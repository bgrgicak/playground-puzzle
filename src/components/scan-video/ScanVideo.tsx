import React, { useEffect, useRef } from "react";

import "./ScanVideo.scss";
import { Loader } from "../loader/Loader.tsx";
import { useVideoContext } from "../../context/video.ts";
import { ScanOverlay } from "../../components/scan-overlay/ScanOverlay.tsx";

export const ScanVideo = () => {
  const { loading, setLoading } = useVideoContext();

  const video = useRef(null);
  const canvas = useRef(null);

  const resizeElements = () => {
    if (!video.current) {
      return;
    }
    if (!canvas.current) {
      return;
    }
    const videoElement = video.current as HTMLVideoElement;
    const canvasElement = canvas.current as HTMLCanvasElement;

    let ratio = 4 / 3;
    if (videoElement.videoHeight) {
      ratio = videoElement.videoWidth / videoElement.videoHeight;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    if (window.innerHeight > window.innerWidth) {
      width = height * ratio;
    } else {
      height = width / ratio;
    }

    videoElement.setAttribute("width", width.toString());
    videoElement.setAttribute("height", height.toString());
    canvasElement.setAttribute("width", width.toString());
    canvasElement.setAttribute("height", height.toString());
  };

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
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
        },
        audio: false,
      })
      .then((stream) => {
        videoElement.srcObject = stream;
        videoElement
          .play()
          .then(() => {
            setLoading(false);
          })
          .catch((err) => {
            console.error(`An error occurred: ${err}`);
          });
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });
    videoElement.addEventListener("canplay", resizeElements, false);
    window.addEventListener("resize", resizeElements);
    return () => {
      videoElement.removeEventListener("canplay", resizeElements);
      window.removeEventListener("resize", resizeElements);
    };
  }, [canvas, video]);

  return (
    <>
      {loading && <Loader />}
      {!loading && <ScanOverlay />}
      <video
        id="scan-video"
        ref={video}
        autoPlay={true}
        playsInline={true}
        muted={true}
      >
        Video stream not available.
      </video>
      <canvas className="scan-video__canvas" ref={canvas} />
    </>
  );
};
