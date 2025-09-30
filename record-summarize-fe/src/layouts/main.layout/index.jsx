import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import PersonalSettingDialog from "@/sections/settings/PersonalSettingDialog";
import { useSnackbar } from "notistack";
import NotificationDrawer from "@/components/notifications/NotificationDrawer";
import { getMe } from "@/repositories/user.repository";
import MainLayoutHeader from "./main.layout.header";
import LoadingScreen from "@/components/LoadingScreen";
import { setUser } from "@/redux/slices/userSlice";
import StagingLabelView from "@/components/StagingLabelView";
import './styles.scss';
import classNames from "classnames";
import Scrollbars from "react-custom-scrollbars-2";

const MainLayout = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const [openNofiDrawer, setOpenNotiDrawer] = useState(false);
  const [openSettingDialog, setOpenSettingDialog] = useState({
    chooseTabId: null,
    open: false,
  });

  const openNotificationList = () => {
    setOpenNotiDrawer(true);
  };

  useEffect(() => {
    setLoading(true);
    getMe()
      .then((response) => {
        dispatch(setUser(response));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [])

  if (loading || !user) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;

  return (
    <>
      {process.env.REACT_APP_ENVIRONMENT === 'Staging' && <StagingLabelView />}
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-col w-full parentLayout">
          <MainLayoutHeader openNotificationList={openNotificationList} />
          <Scrollbars>
            <div className={classNames("p-4 innerLayout", { "isShowStagingLabel": process.env.REACT_APP_ENVIRONMENT === 'Staging' })} >
              <Outlet />
            </div>
          </Scrollbars>
        </div>
      </div>

      <PersonalSettingDialog
        chooseTabId={openSettingDialog.chooseTabId}
        open={openSettingDialog.open}
        onClose={() => setOpenSettingDialog({ chooseTabId: null, open: false })}
      />
      <NotificationDrawer
        open={openNofiDrawer}
        onClose={() => setOpenNotiDrawer(false)}
      />
    </>
  );
};

export default MainLayout;
