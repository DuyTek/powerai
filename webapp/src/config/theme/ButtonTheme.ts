import {
  ComponentsProps,
  ComponentsOverrides,
  ComponentsVariants,
  Theme,
} from "@mui/material";

export const buttonTheme = (): {
  defaultProps?: ComponentsProps["MuiButton"];
  styleOverrides?: ComponentsOverrides<Theme>["MuiButton"];
  variants?: ComponentsVariants["MuiButton"];
} => ({
  defaultProps: {
    disableRipple: true,
    disableElevation: true,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(2, 4),
    }),
    sizeSmall: ({ theme }) => ({
      padding: theme.spacing(1, 2),
    }),
    sizeLarge: ({ theme }) => ({
      padding: theme.spacing(3, 6),
    }),
  },
});
