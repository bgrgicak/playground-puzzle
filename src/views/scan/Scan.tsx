import React, { useContext, useEffect, useRef } from "react";
import { Icon, wordpress } from "@wordpress/icons";
import { ViewContext } from "../../context/view.ts";
import { ScanOverlay } from "../../components/scan-overlay/ScanOverlay.tsx";

import "./Scan.scss";

export const Scan = () => {
  const { setView } = useContext(ViewContext);
  const video = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    if (!video.current) {
      return;
    }
    if (!canvas.current) {
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return;
    }
    const videoElement = video.current as HTMLVideoElement;
    const canvasElement = canvas.current as HTMLCanvasElement;
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
        },
        audio: false,
      })
      .then((stream) => {
        videoElement.srcObject = stream;
        videoElement.play().catch((err) => {
          console.error(`An error occurred: ${err}`);
        });
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });
    videoElement.addEventListener(
      "canplay",
      (ev) => {
        console.log("canplay");
        videoElement.setAttribute("width", window.innerWidth.toString());
        videoElement.setAttribute("height", window.innerHeight.toString());
        canvasElement.setAttribute("width", window.innerWidth.toString());
        canvasElement.setAttribute("height", window.innerHeight.toString());
      },
      false
    );
  }, [canvas, video]);

  const onClick = () => {
    setView("site");
  };
  return (
    <article className="view view--scan">
      <ScanOverlay />
      <video
        id="scan__video"
        ref={video}
        autoPlay={true}
        playsInline={true}
        muted={true}
      >
        Video stream not available.
      </video>
      <canvas className="scan__canvas" ref={canvas} />
      <button onClick={onClick} className="button button--primary scan__action">
        <Icon icon={wordpress} />
        <span>Take me to my site</span>
      </button>
    </article>
  );
};
