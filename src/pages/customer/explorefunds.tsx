import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import GridDX from "../../components/layout/griddx";
import { openURLInBrowser } from "../../shared/global";

const ExploreFunds = () => {
  const listItems = [
    {
      title: "Asan Munafa",
      linkString: `${window.location.origin}/asset/explorefunds/PQAMC-AsanMunafa.pdf`,
    },
    {
      title: "Islamic Stock Fund",
      linkString: `${window.location.origin}/asset/explorefunds/PQAMC-IslamicStockFund.pdf`,
    },
    {
      title: "Khalis Bachat",
      linkString: `${window.location.origin}/asset/explorefunds/PQAMC-KhalisBachat.pdf`,
    },
  ];

  return (
    <GridDX container sx={{ width: "100%" }}>
      <GridDX item xs={12}>
        <List sx={{ width: "100%" }}>
          {listItems.map((item, index) => (
            <ListItem
              key={"fund_" + index}
              sx={{ p: 1, backgroundColor: "white", my: 1 }}
              alignItems="flex-start"
            >
              <ListItemButton
                onClick={
                  item.linkString
                    ? () => openURLInBrowser(item.linkString)
                    : undefined
                }
              >
                <ListItemText primary={item.title} />
                <ListItemIcon sx={{ justifyContent: "end" }}>
                  <DownloadIcon color="primary" />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </GridDX>
    </GridDX>
  );
};

export default ExploreFunds;
