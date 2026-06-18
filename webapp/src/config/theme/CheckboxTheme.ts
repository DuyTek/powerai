import {
  ComponentsProps,
  ComponentsOverrides,
  ComponentsVariants,
  Theme,
} from "@mui/material";

export const checkboxTheme = (): {
  defaultProps?: ComponentsProps["MuiCheckbox"];
  styleOverrides?: ComponentsOverrides<Theme>["MuiCheckbox"];
  variants?: ComponentsVariants["MuiCheckbox"];
} => ({
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(1),
      marginLeft: theme.spacing(1),
    }),
  },
});
