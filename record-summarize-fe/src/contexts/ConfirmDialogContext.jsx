import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createContext } from 'react';
import { useState } from 'react';
import { useContext } from 'react';


const ConfirmDialogContext = createContext(null);

export const ConfirmDialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);
  const [resolveFn, setResolveFn] = useState(null);

  const confirm = (options) => {
    console.log(options);
    return new Promise((resolve) => {
      setDialog(options);
      setResolveFn(() => resolve);
    });
  };

  const handleConfirm = () => {
    if (resolveFn) resolveFn(true);
    setDialog(null);
  };

  const handleCancel = () => {
    if (resolveFn) resolveFn(false);
    setDialog(null);
  };

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <Dialog
          open={!!dialog}
          onClose={handleCancel}>
          <DialogTitle id="alert-dialog-title">{dialog?.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">{dialog?.content}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} sx={{ color: 'gray' }}>{dialog?.button?.cancel?.text || "Hủy"}</Button>
            <Button onClick={handleConfirm} autoFocus>
              {dialog?.button?.confirm?.text || "Xác nhận"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error("useConfirmDialog phải được sử dụng bên trong ConfirmDialogProvider");
  }
  return context;
};
