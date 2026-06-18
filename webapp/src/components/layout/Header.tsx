import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          Test Automation Platform
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/projects">
            Projects
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ fontWeight: "bold" }}
          >
            New Test
          </Button> */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
