import React, { useState } from "react";
import { ScanVideo } from "../../components/scan-video/ScanVideo.tsx";

import "./Scan.scss";
import { ScanContext } from "../../context/scan.ts";
import { ScanButton } from "../../components/scan-button/ScanButton.tsx";
import { Icon, Notice } from "@wordpress/components";
import { useNavigate } from "react-router-dom";
import { SiteButton } from "../../components/SiteButton/SiteButton.tsx";
import { capturePhoto } from "@wordpress/icons";
import { getActions, processImage } from "../../site-builder/processor.ts";

export const Scan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detectedActions, setDetectedActions] = useState<string[]>();
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null
  );
  const [scanArea, setScanArea] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const onClick = async () => {
    if (!detectedActions) {
      setError(
        "No puzzle pieces found. Please ensure the text is clear and try again."
      );
      return;
    }
    const blueprint = await processImage(detectedActions);
    navigate("/playground#" + JSON.stringify(blueprint));
  };

  const onDismiss = () => {
    setError(null);
  };

  const onSuccess = (newActionTitles: string[]) => {
    const newActions = getActions(newActionTitles);
    if (!newActions || newActions.length === 0) {
      return;
    }
    if (!detectedActions) {
      setDetectedActions(newActions as string[]);
    } else {
      setDetectedActions([
        ...detectedActions,
        ...(newActions as string[]).filter(
          (newAction) =>
            !detectedActions.find(
              (detectedAction) => detectedAction === newAction
            )
        ),
      ]);
    }
  };

  const dots: React.ReactNode[] = [];
  if (detectedActions) {
    for (let i = 0; i < detectedActions.length; i++) {
      dots.push(
        <div className="scan__dot scan__dot--circle" key={"dot-" + i} />
      );
    }
    dots.push(<Icon icon={capturePhoto} className="scan__dot" key="capture" />);
  }

  return (
    <ScanContext.Provider
      value={{
        loading,
        setLoading,
        videoElement,
        setVideoElement,
        scanArea,
        setScanArea,
        error,
        setError,
      }}
    >
      {error !== null && (
        <Notice
          status="info"
          isDismissible
          className="scan__error"
          onDismiss={onDismiss}
        >
          {error}
        </Notice>
      )}
      <div className="scan__description">
        <p>
          Place the puzzles in a well-lit environment and point your camera.
        </p>
        {dots && <div className="scan__dots">{dots}</div>}
      </div>
      <article className="view view--scan">
        <ScanVideo />
        {!loading && (
          <div className="scan__actions">
            <ScanButton onSuccess={onSuccess} />
            {detectedActions && (
              <SiteButton onClick={onClick} detectedActions={detectedActions} />
            )}
          </div>
        )}
      </article>
    </ScanContext.Provider>
  );
};
