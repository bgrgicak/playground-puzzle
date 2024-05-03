import React, { useState } from "react";
import "./App.scss";
import { Home } from "./views/home/Home.tsx";
import { Scan } from "./views/scan/Scan.tsx";
import { Site } from "./views/site/Site.tsx";
import { ViewContext, ViewOptions } from "./context/view.ts";

function App() {
  const [view, setView] = useState<ViewOptions>("home");
  const getView = () => {
    if (view === "scan") {
      return <Scan />;
    } else if (view === "site") {
      return <Site />;
    }
    return <Home />;
  };
  return (
    <ViewContext.Provider value={{ view, setView }}>
      <main className="playground-puzzle">{getView()}</main>
    </ViewContext.Provider>
  );
}

export default App;
