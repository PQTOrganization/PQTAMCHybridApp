import React from "react";
import CardDX from "./carddx";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const DashCardDX = (props: {
  icon?: any;

  primaryText: string;
  primaryColor?: string;
  primaryFontSize?: string;

  secondaryText: string;
  secondaryFontSize?: string;

  value: string;
  valueFontSize?: string;

  //width?: string | Number;
  sx?: any;
}) => {
  return (
    <CardDX sx={{ width: "100%", my: 2, boxShadow: 8, ...props.sx }}>
      <CardContent>
        {props.icon ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <props.icon
              sx={{
                color: props.primaryColor
                  ? props.primaryColor
                  : "rgba(0,0,0,0.5)",
                fontSize: "190%",
              }}
            />
          </div>
        ) : (
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              color: props.primaryColor
                ? props.primaryColor
                : "rgba(0,0,0,0.5)",
              fontSize: props.primaryFontSize ? props.primaryFontSize : "120%",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              fontWeight: 600,
              letterSpacing: "-2%",
            }}
          >
            {props.primaryText}
          </Typography>
        )}

        <Typography
          variant="body2"
          sx={{
            marginTop: 3,
            fontSize: props.secondaryFontSize
              ? props.secondaryFontSize
              : "120%",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            letterSpacing: "-2%",
          }}
        >
          {props.secondaryText}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#8B0037",
            fontWeight: "bold",
            fontSize: props.valueFontSize ? props.valueFontSize : "190%",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            letterSpacing: "-2%",
          }}
        >
          {props.value}
        </Typography>
      </CardContent>
    </CardDX>
  );
};

export default DashCardDX;
