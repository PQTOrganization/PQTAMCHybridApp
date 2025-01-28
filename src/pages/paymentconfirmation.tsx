import { Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import ButtonDX from "../components/controls/buttondx";
import BoxDX from "../components/layout/boxdx";
import { useEffect, useState } from "react";

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [status, setStatus] = useState<string | null>("");
  const [message, setMessage] = useState<string | null>("");

  useEffect(() => {
    setStatus(params.get("status"));
    setMessage(params.get("message"));
  }, [params]);

  const gotoDashboard = () => {
    if ((window as any)?.ReactNativeWebView) {
      /*if opened from mobile*/
      (window as any).ReactNativeWebView.postMessage(
        JSON.stringify({
          messageType: "gotodashboard",
          data: "",
        })
      );
    } else navigate("/dashboard");
  };

  if (status && message)
    return (
      <BoxDX
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Payment Processing Complete
        </Typography>
        <Typography sx={{ mb: 2 }}>Status: {status}</Typography>
        <Typography sx={{ mb: 2 }}>{message}</Typography>
        <ButtonDX onClick={() => gotoDashboard()}>Go To Dashboard</ButtonDX>
      </BoxDX>
    );
  else return <></>;
};

export default PaymentConfirmation;
