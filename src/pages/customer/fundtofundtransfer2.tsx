import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { SelectChangeEvent, Typography } from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/lab";

import GridDX from "../../components/layout/griddx";
import TextFieldDX from "../../components/controls/textfielddx";
import ButtonDX from "../../components/controls/buttondx";
import SelectListDX from "../../components/controls/selectlistdx";
import FundPositionTable from "../../components/customer/fundpositiontable";

import { useErrorContext } from "../../context/errorcontext";
import { useAuthContext } from "../../context/authcontext";

import useInvestementService from "../../shared/services/investmentservice";
import { TransferToFundNotAllowed, formattedNumber } from "../../shared/global";
import AlertComponenet from "../../components/alerts/alert";

const FundtoFundTransfer2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setError } = useErrorContext();
  const { getUserDetails } = useAuthContext();
  const { getAllFundWisePosition, getFundWisePosition } =
    useInvestementService();

  const [allFunds, setAllFunds] = useState<any>([]);
  const [allFundsList, setAllFundsList] = useState<any>([]);

  const [funds, setFunds] = useState<any>([]);
  const [fundPositions, setFundPositions] = useState<any>([]);
  const [selectedFromFundPosition, setSelectedFromFundPosition] =
    useState<any>(null);
  const [selectedToFundPosition, setSelectedToFundPosition] =
    useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<any>({});
  const [folioNumber, setFolioNumber] = useState(0);

  const [transferMode, setTransferMode] = useState(0);
  const [data, setData] = useState<any>({
    fundFrom: "",
    amount: "",
    fundTo: "",
  });
  const [showTransferNotAllowedAlert, setShowTransferNotAllowedAlert] =
    useState(false);

  useEffect(() => {
    const { fromFundId, toFundId } = location.state;

    getUserDetails().then((userDetails: any) => {
      setFolioNumber(userDetails.currentFolioNumber);

      return Promise.all([
        getAllFundWisePosition(userDetails.currentFolioNumber).then(
          (allFunds) => {
            setAllFunds(allFunds);

            const allFundsList = allFunds.map((f: any) => {
              return { id: f.fundId, value: f.fundName };
            });
            setAllFundsList(allFundsList);

            const selectedToFund =
              allFundsList.find((f: any) => f.id === toFundId) ?? "";

            setSelectedToFundPosition(
              allFundsList.find((f: any) => f.fundId === toFundId)
            );
            setData((oldData: any) => {
              return {
                ...oldData,
                fundTo: selectedToFund,
              };
            });
          }
        ),
        getFundWisePosition(userDetails.currentFolioNumber).then((funds) => {
          setFundPositions(funds);

          const fundsList = funds.map((f: any) => {
            return { id: f.fundId, value: f.fundName };
          });
          setFunds(fundsList);

          const selectedFromFund = fundsList.find(
            (f: any) => f.id === fromFundId
          );

          setData((oldData: any) => {
            return {
              ...oldData,
              fundFrom: selectedFromFund,
            };
          });
          setSelectedFromFundPosition(
            funds.find((f: any) => f.fundId === fromFundId)
          );
        }),
      ])
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    });
  }, []);

  useEffect(() => {
    if (data?.fundFrom) {
      setSelectedFromFundPosition(
        fundPositions.find((f: any) => f.fundId == data.fundFrom.id)
      );

      handleTransferModeChange(null, 0);
    }
  }, [data.fundFrom]);

  useEffect(() => {
    if (data?.fundTo) {
      setSelectedToFundPosition(
        allFunds.find((f: any) => f.fundId == data.fundTo.id)
      );
    }
  }, [data.fundTo]);

  const handleTransferModeChange = (event: any, newValue: number) => {
    setTransferMode(newValue);

    switch (newValue) {
      case 0:
        setData({
          ...data,
          amount: selectedFromFundPosition?.profitLoss,
          formattedAmount: formattedNumber(
            selectedFromFundPosition?.profitLoss,
            2
          ),
        });
        break;

      case 1:
        setData({
          ...data,
          amount: selectedFromFundPosition?.currentValue,
          formattedAmount: formattedNumber(
            selectedFromFundPosition?.currentValue,
            2
          ),
        });
        break;

      default:
        break;
    }
  };

  const handleInputChange = (event: SelectChangeEvent, name: string) => {
    const newErrors = { ...errors };
    delete newErrors[name];
    setErrors(newErrors);

    if (name === "amount") {
      setData({
        ...data,
        [name]: event.target.value === "NaN" ? 0 : event.target.value,
        formattedAmount: event.target.value === "NaN" ? 0 : event.target.value,
      });
    } else {
      setData({ ...data, [name]: event.target.value });
    }
  };

  const validateSelectChange = (value: any, name: string) => {
    if (name === "fundTo") {
      if (value.id in TransferToFundNotAllowed) {
        setShowTransferNotAllowedAlert(true);
        return false;
      } else {
        setShowTransferNotAllowedAlert(false);
        return true;
      }
    }
  };

  const handleSelectChange = (value: any, name: string) => {
    if (validateSelectChange(value, name)) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);

      setData({ ...data, [name]: value });
    } else {
      setData({ ...data, [name]: "" });
    }
  };

  const handleSubmit = () => {
    if (validateForm())
      navigate("/fund-to-fund-transfer-3", {
        state: {
          transferFrom: selectedFromFundPosition,
          transferTo: selectedToFundPosition,
          amount: data.amount,
          folioNumber: folioNumber,
        },
      });
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (data.fundFrom === "") newErrors["fundFrom"] = "From fund is required";
    if (data.fundTo === "") newErrors["fundTo"] = "To fund is required";

    console.log({ data });

    if (data.fundFrom && data.fundTo && data.fundFrom.id === data.fundTo.id)
      newErrors["fundTo"] = "Transfer between same fund is not allowed";

    if (!data.amount || data.amount === 0)
      newErrors["amount"] = "Amount is required";
    else if (data.amount > selectedFromFundPosition.currentValue)
      newErrors["amount"] = "Amount cannot be greater than the current value";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <GridDX container sx={{ width: "100%" }} rowSpacing={3}>
      <AlertComponenet
        title="Notice"
        open={showTransferNotAllowedAlert}
        alert={
          <Typography>
            Transfering to "Daily Dividend Plan" is not allowed.
          </Typography>
        }
        closeLabel={"Close"}
        handleClose={() => setShowTransferNotAllowedAlert(false)}
        handlePopupClose={() => setShowTransferNotAllowedAlert(false)}
      />
      <GridDX item xs={12}>
        <SelectListDX
          id="fund-from-select"
          name="fund-from-select"
          label="Choose Sending Fund Source"
          value={data["fundFrom"]}
          list={funds}
          onChange={(e: any, v: any) => handleSelectChange(v, "fundFrom")}
          error={errors["fundFrom"] ? true : undefined}
          helperText={errors["fundFrom"]}
          loading={isLoading}
          required
        />
      </GridDX>
      <GridDX item xs={12}>
        <FundPositionTable data={selectedFromFundPosition} />
      </GridDX>

      <GridDX item xs={12}>
        <Typography sx={{ fontWeight: "bold" }}>
          Please Choose What You Want to Transfer
        </Typography>
      </GridDX>

      <GridDX item xs={12}>
        <ToggleButtonGroup
          exclusive
          fullWidth
          color="primary"
          value={transferMode}
          onChange={handleTransferModeChange}
        >
          <ToggleButton value={0}>Profit</ToggleButton>
          <ToggleButton value={1}>Full</ToggleButton>
          <ToggleButton value={2}>Manual</ToggleButton>
        </ToggleButtonGroup>
      </GridDX>

      <GridDX item xs={12}>
        <TextFieldDX
          id="amount"
          label="Enter Amount"
          placeholder="Enter Amount"
          value={data["formattedAmount"]}
          required
          // type="number"
          onInput={(e: any) => {
            e.target.value = Math.max(0, parseInt(e.target.value))
              .toString()
              .slice(0, 9);
          }}
          onChange={(e: SelectChangeEvent) => handleInputChange(e, "amount")}
          onBlur={() => {
            setData({
              ...data,
              formattedAmount: formattedNumber(data["amount"], 2),
            });
          }}
          error={errors["amount"] ? true : undefined}
          helperText={errors["amount"]}
          loading={isLoading}
          disabled={transferMode !== 2}
        />
        {/* helperText="Balance: 200,000" */}
      </GridDX>
      <GridDX item xs={12}>
        <SelectListDX
          id="fund-to-select-2"
          label="Choose Receiving Fund Source"
          value={data["fundTo"]}
          list={allFundsList}
          onChange={(e: any, v: any) => handleSelectChange(v, "fundTo")}
          error={errors["fundTo"] ? true : undefined}
          helperText={errors["fundTo"]}
          loading={isLoading}
          required
        />
      </GridDX>
      <GridDX item xs={12}>
        <FundPositionTable data={selectedToFundPosition} showPL={false} />
      </GridDX>

      <GridDX item xs={12}>
        <ButtonDX fullWidth onClick={handleSubmit}>
          PROCEED
        </ButtonDX>
      </GridDX>
    </GridDX>
  );
};

export default FundtoFundTransfer2;
