import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { TextField, useMediaQuery, useTheme } from "@mui/material";
import moment from "moment";
import { useConfigContext } from "../../context/configcontext";

import { useStyles } from "../../shared/styles";
//import RollingDatePicker from "./rollingdatepicker/rollingdatepicer";

const DatePickerDX = (props: any) => {
  const classes = useStyles();
  const theme = useTheme();
  const useMobileView = useMediaQuery(theme.breakpoints.down("sm"));
  const { DATE_FORMAT } = useConfigContext();

  const helperText = props.helperText;
  const dateFormat = props.format ?? DATE_FORMAT;
  const platform = navigator?.userAgent ?? "";

  if (props.readOnly)
    return (
      <TextField
        {...props}
        value={props.value ? moment(props.value).format(dateFormat) : ""}
        variant="standard"
        fullWidth
        disabled
        placeholder={helperText}
        helperText=""
        InputLabelProps={{ shrink: true }}
        className={classes.readonly}
      />
    );
  else {
    /* if (
      useMobileView &&
      !platform.toLowerCase().includes("iphone") &&
      !platform.toLowerCase().includes("ipad")
    )
      return <RollingDatePicker {...props} />;
    else */
    return (
      <MobileDatePicker
        {...props}
        variant="outlined"
        inputVariant="outlined"
        renderInput={(params: any) => {
          params.inputProps.value = props.value
            ? moment(props.value).format(dateFormat)
            : "";
          return <TextField {...params} {...props} fullWidth />;
        }}
      />
    );
  }
};

export default DatePickerDX;
