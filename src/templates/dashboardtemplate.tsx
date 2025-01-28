import { Outlet } from "react-router-dom";

import GridDX from "../components/layout/griddx";
import BottomBarDX from "../components/appbars/bottombardx";
import AppBarDX from "../components/appbars/dashboardappbardx";
import NotificationBarDX from "../components/notificationbardx";

const DashboardTemplate = () => {
  return (
    <GridDX
      container
      style={{ height: "100vh", width: "100%", flexDirection: "column" }}
    >
      <GridDX item xs={12}>
        <NotificationBarDX />
        <AppBarDX />
      </GridDX>
      <GridDX
        item
        xs={12}
        style={{
          padding: 16,
          height: "calc(100vh - 120px)",
          overflow: "scroll",
        }}
      >
        <Outlet />
      </GridDX>
      <GridDX item xs={12}>
        <BottomBarDX />
      </GridDX>
    </GridDX>
  );
};

export default DashboardTemplate;
