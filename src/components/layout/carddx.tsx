import React from "react";
import Card from "@mui/material/Card";

const CardDX = (props: any) => {
  return (
    <Card
      variant="outlined"
      {...props}
      sx={{
        width: "100%",
        borderWidth: "3px",
        borderRadius: "24px",
        borderColor: "#9e9e9e",
        height: "max-content",
        ...props.sx,
      }}
    />
  );
};

export default CardDX;
