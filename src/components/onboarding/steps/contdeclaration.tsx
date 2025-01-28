import React, { useState, useEffect } from "react";
import { useMediaQuery, useTheme, Typography } from "@mui/material/";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate } from "react-router-dom";

import Navigation from "../../controls/navigation";

import { getPlanListByAccountCategory } from "../../../shared/lookups";

import { useAuthContext } from "../../../context/authcontext";
import { useConfigContext } from "../../../context/configcontext";
import { useValidationContext } from "../../../context/validationcontext";
import GridDX from "../../layout/griddx";
import YesNoSwitch from "../../controls/yesnoswitch";

const ContributionDeclaration = (props: any) => {
  const { getUserDetails, inDiscrepancyMode, isDiscrepantField } =
    useAuthContext();

  const theme = useTheme();
  const useMobileView = useMediaQuery(theme.breakpoints.down("xs"));

  const onHandleNext = () => {
    props.onStepComplete();
    props.onNextAction();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <GridDX container spacing={props.readOnly ? 2 : useMobileView ? 2 : 4}>
        <GridDX item xs={props.readOnly ? 10 : 8} sm={10}>
          <Typography style={{ fontSize: "13px", textAlign: "justify" }}>
            Are you acting on behalf of another person/entity?
          </Typography>
        </GridDX>
        <GridDX item xs={props.readOnly ? 2 : 4} sm={2}>
          <YesNoSwitch
            name="onBehalfOfAnotherPerson"
            readOnly={props.readOnly}
            checked={props.data.onBehalfOfAnotherPerson}
            onChange={(e: any) => props.onChangeAction(e)}
            disabled={
              inDiscrepancyMode() &&
              !isDiscrepantField("onBehalfOfAnotherPerson")
            }
          />
        </GridDX>
        <GridDX item xs={props.readOnly ? 10 : 8} sm={10}>
          <Typography style={{ fontSize: "13px", textAlign: "justify" }}>
            Do you have any financial connections to offshore tax havens?
          </Typography>
        </GridDX>
        <GridDX item xs={props.readOnly ? 2 : 4} sm={2}>
          <YesNoSwitch
            name="connectionTaxHavens"
            readOnly={props.readOnly}
            checked={props.data.connectionTaxHavens}
            onChange={(e: any) => props.onChangeAction(e)}
            disabled={
              inDiscrepancyMode() && !isDiscrepantField("connectionTaxHavens")
            }
          />
        </GridDX>
        <GridDX item xs={props.readOnly ? 10 : 8} sm={10}>
          <Typography style={{ fontSize: "13px", textAlign: "justify" }}>
            Are you dealing in high value items (e.g. precious metals/stones)?
          </Typography>
        </GridDX>
        <GridDX item xs={props.readOnly ? 2 : 4} sm={2}>
          <YesNoSwitch
            name="dealingInHighValueItems"
            readOnly={props.readOnly}
            checked={props.data.dealingInHighValueItems}
            onChange={(e: any) => props.onChangeAction(e)}
            disabled={
              inDiscrepancyMode() &&
              !isDiscrepantField("dealingInHighValueItems")
            }
          />
        </GridDX>
        <GridDX item xs={props.readOnly ? 10 : 8} sm={10}>
          <Typography style={{ fontSize: "13px", textAlign: "justify" }}>
            Has any financial institution ever refused to open your account?
          </Typography>
        </GridDX>
        <GridDX item xs={props.readOnly ? 2 : 4} sm={2}>
          <YesNoSwitch
            name="hasAnyFinancialInstitutionRefusedAccount"
            readOnly={props.readOnly}
            checked={props.data.hasAnyFinancialInstitutionRefusedAccount}
            onChange={(e: any) => props.onChangeAction(e)}
            disabled={
              inDiscrepancyMode() &&
              !isDiscrepantField("hasAnyFinancialInstitutionRefusedAccount")
            }
          />
        </GridDX>
        {!props.readOnly && (
          <GridDX item xs={12}>
            <Navigation
              onPrevAction={props.onPrevAction}
              onNextAction={onHandleNext}
            />
          </GridDX>
        )}
      </GridDX>
    </LocalizationProvider>
  );
};

export default ContributionDeclaration;
