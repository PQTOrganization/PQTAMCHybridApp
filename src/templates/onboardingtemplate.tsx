import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Typography, AppBar, IconButton, Toolbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import GridDX from "../components/layout/griddx";

import { useAuthContext } from "../context/authcontext";
import NotificationBarDX from "../components/notificationbardx";

const OnboardingTemplate = () => {
  const navigate = useNavigate();
  const { signOut } = useAuthContext();

  return (
    <GridDX
      container
      style={{ height: "100vh", width: "100%", alignContent: "flex-start" }}
    >
      <GridDX item xs={12} sx={{ maxHeight: 64 }}>
        <NotificationBarDX />
        <AppBar position="static" sx={{ backgroundColor: "#007A48" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => {
                signOut();
                navigate("/");
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Onboarding
            </Typography>
          </Toolbar>
        </AppBar>
      </GridDX>
      <GridDX item xs={12} sx={{ padding: 2, height: "calc(100vh - 64px)" }}>
        <Outlet />
      </GridDX>
    </GridDX>
  );
};

export default OnboardingTemplate;
