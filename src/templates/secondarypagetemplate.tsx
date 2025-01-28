import { Outlet } from "react-router-dom";

import GridDX from "../components/layout/griddx";
import SecondaryAppBarDX from "../components/appbars/secondaryappbar";
import NotificationBarDX from "../components/notificationbardx";

const SecondaryPageTemplate = () => {
  return (
    <GridDX
      container
      style={{ height: "100vh", width: "100%", flexDirection: "column" }}
    >
      <GridDX item xs={12}>
        <NotificationBarDX />
        <SecondaryAppBarDX />
      </GridDX>
      <GridDX
        item
        xs={12}
        style={{
          padding: 16,
          height: "calc(100vh - 64px)",
          overflow: "auto",
        }}
      >
        <Outlet />
      </GridDX>
    </GridDX>
  );
};

export default SecondaryPageTemplate;
