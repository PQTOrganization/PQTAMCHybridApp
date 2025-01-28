import React, { useEffect, useState } from "react";
import { Typography, AppBar, IconButton, Toolbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import AppDrawerDX from "../layout/appdrawerdx";

import BellIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuthContext } from "../../context/authcontext";

const DashboardBoardAppBarDX = () => {
  const routeMap = new Map<string, string>([
    ["dashboard", "Dashboard"],
    ["e-services", "e-Services"],
    ["statement", "Statement"],
    ["portfolio", "Portfolio"],
  ]);

  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuthContext();

  const [pageHeading, setPageHeading] = useState("Dashboard");

  useEffect(() => {
    const pathName = location.pathname.substring(1);
    setPageHeading(routeMap.get(pathName) ?? "Page Title");
  }, [location.pathname]);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#007A48" }}>
      <Toolbar>
        <AppDrawerDX />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {pageHeading}
        </Typography>
        <IconButton size="large" color="inherit">
          <BellIcon />
        </IconButton>
        <IconButton
          size="large"
          color="inherit"
          onClick={() => {
            signOut();
            navigate("/");
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardBoardAppBarDX;
