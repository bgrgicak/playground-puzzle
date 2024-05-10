import { siteName, post } from "./api.ts";
import woocommerce from "./blueprints/woocommerce.json";

export type Action = {
  color: string;
  title: string;
};

export const actions: { [key: string]: Action } = {
  woocommerce: {
    color: "#7f54b3",
    title: "WooCommerce",
  },
  "site name": {
    color: "#1D35B4",
    title: "Site Name",
  },
  "/wp-admin/": {
    color: "#1D35B4",
    title: "/wp-admin/",
  },
  post: {
    color: "#1D35B4",
    title: "Post",
  },
};

const actionBlueprints = {
  woocommerce,
};

export const getActions = (titles: string[]) => {
  return titles
    .map((item) => {
      item = item.toLowerCase();
      return Object.keys(actions).find((key) => item.includes(key));
    })
    .filter((item) => item !== undefined);
};

export const processImage = async (actions: string[]) => {
  if (actions === undefined || actions.length === 0) {
    throw new Error(
      "No puzzle pieces found. Please ensure the text is clear and try again."
    );
  }

  const blueprint: any = (actions as string[]).reduce(
    (acc: any, action: string) =>
      mergeBlueprints([acc, actionBlueprints[action]]),
    {}
  );
  if (actions.includes("/wp-admin/")) {
    blueprint["landingPage"] = "/wp-admin/";
  }

  if (actions.includes("site name")) {
    blueprint.steps.push({
      step: "setSiteOptions",
      options: {
        blogname: await siteName(),
      },
    });
  }

  if (actions.includes("post")) {
    const data = await post();
    blueprint.steps.push({
      step: "runPHP",
      // $insert_post='${data.slug}'; is a hack to allow us to find this step and extract the slug
      code: `<?php require_once 'wordpress/wp-load.php'; wp_insert_post(array('post_title' => '${data.title}', 'post_content' => '${data.content}', 'post_slug' => '${data.slug}', 'post_status' => 'publish')); ?>`,
    });
    // override the landing page to open the post
    blueprint.landingPage = `/${data.slug}`;
  }
  return blueprint;
};

const excludedSteps = ["login"];

const mergeBlueprints = (blueprints: any[]) => {
  const newBlueprint: any = {
    phpExtensionBundles: ["kitchen-sink"],
    features: {
      networking: true,
    },
    steps: [
      {
        step: "login",
      },
      {
        // Use pretty permalinks to ensure the post is accessible
        step: "writeFile",
        path: "/wordpress/wp-content/mu-plugins/rewrite.php",
        data: "<?php add_action( 'after_setup_theme', function() { global $wp_rewrite; $wp_rewrite->set_permalink_structure('/%postname%/'); $wp_rewrite->flush_rules(); } );",
      },
    ],
  };

  const landingPages: string[] = [];
  let pluginsInstalled = 0;
  let themeInstalled = false;
  for (const blueprint of blueprints) {
    if (!blueprint) {
      continue;
    }
    if (blueprint.landingPage) {
      landingPages.push(blueprint.landingPage);
    }
    if (!blueprint.steps) {
      continue;
    }
    newBlueprint.steps = [
      ...newBlueprint.steps,
      ...blueprint.steps.filter(
        (step: any) => !excludedSteps.includes(step.step)
      ),
    ];

    pluginsInstalled += blueprint.steps.filter(
      (step: any) => step.step === "installPlugin"
    ).length;

    if (
      themeInstalled === false &&
      blueprint.steps.find((step: any) => step.step === "installTheme")
    ) {
      themeInstalled = true;
    }
  }

  // If one landing page is defined, use it
  if (themeInstalled) {
    newBlueprint.landingPage = "/";
  }
  // If multiple plugins are installed, go to the plugins list
  else if (pluginsInstalled > 1) {
    newBlueprint.landingPage = "/wp-admin/plugins.php";
  }
  // If multiple landing pages are defined, go to the first one
  else if (landingPages.length === 1) {
    newBlueprint.landingPage = landingPages[0];
  } else {
    newBlueprint.landingPage = "/";
  }

  return newBlueprint;
};
