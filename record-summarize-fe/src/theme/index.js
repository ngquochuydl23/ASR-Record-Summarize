import PropTypes from "prop-types";
import { useMemo } from "react";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider as MUIThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import useSettings from "../hooks/useSettings.js";
import { createPalette } from "./palette";
import { colors, typography } from "./theme.global.js";
import { createComponents } from "./components.js";


ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default function ThemeProvider({ children }) {
  const palette = createPalette();
  const components = createComponents({ palette });

  const themeOptions = useMemo(
    () => ({
      palette,
      colors,
      typography,
      components
    }),
    []
  );

  const theme = createTheme(themeOptions);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
