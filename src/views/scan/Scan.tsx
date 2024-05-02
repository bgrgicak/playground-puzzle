import React, { useContext } from "react";
import { ViewContext } from "../../context/view.ts";

export const Scan = () => {
  const { setView } = useContext(ViewContext);

  const onClick = () => {
    setView("site");
  };
  return (
    <div className="view view--scan">
      <button onClick={onClick} className="button button--primary">
        Take me to my site
      </button>
    </div>
  );
};
