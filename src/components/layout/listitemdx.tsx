import React from "react";
import { useNavigate } from "react-router-dom";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";

import ChevronRight from "@mui/icons-material/ChevronRight";

import { ListItemDXProps } from "../../@types/listitemdxtype";

const ListItemDX = ({
  listItemDXTypeProps,
}: {
  listItemDXTypeProps: ListItemDXProps;
}): JSX.Element => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <ListItem
        style={{ paddingLeft: 0, paddingRight: 0 }}
        alignItems="flex-start"
        secondaryAction={
          <IconButton
            edge="end"
            aria-label={listItemDXTypeProps.label}
            onClick={
              listItemDXTypeProps.linkString
                ? () => navigate(listItemDXTypeProps.linkString as string)
                : undefined
            }
            sx={{ color: "#8B0037" }}
          >
            <ChevronRight />
          </IconButton>
        }
      >
        <ListItemButton
          onClick={
            listItemDXTypeProps.linkString
              ? () =>
                  navigate(listItemDXTypeProps.linkString as string, {
                    state: { menuItem: listItemDXTypeProps.title },
                  })
              : undefined
          }
        >
          <ListItemIcon>{listItemDXTypeProps.icon}</ListItemIcon>
          <ListItemText primary={listItemDXTypeProps.title} />
        </ListItemButton>
      </ListItem>
      <Divider variant="inset" component="li" />
    </React.Fragment>
  );
};

export default ListItemDX;
