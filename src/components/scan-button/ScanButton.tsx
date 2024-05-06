import { Button } from "@wordpress/components";
import { capturePhoto } from "@wordpress/icons";
import React, { useState } from "react";
import { useScanContext } from "../../context/scan.ts";
import { mergeBlueprints, processImage } from "../../site-builder/index.ts";

import { useBlueprintContext } from "../../context/blueprint.ts";
import { getImageFromCanvas } from "../../site-builder/image.ts";

import "./ScanButton.scss";

export const ScanButton = () => {
  const { videoElement, scanArea, setError } = useScanContext();
  const { blueprint, setBlueprint } = useBlueprintContext();
  const [loading, setLoading] = useState(false);

  const onClick = () => {
    console.log("onClick");
    if (!videoElement) {
      return;
    }

    const image = getImageFromCanvas(videoElement, scanArea);
    if (!image) {
      return;
    }

    setLoading(true);
    setError(null);
    processImage(image)
      .then((response) => {
        setBlueprint(mergeBlueprints([blueprint, response]));
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Button
      onClick={onClick}
      variant="primary"
      className="scan__button"
      icon={capturePhoto}
      isBusy={loading}
    />
  );
};
