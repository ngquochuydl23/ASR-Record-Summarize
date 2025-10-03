import * as React from 'react';
import { createContext } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import PreviewSummaryVersionDialog from '@/components/dialogs/PreviewSummaryVersionDialog';

const PreviewSummaryVersionContext = createContext(null);

export const PreviewSummaryVersionProvider = ({ children }) => {
  const [recordId, setRecordId] = useState(null);
  const openPreviewDialog = (_recordId) => {
    setRecordId(_recordId);
  };

  const closePreviewDialog = () => {
    setRecordId(null);
  }

  const handleCancel = () => {
    setRecordId(null);
  };

  return (
    <PreviewSummaryVersionContext.Provider value={{ openPreviewDialog, closePreviewDialog }}>
      {children}
      <PreviewSummaryVersionDialog open={Boolean(recordId)} onClose={handleCancel} recordId={recordId} />
    </PreviewSummaryVersionContext.Provider>
  );
};

export const usePreviewSVDialog = () => {
  const context = useContext(PreviewSummaryVersionContext);
  if (!context) throw new Error("usePreviewSVDialog phải được sử dụng bên trong PreviewSummaryVersionContext");
  return context;
};
