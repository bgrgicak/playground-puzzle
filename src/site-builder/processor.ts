import { generateSiteName, readImageContent } from "./openai.ts";

import woo from "./blueprints/woo.json";

const actions: string[] = ["woo", "/wp-admin/", "site name"];

const actionBlueprints = {
  woo,
};

export const processImage = async (data: string) => {
  const imageData: string[] = await readImageContent(data);

  const imageActions = imageData
    .map((item) => {
      item = item.toLowerCase();
      const action = actions.find((key) => item.includes(key));
      return action;
    })
    .filter((item) => item !== undefined);
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
        blogname: await generateSiteName(),
      },
    });
  }
  return blueprint;
};

const excludedSteps = ["login"];

export const mergeBlueprints = (blueprints: any[]) => {
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

  // If one landing page is defined, use it
  if (landingPages.length === 1) {
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
