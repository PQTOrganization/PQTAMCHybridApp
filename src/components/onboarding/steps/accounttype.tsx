import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  Divider,
  Typography,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  ListItemButton,
  ListItemIcon,
} from "@mui/material/";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate } from "react-router-dom";
import {
  accountCategoryList,
  initializeListData,
} from "../../../shared/lookups";

import Loading from "../../loading";

const AccountType = (props: any) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [groupedAcctCategoryList, setGroupedAcctCategoryList] = useState<any>(
    []
  );

  useEffect(() => {
    initializeListData("").then(() => {
      setIsLoading(false);
      const groupByCategory = accountCategoryList.reduce(
        (group: any, product: any) => {
          const { title } = product;
          group[title] = group[title] ?? [];
          group[title].push(product);
          return group;
        },
        []
      );

      Object.keys(groupByCategory).map((item) => {
        for (let index = 0; index < groupByCategory[item].length; index++) {
          const element = groupByCategory[item][index];
        }
      });
      setGroupedAcctCategoryList(groupByCategory);
    });
  }, []);

  const onAccountSelect = (accountType: number) => {
    navigate("/onboard", { state: { accountTypeID: accountType } });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      {isLoading && <Loading />}
      {!isLoading && accountCategoryList?.length > 0 && (
        <List>
          {Object.keys(groupedAcctCategoryList).map((key: any) => {
            return (
              <>
                <Typography
                  sx={{
                    fontSize: "24px",
                    mt: 2,
                  }}
                  color="text.primary"
                >
                  {key}{" "}
                </Typography>

                {groupedAcctCategoryList[key].map((item: any) => {
                  return (
                    <>
                      <ListItem>
                        <ListItemButton
                          onClick={() => onAccountSelect(item.id)}
                        >
                          <ListItemText
                            primary={
                              <React.Fragment>
                                <Typography
                                  sx={{
                                    display: "inline",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                  color="text.primary"
                                >
                                  {item.subtitle}
                                </Typography>
                              </React.Fragment>
                            }
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {item.description}
                                </Typography>
                              </React.Fragment>
                            }
                          />
                          <ListItemIcon style={{ alignItems: "flex-end" }}>
                            <NavigateNextIcon />
                          </ListItemIcon>
                        </ListItemButton>
                      </ListItem>
                      <Divider />
                    </>
                  );
                })}
              </>
            );
          })}
        </List>
      )}
    </LocalizationProvider>
  );
};

export default AccountType;
