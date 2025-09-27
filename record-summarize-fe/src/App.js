import Router from "./routes";
import ThemeProvider from "./theme";
import React from "react";
import { SnackbarProvider } from "notistack";
import { ConfirmDialogProvider } from "./contexts/ConfirmDialogContext";
import { LoadingContextProvider } from "./contexts/LoadingContextProvider";
import "./index.css";

export default function App() {
  return (
    <LoadingContextProvider>
      <ThemeProvider>
        <SnackbarProvider>
          <ConfirmDialogProvider>
            <Router />
          </ConfirmDialogProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </LoadingContextProvider>
  );
}
