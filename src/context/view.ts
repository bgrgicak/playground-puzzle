import { createContext, useContext } from "react";

export type ViewOptions = "home" | "scan" | "site";

export const ViewContext = createContext<{
  view: ViewOptions;
  setView: (view: ViewOptions) => void;
}>({
  view: "home",
  setView: () => {},
});
export const useViewContext = () => useContext(ViewContext);
