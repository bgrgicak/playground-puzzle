import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BlueprintContext } from "./context/blueprint.ts";

import { Home } from "./views/home/Home.tsx";
import { Scan } from "./views/scan/Scan.tsx";
import { Site } from "./views/site/Site.tsx";

import "./App.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/scan",
    element: <Scan />,
  },
  {
    path: "/playground",
    element: <Site />,
  },
]);

export const App = () => {
  const [blueprint, setBlueprint] = React.useState(undefined);

  return (
    <BlueprintContext.Provider value={{ blueprint, setBlueprint }}>
      <RouterProvider router={router} />
    </BlueprintContext.Provider>
  );
};
