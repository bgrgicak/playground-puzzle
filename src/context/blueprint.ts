import { createContext, useContext } from "react";

export const BlueprintContext = createContext<{
  blueprint?: Object;
  setBlueprint: (blueprint: any) => void;
}>({
  blueprint: undefined,
  setBlueprint: () => {},
});
export const useBlueprintContext = () => useContext(BlueprintContext);
