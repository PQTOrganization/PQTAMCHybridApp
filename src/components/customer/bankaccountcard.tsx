import {
  Typography,
  CardContent,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useConfigContext } from "../../context/configcontext";
import CardDX from "../layout/carddx";
import GridDX from "../layout/griddx";

const BankAccountCard = (props: any) => {
  return (
    <CardDX sx={{ width: "100%", my: 1 }} key={props.key}>
      <CardContent>
        <GridDX container sx={{ width: "100%" }}>
          <GridDX item xs={12} justifyContent="center">
            <Typography
              color="primary"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {props.bank?.value}
            </Typography>
          </GridDX>
          <GridDX item xs={12} justifyContent="center">
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {props.data.ibanNumber}
            </Typography>
          </GridDX>
          <GridDX
            item
            xs={12}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Typography
              sx={{
                fontSize: 18,
                textAlign: "center",
                fontWeight: 700,
                color: "#007a48",
              }}
            >
              {props.data.oneLinkTitle}
            </Typography>
          </GridDX>
          <GridDX item xs={12} sx={{ justifyContent: "center" }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isOBAccount"
                  checked={props.data.isOBAccount}
                  readOnly
                  color="primary"
                />
              }
              label="Onboarding Account"
            />
          </GridDX>
        </GridDX>
      </CardContent>
    </CardDX>
  );
};

export default BankAccountCard;
