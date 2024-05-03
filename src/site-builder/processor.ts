import { generateSiteName, readImageContent } from "./openai.ts";

import woo from "./steps/woo.json";

const actions: string[] = ["woo", "/wp-admin/", "site name"];

const actionSteps = {
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
    throw new Error("No actions found");
  }
  const steps = imageActions
    .map((action) => actionSteps[action as string])
    .filter((item) => item !== undefined)
    .reduce((acc, val) => acc.concat(val), []);

  const blueprint = {
    steps: steps,
  };

  if (imageActions.includes("/wp-admin/")) {
    blueprint["landingPage"] = "/wp-admin/";
    blueprint.steps.push({
      step: "login",
    });
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
