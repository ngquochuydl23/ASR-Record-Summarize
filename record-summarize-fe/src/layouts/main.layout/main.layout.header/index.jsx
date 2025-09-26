import IcNotification from "@/assets/icons/IcNotification";
import { readUrl } from "@/utils/readUrl";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  Popover,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import "./style.scss";
import { AppRoute } from "@/constants/app.constants";
import { Link, useNavigate } from "react-router-dom";
import MainLayoutSearchbox from "../main.layout.searchbox";
import Cookies from "js-cookie";

const MainLayoutHeader = ({ openNotificationList }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector((state) => state.user);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const navigate = useNavigate();

  const handleSignOut = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    localStorage.clear();
    navigate("/auth/login");
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex h-[60px] bg-white ml-[2px] items-center justify-between px-4 shadow-sm">
      <MainLayoutSearchbox placeholder="Tìm kiếm ..." />
      <div className="flex gap-4 items-center">
        <IconButton onClick={openNotificationList}>
          <Badge badgeContent={4} color="info">
            <IcNotification />
          </Badge>
        </IconButton>
        <Box
          sx={{
            border: "2px solid #d3d3d3",
            borderRadius: "200px",
            height: "fit-content",
          }}
        >
          <div>
            <Avatar
              onClick={handleClick}
              sx={{ width: "35px", height: "35px" }}
              src={readUrl(user?.avatar, true)}
            >
              {user?.fullName}
            </Avatar>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <div className="inside-popover">
                <ul className="menu-list">
                  <li className="menu-list-item">
                    <Link
                      to={AppRoute.PERSONAL_INFO}
                      onClick={handleClose}
                    >{`Thông tin cá nhân`}</Link>
                  </li>
                  <li className="menu-list-item">
                    <a>{`Đổi mật khẩu`}</a>
                  </li>
                  <Divider className="my-[2px]" />
                  <li className="menu-list-item red" onClick={handleSignOut}>
                    {`Đăng xuất`}
                  </li>
                </ul>
              </div>
            </Popover>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default MainLayoutHeader;
