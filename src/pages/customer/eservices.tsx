import React from "react";

import List from "@mui/material/List";
import FolderIcon from "@mui/icons-material/Folder";

import GridDX from "../../components/layout/griddx";
import ListItemDX from "../../components/layout/listitemdx";

import { ListItemDXProps } from "../../@types/listitemdxtype";

const EServices = () => {
  const listItems: ListItemDXProps[] = [
    {
      title: "Transaction in Progress",
      label: "Transaction",
      icon: <FolderIcon color="primary" />,
      linkString: "/transactions-in-process",
    },
    {
      title: "View Transactions",
      label: "View",
      icon: <FolderIcon color="primary" />,
      linkString: "/transactions",
    },
    {
      title: "Make an Investment",
      label: "Invest",
      icon: <FolderIcon color="primary" />,
      linkString: "/make-investment",
    },
    {
      title: "Apply For Redemption",
      label: "Redeem",
      icon: <FolderIcon color="primary" />,
      linkString: "/request-redeem",
    },
    {
      title: "Funds to Fund Transfer",
      label: "Fund Transfer",
      icon: <FolderIcon color="primary" />,
      linkString: "/fund-to-fund-transfer-1",
    },
    {
      title: "SIP Plan",
      label: "SIP Plan",
      icon: <FolderIcon color="primary" />,
      linkString: "/sip-calculator",
    },
    {
      title: "Explore Funds",
      label: "Explore Funds",
      icon: <FolderIcon color="primary" />,
      linkString: "/explore-funds",
    },
  ];

  return (
    <GridDX container sx={{ width: "100%" }}>
      <GridDX item xs={12}>
        <List sx={{ width: "100%" }}>
          {listItems.map((item, index) => (
            <ListItemDX listItemDXTypeProps={item} key={index} />
          ))}
        </List>
      </GridDX>
    </GridDX>
  );
};

export default EServices;
