import { Backdrop } from '@mui/material';
import Lottie from 'react-lottie';
import animationData from '../../assets/lotties/Loading.json';

const LoadingBackdrop = ({ open = false }) => {
  return (
    <Backdrop sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })} open={open}>
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
    </Backdrop>
  )
}

export default LoadingBackdrop;