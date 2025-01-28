import { Outlet } from "react-router-dom";
import NotificationBarDX from "../components/notificationbardx";
import GridDX from "../components/layout/griddx";

const AccountTemplate = () => {
  return (
    <GridDX
      container
      style={{
        height: "100vh",
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <NotificationBarDX />
      <GridDX item xs={12} style={{ padding: 16 }}>
        <Outlet />
      </GridDX>
    </GridDX>
  );
};

export default AccountTemplate;
