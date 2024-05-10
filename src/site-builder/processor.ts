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

export const processImage = async (imageActions: string[]) => {
  if (imageActions === undefined || imageActions.length === 0) {
    throw new Error(
      "No puzzle pieces found. Please ensure the text is clear and try again."
    );
  }

  const blueprint: any = (imageActions as string[]).reduce(
    (acc: any, action: string) =>
      mergeBlueprints([acc, actionBlueprints[action]]),
    {}
  );
  if (imageActions.includes("/wp-admin/")) {
    blueprint["landingPage"] = "/wp-admin/";
  }

  if (imageActions.includes("site name")) {
    blueprint.steps.push({
      step: "setSiteOptions",
      options: {
        blogname: await siteName(),
      },
    });
  }

  if (imageActions.includes("post")) {
    const data = await post();
    blueprint.steps.push({
      step: "runPHP",
      // $insert_post='${data.slug}'; is a hack to allow us to find this step and extract the slug
      code: `<?php $insert_post='${data.slug}'; require_once 'wordpress/wp-load.php'; wp_insert_post(array('post_title' => '${data.title}', 'post_content' => '${data.content}', 'post_slug' => '${data.slug}', 'post_status' => 'publish')); ?>`,
    });
  }
  return blueprint;
};

const excludedSteps = ["login"];

const mergeBlueprints = (blueprints: any[]) => {
  const newBlueprint: any = {
    landingPage: "/",
    steps: [
      {
        step: "login",
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

  const postSteps = newBlueprint.steps.find(
    (step: any) => step.code && step.code.startsWith("<?php $insert_post=")
  );

  // If a post was generated, go to the post
  if (postSteps && postSteps.length > 0) {
    const regex = /\$insert_post='(.*?)'/;
    const codeString = postSteps[postSteps.length - 1];
    const match = codeString.match(regex);
    if (match) {
      const extractedSlug = match[1];
      newBlueprint.landingPage = "/" + extractedSlug;
    }
  }
  // If one landing page is defined, use it
  else if (landingPages.length === 1) {
    newBlueprint.landingPage = landingPages[0];
  }
  // If a theme is installed, go to the homepage
  else if (themeInstalled) {
    newBlueprint.landingPage = "/";
  }
  // If multiple plugins are installed, go to the plugins list
  else if (pluginsInstalled > 1) {
    newBlueprint.landingPage = "/wp-admin/plugins.php";
  }

  return newBlueprint;
};
