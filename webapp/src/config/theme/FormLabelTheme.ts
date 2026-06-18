import {
  ComponentsProps,
  ComponentsOverrides,
  ComponentsVariants,
  Theme,
  inputLabelClasses,
} from "@mui/material";

export const formLabelTheme = (): {
  defaultProps?: ComponentsProps["MuiFormLabel"];
  styleOverrides?: ComponentsOverrides<Theme>["MuiFormLabel"];
  variants?: ComponentsVariants["MuiFormLabel"];
} => ({
  styleOverrides: {
    root: ({ theme }) => ({
      [`&.${inputLabelClasses.root}`]: {
        top: theme.spacing(-2),
        [`&.${inputLabelClasses.focused}`]: {
          top: 0,
        },
      },
    }),
  },
});
