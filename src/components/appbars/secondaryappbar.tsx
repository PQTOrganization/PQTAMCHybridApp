import React, { useEffect, useState } from "react";
import { Typography, AppBar, IconButton, Toolbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";

const SecondaryAppBarDX = () => {
  const routeMap = new Map<string, string>([
    ["profile", "Profile"],
    ["bankaccounts", "Bank Accounts"],
    ["add-bankacct", "Add Bank Account"],
    ["transactions", "Transactions"],
    ["make-investment", "Make Investment"],
    ["confirm-payment", "Confirm Online Payment"],
    ["request-redeem", "Request Redeem"],
    ["redeem-fund", "Redeem Fund"],
    ["fund-to-fund-transfer-1", "Fund to Fund Transfer"],
    ["fund-to-fund-transfer-2", "Fund to Fund Transfer"],
    ["fund-to-fund-transfer-3", "Fund to Fund Transfer"],
    ["transactions-in-process", "Transactions In Process"],
    ["explore-funds", "Explore Funds"],
    ["sip-calculator", "SIP Plan"],
    ["acctsummary", "Account Summary"],
    ["switchfolio", "Select Folio"],
    ["contactus", "Contact Us"],
  ]);

  const navigate = useNavigate();
  const location = useLocation();

  const [pageHeading, setPageHeading] = useState("Dashboard");

  useEffect(() => {
    const pathName = location.pathname.substring(1);
    setPageHeading(routeMap.get(pathName) ?? "Page Title");
  }, [location.pathname]);

  useEffect(() => {
    const menuItem: string | undefined = location?.state?.menuItem;
    if (menuItem) setPageHeading(menuItem ?? "Page Title");
  }, [location.pathname]);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#007A48" }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="Close"
          onClick={() => {
            navigate(-1);
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {pageHeading}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default SecondaryAppBarDX;
