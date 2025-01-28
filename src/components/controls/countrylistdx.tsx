import { InputAdornment, Box, Popper, TextField } from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import DownArrow from "@mui/icons-material/ArrowDropDown";

import { useStyles } from "../../shared/styles";
import { countriesData } from "../../shared/countries";

const CountryListDX = (props: any) => {
  const classes = useStyles();

  const CountryPopper = (props: any) => {
    return (
      <Popper
        {...props}
        style={{ width: "100%", maxWidth: 400 }}
        placement="top"
      />
    );
  };

  const getCountryCode = (dialCode: string) => {
    const country = countriesData.find((x) => x.dial_code == "+" + dialCode);

    if (country) return country.code.toLowerCase();
    else return "";
  };

  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option: any) => option.value,
  });

  return (
    <Autocomplete
      fullWidth
      disableClearable
      autoHighlight
      filterOptions={filterOptions}
      PopperComponent={CountryPopper}
      options={props.list}
      getOptionLabel={(option: any) => option.id || ""}
      {...props}
      renderOption={(props: any, option: any) => {
        const flagSrc = `/asset/countryFlags/${getCountryCode(option.id)}.png`;

        return (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            <img width="15" src={flagSrc} alt="" />
            <span style={{ flex: "auto" }}>{option.value}</span>
            <span
              style={{
                flex: "1",
                textAlign: "right",
              }}
            >
              {option.id}
            </span>
          </Box>
        );
      }}
      renderInput={(params: any) => {
        const countryFlag = getCountryCode(params.inputProps.value);
        const flagSrc = `/asset/countryFlags/${countryFlag}.png`;

        return (
          <TextField
            {...params}
            label={props.label}
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password", // disable autocomplete and autofill
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: countryFlag === "" ? null : <img src={flagSrc} />,
            }}
            variant={!props.readOnly && "outlined"}
            disabled={props.readOnly}
            InputLabelProps={{ shrink: props.readOnly }}
            className={classes.selectStyle} // VERY IMPORTANT
            sx={{
              "& .MuiAutocomplete-input": { minWidth: "20px !important" },
            }}
          />
        );
      }}
    />
  );
};

export default CountryListDX;
