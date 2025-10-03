import { Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { colors } from "@/theme/theme.global";
import IcActiveSetting from "@/assets/icons/IcActiveSetting";
import IcSetting from "@/assets/icons/IcSetting";
import IcActiveCategory from "@/assets/icons/IcActiveCategory";
import IcCategory from "@/assets/icons/IcCategory";
import "./style.scss";
import { useState } from "react";
import IcActiveVideo from "@/assets/icons/IcActiveVideo";
import IcVideo from "@/assets/icons/IcVideo";
import ScheduleIcon from "@mui/icons-material/Schedule";
const sideBarItems = [
  {
    path: "/records",
    activeIcon: <IcActiveVideo />,
    inactiveIcon: <IcVideo />,
    title: "Video tóm tắt",
    enableBadge: true,
  },
  {
    path: "/collections",
    activeIcon: <IcActiveCategory />,
    inactiveIcon: <IcCategory />,
    title: "Bộ sưu tập",
    enableBadge: true,
  },
  {
    path: "/history",
    activeIcon: <ScheduleIcon sx={{ color: colors.primaryColor }} />,
    inactiveIcon: <ScheduleIcon sx={{ color: "#6B7280" }} />,
    title: "Lịch sử trò chuyện cùng AI",
    enableBadge: false,
  },
  {
    path: "/settings",
    activeIcon: <IcActiveSetting />,
    inactiveIcon: <IcSetting />,
    title: "Cài đặt",
    enableBadge: false,
  },
];

const Sidebar = () => {
  const location = useLocation();
  const isSelected = (path) => new RegExp("^" + path).test(location.pathname);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="sidebar">
      <div className="store-info">
        <Link to="/records">
          <div className="flex w-full p-2">
            <img
              src="/chatbot_icon.png"
              className="chatbotIconHeader"
              alt="chatbot"
            />
            <Typography
              fontWeight="900"
              fontSize="24px"
              sx={{ color: colors.primaryColor }}
            >
              EasySUM
            </Typography>
          </div>
        </Link>
      </div>
      <div className="sidebar-items">
        {sideBarItems.map((sideBarItem) => (
          <Link
            to={sideBarItem.path}
            style={{ color: "inherit", textDecoration: "inherit" }}
          >
            <Box
              key={sideBarItem.path}
              sx={{
                width: "100%",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                padding: "7.5px 10px",
                justifyContent: "flex-start",
                ...(isSelected(sideBarItem.path) && {
                  backgroundColor: colors.trans02Primary,
                  borderRadius: "10px",
                }),
              }}
            >
              {isSelected(sideBarItem.path)
                ? sideBarItem.activeIcon
                : sideBarItem.inactiveIcon}
              <Typography
                fontSize="14px"
                ml="10px"
                sx={{
                  textDecoration: "none",
                  ...(isSelected(sideBarItem.path)
                    ? {
                        fontWeight: "600",
                        color: colors.textAccent,
                      }
                    : {
                        fontWeight: "500",
                        color: "gray",
                      }),
                }}
              >
                {sideBarItem.title}
              </Typography>
            </Box>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
