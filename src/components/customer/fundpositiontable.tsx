import GridDX from "../../components/layout/griddx";
import GridRowDividerDX from "../../components/layout/gridrowdividerdx";

import { formattedNumber } from "../../shared/global";

const FundPositionTable = (props: any) => {
  const showPL = props.showPL ?? true;

  return (
    <GridDX container sx={{ width: "100%" }}>
      <GridDX item xs={6} md={6}>
        Amount:
      </GridDX>
      <GridDX item xs={6} md={6} justifyContent="flex-end">
        Rs. {formattedNumber(props.data?.currentValue, 2)}
      </GridDX>
      <GridRowDividerDX />
      <GridDX item xs={6} md={6}>
        Units:
      </GridDX>
      <GridDX item xs={6} md={6} justifyContent="flex-end">
        {formattedNumber(props.data?.numberOfUnits)}
      </GridDX>
      <GridRowDividerDX />
      <GridDX item xs={6} md={6}>
        Last NAV:
      </GridDX>
      <GridDX item xs={6} md={6} justifyContent="flex-end">
        Rs.{" "}
        {props.mode === "R"
          ? formattedNumber(props.data?.purchaseNav)
          : formattedNumber(props.data?.lastNav)}
      </GridDX>
      <GridRowDividerDX />
      {showPL && (
        <>
          <GridDX item xs={6} md={6}>
            Profit / Loss:
          </GridDX>
          <GridDX item xs={6} md={6} justifyContent="flex-end">
            Rs. {formattedNumber(props.data?.profitLoss, 2)}
          </GridDX>
          <GridRowDividerDX />
        </>
      )}
    </GridDX>
  );
};

export default FundPositionTable;
