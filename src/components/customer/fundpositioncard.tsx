import CardActions from "@mui/material/CardActions/CardActions";
import CardContent from "@mui/material/CardContent/CardContent";
import Typography from "@mui/material/Typography";

import CardDX from "../../components/layout/carddx";
import { formattedNumber } from "../../shared/global";
import ButtonDX from "../controls/buttondx";
import GridDX from "../layout/griddx";

const FundPositionCard = (props: any) => {
  return (
    <CardDX sx={{ my: 1 }}>
      <CardContent>
        <Typography
          sx={{ fontSize: 20, textAlign: "center", color: "#007a48" }}
        >
          {props.data.fundName}
        </Typography>
        <br />
        <Typography sx={{ fontSize: 18, textAlign: "center" }}>
          Current Value
        </Typography>
        <Typography
          variant="body1"
          color="primary"
          sx={{ textAlign: "center", fontSize: 30, fontWeight: 700 }}
        >
          Rs. {formattedNumber(props.data.currentValue, 2)}
        </Typography>
        <GridDX container sx={{ width: "100%", mt: 1 }}>
          <GridDX item xs={6}>
            Units :
          </GridDX>
          <GridDX item xs={6} justifyContent="flex-end">
            {formattedNumber(props.data.numberOfUnits)}
          </GridDX>
          <GridDX item xs={6}>
            Last NAV :
          </GridDX>
          <GridDX item xs={6} justifyContent="flex-end">
            Rs. {formattedNumber(props.data.lastNav)}
          </GridDX>
          <GridDX item xs={6}>
            Profit / Loss :
          </GridDX>
          <GridDX item xs={6} justifyContent="flex-end">
            Rs. {formattedNumber(props.data.profitLoss, 2)}
          </GridDX>
        </GridDX>
      </CardContent>
      <CardActions>
        <ButtonDX fullWidth onClick={props.onClick}>
          {props.buttonText}
        </ButtonDX>
      </CardActions>
    </CardDX>
  );
};

export default FundPositionCard;
