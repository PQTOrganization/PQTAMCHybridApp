import React, { useState, useEffect } from "react";
import { useMediaQuery, useTheme, Divider, Typography } from "@mui/material/";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextFieldDX from "../../controls/textfielddx";
import { useAuthContext } from "../../../context/authcontext";
import { useValidationContext } from "../../../context/validationcontext";
import GridDX from "../../layout/griddx";
import DeleteIcon from "@mui/icons-material/DeleteOutline";

const Nominee = (props: any) => {
  const { getUserDetails, inDiscrepancyMode, isDiscrepantField } =
    useAuthContext();

  const theme = useTheme();
  const useMobileView = useMediaQuery(theme.breakpoints.down("xs"));
  const { errors, validateField, validatevpsSubFundValues } =
    useValidationContext();

  let nomData = {
    id: 0,
    name: null,
    relationship: null,
    share: 0,
    cnicNumber: null,
    residentialAddress: null,
    telephoneNumber: null,
    bankDetails: null,
    userApplicationId: props.data.userApplicationId,
  };

  const [nomineeData, setNomineeData] = useState<any | null>(nomData);

  useEffect(() => {
    if (props.nominee) {
      setNomineeData(props.nominee);
    }
  }, [props.nominee]);

  const onDataChange = async ({ target }: any, v: any) => {
    let newNomineeData = {
      ...nomineeData,
      [target.name]: target.value,
    };

    setNomineeData(newNomineeData);
    props.onChangeData(props.index, newNomineeData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <GridDX container style={{ marginTop: "5px" }}>
        <GridDX item xs={12}>
          <Typography color="primary">Nominee {props.index + 1}</Typography>
          {!props.readOnly && (
            <DeleteIcon
              color="error"
              fontSize="small"
              style={{ marginLeft: 5, marginTop: 3, cursor: "pointer" }}
              onClick={() => {
                props.onDelete(props.index);
              }}
            />
          )}
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            name="name"
            value={nomineeData.name || ""}
            label="Name"
            onChange={(e: any, v: any) => onDataChange(e, v)}
            error={errors["nomineename" + props.index] ? true : undefined}
            helperText={errors["nomineename" + props.index]}
            readOnly={props.readOnly}
            disabled={inDiscrepancyMode() && !isDiscrepantField("nomineeName")}
            onBlur={() =>
              validateField("nomineename" + props.index, nomineeData.name)
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            id="relationship"
            name="relationship"
            label="Relationship"
            value={nomineeData.relationship || ""}
            required
            onChange={(e: any, v: any) => onDataChange(e, v)}
            error={
              errors["nomineerelationship" + props.index] ? true : undefined
            }
            helperText={errors["nomineerelationship" + props.index]}
            readOnly={props.readOnly}
            disabled={inDiscrepancyMode() && !isDiscrepantField("relationship")}
            onBlur={() =>
              validateField(
                "nomineerelationship" + props.index,
                nomineeData.relationship
              )
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            id="share"
            name="share"
            label="Share"
            value={nomineeData.share || ""}
            required
            type="number"
            onInput={(e: any) => {
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 9);
            }}
            onChange={(e: any, v: any) => onDataChange(e, v)}
            error={errors["nomineeshare" + props.index] ? true : undefined}
            helperText={errors["nomineeshare" + props.index]}
            readOnly={props.readOnly}
            disabled={inDiscrepancyMode() && !isDiscrepantField("share")}
            onBlur={() =>
              validateField("nomineeshare" + props.index, nomineeData.share)
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            id="cnic"
            name="cnic"
            label="CNIC/NICOP/B Form No."
            value={nomineeData.cnic || ""}
            required
            onChange={(e: any, v: any) => onDataChange(e, v)}
            error={errors["nomineecnic" + props.index] ? true : undefined}
            helperText={errors["nomineecnic" + props.index]}
            readOnly={props.readOnly}
            disabled={inDiscrepancyMode() && !isDiscrepantField("cnic")}
            onBlur={() =>
              validateField("nomineecnic" + props.index, nomineeData.cnic)
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            id="residentialAddress"
            name="residentialAddress"
            label="Residential Address"
            value={nomineeData.residentialAddress || ""}
            onChange={(e: any, v: any) => onDataChange(e, v)}
            error={errors["nomineeresidentialAddress"] ? true : undefined}
            helperText={errors["nomineeresidentialAddress"]}
            readOnly={props.readOnly}
            disabled={
              inDiscrepancyMode() && !isDiscrepantField("residentialAddress")
            }
            onBlur={() =>
              validateField(
                "nomineeresidentialAddress",
                nomineeData.residentialAddress
              )
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            id="telephoneNumber"
            name="telephoneNumber"
            label="Telephone Number"
            value={nomineeData.telephoneNumber || ""}
            onChange={(e: any, v: any) => onDataChange(e, v)}
            error={errors["nomineetelephoneNumber"] ? true : undefined}
            helperText={errors["nomineetelephoneNumber"]}
            readOnly={props.readOnly}
            disabled={
              inDiscrepancyMode() &&
              !isDiscrepantField("nomineetelephoneNumber")
            }
            onBlur={() =>
              validateField(
                "nomineetelephoneNumber",
                nomineeData.telephoneNumber
              )
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            id="bankAccountDetail"
            name="bankAccountDetail"
            label="Bank Account Detail"
            value={nomineeData.bankAccountDetail || ""}
            onChange={(e: any, v: any) => onDataChange(e, v)}
            error={errors["nomineebankAccountDetail"] ? true : undefined}
            helperText={errors["nomineebankAccountDetail"]}
            readOnly={props.readOnly}
            disabled={
              inDiscrepancyMode() &&
              !isDiscrepantField("nomineebankAccountDetail")
            }
            onBlur={() =>
              validateField(
                "nomineebankAccountDetail",
                nomineeData.bankAccountDetail
              )
            }
          />
        </GridDX>
      </GridDX>
    </LocalizationProvider>
  );
};

export default Nominee;
