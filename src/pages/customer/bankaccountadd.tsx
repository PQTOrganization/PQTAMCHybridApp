import { useEffect, useState } from "react";
import ButtonDX from "../../components/controls/buttondx";
import GridDX from "../../components/layout/griddx";
import { useAuthContext } from "../../context/authcontext";
import { useErrorContext } from "../../context/errorcontext";
import useBankAccountService from "../../shared/services/bankaccountservice";
import { useNavigate, useParams } from "react-router-dom";
import TextFieldDX from "../../components/controls/textfielddx";
import CardDX from "../../components/layout/carddx";
import { CardContent, Typography } from "@mui/material";
import SelectListDX from "../../components/controls/selectlistdx";
import { bankList } from "../../shared/lookups";
import { getBanks } from "../../shared/lookups";
import Skeleton from "react-loading-skeleton";

const BankAccountAdd = () => {
  const navigate = useNavigate();
  const { setError, setInfo } = useErrorContext();
  const { getUserDetails } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [ibanNumber, setIBANNumber] = useState("");
  const [title, setTitle] = useState("");
  const [selectedBankId, setSelectedBankId] = useState(0);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});
  const { addUserBank } = useBankAccountService();

  useEffect(() => {
    setIsLoading(true);

    if (bankList.length == 0) {
      getBanks().catch((err) => console.log("error", err));
    }
    getUserDetails()
      .then((userDetails: any) => {
        setUserDetails(userDetails);
      })
      .catch((err: any) => console.log("error in fetching user details", err))
      .finally(() => setIsLoading(false));
  }, []);

  const onAdd = async () => {
    if (validateForm()) {
      let account = {
        userBankId: 0,
        userId: userDetails?.userId,
        bankId: selectedBankId,
        ibanNumber: ibanNumber,
        isIBANVerified: false,
        oneLinkTitle: title,
        isOBAccount: false,
      };
      addUserBank(account).then((response) => {
        console.log("account add response", response);
        setInfo("Account added successfully.");
        navigate("/bankaccounts");
      });
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (selectedBankId <= 0) newErrors["bankid"] = "Bank is required";

    if (ibanNumber === "") newErrors["ibanNumber"] = "IBAN is required";

    if (title === "") newErrors["title"] = "Title is required";
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: any, v: any) => {
    setSelectedBankId(v.id);
  };

  return (
    <GridDX container sx={{ width: "100%" }}>
      <GridDX item xs={12} sx={{ justifyContent: "flex-start" }}>
        <Typography
          color="primary"
          sx={{
            fontSize: 18,
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          Add Bank Account
        </Typography>
      </GridDX>
      <GridDX item xs={12}>
        <SelectListDX
          list={bankList}
          onChange={(e: any, v: any) => handleChange(e, v)}
          error={errors["bankid"] ? true : undefined}
          helperText={errors["bankid"]}
          loading={isLoading}
        />
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldDX
          label="IBAN Number"
          value={ibanNumber}
          onInput={(e: any) => {
            let value = e.target.value;
            value = value.replace(/[^A-Za-z0-9]/gi, "");
            value = value.toUpperCase();
            setIBANNumber(value);
          }}
          error={errors["ibanNumber"] ? true : undefined}
          helperText={errors["ibanNumber"]}
          loading={isLoading}
        />
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldDX
          label="Title"
          value={title}
          onChange={(e: any) => {
            setTitle(e.target.value);
          }}
          error={errors["title"] ? true : undefined}
          helperText={errors["title"]}
          loading={isLoading}
        />
      </GridDX>
      <GridDX item xs={12} sx={{ justifyContent: "flex-end" }}>
        <ButtonDX style={{ width: 125, height: 36.5 }} onClick={onAdd}>
          Add
        </ButtonDX>
      </GridDX>
    </GridDX>
  );
};

export default BankAccountAdd;
