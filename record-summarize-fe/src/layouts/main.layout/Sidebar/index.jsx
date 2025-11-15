import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { colors } from "@/theme/theme.global";
import IcActiveSetting from "@/assets/icons/IcActiveSetting";
import IcSetting from "@/assets/icons/IcSetting";
import IcActiveCategory from "@/assets/icons/IcActiveCategory";
import IcCategory from "@/assets/icons/IcCategory";
import "./style.scss";
import { useState, useEffect } from "react";
import IcActiveVideo from "@/assets/icons/IcActiveVideo";
import IcVideo from "@/assets/icons/IcVideo";
import ScheduleIcon from "@mui/icons-material/Schedule";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
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
    path: "/chat",
    activeIcon: <ScheduleIcon sx={{ color: colors.primaryColor }} />,
    inactiveIcon: <ScheduleIcon sx={{ color: "#6B7280" }} />,
    title: "Trò chuyện cùng AI",
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
  const isChatRoute = location.pathname.startsWith("/chat");
  const [isCollapsed, setIsCollapsed] = useState(isChatRoute);

  useEffect(() => {
    setIsCollapsed(location.pathname.startsWith("/chat"));
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <IconButton
          className="toggle-btn"
          onClick={toggleSidebar}
          sx={{ color: colors.primaryColor }}
          size="small">
          <MenuIcon />
        </IconButton>
      </div>
      <div className="sidebar-items">
        {sideBarItems.map((sideBarItem) => (
          <Link to={sideBarItem.path} style={{ color: "inherit", textDecoration: "inherit" }} key={sideBarItem.path}>
            <Box
              sx={{
                width: "100%",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                padding: "7.5px 10px",
                justifyContent: "flex-start",
                boxShadow: 'box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;',
                ...(isCollapsed) && {
                  justifyContent: "center",
                  padding: "7.5px 5px",
                },
                ...(isSelected(sideBarItem.path) && {
                  backgroundColor: colors.trans02Primary,
                  borderRadius: "10px",
                }),
              }}
            >
              {isSelected(sideBarItem.path)
                ? sideBarItem.activeIcon
                : sideBarItem.inactiveIcon
              }
              {!isCollapsed && (
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
              )}
            </Box>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
