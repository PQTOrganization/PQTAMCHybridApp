import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  SwipeableDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import UserIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";

import GridDX from "./griddx";

import { useAuthContext } from "../../context/authcontext";
import { zeroPad } from "../../shared/global";

type Anchor = "top" | "left" | "bottom" | "right";

const AppDrawerDX = () => {
  const itemsList = [
    {
      title: "Profile",
      icon: <ManageAccountsIcon fontSize="large" />,
      link: "/profile",
    },
    {
      title: "Add / Update Bank Account",
      icon: <CurrencyExchangeIcon fontSize="large" />,
      link: "/bankaccounts",
    },
    {
      title: "Switch Folio",
      icon: <SwitchAccountIcon fontSize="large" />,
      link: "/switchfolio",
    },
  ];

  const navigate = useNavigate();
  const { getUserDetails } = useAuthContext();

  const [state, setState] = useState({
    left: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const drawListItem = (icon: any, text: string, link: string) => {
    return (
      <ListItem key={text} disablePadding>
        <ListItemButton
          onClick={() => {
            if (link.includes("switchfolio")) navigate(link, { replace: true });
            else navigate(link);
          }}
        >
          <ListItemIcon sx={{ fontSize: "large" }}>{icon}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    );
  };

  const list = (anchor: Anchor) => {
    const allowSwitch = userDetails?.folioList.length > 1;

    let newItemsList = [...itemsList];

    if (!allowSwitch)
      newItemsList = itemsList.filter((x) => !x.link.includes("switch"));

    return (
      <Box
        sx={{
          width: "auto",
          mx: 1.5,
        }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List>
          {newItemsList.map((item) =>
            drawListItem(item.icon, item.title, item.link)
          )}
        </List>
      </Box>
    );
  };

  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    getUserDetails().then((userDetails: any) => setUserDetails(userDetails));
  }, []);

  return (
    <div
      style={{
        flex: 1,
      }}
    >
      <IconButton
        onClick={toggleDrawer("left", true)}
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
      >
        <MenuRoundedIcon />
      </IconButton>
      <SwipeableDrawer
        PaperProps={{
          sx: { width: "100%" },
        }}
        anchor={"left"}
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
        onOpen={toggleDrawer("left", true)}
      >
        <GridDX container spacing={1} sx={{ mx: 2, my: 2 }}>
          <GridDX item xs={12}>
            <CloseIcon
              fontSize="medium"
              style={{ cursor: "pointer" }}
              onClick={toggleDrawer("left", false)}
            />
          </GridDX>
          <GridDX
            item
            xs={2}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <UserIcon fontSize="large" />
          </GridDX>
          <GridDX
            item
            xs={10}
            sx={{ color: "#000000", opacity: 0.6, flexDirection: "column" }}
          >
            <Typography sx={{ opacity: 1 }}>Welcome</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "larger" }}>
              {userDetails?.firstName}
            </Typography>
            <Typography>
              Account # {zeroPad(userDetails?.currentFolioNumber, 7)}
            </Typography>
          </GridDX>
        </GridDX>
        {list("left")}
      </SwipeableDrawer>
    </div>
  );
};

export default AppDrawerDX;
