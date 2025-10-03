import Router from "./routes";
import ThemeProvider from "./theme";
import React from "react";
import { SnackbarProvider } from "notistack";
import { ConfirmDialogProvider } from "./contexts/ConfirmDialogContext";
import { LoadingContextProvider } from "./contexts/LoadingContextProvider";
import "./index.css";
import { PreviewSummaryVersionProvider } from "./contexts/PreviewSummaryVContext";

export default function App() {
  return (
    <LoadingContextProvider>
      <ThemeProvider>
        <SnackbarProvider>
          <ConfirmDialogProvider>
            <PreviewSummaryVersionProvider>
              <Router />
            </PreviewSummaryVersionProvider>
          </ConfirmDialogProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </LoadingContextProvider>
  );
}
