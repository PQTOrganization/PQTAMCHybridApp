import * as React from "react";

import { TextField, InputAdornment } from "@mui/material";
import CNICMask from "./cnicmask";
import IBANMask from "./ibanmask";
import ToolTipHelper from "../tooltip";
import { useStyles } from "../../../shared/styles";
import { cleanMaskedInputValue } from "../../../shared/global";

const MaskTextField = (props: any) => {
  const classes = useStyles();
  const helperText = props.helpertext;

  if (props.readOnly) {
    const controlValue = cleanMaskedInputValue(props.value);

    return (
      <TextField
        {...props}
        variant="standard"
        fullWidth
        disabled
        placeholder={helperText}
        helperText={props.value !== "" ? helperText : ""}
        InputLabelProps={{ shrink: true }}
        className={classes.readonly}
        value={controlValue}
      />
    );
  } else
    return (
      <TextField
        {...props}
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        InputProps={{
          inputComponent: props.masktype === "cnic" ? CNICMask : IBANMask,
          endAdornment: props.tip ? (
            <InputAdornment position="end">
              <ToolTipHelper title={props.tip} />
            </InputAdornment>
          ) : null,
        }}
      />
    );
};

export default MaskTextField;
