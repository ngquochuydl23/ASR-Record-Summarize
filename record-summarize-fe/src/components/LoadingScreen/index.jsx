import React from "react";
import CircularProgress from '@mui/material/CircularProgress';
import styles from './styles.module.scss';

const LoadingScreen = () => {
  return (
    <div className={styles.loadingView}>
      <CircularProgress />
    </div>
  );
};

export default LoadingScreen;
