import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Typography, Modal } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useErrorContext } from "../../context/errorcontext";

import ButtonDX from "../../components/controls/buttondx";
import BoxDX from "../../components/layout/boxdx";
import GridDX from "../../components/layout/griddx";
import GridRowDividerDX from "../../components/layout/gridrowdividerdx";
import LoadingButtonDX from "../../components/controls/loadingbuttondx";

import { formattedNumber, HighRiskFunds } from "../../shared/global";
import useInvestementService from "../../shared/services/investmentservice";
import { useAuthContext } from "../../context/authcontext";
import AlertComponenet from "../../components/alerts/alert";

const FundToFundTransfer3 = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setError } = useErrorContext();
  const { getUserDetails } = useAuthContext();
  const { createFundToFundTransferRequest } = useInvestementService();

  const [open, setOpen] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);

  const [showHighRiskAlert, setShowHighRiskAlert] = useState(false);
  const [riskAccepted, setRiskAccepted] = useState(false);

  useEffect(() => {
    if (riskAccepted) {
      createFundTransfer();
    }
  }, [riskAccepted]);

  const handleConfirm = () => {
    if (parseInt(state.transferTo.fundId) in HighRiskFunds) {
      setShowHighRiskAlert(true);
    } else {
      createFundTransfer();
    }
  };

  const createFundTransfer = () => {
    getUserDetails().then((userDetails: any) => {
      createFundToFundTransferRequest(
        userDetails.userId,
        state.folioNumber,
        state.transferFrom.fundId,
        state.amount,
        state.transferFrom.lastNav,
        state.amount / state.transferFrom.lastNav,
        state.transferTo.fundId,
        state.transferTo.lastNav,
        state.amount / state.transferTo.lastNav
      )
        .then(() => {
          setOpen(true);
        })
        .catch((err: any) => setError(err))
        .finally(() => setSendingRequest(false));
    });
  };

  return (
    <GridDX container sx={{ width: "100%" }} rowSpacing={2}>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
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
            id="modal-modal-title"
            variant="h4"
            component="h1"
            align="center"
            sx={{
              color: "#263238",
              fontSize: 23,
              fontWeight: 900,
            }}
          >
            Fund To Fund Transfer Request Generated
          </Typography>

          <Typography
            id="modal-modal-description"
            align="center"
            sx={{ my: 3, fontSize: 18 }}
          >
            Thank you. Your request for Funds to Funds transfer has been
            created. And it will be processed within 24 Working Hours.
          </Typography>

          <ButtonDX
            onClick={() => {
              setOpen(false);
              navigate("/e-services");
            }}
          >
            OK
          </ButtonDX>
        </BoxDX>
      </Modal>

      <AlertComponenet
        title="Notice"
        open={showHighRiskAlert}
        alert={
          <Typography>
            Risk / Investment Warning: Investing in mutual funds involves market
            risks, and the value of the units may fluctuate based on market
            conditions. Before investing, it is crucial to carefully review the
            investment policies, risk factors, taxation policies, and warnings
            mentioned in the offering documents to make an informed decision.
            You confirm that you understand and acknowledge the potential risks
            and associated dangers of erosion of your principal amount. Pak
            Qatar Asset Management Company Limited (PQAMCL) is not liable for
            any losses incurred as a result of your investment decision.
            <br /> <br />
            Furthermore, PQAMCL has recommended a specific fund category based
            on your risk profile. However, you have the right to invest in any
            other fund or category. By clicking on "Yes," you confirm that you
            have read and understood the Trust Deeds, offering documents, and
            any supplemental Trust Deeds and Offering Documents governing these
            funds and their respective investment or transfer or conversion,
            which are available at https://pqamcl.com/constitutive-documents/
            You agree to the risks mentioned in this warning and provide your
            consent to PQAMCL. Or press cancel to select another fund category
          </Typography>
        }
        closeLabel={"Cancel"}
        handleClose={() => setShowHighRiskAlert(false)}
        okLabel={"Yes"}
        handleCloseOk={() => {
          setRiskAccepted(true);
          setShowHighRiskAlert(false);
        }}
        handlePopupClose={() => setShowHighRiskAlert(false)}
      />

      <GridDX item xs={12}>
        <GridDX container sx={{ width: "100%" }}>
          <GridDX item xs={12} justifyContent="center">
            <h3>Transfer From</h3>
          </GridDX>
          <GridDX item xs={3} md={6}>
            Fund:
          </GridDX>
          <GridDX item xs={9} md={6} justifyContent="flex-end">
            {state.transferFrom.fundName}
          </GridDX>
          <GridRowDividerDX />

          <GridDX item xs={6} md={6}>
            Transfer Amount:
          </GridDX>
          <GridDX item xs={6} md={6} justifyContent="flex-end">
            Rs. {formattedNumber(state.amount, 2)}
          </GridDX>
          <GridRowDividerDX />

          <GridDX item xs={6} md={6}>
            Transfer Units:
          </GridDX>
          <GridDX item xs={6} md={6} justifyContent="flex-end">
            {formattedNumber(state.amount / state.transferFrom.lastNav)}
          </GridDX>
          <GridRowDividerDX />

          <GridDX item xs={6} md={6}>
            Last NAV:
          </GridDX>
          <GridDX item xs={6} md={6} justifyContent="flex-end">
            {formattedNumber(state.transferFrom.lastNav)}
          </GridDX>
          <GridRowDividerDX />
        </GridDX>
      </GridDX>
      <GridDX item xs={12}>
        <GridDX container sx={{ mb: 2, width: "100%" }}>
          <GridDX item xs={12} justifyContent="center" textAlign="center">
            <h3>Transfer To</h3>
          </GridDX>

          <GridDX item xs={3} md={6}>
            Fund:
          </GridDX>
          <GridDX item xs={9} md={6} justifyContent="flex-end">
            {state.transferTo.fundName}
          </GridDX>
          <GridRowDividerDX />

          <GridDX item xs={6}>
            Transfer Amount:
          </GridDX>
          <GridDX item xs={6} justifyContent="flex-end">
            Rs. {formattedNumber(state.amount, 2)}
          </GridDX>
          <GridRowDividerDX />

          <GridDX item xs={6}>
            Transfer Units:
          </GridDX>
          <GridDX item xs={6} justifyContent="flex-end">
            {formattedNumber(state.amount / state.transferTo.lastNav)}
          </GridDX>
          <GridRowDividerDX />

          <GridDX item xs={6}>
            Last NAV:
          </GridDX>
          <GridDX item xs={6} justifyContent="flex-end">
            {formattedNumber(state.transferTo.lastNav)}
          </GridDX>
          <GridRowDividerDX />
        </GridDX>
      </GridDX>
      <GridDX item xs={12}>
        <LoadingButtonDX
          fullWidth
          loading={sendingRequest}
          onClick={handleConfirm}
        >
          Confirm
        </LoadingButtonDX>
      </GridDX>
      <GridDX item xs={12}>
        <ButtonDX
          fullWidth
          variant="outlined"
          onClick={() =>
            navigate("/fund-to-fund-transfer-2", {
              replace: true,
              state: {
                fromFundId: state.transferFrom.fundId,
                toFundId: state.transferTo.fundId,
              },
            })
          }
        >
          BACK
        </ButtonDX>
      </GridDX>
    </GridDX>
  );
};

export default FundToFundTransfer3;
