import { createTheme, Theme } from "@mui/material";
import { buttonTheme } from "./ButtonTheme";
import { textFieldTheme } from "./TextFieldTheme";
import { outlinedInputTheme } from "./OutlinedInputTheme";
import { formLabelTheme } from "./FormLabelTheme";
import { buttonBaseTheme } from "./ButtonBaseTheme";
import { checkboxTheme } from "./CheckboxTheme";
import { formHelperTextTheme } from "./FormHelperTextTheme";

export const themeConfig: Theme = createTheme({
  palette: {
    primary: {
      main: "#1565c0", // A darker shade of blue
      light: "#42a5f5", // A lighter shade
      dark: "#0d47a1",
      100: "#e3f2fd", // A very light shade of blue
      200: "#bbdefb", // A light shade of blue
      300: "#90caf9", // A medium shade of blue
      400: "#64b5f6", // A lighter shade of blue
      500: "#42a5f5", // A light blue
      600: "#2196f3", // A standard blue
      700: "#1976d2", // A darker blue
      800: "#000", // A very dark blue
      900: "#0d47a1", // The darkest blue
    },
    secondary: {
      main: "#4CAF50", // A green color for secondary
      light: "#81c784", // A lighter shade of green
      dark: "#388e3c", // A darker shade of green
    },
    error: {
      main: "#d32f2f",
    },
    warning: {
      main: "#ed6c02",
    },
    info: {
      main: "#0288d1",
    },
    success: {
      main: "#2e7d32",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "40px",
      fontWeight: 500,
      lineHeight: "48px",
    },
    h2: {
      fontSize: "32px",
      fontWeight: 500,
      lineHeight: "40px",
    },
    h3: {
      fontSize: "28px",
      fontWeight: 500,
      lineHeight: "36px",
    },
    h4: {
      fontSize: "24px",
      fontWeight: 500,
      lineHeight: "32px",
    },
    h5: {
      fontSize: "20px",
      fontWeight: 500,
      lineHeight: "28px",
    },
    h6: {
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: "24px",
    },
    body1: {
      fontSize: "16px",
      lineHeight: "24px",
    },
    body2: {
      fontSize: "14px",
      lineHeight: "20px",
    },
    button: {
      fontSize: "14px",
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 4,
  },
  spacing: 4,
  components: {
    MuiCheckbox: checkboxTheme(),
    MuiButton: buttonTheme(),
    MuiButtonBase: buttonBaseTheme(),
    MuiFormLabel: formLabelTheme(),
    MuiFormHelperText: formHelperTextTheme(),
    MuiOutlinedInput: outlinedInputTheme(),
    MuiTextField: textFieldTheme(),
  },
});

export const theme = createTheme(themeConfig);

declare module "@mui/material/styles" {
  interface PaletteColor {
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
  }
}
