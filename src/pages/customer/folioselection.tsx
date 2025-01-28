import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  Divider,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import UserIcon from "@mui/icons-material/AccountCircle";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../context/authcontext";

import GridDX from "../../components/layout/griddx";
import { zeroPad } from "../../shared/global";

const FolioSelection = () => {
  const navigate = useNavigate();
  const { getUserDetails, updateCurrentFolioNumber } = useAuthContext();

  const [usersList, setUsersList] = useState<any>([]);

  useEffect(() => {
    getUserDetails().then((userDetails: any) =>
      setUsersList(userDetails.folioList.slice())
    );
  }, []);

  const selectFolioNumber = (
    newFolioNumber: string,
    firstName: string,
    lastName: string
  ) => {
    const fullName = `${firstName} ${lastName ?? ""}`;
    updateCurrentFolioNumber(newFolioNumber, fullName).then(() =>
      navigate("/dashboard")
    );
  };

  return (
    <GridDX container sx={{ width: "100%" }}>
      <GridDX item xs={12}>
        <List sx={{ width: "100%" }}>
          {usersList.map((user: any, index: number) => (
            <div key={`folio_list_${index}`}>
              <ListItem
                style={{ paddingLeft: 0, paddingRight: 0 }}
                alignItems="center"
                onClick={() =>
                  selectFolioNumber(
                    user.folioNumber,
                    user.firstName,
                    user.lastName
                  )
                }
                sx={{ cursor: "pointer" }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <UserIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${user.firstName} ${user.lastName ?? ""}`}
                  secondary={zeroPad(user.folioNumber, 7)}
                />
                <ListItemAvatar sx={{ textAlign: "end" }}>
                  <ChevronRight />
                </ListItemAvatar>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </GridDX>
    </GridDX>
  );
};

export default FolioSelection;
