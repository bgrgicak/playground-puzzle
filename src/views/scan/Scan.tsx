import React, { useContext, useEffect, useRef } from "react";
import { Icon, wordpress } from "@wordpress/icons";
import { ViewContext } from "../../context/view.ts";

import shape from "../../assets/shape.png";

import "./Scan.scss";

export const Scan = () => {
  const { setView } = useContext(ViewContext);
  const video = useRef(null);
  const canvas = useRef(null);
  const overlay = useRef(null);

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

  // create dark overlay wih hole in the middle
  useEffect(() => {
    if (!overlay.current) {
      return;
    }
    const overlayElement = overlay.current as HTMLCanvasElement;
    const ctx = overlayElement.getContext("2d");
    if (!ctx) {
      return;
    }
    overlayElement.width = window.innerWidth;
    overlayElement.height = window.innerHeight;
    ctx.fillStyle = "rgba(35, 40, 45, 0.9)";
    ctx.fillRect(0, 0, overlayElement.width, overlayElement.height);
    ctx.globalCompositeOperation = "xor";
    // ctx.drawImage(img, 0, 0);

    // ctx.globalCompositeOperation = "source-in";
    const img = new Image();
    img.src = shape;
    img.width = window.innerWidth;
    img.height = img.width * 0.885;
    ctx.drawImage(
      img,
      (window.innerWidth - img.width) / 2,
      (window.innerHeight - img.height) / 2
    );
    ctx.fill();
  }, [overlay]);

  const onClick = () => {
    setView("site");
  };
  return (
    <article className="view view--scan">
      <canvas className="scan__overlay" ref={overlay} />
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
