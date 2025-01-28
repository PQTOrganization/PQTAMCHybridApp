import React, { useState, useEffect, useContext } from "react";
import { TextField, Checkbox } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

import TextFieldDX from "../../controls/textfielddx";
import SelectListDX from "../../controls/selectlistdx";
import GridDX from "../../layout/griddx";

import {
  annualIncomeList,
  annualInvestAmountList,
  relationshipList,
} from "../../../shared/lookups";

const Additional = (props: any) => {
  return (
    <GridDX container>
      <GridDX item sm={12}>
        <h2>Additional Information</h2>
      </GridDX>
      <GridDX container sm={12} spacing={4}>
        <GridDX item xs={12} sm={6}>
          <SelectListDX
            label="Annual Income"
            key="anninc"
            list={annualIncomeList}
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <SelectListDX
            label="Expected Investment Transactions in a Year(Rs.)"
            key="expinv"
            list={annualInvestAmountList}
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextField
            label="Expected Investment Per Transaction (Rs.)"
            select
            fullWidth
          ></TextField>
        </GridDX>
        <GridDX item xs={12}>
          <FormControlLabel
            value="start"
            control={<Checkbox color="primary" />}
            label="Has your account even been refused any financial institution (Bank/DFI/NBFC etc.) in Pakistan or Aboard?"
            labelPlacement="start"
          />
        </GridDX>
        <GridDX item xs={12}>
          <GridDX container xs={12}>
            <GridDX item xs={12}>
              If Yes, please explain the reason of refusal
            </GridDX>
            <GridDX item xs={12}>
              <TextFieldDX multiline maxRows={4} />
            </GridDX>
          </GridDX>
        </GridDX>
        <GridDX item xs={12}>
          <b>
            Who should we connect regarding your account in case we are unable
            to make contact with you or in case of your death?
          </b>
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX label="Name" />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <SelectListDX
            label="Relationship"
            key="relation"
            list={relationshipList}
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX label="CNIC Number/B-Form" />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX label="Mobile Number" />
        </GridDX>
      </GridDX>
    </GridDX>
  );
};

export default Additional;
