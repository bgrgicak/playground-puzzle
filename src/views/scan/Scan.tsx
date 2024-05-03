import React, { useState } from "react";
import { ScanVideo } from "../../components/scan-video/ScanVideo.tsx";

import "./Scan.scss";
import { ScanContext } from "../../context/scan.ts";
import { ScanButton } from "../../components/scan-button/ScanButton.tsx";

export const Scan = () => {
  const [loading, setLoading] = useState(true);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null
  );
  const [scanArea, setScanArea] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  return (
    <ScanContext.Provider
      value={{
        loading,
        setLoading,
        videoElement,
        setVideoElement,
        scanArea,
        setScanArea,
      }}
    >
      <article className="view view--scan">
        <ScanVideo />
        {!loading && <ScanButton />}
      </article>
    </ScanContext.Provider>
  );
};
