import moment from "moment";
import React from "react";
import { useConfigContext } from "../../context/configcontext";
import { formattedNumber } from "../../shared/global";
import GridDX from "./griddx";
import GridRowDividerDX from "./gridrowdividerdx";

const TransactionGrid = (props: any) => {
  const { DATE_FORMAT } = useConfigContext();

  const requestTypeText = (type: string) => {
    switch (type) {
      case "I":
        return "New Investment Request";
      case "R":
        return "New Redemption Request";
      default:
        return "New Transfer Request";
    }
  };

  return (
    <GridDX container sx={{ width: "100%", mb: 1 }}>
      <GridDX
        item
        xs={12}
        sx={{
          my: 1,
          p: 0.5,
          color: "#8B0037",
          fontWeight: 500,
          backgroundColor: "rgba(0,0,0, 0.12)",
        }}
      >
        {requestTypeText(props.data.requestType)}
      </GridDX>
      <GridDX item xs={12}>
        <GridDX
          container
          sx={{
            width: "100%",
          }}
        >
          <GridDX
            item
            xs={8}
            sx={{ color: "rgba(0,0,0,0.87)", flexDirection: "column" }}
          >
            <GridDX item xs={12}>
              {props.data.requestType === "T" ? "From " : ""} Fund :{" "}
              {props.data.fundName}
            </GridDX>
            {props.data.requestType === "T" && (
              <GridDX item xs={12}>
                To Fund : {props.data.toFundName}
              </GridDX>
            )}
            <GridDX item xs={12}>
              Transaction Date :{" "}
              {moment(props.data.requestDate).format(DATE_FORMAT + " hh:mm A")}
            </GridDX>

            {props.data.requestType === "I" && (
              <>
                {/* <GridDX item xs={12}>
                  Payment Mode : {props.data.paymentMode}
                </GridDX> */}
                <GridDX item xs={12}>
                  Payment Reference : {props.data.paymentReference}
                </GridDX>
              </>
            )}
          </GridDX>

          <GridDX
            item
            xs={4}
            sx={{ color: "rgba(0,0,0,0.87)", flexDirection: "column" }}
          >
            <GridDX
              item
              xs={12}
              sx={{
                justifyContent: "flex-end",
                fontWeight: 500,
                color:
                  props.data.requestType === "I"
                    ? "#007A47"
                    : props.data.requestType === "R"
                    ? "#B00020"
                    : "#000000",
              }}
            >
              Rs. {formattedNumber(props.data.amount, 2)}
            </GridDX>
            {props.data.requestType === "R" && (
              <>
                <GridDX
                  item
                  xs={12}
                  sx={{
                    justifyContent: "flex-end",
                  }}
                >
                  Bank Account : {props.data.bankAccountNo}
                </GridDX>
              </>
            )}
          </GridDX>
        </GridDX>
      </GridDX>
      <GridDX item xs={12}>
        <GridRowDividerDX />
      </GridDX>
    </GridDX>
  );
};

export default TransactionGrid;
