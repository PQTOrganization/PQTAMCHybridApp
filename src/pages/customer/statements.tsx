import React from "react";

import List from "@mui/material/List";
import FolderIcon from "@mui/icons-material/Folder";

import GridDX from "../../components/layout/griddx";
import ListItemDX from "../../components/layout/listitemdx";

import { ListItemDXProps } from "../../@types/listitemdxtype";

const Statement = () => {
  const listItems: ListItemDXProps[] = [
    {
      title: "Account Summary",
      label: "Acc Summary",
      icon: <FolderIcon />,
      linkString: "/acctsummary",
    },
    {
      title: "Transaction Statement",
      label: "Statement",
      icon: <FolderIcon />,
      linkString: "/acctsummary",
    },
    {
      title: "Portfolio Summary",
      label: "Portfolio Summary",
      icon: <FolderIcon />,
    },
    {
      title: "Tax Certificate",
      label: "Tax Cert",
      icon: <FolderIcon />,
    },
    {
      title: "Cost Certificate",
      label: "Cost Cert",
      icon: <FolderIcon />,
    },
    {
      title: "Dividend Summary",
      label: "Dividend Summary",
      icon: <FolderIcon />,
    },
    {
      title: "Portfolio Performance",
      label: "Performance",
      icon: <FolderIcon />,
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

export default Statement;
