import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { SelectChangeEvent, Modal, Typography } from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/lab";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import SelectListDX from "../../components/controls/selectlistdx";
import TextFieldDX from "../../components/controls/textfielddx";
import ButtonDX from "../../components/controls/buttondx";
import GridDX from "../../components/layout/griddx";
import BoxDX from "../../components/layout/boxdx";
import GridRowDividerDX from "../../components/layout/gridrowdividerdx";
import LoadingButtonDX from "../../components/controls/loadingbuttondx";

import { useErrorContext } from "../../context/errorcontext";
import { useAuthContext } from "../../context/authcontext";

import useInvestementService from "../../shared/services/investmentservice";
import FundPositionTable from "../../components/customer/fundpositiontable";

const RedeemFund = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setError } = useErrorContext();
  const { getUserDetails } = useAuthContext();
  const { createRedemptionRequest, getFolioBanks, getFundWisePosition } =
    useInvestementService();

  const [open, setOpen] = useState(false);
  const [redeemptionMode, setRedeemptionMode] = useState(0);
  const [funds, setFunds] = useState<any>([]);
  const [fundPositions, setFundPositions] = useState<any>([]);
  const [selectedfundPosition, setSelectedFundPosition] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [userData, setUserData] = useState<any>();
  const [data, setData] = useState<any>({
    fund: "",
    amount: null,
  });

  const [toAccountList, setToAccountList] = useState([]);
  const [toAccountSelectList, setToAccountSelectList] = useState([]);
  const [selectedtoAccount, setSelectedToAccount] = useState<any>(null);

  useEffect(() => {
    const { fundId } = location.state;

    getUserDetails().then((userDetails: any) => {
      setUserData(userDetails);
      getFundWisePosition(userDetails.currentFolioNumber)
        .then((funds) => {
          setFundPositions(funds);

          const fundsList = funds.map((f: any) => {
            return { id: f.fundId, value: f.fundName };
          });

          const selectedFund = fundsList.find((f: any) => f.id == fundId);

          setFunds(fundsList);

          setData({ ...data, fund: selectedFund });

          return getFolioBanks(userDetails.userId).then((response) => {
            const toFundsList = response.bankList.map((f: any) => {
              return {
                id: f.bankId,
                value: f.bankShortName + " - " + f.bankAccountNo,
              };
            });

            setToAccountSelectList(toFundsList);
            setToAccountList(response.bankList);
          });
        })
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    });
  }, []);

  useEffect(() => {
    if (data?.fund) {
      setSelectedFundPosition(
        fundPositions.find((f: any) => f.fundId == data.fund.id)
      );

      handleRedeemptionModeChange(null, 0);
    }
  }, [data.fund]);

  useEffect(() => {
    if (data?.toAccount) {
      setSelectedToAccount(
        toAccountList.find((f: any) => {
          return f.bankId == data.toAccount.id;
        })
      );
    }
  }, [data.toAccount]);

  const handleRedeemptionModeChange = (event: any, newValue: number) => {
    setRedeemptionMode(newValue);

    switch (newValue) {
      case 0:
        setData({
          ...data,
          amount: Math.round(selectedfundPosition?.profitLoss),
        });
        break;

      case 1:
        setData({
          ...data,
          amount: Math.round(selectedfundPosition?.currentValue),
        });
        break;

      default:
        break;
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    delete newErrors[name];

    setErrors(newErrors);
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSelectChange = (value: any, name: string) => {
    const newErrors = { ...errors };
    delete newErrors[name];
    setErrors(newErrors);

    setData({ ...data, [name]: value });
  };

  const handleSubmit = () => {
    if (validateForm()) createRedemption();
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (data.fund === "") newErrors["fund"] = "Fund is required";

    if (!data.amount || data.amount === 0)
      newErrors["amount"] = "Amount is required";

    if (data.toAccount === "")
      newErrors["toAccount"] = "To Account is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const createRedemption = async () => {
    setSendingRequest(true);

    createRedemptionRequest(
      userData.userId,
      userData.currentFolioNumber,
      data.fund.id,
      data.amount,
      selectedfundPosition.backEndLoadPercentage,
      selectedfundPosition.purchaseNav,
      selectedtoAccount.bankId,
      selectedtoAccount.bankAccountNo
    )
      .then(() => {
        setOpen(true);
      })
      .catch((err: any) => setError(err))
      .finally(() => setSendingRequest(false));
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
            Redeem Fund Request Generated
          </Typography>

          <Typography
            id="modal-modal-description"
            align="center"
            sx={{ my: 3, fontSize: 18 }}
          >
            Thank you. Your request for Funds Redemption has been created. And
            it will be processed within 24 Working Hours.
          </Typography>

          <ButtonDX
            onClick={() => {
              setOpen(false);
              navigate(-1);
            }}
          >
            OK
          </ButtonDX>
        </BoxDX>
      </Modal>
      <GridDX item xs={12}>
        <SelectListDX
          id="fund"
          name="fund"
          label="Choose Fund"
          list={funds}
          value={data["fund"]}
          onChange={(e: any, v: any) => handleSelectChange(v, "fund")}
          error={errors["fund"] ? true : undefined}
          helperText={errors["fund"]}
          loading={isLoading}
          required
        />
      </GridDX>

      <GridDX item xs={12}>
        <FundPositionTable data={selectedfundPosition} mode={"R"} />
      </GridDX>

      <GridDX item xs={12} sx={{ mt: 2 }}>
        <GridDX container sx={{ width: "100%" }} justifyContent="center">
          <GridDX item xs={12} sx={{ fontWeight: 600 }}>
            Please Choose What You Want to Redeem
          </GridDX>

          <GridDX item xs={12}>
            <ToggleButtonGroup
              exclusive
              fullWidth
              color="primary"
              value={redeemptionMode}
              onChange={handleRedeemptionModeChange}
            >
              <ToggleButton value={0}>Profit</ToggleButton>
              <ToggleButton value={1}>Full</ToggleButton>
              <ToggleButton value={2}>Manual</ToggleButton>
            </ToggleButtonGroup>
          </GridDX>
        </GridDX>
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldDX
          id="amount"
          name="amount"
          label="Enter Amount"
          placeholder="Enter Amount"
          value={data["amount"] || ""}
          required
          type="number"
          onInput={(e: any) => {
            e.target.value = Math.max(0, parseInt(e.target.value))
              .toString()
              .slice(0, 9);
          }}
          onChange={handleInputChange}
          error={errors["amount"] ? true : undefined}
          helperText={errors["amount"]}
          loading={isLoading}
          disabled={redeemptionMode !== 2}
        />
        {/* helperText="Balance: 200,000" */}
      </GridDX>
      <GridDX item xs={12}>
        <SelectListDX
          id="toAccount"
          name="toAccount"
          label="Choose Bank Account"
          list={toAccountSelectList}
          value={data["toAccount"]}
          onChange={(e: any, v: any) => handleSelectChange(v, "toAccount")}
          error={errors["toAccount"] ? true : undefined}
          helperText={errors["toAccount"]}
          loading={isLoading}
          required
        />
      </GridDX>
      <GridDX item xs={12}>
        <LoadingButtonDX
          fullWidth
          loading={isLoading || sendingRequest}
          onClick={handleSubmit}
        >
          Proceed
        </LoadingButtonDX>
      </GridDX>
    </GridDX>
  );
};

export default RedeemFund;
