import React, { useState, useEffect } from "react";
import { useMediaQuery, useTheme } from "@mui/material/";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate } from "react-router-dom";
import TextFieldDX from "../../controls/textfielddx";
import SelectListDX from "../../controls/selectlistdx";
import Navigation from "../../controls/navigation";

import {
  getPlanListByAccountCategory,
  modeOfPaymentList,
  modeOfContributionList,
  contributionFrequencyList,
  bankList,
} from "../../../shared/lookups";

import { useAuthContext } from "../../../context/authcontext";
import { useConfigContext } from "../../../context/configcontext";
import { useValidationContext } from "../../../context/validationcontext";
import GridDX from "../../layout/griddx";

const Contribution = (props: any) => {
  const { getUserDetails, inDiscrepancyMode, isDiscrepantField } =
    useAuthContext();

  const theme = useTheme();
  const useMobileView = useMediaQuery(theme.breakpoints.down("xs"));
  const { errors, validateField, validatevpsSubFundValues } =
    useValidationContext();

  const handleNextClick = (resetNav: any) => {
    props.onNextAction(resetNav);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <GridDX container spacing={props.readOnly ? 2 : useMobileView ? 2 : 4}>
        <GridDX item xs={12} sm={6}>
          <SelectListDX
            id="modeOfContribution"
            name="modeOfContribution"
            label="Mode of Contribution"
            value={props.data.modeOfContribution}
            list={modeOfContributionList}
            onChange={(e: any, v: any) => props.onChangeAction(e, v)}
            error={errors["modeOfContribution"] ? true : undefined}
            helperText={errors["modeOfContribution"]}
            readOnly={props.readOnly}
            disabled={
              inDiscrepancyMode() && !isDiscrepantField("modeOfContribution")
            }
            onBlur={() =>
              validateField("modeOfContribution", props.data.modeOfContribution)
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            name="initialContributionAmount"
            label="Initial Contribution Amount"
            value={props.data.initialContributionAmount}
            required
            type="number"
            onInput={(e: any) => {
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 9);
            }}
            onChange={(e: any) => props.onChangeAction(e)}
            error={errors["initialContributionAmount"] ? true : false}
            helperText={errors["initialContributionAmount"]}
            readOnly={props.readOnly}
            disabled={
              inDiscrepancyMode() &&
              !isDiscrepantField("initialContributionAmount")
            }
            onBlur={() =>
              validateField(
                "initialContributionAmount",
                props.data.initialContributionAmount
              )
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            id="amountInWords"
            name="amountInWords"
            label="Amount In Words"
            value={props.data.amountInWords}
            required
            onChange={(e: any) => props.onChangeAction(e)}
            error={errors["amountInWords"] ? true : undefined}
            helperText={errors["amountInWords"]}
            readOnly={props.readOnly}
            disabled={
              inDiscrepancyMode() && !isDiscrepantField("amountInWords")
            }
            onBlur={() =>
              validateField("amountInWords", props.data.amountInWords)
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            id="frontEndLoad"
            name="frontEndLoad"
            label="Front End Load (%)"
            value={props.data.frontEndLoad}
            required
            type="number"
            onInput={(e: any) => {
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 9);
            }}
            onChange={(e: any) => props.onChangeAction(e)}
            error={errors["frontEndLoad"] ? true : undefined}
            helperText={errors["frontEndLoad"]}
            readOnly={props.readOnly}
            disabled={inDiscrepancyMode() && !isDiscrepantField("frontEndLoad")}
            onBlur={() =>
              validateField("frontEndLoad", props.data.frontEndLoad)
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <SelectListDX
            id="contributionPaymentMode"
            name="contributionPaymentMode"
            label="Mode of Payment"
            value={props.data.contributionPaymentMode}
            list={modeOfPaymentList}
            onChange={(e: any, v: any) => props.onChangeAction(e, v)}
            error={errors["contributionPaymentMode"] ? true : undefined}
            helperText={errors["contributionPaymentMode"]}
            readOnly={props.readOnly}
            disabled={
              inDiscrepancyMode() &&
              !isDiscrepantField("contributionPaymentMode")
            }
            onBlur={() =>
              validateField(
                "contributionPaymentMode",
                props.data.contributionPaymentMode
              )
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            name="contributionReferenceNumber"
            value={props.data.contributionReferenceNumber}
            label="Cheque/DD/PO/Ref. No."
            required
            onChange={(e: any) => props.onChangeAction(e)}
            error={errors["contributionReferenceNumber"] ? true : false}
            helperText={errors["contributionReferenceNumber"]}
            readOnly={props.readOnly}
            InputLabelProps={{ style: { pointerEvents: "auto" } }}
            disabled={
              inDiscrepancyMode() &&
              !isDiscrepantField("contributionReferenceNumber")
            }
            onBlur={() =>
              validateField(
                "contributionReferenceNumber",
                props.data.contributionReferenceNumber
              )
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <SelectListDX
            id="drawnOn"
            name="drawnOn"
            label="Drawn On"
            key="drawnOn"
            list={bankList}
            value={props.data.drawnOn}
            onChange={(e: any, v: any) => {
              props.onChangeAction(e, v);
            }}
            error={errors["drawnOn"] ? true : false}
            helperText={errors["drawnOn"]}
            readOnly={props.readOnly}
            disabled={inDiscrepancyMode() && !isDiscrepantField("drawnOn")}
            onBlur={() => validateField("drawnOn", props.data.drawnOn)}
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <SelectListDX
            id="contributionFrequency"
            name="contributionFrequency"
            label="Contribution Frequency"
            value={props.data.contributionFrequency}
            list={contributionFrequencyList}
            onChange={(e: any, v: any) => props.onChangeAction(e, v)}
            error={errors["contributionFrequency"] ? true : undefined}
            helperText={errors["contributionFrequency"]}
            readOnly={props.readOnly}
            disabled={
              inDiscrepancyMode() && !isDiscrepantField("contributionFrequency")
            }
            onBlur={() =>
              validateField(
                "contributionFrequency",
                props.data.contributionFrequency
              )
            }
          />
        </GridDX>

        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            name="periodicContributionAmount"
            value={props.data.periodicContributionAmount}
            label="Periodic Contribution Amount"
            type="number"
            onInput={(e: any) => {
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 9);
            }}
            onChange={(e: any) => props.onChangeAction(e)}
            error={errors["periodicContributionAmount"] ? true : false}
            helperText={errors["periodicContributionAmount"]}
            readOnly={props.readOnly}
            disabled={
              inDiscrepancyMode() &&
              !isDiscrepantField("periodicContributionAmount")
            }
            onBlur={() =>
              validateField(
                "periodicContributionAmount",
                props.data.periodicContributionAmount
              )
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            name="yearlyContributionAmount"
            value={props.data.yearlyContributionAmount}
            label="Yearly Contribution Amount"
            type="number"
            onInput={(e: any) => {
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 9);
            }}
            onChange={(e: any) => props.onChangeAction(e)}
            error={errors["yearlyContributionAmount"] ? true : false}
            helperText={errors["yearlyContributionAmount"]}
            readOnly={props.readOnly}
            disabled={
              inDiscrepancyMode() &&
              !isDiscrepantField("yearlyContributionAmount")
            }
            onBlur={() =>
              validateField(
                "yearlyContributionAmount",
                props.data.yearlyContributionAmount
              )
            }
          />
        </GridDX>
        {!props.readOnly && (
          <GridDX item xs={12}>
            <Navigation
              onPrevAction={props.onPrevAction}
              onNextAction={handleNextClick}
            />
          </GridDX>
        )}
      </GridDX>
    </LocalizationProvider>
  );
};

export default Contribution;
