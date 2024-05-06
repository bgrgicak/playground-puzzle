import React, { useState } from "react";
import { ScanVideo } from "../../components/scan-video/ScanVideo.tsx";

import "./Scan.scss";
import { ScanContext } from "../../context/scan.ts";
import { ScanButton } from "../../components/scan-button/ScanButton.tsx";
import { Button, Notice } from "@wordpress/components";
import { wordpress } from "@wordpress/icons";
import { useNavigate } from "react-router-dom";
import { useBlueprintContext } from "../../context/blueprint.ts";

export const Scan = () => {
  const navigate = useNavigate();
  const { blueprint } = useBlueprintContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null
  );
  const [scanArea, setScanArea] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const onClick = () => {
    navigate("/playground#" + JSON.stringify(blueprint));
  };

  const onDismiss = () => {
    setError(null);
  };

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
      <article className="view view--scan">
        <ScanVideo />
        {!loading && (
          <div className="scan__actions">
            <ScanButton />
            {blueprint !== undefined && (
              <Button
                onClick={onClick}
                variant="secondary"
                className="scan__action"
                icon={wordpress}
              >
                Take me to my site
              </Button>
            )}
          </div>
        )}
      </article>
    </ScanContext.Provider>
  );
};
