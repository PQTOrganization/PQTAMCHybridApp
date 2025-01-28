import React, { useState, useEffect } from "react";
import {
  useMediaQuery,
  useTheme,
  Divider,
  FormControlLabel,
  Checkbox,
  Typography,
  Radio,
  RadioGroup,
} from "@mui/material/";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextFieldDX from "../../controls/textfielddx";
import { useAuthContext } from "../../../context/authcontext";
import { useValidationContext } from "../../../context/validationcontext";
import GridDX from "../../layout/griddx";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { OpacityOutlined } from "@mui/icons-material";

const Profile = (props: any) => {
  const { getUserDetails, inDiscrepancyMode, isDiscrepantField } =
    useAuthContext();

  const theme = useTheme();
  const useMobileView = useMediaQuery(theme.breakpoints.down("xs"));
  const { errors, validateField, validatevpsSubFundValues } =
    useValidationContext();

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <GridDX container direction="column" p={2}>
        <GridDX item style={{ textAlign: "center" }}>
          <Typography color="primary" style={{ fontWeight: "bold" }}>
            ({props.content.order})
          </Typography>
          <Typography
            color="primary"
            style={{
              fontWeight: "bold",
              textAlign: "center",
              marginLeft: "35px",
            }}
          >
            {props.content.heading}
          </Typography>
        </GridDX>
        <GridDX item>
          <RadioGroup
            name="riskProfileSelected"
            value={props.content.selectedOption}
            onChange={(e) => props.onChange(props.content.id, e)}
          >
            {props.content.options.map((option: any) => {
              return (
                <GridDX direction="row">
                  <FormControlLabel
                    value={option.id}
                    control={
                      <Radio color="primary" disabled={props.readOnly} />
                    }
                    label={
                      <Typography>
                        {option.option} ({option.score})
                      </Typography>
                    }
                    labelPlacement="end"
                    // disabled={props.readOnly}
                  />
                </GridDX>
              );
            })}
          </RadioGroup>
        </GridDX>
      </GridDX>
    </LocalizationProvider>
  );
};

export default Profile;
