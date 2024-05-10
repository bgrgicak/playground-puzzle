import { Button } from "@wordpress/components";
import "./SiteButton.scss";
import { check, wordpress } from "@wordpress/icons";
import React, { useEffect, useRef, useState } from "react";
import { actions } from "../../site-builder/processor.ts";

const mainCta = "Take me to my site";
const successTimeout = 2000;

export const SiteButton = ({ onClick, detectedActions }) => {
  const actionCount = useRef<number>(0);
  const [timeout, setTimeout] = useState<number | null>(null);
  const [title, setTitle] = useState<string>();

  useEffect(() => {
    if (detectedActions && detectedActions.length > actionCount.current) {
      actionCount.current = detectedActions.length;
      if (actions[detectedActions[detectedActions.length - 1]]) {
        setTitle(
          "Added " + actions[detectedActions[detectedActions.length - 1]].title
        );

        setTimeout(
          window.setTimeout(() => {
            setTitle(mainCta);
          }, successTimeout)
        );
      }
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [detectedActions]);

  if (!title) {
    return null;
  }

  const classNames = ["scan__action"];
  let icon = wordpress;
  if (title !== mainCta) {
    classNames.push("scan__action--success");
    icon = check;
  }

  return (
    <Button
      onClick={onClick}
      variant="secondary"
      className={classNames.join(" ")}
      icon={icon}
    >
      {title}
    </Button>
  );
};
