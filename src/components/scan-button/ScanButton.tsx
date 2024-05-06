import { Button } from "@wordpress/components";
import { capturePhoto } from "@wordpress/icons";
import React, { useState } from "react";
import { useScanContext } from "../../context/scan.ts";
import { mergeBlueprints, processImage } from "../../site-builder/index.ts";

import "./ScanButton.scss";
import { useBlueprintContext } from "../../context/blueprint.ts";

export const ScanButton = () => {
  const { videoElement, scanArea, setError } = useScanContext();
  const { blueprint, setBlueprint } = useBlueprintContext();
  const [loading, setLoading] = useState(false);

  const onClick = () => {
    if (!videoElement) {
      return;
    }

    const videoCanvas = document.createElement("canvas");
    videoCanvas.width = videoElement.width;
    videoCanvas.height = videoElement.height;
    const videoCtx = videoCanvas.getContext("2d");
    if (!videoCtx) {
      return;
    }
    videoCtx.drawImage(
      videoElement,
      0,
      0,
      videoElement.width,
      videoElement.height
    );

    const canvasElement = document.createElement("canvas");
    canvasElement.width = scanArea.width;
    canvasElement.height = scanArea.height;
    const ctx = canvasElement.getContext("2d");
    if (!ctx) {
      return;
    }
    const x = (videoElement.width - scanArea.width) / 2;
    const y = (videoElement.height - scanArea.height) / 2;
    ctx.drawImage(
      videoCanvas,
      x,
      y,
      scanArea.width,
      scanArea.height,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    const image = canvasElement.toDataURL("image/png");

    videoCanvas.remove();
    canvasElement.remove();

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
