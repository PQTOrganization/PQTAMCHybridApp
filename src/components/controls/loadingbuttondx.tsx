import React from "react";
import { LoadingButton } from "@mui/lab";

const LoadingButtonDX = (props: any) => {
  return (
    <LoadingButton
      variant="contained"
      {...props}
      sx={{ height: "max-content", borderRadius: "20px", ...props.sx }}
    />
  );
};

export default LoadingButtonDX;
