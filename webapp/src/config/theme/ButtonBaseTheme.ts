import {
  ComponentsProps,
  ComponentsOverrides,
  ComponentsVariants,
  Theme,
} from "@mui/material";

export const buttonBaseTheme = (): {
  defaultProps?: ComponentsProps["MuiButtonBase"];
  styleOverrides?: ComponentsOverrides<Theme>["MuiButtonBase"];
  variants?: ComponentsVariants["MuiButtonBase"];
} => ({
  defaultProps: {
    disableRipple: true,
    disableTouchRipple: true,
  },
});
