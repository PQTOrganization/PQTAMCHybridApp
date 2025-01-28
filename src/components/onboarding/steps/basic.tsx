import React, { useState, useEffect } from "react";
import {
  Grid,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material/";
import moment, { Moment } from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate } from "react-router-dom";

import TextFieldDX from "../../controls/textfielddx";
import SelectListDX from "../../controls/selectlistdx";
import DatePickerDX from "../../controls/datepickerdx";
import MaskInput from "../../controls/maskinput/maskinput";
import Navigation from "../../controls/navigation";

import {
  genderList,
  mobileOwnList,
  fundPreferenceList,
  accountCategoryList,
  retirementAgeList,
  getPlanListByAccountCategory,
} from "../../../shared/lookups";

import AlertComponenet from "../../alerts/alert";
import { useAuthContext } from "../../../context/authcontext";
import Api from "../../../shared/api/api";
import { useConfigContext } from "../../../context/configcontext";
import { useValidationContext } from "../../../context/validationcontext";
import GridDX from "../../layout/griddx";
import {
  ACT_CATEGORY_GENERAL,
  ACT_CATEGORY_VPS,
  VPSCategoryList,
} from "../../../shared/global";

const Basic = (props: any) => {
  const {
    getUserDetails,
    signOut,
    setReloginDetails,
    getToken,
    inDiscrepancyMode,
    isDiscrepantField,
    getUserAccountLevel,
    getDiscrepantData,
  } = useAuthContext();
  const { DATE_FORMAT } = useConfigContext();

  const theme = useTheme();
  const history = useNavigate();
  const useMobileView = useMediaQuery(theme.breakpoints.down("xs"));
  const { errors, validateField, validatevpsSubFundValues } =
    useValidationContext();

  const [open, setOpen] = useState(false);
  const [warning, setWarning] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [newMobileNumber, setNewMobileNumber] = useState("");
  const [showCNICAlert, setShowCNICAlert] = useState(false);
  const [CNICAlertMessage, setCNICAlertMessage] = useState("");
  const [CNICCheckCode, setCNICCheckCode] = useState("");
  const [isInternationalNumber, setIsInternationalNumber] = useState(false);
  const [planListByAccountCategory, setPlanList] = useState<any>([]);
  const [showActCategoryAlert, setShowActCategoryAlert] = useState(false);
  const [userOldData, setUserOldData] = useState(null);
  const [checkingCNICDependency, setCheckingCNICDependency] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const lstPaymentServerDays = [
    { id: 1, value: "1" },
    { id: 2, value: "2" },
    { id: 3, value: "3" },
    { id: 4, value: "4" },
    { id: 5, value: "5" },
    { id: 6, value: "6" },
    { id: 7, value: "7" },
    { id: 8, value: "8" },
    { id: 9, value: "9" },
    { id: 10, value: "10" },
    { id: 11, value: "11" },
    { id: 12, value: "12" },
    { id: 13, value: "13" },
    { id: 14, value: "14" },
    { id: 15, value: "15" },
    { id: 16, value: "16" },
    { id: 17, value: "17" },
    { id: 18, value: "18" },
    { id: 19, value: "19" },
    { id: 20, value: "20" },
    { id: 21, value: "21" },
    { id: 22, value: "22" },
    { id: 23, value: "23" },
    { id: 24, value: "24" },
    { id: 25, value: "25" },
    { id: 26, value: "26" },
    { id: 27, value: "27" },
    { id: 28, value: "28" },
  ];

  let isSubscribed = true;

  useEffect(() => {
    getUserDetails().then((data: any) => {
      if (isSubscribed) {
        setMobileNumber(data.mobileNumber);

        if (
          data.mobileNumber &&
          data.mobileNumber.length > 1 &&
          data.mobileNumber.substring(0, 2) !== "92"
        )
          setIsInternationalNumber(true);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    if (props.data.accountCategoryId) {
      getPlanListByAccountCategory(props.data.accountCategoryId.id).then(
        (plans) => {
          setPlanList(plans);
        }
      );
    }
  }, [props.data.accountCategoryId]);

  const showCNICAlertMessage = (message: string) => {
    setCNICAlertMessage(message);
    setShowCNICAlert(message === "" ? false : true);
  };

  const closeAndRetry = () => {
    showCNICAlertMessage("");
    setShowCNICAlert(false);

    if (CNICCheckCode === "00" && !checkingCNICDependency) {
      props.onNextAction(null, false);
    }
    if (CNICCheckCode === "08") {
      console.log("update data with old one");
      if (userOldData) {
        props.updateWithData(userOldData, props.data.accountCategory);
        setUserOldData(null);
      }
    } else {
      props.data.cnic = "";
    }

    // Reset variable if being called from CNIC lose focus
    setCheckingCNICDependency(false);
  };

  const closeAndSignIn = async () => {
    setShowCNICAlert(false);

    if (CNICCheckCode === "02" || CNICCheckCode === "03") {
      const verifyData = {
        CellNo: newMobileNumber,
      };

      const promise = await Api("Login/LoginUserAccount", verifyData);

      if (promise) {
        if (promise.MessageCode === "123") {
          // This is done to fix API response error
          if (!promise.ResultSet.CellNo)
            promise.ResultSet.CellNo = verifyData.CellNo;

          const loginDetails = {
            relogin: true,
            CellNo: newMobileNumber,
            MessageDesc: promise.MessageDesc,
            ResultSet: promise.ResultSet,
          };
          setReloginDetails(loginDetails);
        } else console.log(promise.MessageDesc);
      }

      signOut();
    } else if (CNICCheckCode === "01") {
      signOut();
      history("/isavelogin");
    } else if (CNICCheckCode === "04") {
      signOut();
      history("/welcome");
    } else if (
      (CNICCheckCode === "08" || CNICCheckCode === "00") &&
      !checkingCNICDependency
    ) {
      props.onNextAction(null, false);
    }

    // Reset variable if being called from CNIC lose focus
    setCheckingCNICDependency(false);
  };

  const onHandleDateChange = (fieldName: string, dateValue: any) => {
    props.onChangeAction({ target: { name: fieldName, value: dateValue } });
  };

  const onHandleDateAccept = (fieldName: string, dateValue: Moment) => {
    if (fieldName === "dateOfBirth") {
      const dateAfter18Years = moment(dateValue).add(18, "y");

      if (dateAfter18Years.isAfter()) {
        props.onChangeAction({ target: { name: fieldName, value: null } });
        setOpen(true);
        setWarning("Only 18 years and above age can open account");
      }
    } else if (fieldName === "cnicIssueDate") {
      if (dateValue.year() < 2000) {
        props.onChangeAction({ target: { name: fieldName, value: null } });
        setOpen(true);
        setWarning("Issue Date should be greater then 2000");
      }
    }
  };

  const onHandleAccountCategoryChange = (e: any, v: any) => {
    // if (v.id === ACT_CATEGORY_VPS) {
    if (VPSCategoryList.includes(v.id)) {
      setShowActCategoryAlert(true);
      //props.data.fundPreference = { id: 1, value: "All Funds" };
    } else {
      props.data.fundPreference = "";
      props.data.expectedRetirementAge = null;
      props.data.vpsFundId = null;
    }

    props.onChangeAction(e, v);
  };

  const handleClose = () => setOpen(false);

  const handleNext = async (resetNav: any) => {
    const apiError = await checkCNICDependencies();

    console.log({ apiError });

    if (apiError) resetNav();

    if (
      props.data.vpsFundId &&
      props.data.vpsFundId?.value === "Customized" &&
      validatevpsSubFundValues(
        props.data.equitySubFund,
        props.data.debtSubFund,
        props.data.moneyMarketSubFund
      )
    ) {
      setShowError(true);
      setErrorMessage("Sum of all funds should be equal to 100");
      resetNav();
    } else props.onNextAction(resetNav);
  };

  const checkCNICDependencies = async () => {
    var apiError = false;

    const checkNIC =
      (props.data.cnic && props.data.cnic !== "" && !inDiscrepancyMode()) ||
      (inDiscrepancyMode() && isDiscrepantField("cnic"));

    if (checkNIC) {
      try {
        const token = getToken();

        let cnicCheck = await Api(
          `UserApplication/CheckCNICReuse`,
          {
            cnic: props.data.cnic,
            cellNo: mobileNumber,
          },
          "POST",
          token
        );

        console.log({ cnicCheck });

        const messageCode: string = cnicCheck.isSuccess ? "01" : "00";

        setCNICCheckCode(messageCode);

        switch (messageCode) {
          case "01":
          case "04": {
            showCNICAlertMessage(cnicCheck.errorMessage);
            apiError = true;
            break;
          }

          case "03": {
            setNewMobileNumber(cnicCheck.cellNo);
            showCNICAlertMessage(cnicCheck.errorMessage);
            apiError = true;
            break;
          }

          default: {
            setCheckingCNICDependency(false);
            apiError = false;
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    return apiError;
  };

  const alertCloseLabel = () => {
    switch (CNICCheckCode) {
      case "01":
      case "04":
        return "OK";
      case "08":
        return "No";
      default:
        return "Login";
    }
  };

  const alertOKLabel = () => {
    return CNICCheckCode === "08" ? "Yes" : "Ok";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <AlertComponenet
        title="CNIC already exists!"
        open={showCNICAlert}
        alert={CNICAlertMessage}
        closeLabel={alertCloseLabel()}
        //okLabel={alertOKLabel()}
        handleClose={closeAndRetry}
        //handleCloseOk={closeAndRetry}
        handlePopupClose={() => setShowCNICAlert(false)}
      />
      <AlertComponenet
        title="VPS Funds Error!"
        open={showError}
        alert={errorMessage}
        closeLabel={"Ok"}
        handleClose={() => setShowError(false)}
        handlePopupClose={() => setShowError(false)}
      />
      <AlertComponenet
        title="Account Category"
        open={showActCategoryAlert}
        alert={
          'You have selected "VPS" account category through which you will be able to open a Voluntary Pension Scheme account which aids in retirement planning. If you wish to invest in Mutual Funds please select General Category.'
        }
        closeLabel={"Continue with VPS"}
        okLabel={"Change to General"}
        handleClose={() => setShowActCategoryAlert(false)}
        handleCloseOk={() => {
          setShowActCategoryAlert(false);
          props.onChangeAction({
            target: {
              name: "accountCategoryId",
              value: {
                id: ACT_CATEGORY_GENERAL,
                value: "Mutual Funds (Digital)",
              },
            },
          });
        }}
        handlePopupClose={() => setShowActCategoryAlert(false)}
      />

      <GridDX container spacing={props.readOnly ? 2 : useMobileView ? 2 : 4}>
        <GridDX item xs={12} sm={6}>
          <SelectListDX
            id="accountCategoryId"
            name="accountCategoryId"
            label="Account Category"
            value={props.data.accountCategoryId}
            list={accountCategoryList}
            onChange={(e: any, v: any) => {
              onHandleAccountCategoryChange(e, v);
            }}
            error={errors["accountCategoryId"] ? true : undefined}
            helperText={errors["accountCategoryId"]}
            readOnly={props.readOnly}
            disabled={
              inDiscrepancyMode() && !isDiscrepantField("accountCategoryId")
            }
            onBlur={() =>
              validateField("accountCategoryId", props.data.accountCategoryId)
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <MaskInput
            name="cnic"
            tip="ID Card Number is mentioned in your Identity Document includes CNIC, SCNIC, NICOP, SNICOP and POC"
            label="ID Card Number"
            value={props.data.cnic}
            masktype="cnic"
            onChange={(e: any) => props.onChangeAction(e)}
            error={errors["cnic"] ? true : false}
            helpertext={errors["cnic"]}
            readOnly={props.readOnly}
            InputLabelProps={{ style: { pointerEvents: "auto" } }}
            disabled={inDiscrepancyMode() && !isDiscrepantField("cnic")}
            onBlur={() => {
              if (props.data.cnic && props.data.cnic.length === 13) {
                setCheckingCNICDependency(true);
                checkCNICDependencies();
              }

              validateField("cnic", props.data.cnic);
            }}
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            name="name"
            value={props.data.name}
            tip="Name should be as per your ID Card. Identity Document includes CNIC, SCNIC, NICOP, SNICOP and POC"
            label="Name as per ID Card"
            onChange={(e: any) => props.onChangeAction(e)}
            error={errors["name"] ? true : false}
            helperText={errors["name"]}
            readOnly={props.readOnly}
            InputLabelProps={{ style: { pointerEvents: "auto" } }}
            disabled={inDiscrepancyMode() && !isDiscrepantField("name")}
            onBlur={() => validateField("name", props.data.name)}
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            name="fatherHusbandName"
            value={props.data.fatherHusbandName}
            tip="Father / Husband Name should be as per your ID Card. ID Card includes CNIC, SCNIC, NICOP, SNICOP, POC"
            label="Father / Husband Name"
            onChange={(e: any) => props.onChangeAction(e)}
            error={errors["fatherHusbandName"] ? true : false}
            helperText={errors["fatherHusbandName"]}
            readOnly={props.readOnly}
            InputLabelProps={{ style: { pointerEvents: "auto" } }}
            disabled={
              inDiscrepancyMode() && !isDiscrepantField("fatherHusbandName")
            }
            onBlur={() =>
              validateField("fatherHusbandName", props.data.fatherHusbandName)
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <SelectListDX
            id="genderId"
            name="genderId"
            value={props.data.genderId}
            label="Gender"
            list={genderList}
            onChange={(e: any, v: any) => props.onChangeAction(e, v)}
            error={errors["genderId"] ? true : undefined}
            helperText={errors["genderId"]}
            readOnly={props.readOnly}
            disabled={inDiscrepancyMode() && !isDiscrepantField("genderId")}
            onBlur={() => validateField("genderId", props.data.genderId)}
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <DatePickerDX
            format={DATE_FORMAT}
            label="ID Card Date of Birth"
            fullWidth
            disableFuture
            value={props.data.dateOfBirth}
            onChange={(dateValue: any) => {
              onHandleDateChange("dateOfBirth", dateValue);
            }}
            onAccept={(dateValue: any) => {
              onHandleDateAccept("dateOfBirth", dateValue);
            }}
            error={errors["dateOfBirth"] ? true : false}
            helperText={errors["dateOfBirth"]}
            readOnly={props.readOnly}
            disabled={inDiscrepancyMode() && !isDiscrepantField("dateOfBirth")}
            onBlur={() => validateField("dateOfBirth", props.data.dateOfBirth)}
          />
          <AlertComponenet
            open={open}
            handleClose={handleClose}
            alert={warning}
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <DatePickerDX
            format={DATE_FORMAT}
            label="ID Card Issue Date"
            fullWidth
            disableFuture
            value={props.data.cnicIssueDate}
            onChange={(dateValue: any) =>
              onHandleDateChange("cnicIssueDate", dateValue)
            }
            onAccept={(dateValue: any) => {
              console.log({ dateValue });
              onHandleDateAccept("cnicIssueDate", dateValue);
            }}
            error={errors["cnicIssueDate"] ? true : false}
            helperText={errors["cnicIssueDate"]}
            readOnly={props.readOnly}
            disabled={
              inDiscrepancyMode() && !isDiscrepantField("cnicIssueDate")
            }
            onBlur={() =>
              validateField("cnicIssueDate", props.data.cnicIssueDate)
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6} sx={{ flexDirection: "column" }}>
          <DatePickerDX
            format={DATE_FORMAT}
            label="ID Card Exipry Date"
            fullWidth
            disablePast
            value={props.data.cnicExpiryDate}
            onChange={(dateValue: any) =>
              onHandleDateChange("cnicExpiryDate", dateValue)
            }
            error={errors["cnicExpiryDate"] ? true : false}
            helperText={errors["cnicExpiryDate"]}
            readOnly={props.readOnly}
            disabled={
              props.data.isCNICLifeTime ||
              (inDiscrepancyMode() && !isDiscrepantField("cnicExpiryDate"))
            }
            onBlur={() =>
              validateField("cnicExpiryDate", props.data.cnicExpiryDate)
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                name="isCNICLifeTime"
                checked={props.data.isCNICLifeTime}
                disabled={
                  props.readOnly ||
                  (inDiscrepancyMode() && !isDiscrepantField("LifeTimeNIC"))
                }
                onChange={(e) => {
                  props.data.cnicExpiryDate = null;
                  props.onChangeAction(e);
                }}
                color="primary"
              />
            }
            label="Lifetime Expiry Date"
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <TextFieldDX
            name="motherMaidenName"
            value={props.data.motherMaidenName}
            label="Mother's Maiden Name"
            onChange={(e: any) => props.onChangeAction(e)}
            error={errors["motherMaidenName"] ? true : false}
            helperText={errors["motherMaidenName"]}
            readOnly={props.readOnly}
            disabled={
              inDiscrepancyMode() && !isDiscrepantField("motherMaidenName")
            }
            onBlur={() =>
              validateField("motherMaidenName", props.data.motherMaidenName)
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <SelectListDX
            id="contactOwnershipId"
            name="contactOwnershipId"
            value={props.data.contactOwnershipId}
            tip="To avoid frauds, we need to verify the ownership of mobile number provided. If provided mobile number is registered against your own Name / CNIC then system will need to verify it. If provided mobile number is registered against the name of your ‘Close Family Member’ then you will need to provide an undertaking in the declaration section. If provided mobile number is ‘Company Registered’ then you will need to provide a Recent Bill of Service Provider and Letter from Employer, stating that the said mobile number is provided by the employer to its employee, in the document upload section. If you are using ‘International Mobile Number’ you need to provide a Recent Bill of Service Provider in the document upload section. Closed Family Member includes ‘Spouse’, ‘Dependent Parents’ and ‘Dependent Children’ only."
            label={`Ownership of Mobile No. ${mobileNumber}`}
            list={mobileOwnList}
            onChange={(e: any, v: any) => {
              props.data.cellOwnerConsent = false;
              props.onChangeAction(e, v);
            }}
            error={errors["contactOwnershipId"] ? true : false}
            helperText={errors["contactOwnershipId"]}
            readOnly={props.readOnly}
            InputLabelProps={{ style: { pointerEvents: "auto" } }}
            disabled={
              isInternationalNumber ||
              (inDiscrepancyMode() && !isDiscrepantField("contactOwnershipId"))
            }
            onBlur={() =>
              validateField("contactOwnershipId", props.data.contactOwnershipId)
            }
          />
        </GridDX>
        {props.data.accountCategoryId !== null &&
          VPSCategoryList.includes(props.data.accountCategoryId?.id) && (
            <>
              <GridDX item xs={12} sm={6}>
                <SelectListDX
                  id="expectedRetirementAge"
                  name="expectedRetirementAge"
                  value={props.data.expectedRetirementAge}
                  label="Retirement Age"
                  list={retirementAgeList}
                  onChange={(e: any, v: any) => props.onChangeAction(e, v)}
                  error={errors["expectedRetirementAge"] ? true : false}
                  helperText={errors["expectedRetirementAge"]}
                  readOnly={props.readOnly}
                  disabled={
                    inDiscrepancyMode() &&
                    !isDiscrepantField("expectedRetirementAge")
                  }
                  onBlur={() =>
                    validateField(
                      "expectedRetirementAge",
                      props.data.expectedRetirementAge
                    )
                  }
                />
              </GridDX>
              <GridDX item xs={12} sm={6} sx={{ flexDirection: "column" }}>
                <SelectListDX
                  id="vpsFundId"
                  name="vpsFundId"
                  label="VPS Fund Selection"
                  value={props.data.vpsFundId}
                  list={planListByAccountCategory}
                  onChange={(e: any, v: any) => props.onChangeAction(e, v)}
                  error={errors["vpsFundId"] ? true : false}
                  helperText={errors["vpsFundId"]}
                  readOnly={props.readOnly}
                  disabled={
                    inDiscrepancyMode() && !isDiscrepantField("vpsFundId")
                  }
                  onBlur={() =>
                    validateField("vpsFundId", props.data.vpsFundId)
                  }
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                  }}
                >
                  {props.data.vpsFundId !== null && (
                    <>
                      <TextFieldDX
                        key={"key_per_" + 1}
                        value={props.data.equitySubFund}
                        name="equitySubFund"
                        label={"Equity"}
                        style={{ maxWidth: 115 }}
                        readOnly={props.readOnly}
                        disabled={
                          props.data?.vpsFundId?.value === "Customized"
                            ? false
                            : true
                        }
                        adornment="%"
                        adornmentPosition="end"
                        type="number"
                        onInput={(e: any) => {
                          e.target.value = Math.max(0, parseInt(e.target.value))
                            .toString()
                            .slice(0, 3);
                        }}
                        onChange={(e: any) => {
                          // if (e.target.value.length > 3) {
                          //   return;
                          // }
                          props.onChangeAction(e);
                        }}
                        onBlur={() =>
                          validatevpsSubFundValues(
                            props.data.equitySubFund,
                            props.data.debtSubFund,
                            props.data.moneyMarketSubFund
                          )
                        }
                      />
                      <TextFieldDX
                        key={"key_per_" + 2}
                        value={props.data.debtSubFund}
                        name="debtSubFund"
                        label={"Debt"}
                        style={{ maxWidth: 115 }}
                        readOnly={props.readOnly}
                        disabled={
                          props.data.vpsFundId?.value === "Customized"
                            ? false
                            : true
                        }
                        adornment="%"
                        adornmentPosition="end"
                        type="number"
                        onInput={(e: any) => {
                          e.target.value = Math.max(0, parseInt(e.target.value))
                            .toString()
                            .slice(0, 3);
                        }}
                        onChange={(e: any) => {
                          // if (e.target.value.length > 3) {
                          //   return;
                          // }
                          props.onChangeAction(e);
                        }}
                        onBlur={() =>
                          validatevpsSubFundValues(
                            props.data.equitySubFund,
                            props.data.debtSubFund,
                            props.data.moneyMarketSubFund
                          )
                        }
                      />
                      <TextFieldDX
                        key={"key_per_" + 3}
                        value={props.data.moneyMarketSubFund}
                        name="moneyMarketSubFund"
                        label={"Money Market"}
                        style={{ maxWidth: 115 }}
                        readOnly={props.readOnly}
                        disabled={
                          props.data.vpsFundId?.value === "Customized"
                            ? false
                            : true
                        }
                        adornment="%"
                        adornmentPosition="end"
                        type="number"
                        onInput={(e: any) => {
                          e.target.value = Math.max(0, parseInt(e.target.value))
                            .toString()
                            .slice(0, 3);
                        }}
                        onChange={(e: any) => {
                          // if (e.target.value.length > 3) {
                          //   return;
                          // }
                          props.onChangeAction(e);
                        }}
                        onBlur={() =>
                          validatevpsSubFundValues(
                            props.data.equitySubFund,
                            props.data.debtSubFund,
                            props.data.moneyMarketSubFund
                          )
                        }
                      />
                    </>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                  }}
                >
                  <Typography
                    style={{
                      whiteSpace: "pre",
                      color: "#d32f2f",
                      fontSize: "0.75rem",
                      marginLeft: "14px",
                    }}
                  >
                    {errors["vpsSubFund"]}
                  </Typography>
                </div>
              </GridDX>
            </>
          )}
        {!props.readOnly && (
          <GridDX item xs={12}>
            <Navigation onNextAction={handleNext} />
          </GridDX>
        )}
      </GridDX>
    </LocalizationProvider>
  );
};

export default Basic;
