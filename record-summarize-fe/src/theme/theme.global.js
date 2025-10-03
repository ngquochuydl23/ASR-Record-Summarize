import { pxToRem, responsiveFontSizes } from "../utils/getFontValue";
import { letterSpacing, textTransform } from "@mui/system";
import { alpha } from "@mui/material/styles";

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const colors = {
  primaryColor: "#6441a5",
  trans05Primary: "rgba(100,65,165 ,0.5)",
  trans01Primary: alpha("#7C3AED", 0.1),
  trans02Primary: "#F5F3FF",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  gray: "#d9d9d9",
  secondaryColor: "rgb(26, 28, 30)",
  cardColor: "rgb(26, 28, 30)",
  ratingColor: "#f5b700",
  pendingColor: '#f29339',
  borderColor: "#d3d3d3",
  textSecondaryColor: "#606060",
  textPrimaryColor: "#000",
  textAccent: "#7C3AED",
  transparent50: " rgba(255, 255, 255, 0.5)",
  errorColor: "#B42318",
  errorColorBg: "#ee6d9b",
  successColorBg: "#44be84",
};

export const typography = {
  fontFamily:
    '\'Plus Jakarta Sans\', "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 700,
    lineHeight: 80 / 64,
    fontSize: pxToRem(40),
    letterSpacing: 2,
    ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
  },
  h2: {
    fontWeight: 700,
    lineHeight: 64 / 48,
    fontSize: pxToRem(32),
    ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
  },
  h3: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }),
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
  },
  h5: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }),
  },
  h6: {
    fontWeight: 700,
    lineHeight: 28 / 18,
    fontSize: pxToRem(17),
    ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 700,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
    fontWeight: 600,
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    fontWeight: 600,
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: "uppercase",
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: "capitalize",
  },
  article: {
    fontWeight: 700,
  },
};
