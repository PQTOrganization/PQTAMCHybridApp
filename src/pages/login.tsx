import { useEffect, useState } from "react";
import { Container, IconButton, Typography } from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";
import moment from "moment";

import AMCLogo from "../asset/pqamc_trans_logo.png";

import GridDX from "../components/layout/griddx";
import TextFieldDX from "../components/controls/textfielddx";
import CountryListDX from "../components/controls/countrylistdx";
import ButtonDX from "../components/controls/buttondx";
import LoadingButtonDX from "../components/controls/loadingbuttondx";

import { useAuthContext } from "../context/authcontext";
import { useErrorContext } from "../context/errorcontext";
import { useConfigContext } from "../context/configcontext";

import { countryCodeList } from "../shared/lookups";
import { sendOTP, verifyOTP } from "../shared/services/auth";
import { formatTimerToMinAndSecs } from "../shared/global";

import ReCAPTCHA from "react-google-recaptcha";
import React from "react";

// const isMobile = (): boolean => {
//   const userAgent = navigator.userAgent.toLowerCase();
//   //console.log("userAgent: ", userAgent);
//   return /android|ipad|iphone/i.test(userAgent);
// }

const Login = () => {
  const navigate = useNavigate();

  const { isLoggedIn, signIn } = useAuthContext();
  const { setError } = useErrorContext();
  const { RESEND_TIMER } = useConfigContext();

  const [mode, setMode] = useState(0);
  const [lastMode, setLastMode] = useState(0);
  const [countryCode, setCountryCode] = useState({ id: "", value: "" });
  const [number, setNumber] = useState("");
  const [otp, setOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_TIMER);

  const [token, setToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isHuman, setIsHuman] = useState(true);

  let isSubscribed = true;
  let timeOutRef: any;

  const isMobile = (): boolean => {
    if ((window as any)?.ReactNativeWebView) {
      setIsHuman(true);
      setShowCaptcha(false);
    }
    setIsHuman(false);
    setShowCaptcha(false);
    return false;
  };

  // const handleTokenVerification = (token: string | null) => {
  //   console.log("Captcha token: ", token);
  //   setToken(token);
  //   setCaptchaError(null);
  // };

  const onChange = async (value: any) => {
    console.log("google token", token);
    console.log("Captcha value:", value);
    if (value != null) {
      setIsHuman(true);
    } else {
      setIsHuman(false);
    }
  };

  const handleError = (err: string) => {
    console.error("Captcha Error:", err);
    setCaptchaError("Captcha verification failed. Please try again.");
  };

  useEffect(() => {
    if (mode === 1) {
      if (seconds > 0) {
        timeOutRef = setTimeout(() => {
          if (isSubscribed)
            setSeconds(
              Number(seconds) - 1 < 10 ? "0" + (seconds - 1) : seconds - 1
            );
        }, 1000);
      }
    }

    return () => {
      isSubscribed = false;

      if (timeOutRef) clearTimeout(timeOutRef);
    };
  });

  useEffect(() => {
    isMobile();
  }, []);

  useEffect(() => {
    setCountryCode({ id: "92", value: "92" });
  }, [countryCodeList]);

  const login = async () => {
    if (number) {
      if (number.length !== 10)
        setError("Please provide a valid mobile number");
      else {
        setIsLoading(true);
        sendOTP(countryCode.value + "" + number)
          .then(() => setMode(1))
          .catch((err) => setError(err))
          .finally(() => setIsLoading(false));
      }
    } else setError("Please provide mobile number");
  };

  const resendOTP = () => {
    setIsLoading(true);
    sendOTP(countryCode.value + "" + number)
      .then(() => setSeconds(RESEND_TIMER))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  // console.log("key", process.env.REACT_APP_ReCAPTCHA_SITE);
  const showOTPEntryStep = () => {
    return (
      <GridDX container spacing={2} style={{ alignItems: "center" }}>
        <GridDX
          item
          xs={12}
          style={{ justifyContent: "center", flexDirection: "column" }}
        >
          <Typography variant="h5" style={{ textAlign: "center" }}>
            OTP Verification
          </Typography>
        </GridDX>
        <GridDX item xs={12}>
          <TextFieldDX
            label="SMS OTP"
            type="text"
            onInput={() => {}}
            value={otp}
            onChange={(e: any) => setOTP(e.target.value)}
          />
        </GridDX>
        <GridDX item xs={12}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <LoadingButtonDX
              loading={isLoading}
              onClick={resendOTP}
              disabled={seconds !== "00"}
            >
              Resend OTP
            </LoadingButtonDX>
            <Typography variant={"h6"} style={{ marginLeft: 30 }}>
              {formatTimerToMinAndSecs(seconds)}
            </Typography>
          </div>
        </GridDX>

        {showCaptcha ? (
          <GridDX>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_ReCAPTCHA_SITE as string}
              onChange={onChange}
            />
          </GridDX>
        ) : (
          <></>
        )}

        <GridDX
          item
          xs={12}
          style={{
            justifyContent: "flex-end",
          }}
        >
          <ButtonDX
            variant="outlined"
            style={{ marginRight: 16 }}
            color="secondary"
            onClick={() => {
              setMode(lastMode);
              setSeconds(RESEND_TIMER);
              setLastMode(1);
            }}
          >
            Back
          </ButtonDX>
          <LoadingButtonDX
            loading={isLoading}
            fullWidth
            onClick={onVerifyOTPClicked}
            disabled={seconds === "00" || otp === "" /*|| !isHuman*/}
          >
            Proceed
          </LoadingButtonDX>
        </GridDX>
      </GridDX>
    );
  };

  const onVerifyOTPClicked = async () => {
    if (otp.length > 0) {
      setIsLoading(true);
      verifyOTP(otp, countryCode.value + "" + number)
        .then((authData) => {
          var data = {
            userId: authData.userId,
            mobileNumber: authData.mobileNumber,
            firstName: authData.firstName,
            lastName: authData.lastName,
            emailConfirmed: authData.emailConfirmed,
            email: authData.email,
            profileImage: authData.profileImage,
            registerationDate: moment(authData.registerationDate),
            userApplicationId: authData.userApplicationId,
            applicationStatusId: authData.applicationStatusId,
            folioNumber: authData.folioNumber,
            folioList: authData.folioList,
            currentFolioNumber: authData.folioNumber,
            currentFolioName:
              (authData.firstName ?? "") + " " + (authData.lastName ?? ""),
          };

          signIn(data, authData.tokenInfo.token);

          if (!authData.folioNumber || authData.folioNumber?.length === 0)
            navigate("/onboard");
          else {
            if (authData.folioList.length === 1) navigate("/dashboard");
            else navigate("/switchfolio");
          }
        })
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    } else setError("Please provide a valid OTP");
  };

  return (
    <Container
      style={{
        display: "flex",
        height: "100%",
        alignItems: "flex-start",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "absolute", top: 20 }}>
        <IconButton
          sx={{ alignSelf: "flex-start", backgroundColor: "#cdcdcd" }}
          onClick={() => navigate(-1)}
        >
          <BackIcon />
        </IconButton>
      </div>
      {mode === 0 && (
        <GridDX container spacing={2} style={{ alignItems: "center" }}>
          <GridDX item xs={12} style={{ justifyContent: "center" }}>
            <img src={AMCLogo} alt="Logo" width={150} />
          </GridDX>
          <GridDX item xs={5}>
            <CountryListDX
              id="code"
              name="code"
              label="Code"
              value={countryCode}
              list={countryCodeList}
              onChange={(e: any, v: any) => setCountryCode(v)}
            />
          </GridDX>
          <GridDX
            item
            xs={7}
            style={{ justifyContent: "center", flexDirection: "column" }}
          >
            <TextFieldDX
              label="Mobile Number"
              type="number"
              onInput={(e: any) => {
                if (countryCode.id === "92") {
                  e.target.value = parseInt(e.target.value)
                    .toString()
                    .slice(0, 10);
                } else e.target.value = e.target.value.toString().slice(0, 15);
              }}
              value={number}
              onChange={(e: any) => setNumber(e.target.value)}
            />
          </GridDX>
          <GridDX
            item
            xs={12}
            style={{ flexDirection: "column", marginTop: 16 }}
          >
            <LoadingButtonDX loading={isLoading} fullWidth onClick={login}>
              Login
            </LoadingButtonDX>
          </GridDX>
        </GridDX>
      )}

      {mode === 1 && showOTPEntryStep()}
    </Container>
  );
};

export default Login;
