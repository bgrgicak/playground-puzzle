import React, { useContext, useState } from "react";
import { Icon, wordpress } from "@wordpress/icons";
import { ViewContext } from "../../context/view.ts";
import { ScanVideo } from "../../components/scan-video/ScanVideo.tsx";

import "./Scan.scss";
import { VideoContext } from "../../context/video.ts";

export const Scan = () => {
  const { setView } = useContext(ViewContext);
  const [loading, setLoading] = useState(true);

  const onClick = () => {
    setView("site");
  };
  return (
    <VideoContext.Provider value={{ loading, setLoading }}>
      <article className="view view--scan">
        <ScanVideo />
        <button
          onClick={onClick}
          className="button button--primary scan__action"
        >
          <Icon icon={wordpress} />
          <span>Take me to my site</span>
        </button>
      </article>
    </VideoContext.Provider>
  );
};
