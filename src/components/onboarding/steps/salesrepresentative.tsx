import React, { useState, useEffect } from "react";
import TextFieldDX from "../../controls/textfielddx";
import GridDX from "../../layout/griddx";
import { useAuthContext } from "../../../context/authcontext";
import { useValidationContext } from "../../../context/validationcontext";
import Navigation from "../../controls/navigation";

const SalesRepresentative = (props: any) => {
  const [open, setOpen] = useState(false);
  const { inDiscrepancyMode, isDiscrepantField } = useAuthContext();
  const { errors, validateField } = useValidationContext();

  const handleClose = () => setOpen(false);

  const handleOpen = (e: any) => {
    props.onChangeAction(e);
    setOpen(e.target.checked === true ? false : true);
  };

  const handleNext = (resetNav: any) => {
    console.log("called");
    props.onStepComplete();
    props.onNextAction(resetNav);
  };

  useEffect(() => {
    props.onStepComplete();
  }, []);

  return (
    <GridDX container spacing={props.readOnly ? 1 : 3}>
      <GridDX item xs={12} sm={7}>
        <TextFieldDX
          name="SalesRepresentativeNameCode"
          value={props.data.SalesRepresentativeNameCode}
          label="Sales Representative Name/Code"
          onInput={(e: any) => {
            const value = e.target.value;
            e.target.value = value.replace(/[^0-9A-Za-z ]/gi, "");
          }}
          onChange={(e: any) => props.onChangeAction(e)}
          error={errors["SalesRepresentativeNameCode"] ? true : false}
          helperText={errors["SalesRepresentativeNameCode"]}
          readOnly={props.readOnly}
          InputLabelProps={{ style: { fontSize: "12px" } }}
          disabled={
            inDiscrepancyMode() &&
            !isDiscrepantField("SalesRepresentativeNameCode")
          }
          onBlur={() =>
            validateField(
              "SalesRepresentativeNameCode",
              props.data.SalesRepresentativeNameCode
            )
          }
        />
      </GridDX>
      <GridDX item xs={12} sm={7}>
        <TextFieldDX
          name="SalesRepresentativeMobileNumber"
          value={props.data.SalesRepresentativeMobileNumber}
          label="Sales Representative Mobile No"
          onInput={(e: any) => {
            const value = e.target.value;
            e.target.value = value.replace(/[^0-9A-Za-z]/gi, "");
          }}
          onChange={(e: any) => props.onChangeAction(e)}
          error={errors["SalesRepresentativeMobileNumber"] ? true : false}
          helperText={errors["SalesRepresentativeMobileNumber"]}
          readOnly={props.readOnly}
          InputLabelProps={{ style: { fontSize: "12px" } }}
          disabled={
            inDiscrepancyMode() &&
            !isDiscrepantField("SalesRepresentativeMobileNumber")
          }
          onBlur={() =>
            validateField(
              "SalesRepresentativeMobileNumber",
              props.data.SalesRepresentativeMobileNumber
            )
          }
        />
      </GridDX>
      {!props.readOnly && (
        <GridDX item xs={12}>
          <Navigation
            onPrevAction={props.onPrevAction}
            onNextAction={handleNext}
          />
        </GridDX>
      )}
    </GridDX>
  );
};

export default SalesRepresentative;
