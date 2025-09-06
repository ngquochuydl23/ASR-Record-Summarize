import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from "@mui/material";
import './style.scss';
import IcUploadExcel from "@/assets/icons/IcUploadExcel";
import { colors } from "@/theme/theme.global";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

const ImportExcelDialog = ({
  open,
  onClose = () => { },
  onUploadedExcel = (file) => { }
}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSelectFile = (e) => document.getElementById('xlss-file')?.click();

  const handleFile = (e) => {
    const _file = e.target.files[0];
    setUploading(true);
    setFile(_file);

    setTimeout(() => {
      setUploading(false);
    }, 1000);
  }

  const handleImport = () => {
    onClose();
    onUploadedExcel();
  }

  useEffect(() => {
    setFile(null);
    setUploading(false);
  }, [open]);

  return (
    <Dialog open={open} maxWidth='xs' fullWidth onClose={onClose}>
      <DialogTitle sx={{ padding: "10px 5px" }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
        Import excel
      </DialogTitle>
      <DialogContent>
        {file &&
          <div className="uploading-item">
            <div className="icon-frame">
              <CircularProgress
                variant={uploading ? "indeterminate" : "determinate"}
                className={`progressbar ${!uploading && 'done'}`}
                value={100} />
              <div className="overlay-icon">
                <IcUploadExcel />
              </div>
            </div>
            <div className="file-info">
              <Typography variant="body1" className="filename">{file.name}</Typography>
              <Typography variant="caption" className="filesize">{file.size}</Typography>
            </div>
          </div>
        }
        {(!uploading && !file) &&
          <div className="upload-frame">
            <input id="xlss-file" type="file" onChange={handleFile} accept=".xls,.xlsx" />
            <IconButton
              onClick={handleSelectFile}
              size="large"
              sx={{
                backgroundColor: colors.trans02Primary,
                width: '60px',
                height: '60px'
              }}>
              <IcUploadExcel />
            </IconButton>
            <div className="upload-frame-helper-text">
              <p className="helper-text-primary"><span onClick={handleSelectFile}>Click here </span>to upload your file or drag.</p>
              <p className="helper-text-secondary">Supported Format: .xlss</p>
            </div>
          </div>
        }
      </DialogContent >
      {file &&
        <DialogActions>
          <Button disabled={uploading} onClick={handleImport}>{'Import'}</Button>
          <Button autoFocus onClick={onClose}>{"Cancel"}</Button>
        </DialogActions>
      }
    </Dialog >
  )
}

export default ImportExcelDialog;