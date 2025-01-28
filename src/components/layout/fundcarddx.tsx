import { CardContent, Typography } from "@mui/material";
import { formattedNumber } from "../../shared/global";
import CardDX from "./carddx";
import GridDX from "./griddx";

const FundCards = (props: any) => {
  return (
    <CardDX
      sx={{
        my: 1,
        boxShadow: 10,
      }}
    >
      <CardContent>
        <Typography
          color="primary"
          sx={{
            display: "flex",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: 20,
          }}
        >
          {props.data.fundName}
        </Typography>
        <GridDX container spacing={2} sx={{ mt: 1 }}>
          <GridDX item xs={6}>
            Amount:
          </GridDX>
          <GridDX item xs={6} justifyContent="flex-end">
            Rs. {formattedNumber(props.data.currentValue)}
          </GridDX>
          <GridDX item xs={6}>
            Units:
          </GridDX>
          <GridDX item xs={6} justifyContent="flex-end">
            {formattedNumber(props.data.numberOfUnits)}
          </GridDX>
          <GridDX item xs={6}>
            NAV:
          </GridDX>
          <GridDX item xs={6} justifyContent="flex-end">
            Rs. {formattedNumber(props.data.lastNav)}
          </GridDX>
          <GridDX item xs={6}>
            Gain/Loss:
          </GridDX>
          <GridDX item xs={6} justifyContent="flex-end">
            Rs. {formattedNumber(props.data.profitLoss)}
          </GridDX>
        </GridDX>
      </CardContent>
    </CardDX>
  );
};

export default FundCards;
