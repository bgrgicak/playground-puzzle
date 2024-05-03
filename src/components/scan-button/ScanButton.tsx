import { Button } from "@wordpress/components";
import { wordpress } from "@wordpress/icons";
import React from "react";
import { useScanContext } from "../../context/scan.ts";
import { processImage } from "../../site-builder/index.ts";

export const ScanButton = () => {
  const { videoElement, scanArea } = useScanContext();

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

    processImage(canvasElement.toDataURL("image/png"))
      .then((response) => {
        console.log(response);
        window.open(
          "https://playground.wordpress.net/#" + JSON.stringify(response)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <Button
      onClick={onClick}
      variant="primary"
      className="scan__action"
      icon={wordpress}
    >
      Scan puzzle pieces
    </Button>
  );
};
