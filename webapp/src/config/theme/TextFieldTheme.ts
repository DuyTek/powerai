import {
  ComponentsProps,
  ComponentsOverrides,
  ComponentsVariants,
  formLabelClasses,
  Theme,
} from "@mui/material";

export const textFieldTheme = (): {
  defaultProps?: ComponentsProps["MuiTextField"];
  styleOverrides?: ComponentsOverrides<Theme>["MuiTextField"];
  variants?: ComponentsVariants["MuiTextField"];
} => ({
  styleOverrides: {
    root: {
      "& .Mui-required": {
        [`& .${formLabelClasses.asterisk}`]: {
          color: "red",
        },
      },
    },
  },
});
