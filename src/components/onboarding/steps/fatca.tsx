import React from "react";

import {
  Checkbox,
  FormControlLabel,
  Typography,
  useTheme,
} from "@mui/material";

import TextFieldDX from "../../controls/textfielddx";
import Navigation from "../../controls/navigation";
import TooltipHelper from "../../controls/tooltip";
import GridDX from "../../layout/griddx";

import { transformAndFilterInput } from "../../../shared/global";

import { useAuthContext } from "../../../context/authcontext";
import { useValidationContext } from "../../../context/validationcontext";

const FATCA = (props: any) => {
  const theme = useTheme();
  const { inDiscrepancyMode, isDiscrepantField } = useAuthContext();
  const { errors, validateField } = useValidationContext();

  return (
    <GridDX container spacing={props.readOnly ? 0 : 4}>
      <GridDX item xs={12} sm={7}>
        <TextFieldDX
          label="Name (as show on your income tax return)"
          name="w9Name"
          value={props.data.w9Name}
          onChange={(e: any) => props.onChangeAction(e)}
          error={errors["w9Name"] ? true : false}
          helperText={errors["w9Name"]}
          readOnly={props.readOnly}
          InputLabelProps={{ style: { fontSize: "13px" } }}
          disabled={inDiscrepancyMode()}
          onBlur={() => validateField("w9Name", props.data.w9Name)}
        />
      </GridDX>
      <GridDX item xs={12} sm={7}>
        <TextFieldDX
          label="Address in United States (if any)"
          name="w9Address"
          value={props.data.w9Address}
          onChange={(e: any) => props.onChangeAction(e)}
          error={errors["w9Address"] ? true : false}
          helperText={errors["w9Address"]}
          readOnly={props.readOnly}
          InputLabelProps={{ style: { fontSize: "14px" } }}
          allowCopyPaste={false}
          onInput={transformAndFilterInput}
          disabled={inDiscrepancyMode() && !isDiscrepantField("w9Address")}
          onBlur={() => validateField("w9Address", props.data.w9Address)}
        />
      </GridDX>
      <GridDX item xs={12} sm={7} sx={{ flexDirection: "column" }}>
        <Typography style={{ fontWeight: "bold", marginBottom: 10 }}>
          Tax payer Identification Number (TIN){" "}
          <TooltipHelper
            show={!props.readOnly}
            title="A Taxpayer Identification Number (TIN) is an identification number used by the Internal Revenue Service (IRS) in the administration of tax laws. It is issued either by the Social Security Administration (SSA) or by the IRS. A Social Security number (SSN) is issued by the SSA whereas all other TINs are issued by the IRS."
          />
        </Typography>
        <TextFieldDX
          label="Social Security Number"
          name="w9SSN"
          value={props.data.w9SSN}
          onChange={(e: any) => props.onChangeAction(e)}
          error={errors["w9EINSSN"] ? true : false}
          readOnly={props.readOnly}
          InputLabelProps={{ style: { fontSize: "14px" } }}
          type="number"
          onInput={(e: any) => {
            e.target.value = Math.max(0, parseInt(e.target.value))
              .toString()
              .slice(0, 9);
          }}
          disabled={
            props.data.w9EIN ||
            (inDiscrepancyMode() && !isDiscrepantField("w9SSN"))
          }
          onBlur={() => validateField("w9SSN", props.data.w9SSN)}
        />
        <Typography
          style={{ fontWeight: "bold", marginTop: 10, marginBottom: 10 }}
        >
          OR
        </Typography>
        <TextFieldDX
          label="Employer Identification Number"
          name="w9EIN"
          value={props.data.w9EIN}
          onChange={(e: any) => props.onChangeAction(e)}
          error={errors["w9EINSSN"] ? true : false}
          readOnly={props.readOnly}
          InputLabelProps={{ style: { fontSize: "14px" } }}
          type="number"
          onInput={(e: any) => {
            e.target.value = Math.max(0, parseInt(e.target.value))
              .toString()
              .slice(0, 9);
          }}
          disabled={
            props.data.w9SSN ||
            (inDiscrepancyMode() && !isDiscrepantField("w9EIN"))
          }
          onBlur={() => validateField("w9EIN", props.data.w9EIN)}
        />
        <label style={{ color: theme.palette.error.main }}>
          {errors["w9EINSSN"]}
        </label>
      </GridDX>
      <GridDX item xs={12} style={{ flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                name="isCertify"
                checked={props.data.isCertify}
                onChange={(e: any) => props.onChangeAction(e)}
                color="primary"
                disabled={
                  props.readOnly ||
                  (inDiscrepancyMode() && !isDiscrepantField("isCertify"))
                }
              />
            }
            label=""
          />
          <Typography variant="body1" style={{ marginLeft: -10, fontSize: 14 }}>
            Under penalties of perjury, I certify that:
          </Typography>
        </div>
        <div>
          <ol style={{ textAlign: "justify", fontSize: 14 }}>
            <li>
              The number shown on this form is my correct taxpayer
              identification number (or I am waiting for a number to be issued
              to me); and
            </li>
            <li>
              I am not subject to backup withholding because:
              <ol type="a">
                <li>I am exempt from backup withholding, or</li>
                <li>
                  I have not been notified by the Internal Revenue Service (IRS)
                  that I am subject to backup withholding as a result of a
                  failure to report all interest or dividends, or
                </li>
                <li>
                  The IRS has notified me that I am no longer subject to backup
                  withholding tax; and
                </li>
              </ol>
            </li>
            <li>I am U.S. citizen or other U.S. person and</li>
            <li>
              The FATCA code(s) entered on this form (if any) indicating that I
              am exempt from FATCA report is correct.
            </li>
          </ol>
        </div>
      </GridDX>
      {!props.readOnly && (
        <GridDX item xs={12}>
          <Navigation
            onPrevAction={props.onPrevAction}
            onNextAction={props.onNextAction}
            disable={props.data.isCertify}
          />
        </GridDX>
      )}
    </GridDX>
  );
};

export default FATCA;
