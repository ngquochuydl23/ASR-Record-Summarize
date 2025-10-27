import * as React from 'react';
import { createContext } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import PreviewSummaryVersionDialog from '@/components/dialogs/PreviewSummaryVersionDialog';

const PreviewSummaryVersionContext = createContext(null);

export const PreviewSummaryVersionProvider = ({ children }) => {
  const [data, setData] = useState({ recordId: null, config: null });
  const openPreviewDialog = (_recordId, _config) => {
    setData({ recordId: _recordId, config: _config });
  };

  const closePreviewDialog = () => {
    setData({ recordId: null, config: null });
  }

  const handleCancel = () => {
    setData({ recordId: null, config: null });
  };

  const isOpen = React.useMemo(() => Boolean(data?.recordId), [data?.recordId]);

  return (
    <PreviewSummaryVersionContext.Provider value={{ openPreviewDialog, closePreviewDialog, isOpen }}>
      {children}
      <PreviewSummaryVersionDialog
        open={isOpen}
        hideBackdrop={data?.config?.hideBackdrop || false}
        onClose={handleCancel}
        recordId={data?.recordId} />
    </PreviewSummaryVersionContext.Provider>
  );
};

export const usePreviewSVDialog = () => {
  const context = useContext(PreviewSummaryVersionContext);
  if (!context) throw new Error("usePreviewSVDialog phải được sử dụng bên trong PreviewSummaryVersionContext");
  return context;
};
