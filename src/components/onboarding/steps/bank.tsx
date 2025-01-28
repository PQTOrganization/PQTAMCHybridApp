import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material/";
import { useTheme } from "@mui/material/";
import YesNoSwitch from "../../controls/yesnoswitch";

import TextFieldDX from "../../controls/textfielddx";
import SelectListDX from "../../controls/selectlistdx";
import Navigation from "../../controls/navigation";
import MaskInput from "../../controls/maskinput/maskinput";
import Api from "../../../shared/api/api";

import { bankList } from "../../../shared/lookups";
import AlertComponenet from "../../alerts/alert";
import FailedIcon from "@mui/icons-material/ClearRounded";
import SuccessIcon from "@mui/icons-material/Check";
import { useAuthContext } from "../../../context/authcontext";
import { useValidationContext } from "../../../context/validationcontext";
import { useErrorContext } from "../../../context/errorcontext";
import GridDX from "../../layout/griddx";

const Bank = (props: any) => {
  const { getToken, inDiscrepancyMode, isDiscrepantField } = useAuthContext();
  const { errors, validateField } = useValidationContext();
  const { setError } = useErrorContext();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert2, setShowAlert2] = useState(false);
  const [alertMessage2, setAlertMessage2] = useState("");
  const [isTitleFetched, setTitleFetched] = useState(true);
  const [wasTitleChecked, setWasTitleChecked] = useState(true);
  const [IBANVerifiedInput, setIBANVerifiedInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isNavLoading, setNavLoading] = useState(false);

  useEffect(() => {
    // if (props.data.oneLinkTitle)
    //   setTitleFetched(props.data.oneLinkTitle.length > 0);
    // else setTitleFetched(false);
  }, []);

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const showAlertMessage2 = (message: string) => {
    setAlertMessage2(message);
    setShowAlert2(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const fetchTitle = () => {
    if (!props.data.cnic || props.data.cnic === "") {
      showAlertMessage2(
        "Title Fetch cannot be processed due to missing CNIC number"
      );
    } else if (!props.data.bankId || props.data.ibanNumber?.length !== 24) {
      showAlertMessage2(
        "Please provide complete bank and IBAN details for title fetch"
      );
    } else {
      setIsVerifying(true);

      const token = getToken();

      Api(
        "ibft/fetchtitle",
        {
          cnic: props.data.cnic,
          ibanNumber: props.data.ibanNumber,
          bankId: props.data.bankId?.id,
          userApplicationId: props.userApplicationId,
        },
        "POST",
        token
      )
        .then((response) => {
          setWasTitleChecked(true);
          console.log("IBAN Verify Response: ", response);

          if (response.isSuccess) {
            setTitleFetched(true);
            props.onMultiChangeAction([
              {
                name: "oneLinkTitle",
                value: response.accountTitle,
              },
              {
                name: "isIBANVerified",
                value: true,
              },
            ]);
          } else {
            setTitleFetched(false);

            const messageToShow =
              !response.errorMessage || response.errorMessage === null
                ? "Error fetching title"
                : response.MessageDesc;

            setError(messageToShow);
          }
        })
        .catch((ex: any) => {
          console.log(ex);
          setError("Unexpected Error. Contact site administrator");
        })
        .finally(() => setIsVerifying(false));
    }
  };

  const handleNext = (resetNav: any) => {
    setNavLoading(true);

    // Doing this here because IBAN change event was getting called on page load also
    // if (!isTitleFetched) props.data.oneLinkTitle = "";

    if (isTitleFetched) {
      gotoNextPage(resetNav);
    } else {
      showAlertMessage(
        "Please fetch title before proceeding next and ensure Bank account title must be same as PQAMCL account title"
      );
    }
  };

  const closeAndVerify = () => {
    hideAlert();
    setNavLoading(false); // this is done to stop loading indicator on NEXT
    // fetchTitle();
  };

  const closeAndMoveNext = () => {
    hideAlert();
    gotoNextPage(null);
  };

  const gotoNextPage = (resetNav: any) => {
    props.onNextAction(resetNav);
  };

  const showVerificationStatus = () => {
    return isTitleFetched ? (
      <>
        <SuccessIcon
          style={{
            backgroundColor: "green",
            borderRadius: "50%",
            marginRight: 5,
            marginLeft: 5,
            color: "white",
            fontSize: 16,
          }}
        />
        <span style={{ color: "green" }}>Title fetched successfully</span>
      </>
    ) : (
      <>
        <FailedIcon
          style={{
            backgroundColor: "red",
            borderRadius: "50%",
            marginRight: 5,
            marginLeft: 5,
            color: "white",
            fontSize: 16,
          }}
        />
        <span style={{ color: "red" }}>Tile fetch unsuccessful</span>
      </>
    );
  };

  return (
    <GridDX container spacing={props.readOnly ? 0 : 2}>
      <AlertComponenet
        title="Title Fetch"
        open={showAlert}
        alert={alertMessage}
        closeLabel="Title Fetch"
        okLabel="Later"
        handleClose={closeAndVerify}
        handleCloseOk={closeAndMoveNext}
        handlePopupClose={() => setShowAlert(false)}
      />

      <AlertComponenet
        title="Incomplete Information"
        open={showAlert2}
        alert={alertMessage2}
        closeLabel="Ok"
        handleClose={() => setShowAlert2(false)}
      />

      <GridDX item xs={12}>
        <SelectListDX
          id="bankId"
          name="bankId"
          label="Bank Name"
          key="bank"
          list={bankList}
          value={props.data.bankId}
          onChange={(e: any, v: any) => {
            console.log("e:", e);
            console.log("v", v);
            console.log("bank name changed");
            props.data.ibanNumber = "";
            props.data.oneLinkTitle = "";
            props.onChangeAction(e, v);
          }}
          error={errors["bankId"] ? true : false}
          helperText={errors["bankId"]}
          readOnly={props.readOnly}
          disabled={inDiscrepancyMode() && !isDiscrepantField("bankId")}
          onBlur={() => validateField("bankId", props.data.bankId)}
        />
      </GridDX>
      <GridDX item xs={12}>
        <MaskInput
          label="Bank/E-Wallet IBAN Number"
          name="ibanNumber"
          maskType="iban"
          value={props.data.ibanNumber}
          onChange={(e: any) => {
            console.log("iban changed");
            //props.data.oneLinkTitle = ""; Don't do this. Onchange also gets called when value is assigned
            // setTitleFetched(false);
            props.onChangeAction(e);
          }}
          error={errors["ibanNumber"] ? true : false}
          helpertext={errors["ibanNumber"]}
          readOnly={props.readOnly}
          disabled={inDiscrepancyMode() && !isDiscrepantField("ibanNumber")}
          onBlur={() => validateField("ibanNumber", props.data.ibanNumber)}
        />
      </GridDX>

      {!props.readOnly && (
        <>
          <GridDX item xs={12}>
            <p style={{ margin: 0 }}>
              <span style={{ fontWeight: "bold" }}>
                International Bank Account Number (IBAN)
              </span>
              <br />
              <span
                style={{
                  fontSize: matches ? 16 : 12,
                  color: "gray",
                  fontWeight: "bold",
                }}
              >
                consists of 24 characters printed in your cheque book:
              </span>
            </p>
            <p style={{ fontSize: matches ? 16 : 12, fontWeight: "bold" }}>
              <span style={{ color: "gray" }}>IBAN Format: &nbsp;</span>
              <span>PK</span> <span>36</span> <span>SBCL</span>{" "}
              <span>0000 0011 2345 6702</span>
            </p>

            <table
              border={1}
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: matches ? 16 : 12,
                fontWeight: "bold",
              }}
            >
              <tbody>
                <tr>
                  <td>Country Code</td>
                  <td>
                    <span>PK</span>
                  </td>
                </tr>
                <tr>
                  <td>Check Digit</td>
                  <td>
                    <span>36</span>
                  </td>
                </tr>
                <tr>
                  <td>Bank Code</td>
                  <td>
                    <span>SBCL</span>
                  </td>
                </tr>
                <tr>
                  <td>Bank Account Number</td>
                  <td>
                    <span>0000 0011 2345 6702</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </GridDX>
        </>
      )}

      {/* <GridDX
        item
        xs={12}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        {!props.readOnly && (
          <Button
            variant="contained"
            color="primary"
            disabled={
              isTitleFetched ||
              props.data.bankId === null ||
              props.data.ibanNumber?.length !== 24
            }
            onClick={() => fetchTitle()}
          >
            Title Fetch
          </Button>
        )}

        <div
          style={{
            fontSize: 14,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          {isVerifying ? (
            <CircularProgress size={30} style={{ marginRight: 10 }} />
          ) : (
            wasTitleChecked && showVerificationStatus()
          )}
        </div>
      </GridDX>

      <GridDX
        item
        xs={12}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {isTitleFetched && (
            <>
              <TextFieldDX
                disabled={true}
                style={
                  props.readonly
                    ? {}
                    : {
                        marginTop: 10,
                        marginBottom: 20,
                      }
                }
                label="Bank Account Title"
                value={props.data.oneLinkTitle}
                readOnly={props.readOnly}
              />
            </>
          )}
        </div>
      </GridDX> */}

      <GridDX item xs={8}>
        <Typography style={{ fontSize: 14, textAlign: "justify" }}>
          Do you use online banking
        </Typography>
      </GridDX>
      <GridDX item xs={4}>
        <YesNoSwitch
          name="useOnlineBanking"
          readOnly={props.readOnly}
          checked={props.data.useOnlineBanking}
          onChange={(e: any) => props.onChangeAction(e)}
          disabled={
            inDiscrepancyMode() && !isDiscrepantField("useOnlineBanking")
          }
        />
      </GridDX>
      {!props.readOnly && (
        <GridDX item xs={12}>
          <Navigation
            loadingIndicator={isNavLoading}
            onPrevAction={props.onPrevAction}
            onNextAction={handleNext}
          />
        </GridDX>
      )}
    </GridDX>
  );
};

export default Bank;
