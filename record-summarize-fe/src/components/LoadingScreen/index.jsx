import React from "react";
import animationData from '../../assets/lotties/Loading.json';
import styles from './styles.module.scss';
import Lottie from "react-lottie";

const LoadingScreen = () => {
  return (
    <div className={styles.loadingView}>
      <div className={styles.innerView}>
        <Lottie
          height={150}
          width={150}
          options={{
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice"
            }
          }} />
      </div>
    </div>
  );
};

export default LoadingScreen;
