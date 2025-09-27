import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import NotificationDrawer from "@/components/notifications/NotificationDrawer";
import { getMe } from "@/repositories/user.repository";
import { setUser } from "@/redux/slices/userSlice";
import MainLayoutHeader from "../main.layout/main.layout.header";
import StagingLabelView from "@/components/StagingLabelView";
import classNames from "classnames";
import { useLoading } from "@/contexts/LoadingContextProvider";

const PlayVideoLayout = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { showLoading, hideLoading, isLoading } = useLoading();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [openNofiDrawer, setOpenNotiDrawer] = useState(false);

  const openNotificationList = () => {
    setOpenNotiDrawer(true);
  };

  useEffect(() => {
    showLoading();
    getMe()
      .then((response) => {
        dispatch(setUser(response));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => { });
  }, [])


  if (!isLoading && !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <>
      {process.env.REACT_APP_ENVIRONMENT === 'Staging' && <StagingLabelView />}
      <div className="flex">
        <div className="flex flex-col w-full bg-[#fcfcfc] h-full">
          <MainLayoutHeader showHeader openNotificationList={openNotificationList} />
          <div className={classNames("innerLayout", { "isShowStagingLabel": process.env.REACT_APP_ENVIRONMENT === 'Staging' })}>
            <Outlet />
          </div>
        </div>
      </div>
      <NotificationDrawer
        open={openNofiDrawer}
        onClose={() => setOpenNotiDrawer(false)}
      />
    </>
  );
};

export default PlayVideoLayout;
