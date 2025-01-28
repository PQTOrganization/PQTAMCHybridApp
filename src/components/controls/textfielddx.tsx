import { TextField, InputAdornment } from "@mui/material/";
import Skeleton from "react-loading-skeleton";
import { useStyles } from "../../shared/styles";
import ToolTipHelper from "./tooltip";

const TextFieldDX = (props: any) => {
  const classes = useStyles();

  const helperText = props.helperText;
  const controlType = props.type ?? "text";
  const allowCopyPaste = props.allowCopyPaste ?? "true";
  const loading = props.loading ?? false;

  const toInputUppercase = (e: any) => {
    let value = e.target.value;
    // value = value.replace(/[^A-Za-z ]/gi, "");
    e.target.value = ("" + value).toUpperCase();
  };

  const handleCopyPaste = (e: any) => {
    e.preventDefault();
  };

  if (loading)
    return (
      <Skeleton
        containerClassName="skeleton-container"
        style={{ height: 56 }}
      />
    );
  else if (props.readOnly)
    return (
      <TextField
        {...props}
        value={props.value || ""}
        variant="standard"
        fullWidth
        multiline
        disabled
        placeholder={helperText}
        helperText=""
        InputLabelProps={{ shrink: true }}
        className={classes.readonly}
      />
    );
  else
    return (
      <TextField
        fullWidth
        variant="outlined"
        {...props}
        value={props.value || ""}
        onInput={props.onInput ? props.onInput : toInputUppercase}
        inputProps={controlType === "number" ? { inputMode: "numeric" } : {}}
        onCut={allowCopyPaste ? null : handleCopyPaste}
        onCopy={allowCopyPaste ? null : handleCopyPaste}
        onPaste={allowCopyPaste ? null : handleCopyPaste}
        onWheel={(e: any) => e.target?.blur()}
        onKeyDown={(e) => {
          if (props?.type === "number" && (e.which === 38 || e.which === 40)) {
            e.preventDefault();
          }
        }}
        InputProps={
          (props.tip == null
            ? null
            : {
                endAdornment: (
                  <InputAdornment position="end">
                    <ToolTipHelper title={props.tip} />
                  </InputAdornment>
                ),
              }) ||
          (props.adornment == null
            ? null
            : {
                endAdornment: (
                  <InputAdornment position="end">
                    {props.adornment}
                  </InputAdornment>
                ),
              })
        }
      />
    );
};

export default TextFieldDX;
