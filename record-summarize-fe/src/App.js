import Router from "./routes";
import ThemeProvider from "./theme";
import React from "react";
import { SnackbarProvider } from "notistack";
import { ConfirmDialogProvider } from "./contexts/ConfirmDialogContext";
import "./index.css";

export default function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider>
        <ConfirmDialogProvider>
          <Router />
        </ConfirmDialogProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
