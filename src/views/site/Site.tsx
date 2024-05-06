import React, { useEffect, useRef, useState } from "react";
import { startPlaygroundWeb } from "@wp-playground/client";

import { useNavigate } from "react-router-dom";

import "./Site.scss";

const currentBlueprint = () => {
  if (!window.location.hash) {
    return null;
  }
  try {
    return JSON.parse(decodeURI(window.location.hash.slice(1)));
  } catch (error) {
    return null;
  }
};

export const Site = () => {
  const navigate = useNavigate();
  const iframe = useRef<HTMLIFrameElement>(null);
  const blueprint = currentBlueprint();
  const [isPlaygroundRunning, setIsPlaygroundRunning] = useState(false);

  useEffect(() => {
    if (!blueprint) {
      navigate("/scan");
      return;
    }
  }, [blueprint, navigate, iframe]);

  useEffect(() => {
    const loadPlayground = async () => {
      if (!iframe.current) {
        return;
      }
      if (isPlaygroundRunning) {
        return;
      }
      setIsPlaygroundRunning(true);
      await startPlaygroundWeb({
        iframe: iframe.current,
        remoteUrl: `https://playground.wordpress.net/remote.html`,
        blueprint,
      });
    };
    loadPlayground();
  }, [blueprint, iframe, isPlaygroundRunning]);

  return (
    <div className="view view--site">
      <iframe
        id="wp"
        ref={iframe}
        className="site__iframe"
        title="WordPress Playground"
      />
    </div>
  );
};
