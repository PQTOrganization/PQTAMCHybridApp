import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import AppsIcon from "@mui/icons-material/Apps";
import ChatIcon from "@mui/icons-material/Chat";
import FilterListIcon from "@mui/icons-material/FilterList";

const BottomBarDX = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  return (
    <Paper
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <BottomNavigation
        sx={{
          bgcolor: "#007A48",
          color: "#FFF",
          "& .Mui-selected": {
            "& .MuiBottomNavigationAction-label": {
              fontSize: (theme) => theme.typography.caption,
              transition: "none",
              fontWeight: "bold",
              lineHeight: "20px",
            },
            "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
              color: "#FFF",
              opacity: 1,
            },
          },
          "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
            color: "#FFFFFF",
            opacity: 0.74,
          },
        }}
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          onClick={() => navigate("/dashboard")}
        />
        <BottomNavigationAction
          label="e-Services"
          icon={<AppsIcon />}
          onClick={() => navigate("/e-services")}
        />
        <BottomNavigationAction
          label="Statement"
          icon={<ChatIcon />}
          onClick={() => navigate("/statement")}
        />
        <BottomNavigationAction
          label="Portfolio"
          icon={<FilterListIcon />}
          onClick={() => navigate("/portfolio")}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomBarDX;
