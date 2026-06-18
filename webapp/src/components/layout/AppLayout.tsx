import React from "react";
import { Box } from "@mui/material";
import { Header } from "./Header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
          pt: 8,
          px: 10,
        }}
      >
        {children}
      </Box>
      {/* <Footer /> */}
    </Box>
  );
}
