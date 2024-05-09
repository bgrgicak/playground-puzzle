import { Button } from "@wordpress/components";
import { capturePhoto } from "@wordpress/icons";
import React, { useState } from "react";
import { useScanContext } from "../../context/scan.ts";
import {
  actions,
  mergeBlueprints,
  processImage,
} from "../../site-builder/index.ts";

import { useBlueprintContext } from "../../context/blueprint.ts";
import { getImageFromCanvas } from "../../site-builder/image.ts";

import "./ScanButton.scss";
import { readImageContent } from "../../site-builder/api.ts";

export const ScanButton = ({ onSuccess }) => {
  const { videoElement, scanArea, setError } = useScanContext();
  const { blueprint, setBlueprint } = useBlueprintContext();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (!videoElement) {
      return;
    }

    const image = getImageFromCanvas(videoElement, scanArea);
    if (!image) {
      return;
    }

    setLoading(true);
    setError(null);

    const imageData: string[] = await readImageContent(image);
    processImage(imageData)
      .then((response) => {
        setBlueprint(mergeBlueprints([blueprint, response]));
        onSuccess(imageData.map((item) => actions[item]));
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
