import * as React from "react";
import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";

const IBANMask = React.forwardRef(function TextMaskCustom(props: any, ref) {
  const { onChange, ...other } = props;

  return (
    <IMaskInput
      {...other}
      mask="{PK}00aaaa0000000000000000"
      lazy={false}
      inputRef={ref}
      unmask={false}
      onAccept={(value: any) =>
        onChange({ target: { name: props.name, value: value.toUpperCase() } })
      }
      overwrite
      style={{ letterSpacing: 6, textTransform: "uppercase" }}
    />
  );
});

IBANMask.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default IBANMask;
