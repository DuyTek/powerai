import {
  ComponentsProps,
  ComponentsOverrides,
  ComponentsVariants,
  Theme,
} from "@mui/material";

export const formHelperTextTheme = (): {
  defaultProps?: ComponentsProps["MuiFormHelperText"];
  styleOverrides?: ComponentsOverrides<Theme>["MuiFormHelperText"];
  variants?: ComponentsVariants["MuiFormHelperText"];
} => ({
  styleOverrides: {
    root: {
      fontSize: "16px",
    },
  },
});
