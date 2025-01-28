import React from "react";
import { TextValidator } from "react-material-ui-form-validator";
import { InputLabel } from "@mui/material";

import GridDX from "../layout/griddx";

const FormTextControlDX = (props: {
  label?: string;
  placeholder?: string;
  name: string;
  value: string;
  validators?: string[];
  errormessages?: string[];
  disabled?: boolean;
  rows?: number;
  onchange: any;
  multiline?: any;
}) => {
  return (
    <div
      style={{
        marginTop: 16,
        marginBottom: 16,
        marginRight: "5%",
        marginLeft: "5%",
      }}
    >
      <GridDX
        item
        xs={4}
        md={3}
        style={{ display: "flex", alignItems: "center", color: "#8B0037" }}
      >
        <InputLabel htmlFor={props?.label}>{props?.label}</InputLabel>
      </GridDX>
      <GridDX item xs={12} md={6}>
        <TextValidator
          style={{ width: "100%" }}
          id={props?.label}
          placeholder={props?.placeholder}
          onChange={props?.onchange}
          name={props?.name}
          value={props?.value}
          validators={props?.validators}
          errorMessages={props?.errormessages}
          multiline={props?.multiline}
          rows={props?.rows}
          disabled={props?.disabled}
        />
      </GridDX>
    </div>
  );
};

export default FormTextControlDX;
