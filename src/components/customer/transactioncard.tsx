import { Typography, CardContent } from "@mui/material";
import moment from "moment";

import { useConfigContext } from "../../context/configcontext";
import { formattedNumber } from "../../shared/global";

import CardDX from "../layout/carddx";
import GridDX from "../layout/griddx";

const TransactionCard = (props: any) => {
  const { DATE_FORMAT } = useConfigContext();

  return (
    <CardDX sx={{ width: "100%", my: 1 }} key={props.keyValue}>
      <CardContent>
        <GridDX container sx={{ width: "100%" }}>
          <GridDX item xs={6} justifyContent="flex-start">
            <Typography>
              {moment(props.data.processDate).format(DATE_FORMAT)}
            </Typography>
          </GridDX>
          <GridDX item xs={6} justifyContent="flex-end">
            <Typography>{props.data.transaction}</Typography>
          </GridDX>
          <GridDX item xs={6}>
            <Typography>{props.data.fundame}</Typography>
          </GridDX>
          <GridDX item xs={6} justifyContent="flex-end">
            <Typography>{formattedNumber(props.data.grossAmount)}</Typography>
          </GridDX>
        </GridDX>
      </CardContent>
    </CardDX>
  );
};

export default TransactionCard;
