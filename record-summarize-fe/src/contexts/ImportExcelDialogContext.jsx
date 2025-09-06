import * as React from 'react';
import { createContext } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import ImportExcelDialog from '@/components/dialogs/ImportExcelDialog';


const ImportExcelDialogContext = createContext(null);

export const ImportExcelDialogProvider = ({ children }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [resolveFn, setResolveFn] = useState(null);

  const value = () => {
    return new Promise((resolve) => {
      setOpenDialog(true);
      setResolveFn(() => resolve);
    });
  };

  const handleReceiveExcelFile = (file) => {
    if (resolveFn) resolveFn(file);
    setOpenDialog(false);
  };

  const handleCancel = () => {
    if (resolveFn) resolveFn(null);
    setOpenDialog(null);
  };

  return (
    <ImportExcelDialogContext.Provider value={{ value }}>
      {children}
      {openDialog && (
        <ImportExcelDialog
          open={openDialog}
          onClose={handleCancel}
          onUploadedExcel={handleReceiveExcelFile} />
      )}
    </ImportExcelDialogContext.Provider>
  );
};

export const useImportExcelDialog = () => {
  const context = useContext(ImportExcelDialogContext);
  if (!context) {
    throw new Error("useImportExcelDialog phải được sử dụng bên trong ImportExcelDialogProvider");
  }
  return context.value;
};
