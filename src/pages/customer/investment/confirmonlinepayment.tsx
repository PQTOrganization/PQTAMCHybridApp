import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Modal } from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import ButtonDX from "../../../components/controls/buttondx";
import GridDX from "../../../components/layout/griddx";
import LoadingButtonDX from "../../../components/controls/loadingbuttondx";
import BoxDX from "../../../components/layout/boxdx";

import { useAuthContext } from "../../../context/authcontext";
import { formattedNumber } from "../../../shared/global";
import { useErrorContext } from "../../../context/errorcontext";

import useInvestementService from "../../../shared/services/investmentservice";
import { useConfigContext } from "../../../context/configcontext";

const ConfirmOnlinePayment = () => {
  const { getUserDetails } = useAuthContext();
  const { setError } = useErrorContext();
  const { BLINQ_URL } = useConfigContext();
  const { createInvestmentRequest } = useInvestementService();

  const navigate = useNavigate();
  const location = useLocation();

  const [userData, setUserData] = useState<any>();
  const [data, setData] = useState<any>();
  const [sendingRequest, setSendingRequest] = useState(false);
  const [open, setOpen] = useState(false);
  const [newReferenceNumber, setReferenceNumber] = useState("");

  useEffect(() => {
    document.addEventListener("message", messageFromApp, false);

    const { data } = location.state;
    setData(data);

    getUserDetails().then((user: any) => setUserData(user));

    return () => {
      document.removeEventListener("message", messageFromApp, false);
    };
  }, []);

  const messageFromApp = () => {
    navigate("/dashboard");
  };

  const createInvestment = async () => {
    setSendingRequest(true);

    createInvestmentRequest(
      userData.userId,
      userData.currentFolioNumber,
      data.fund.id,
      data.investmentAmount,
      data.modeOfPayment.id,
      1,
      1,
      null,
      data.bank?.id,
      null,
      null,
      null,
      null
    )
      .then((newData) => {
        setReferenceNumber(newData.onlinePaymentReference);

        if (data.modeOfPayment.id === 4) setOpen(true);
        else if ((window as any)?.ReactNativeWebView) {
          /*if opened from mobile*/
          (window as any).ReactNativeWebView.postMessage(
            JSON.stringify({
              messageType: "payment",
              data: newData.onlinePaymentReference,
            })
          );
        } else
          window.location.replace(
            BLINQ_URL + "?pcode=" + newData.onlinePaymentReference
          );
      })
      .catch((err: any) => setError(err))
      .finally(() => setSendingRequest(false));
  };

  return (
    <GridDX
      container
      sx={{ width: "100%" }}
      rowSpacing={3}
      alignContent="flex-start"
    >
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          navigate(-2);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <BoxDX
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            backgroundColor: "white",
            boxShadow: 24,
            borderRadius: 1,
            textAlign: "center",
            p: 4,
          }}
        >
          <CheckCircleIcon sx={{ color: "#219653", fontSize: 120, mb: 2 }} />

          <Typography
            variant="h4"
            component="h1"
            align="center"
            sx={{
              color: "#263238",
              fontSize: 23,
              fontWeight: 900,
              fontFamily: "Roboto",
            }}
          >
            New Investment Request Generated
          </Typography>

          <Typography align="center" sx={{ my: 3, fontSize: 18 }}>
            Your transaction has been initited with Ref. No.{" "}
            {newReferenceNumber}. Further details have been sent to you on your
            provided email address.
          </Typography>

          <ButtonDX
            onClick={() => {
              setOpen(false);
              navigate(-2);
            }}
          >
            OK
          </ButtonDX>
        </BoxDX>
      </Modal>

      <GridDX xs={6}>Folio ID:</GridDX>
      <GridDX xs={6}>{userData?.currentFolioNumber}</GridDX>
      <GridDX xs={6}>Name:</GridDX>
      <GridDX xs={6}>{`${userData?.firstName} ${userData?.lastName}`}</GridDX>
      <GridDX xs={6}>Fund Name:</GridDX>
      <GridDX xs={6}>{data?.fund.value}</GridDX>
      <GridDX xs={6}>Invesment Amount:</GridDX>
      <GridDX xs={6}>Rs. {formattedNumber(data?.investmentAmount, 2)}</GridDX>
      <GridDX xs={6}>Total Deduction:</GridDX>
      <GridDX xs={6}>Rs. </GridDX>
      <GridDX item xs={12}>
        <LoadingButtonDX
          fullWidth
          loading={sendingRequest}
          onClick={createInvestment}
        >
          Confirm
        </LoadingButtonDX>
      </GridDX>
      <GridDX item xs={12}>
        <LoadingButtonDX
          fullWidth
          loading={sendingRequest}
          variant="outlined"
          onClick={() =>
            navigate("/make-investment", {
              replace: true,
              state: {
                data,
              },
            })
          }
        >
          Back
        </LoadingButtonDX>
      </GridDX>
    </GridDX>
  );
};

export default ConfirmOnlinePayment;
