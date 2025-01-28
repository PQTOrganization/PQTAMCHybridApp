import React, { useState } from "react";
import {
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormHelperText,
} from "@mui/material";

import SelectListDX from "../../controls/selectlistdx";
import Navigation from "../../controls/navigation";
import TextFieldDX from "../../controls/textfielddx";
import YesNoSwitch from "../../controls/yesnoswitch";
import GridDX from "../../layout/griddx";

import { crsCountriesList, reasonList } from "../../../shared/lookups";

import { useAuthContext } from "../../../context/authcontext";
import { useValidationContext } from "../../../context/validationcontext";

const CRS1 = (props: any) => {
  const [open, setOpen] = useState(false);
  const { inDiscrepancyMode, isDiscrepantField } = useAuthContext();
  const { errors, validateField } = useValidationContext();

  const handleClose = () => setOpen(false);

  const handleOpen = (e: any) => {
    props.onChangeAction(e);
    setOpen(e.target.checked === true ? false : true);
  };

  const handleNext = (resetNav: any) => {
    props.onNextAction(resetNav);
  };

  return (
    <GridDX container spacing={props.readOnly ? 1 : 3}>
      <GridDX item xs={12} sm={7}>
        <SelectListDX
          id="countryOfTaxId"
          name="countryOfTaxId"
          label="Country/jurisdiction of Tax residence"
          tip={`Generally, an individual will be a tax resident of a jurisdiction/country if they normally reside in that jurisdiction/country and not just because they receive income from that jurisdiction/country. Except for the U.S., your citizenship or your place of birth does not determine your tax residence.`}
          list={crsCountriesList}
          value={props.data.countryOfTaxId}
          onChange={(e: any, v: any) => props.onChangeAction(e, v)}
          error={errors["countryOfTaxId"] ? true : false}
          helperText={errors["countryOfTaxId"]}
          readOnly={props.readOnly}
          disabled={inDiscrepancyMode() && !isDiscrepantField("countryOfTaxId")}
          onBlur={() =>
            validateField("countryOfTaxId", props.data.countryOfTaxId)
          }
        />
      </GridDX>
      <GridDX item xs={props.readOnly ? 10 : 7} sm={10}>
        <Typography style={{ fontSize: "12px", textAlign: "justify" }}>
          Is TIN (Tax Identification Number) Available?
        </Typography>
      </GridDX>
      <GridDX item xs={props.readOnly ? 2 : 5} sm={2}>
        <YesNoSwitch
          name="isTINAvailable"
          readOnly={props.readOnly}
          checked={props.data.isTINAvailable}
          onChange={(e: any) => handleOpen(e)}
          disabled={inDiscrepancyMode() && !isDiscrepantField("isTINAvailable")}
        />
      </GridDX>

      {props.readOnly && !props.data.isTINAvailable ? (
        <GridDX item xs={props.readOnly ? 10 : 8} sm={10}>
          {reasonList.find(
            (reason: any) => reason.id === props.data.tinReasonId
          ) && (
            <FormControlLabel
              control={<Radio color="primary" checked={true} disabled={true} />}
              style={{ textAlign: "justify", marginBottom: 15 }}
              label={
                reasonList
                  ? reasonList.find(
                      (reason: any) => reason.id === props.data.tinReasonId
                    )?.value
                  : ""
              }
            />
          )}
        </GridDX>
      ) : !props.data.isTINAvailable ? (
        <GridDX item xs={12}>
          <FormControl
            component="fieldset"
            error={errors["tinReasonId"] ? true : false}
          >
            <FormHelperText>{errors["tinReasonId"]}</FormHelperText>
            <RadioGroup
              name="tinReasonId"
              value={props.data.tinReasonId}
              onChange={(e) => props.onChangeAction(e)}
              onBlur={() =>
                validateField("tinReasonId", props.data.tinReasonId)
              }
            >
              {reasonList &&
                reasonList.map((reason: any, index: number) => (
                  <FormControlLabel
                    key={"reason_key_" + index}
                    value={reason.id}
                    style={{
                      textAlign: "justify",
                      marginBottom: 5,
                    }}
                    control={
                      <Radio
                        color="primary"
                        disabled={
                          props.readOnly ||
                          (inDiscrepancyMode() &&
                            !isDiscrepantField("tinReasonId"))
                        }
                      />
                    }
                    label={reason.value}
                    disabled={
                      props.readOnly ||
                      (inDiscrepancyMode() && !isDiscrepantField("tinReasonId"))
                    }
                  />
                ))}
            </RadioGroup>
          </FormControl>
        </GridDX>
      ) : null}

      {props.data.isTINAvailable && (
        <GridDX item xs={12} sm={7}>
          <TextFieldDX
            name="tinNumber"
            value={props.data.tinNumber}
            label="Please Enter TIN ( Tax Identification Number )"
            onInput={(e: any) => {
              const value = e.target.value;
              e.target.value = value.replace(/[^0-9A-Za-z]/gi, "");
            }}
            onChange={(e: any) => props.onChangeAction(e)}
            error={errors["tinNumber"] ? true : false}
            helperText={errors["tinNumber"]}
            readOnly={props.readOnly}
            InputLabelProps={{ style: { fontSize: "12px" } }}
            disabled={inDiscrepancyMode() && !isDiscrepantField("tinNumber")}
            onBlur={() => validateField("tinNumber", props.data.tinNumber)}
          />
        </GridDX>
      )}

      {!props.data.isTINAvailable && props.data.tinReasonId === "2" && (
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            name="tinReasonDetail"
            value={props.data.tinReasonDetail}
            label="Justification required for Reason B selection"
            onChange={(e: any) => props.onChangeAction(e)}
            error={errors["tinReasonDetail"] ? true : false}
            helperText={errors["tinReasonDetail"]}
            readOnly={props.readOnly}
            InputLabelProps={{ style: { fontSize: "12px" } }}
            disabled={
              inDiscrepancyMode() && !isDiscrepantField("tinReasonDetail")
            }
            onBlur={() =>
              validateField("tinReasonDetail", props.data.tinReasonDetail)
            }
          />
        </GridDX>
      )}

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

export default CRS1;
