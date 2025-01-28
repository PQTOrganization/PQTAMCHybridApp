import React from "react";
import Button from "@mui/material/Button";

const ButtonDX = (props: any) => {
  return (
    <Button
      variant="contained"
      {...props}
      sx={{ borderRadius: "20px", ...props.sx }}
    />
  );
};

export default ButtonDX;
