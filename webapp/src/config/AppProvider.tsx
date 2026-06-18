import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  let node = children;

  node = <CssBaseline>{node}</CssBaseline>;
  node = <ThemeProvider theme={theme}>{node}</ThemeProvider>;

  return <>{node}</>;
};
