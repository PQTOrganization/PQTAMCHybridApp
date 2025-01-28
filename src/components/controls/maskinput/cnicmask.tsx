import * as React from "react";
import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";

const CNICMask = React.forwardRef(function TextMaskCustom(props: any, ref) {
  const { onChange, ...other } = props;

  return (
    <IMaskInput
      {...other}
      mask="00000-0000000-0"
      definitions={{
        "#": /[0-9]/,
      }}
      type="tel"
      lazy={false}
      inputRef={ref}
      unmask={false}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
      style={{ letterSpacing: 6 }}
    />
  );
});

CNICMask.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CNICMask;
