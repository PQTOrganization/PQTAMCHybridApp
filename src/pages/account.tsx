import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import AMCLogo from "../asset/pqamc_trans_logo.png";

import { useAuthContext } from "../context/authcontext";
import { useErrorContext } from "../context/errorcontext";
import { useConfigContext } from "../context/configcontext";

import GridDX from "../components/layout/griddx";
import TextFieldDX from "../components/controls/textfielddx";
import CountryListDX from "../components/controls/countrylistdx";
import ButtonDX from "../components/controls/buttondx";
import LoadingButtonDX from "../components/controls/loadingbuttondx";

import { countryCodeList } from "../shared/lookups";
import { sendOTP, register, verifyOTP } from "../shared/services/auth";
import {
  formatTimerToMinAndSecs,
  isEmail,
  openURLInBrowser,
} from "../shared/global";

const Account = () => {
  const links = [
    {
      code: 0,
      title: "Investment Products",
      
      link: "https://pqamcl.com/product-broachers/",
    },
    {
      code: 1,
      title: "Fund Performance Report",
      link: "https://pqamcl.com/download-2/fund-manager-reports/",
    },
    {
      code: 2,
      title: "Calculator",
      link: "https://pqamcl.com/investor-services/investments-calculator/",
    },
    {
      code: 3,
      title: "What We Offer",
      link: "https://pqamcl.com/what-we-offer/",
    },
  ];

  const navigate = useNavigate();

  const { isLoggedIn, signIn, getUserDetails } = useAuthContext();
  const { setError } = useErrorContext();
  const { RESEND_TIMER } = useConfigContext();

  const [mode, setMode] = useState(0);
  const [lastMode, setLastMode] = useState(1);
  const [countryCode, setCountryCode] = useState({ id: "", value: "" });
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_TIMER);

  let isSubscribed = true;
  let timeOutRef: any;

  useEffect(() => {
    if (isLoggedIn) {
      getUserDetails().then((userDetails: any) => {
        if (
          userDetails.currentFolioNumber &&
          userDetails.currentFolioNumber > 0
        )
          navigate("/dashboard");
        else navigate("/onboard");
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setCountryCode({ id: "92", value: "92" });
  }, [countryCodeList]);

  useEffect(() => {
    if (mode === 3) {
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

  const mobileNumberField = () => (
    <TextFieldDX
      label="Mobile Number"
      type="number"
      onInput={(e: any) => {
        if (countryCode.id === "92") {
          e.target.value = parseInt(e.target.value).toString().slice(0, 10);
        } else e.target.value = e.target.value.toString().slice(0, 15);
      }}
      value={number}
      onChange={(e: any) => setNumber(e.target.value)}
    />
  );

  const showNewOrExistingAccountStep = () => {
    return (
      <GridDX container sx={{ height: "100%" }}>
        <GridDX item xs={12} style={{ justifyContent: "center" }}>
          <img src={AMCLogo} alt="Logo" height={150} />
        </GridDX>
        <GridDX item xs={12} style={{ flexDirection: "column" }}>
          {links.map((item) => {
            return (
              <ButtonDX
                sx={{ my: 2, mt: 3 }}
                onClick={() => openURLInBrowser(item.link)}
              >
                {item.title}
              </ButtonDX>
            );
          })}
          <ButtonDX sx={{ my: 2, mt: 3 }} onClick={() => setMode(1)}>
            Open New Account
          </ButtonDX>
          <Typography
            variant="h6"
            style={{ textAlign: "center", marginTop: 32, marginBottom: 8 }}
          >
            Already have an Account
          </Typography>
          <ButtonDX
            style={{ marginTop: 8, marginBottom: 8 }}
            variant="contained"
            onClick={() => navigate("/login")}
          >
            Sign In
          </ButtonDX>
        </GridDX>
      </GridDX>
    );
  };

  const showNewAccountStep = () => {
    return (
      <GridDX container spacing={2} style={{ alignItems: "center" }}>
        <GridDX item xs={12} style={{ justifyContent: "center" }}>
          <img src={AMCLogo} alt="Logo" width={150} />
        </GridDX>
        <GridDX item xs={12} style={{ justifyContent: "center" }}>
          <Typography variant="h5" style={{ textAlign: "center" }}>
            Open a New Account
          </Typography>
        </GridDX>
        <GridDX item xs={12}>
          <Typography variant="body1" style={{ textAlign: "center" }}>
            New to Investments ? Click below to open an account
          </Typography>
        </GridDX>
        <GridDX item xs={12} style={{ justifyContent: "center" }}>
          <ButtonDX fullWidth variant="contained" onClick={() => setMode(2)}>
            Create Account
          </ButtonDX>
        </GridDX>
        <GridDX item xs={12} style={{ justifyContent: "center" }}>
          <Typography variant="h5" style={{ textAlign: "center" }}>
            OR
          </Typography>
        </GridDX>
        <GridDX item xs={12} style={{ justifyContent: "center" }}>
          <Typography variant="h5" style={{ textAlign: "center" }}>
            Complete an Existing Account Application
          </Typography>
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
        <GridDX item xs={7}>
          {mobileNumberField()}
        </GridDX>
        <GridDX item xs={12} style={{ justifyContent: "center" }}>
          <LoadingButtonDX loading={isLoading} fullWidth onClick={login}>
            Login
          </LoadingButtonDX>
        </GridDX>
      </GridDX>
    );
  };

  const showAccountCreateStep = () => {
    return (
      <GridDX container spacing={2} style={{ alignItems: "center" }}>
        <GridDX item xs={12} style={{ justifyContent: "center" }}>
          <Typography variant="body1" style={{ textAlign: "center" }}>
            Welcome to
          </Typography>
        </GridDX>
        <GridDX item xs={12} style={{ justifyContent: "center" }}>
          <Typography variant="h5" style={{ textAlign: "center" }}>
            Digital Account Opening
          </Typography>
        </GridDX>
        <GridDX item xs={12} style={{ justifyContent: "center" }}>
          <Typography variant="body1" style={{ textAlign: "center" }}>
            Now you can open your regular account from the comfort of your home
          </Typography>
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
        <GridDX item xs={7}>
          {mobileNumberField()}
        </GridDX>
        <GridDX item xs={12}>
          <TextFieldDX
            label="Email"
            onInput={() => {}}
            value={email}
            onChange={(e: any) => setEmail(e.target.value?.trim())}
          />
        </GridDX>
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
              setMode(1);
              setLastMode(1);
            }}
          >
            Close
          </ButtonDX>
          <ButtonDX variant="contained" onClick={onRegisterClick}>
            Proceed
          </ButtonDX>
        </GridDX>
      </GridDX>
    );
  };

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
            type="number"
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
            disabled={seconds === "00"}
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
      verifyOTP(otp, countryCode.id + "" + number)
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
          };
          signIn(data, authData.tokenInfo.token);
          if (authData.userApplicationId > 0) navigate("/onboard");
          else navigate("/accounttype");
        })
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    } else setError("Please provide a valid OTP");
  };

  const isPhoneNumberValid = () => {
    // length should be 10 for PK otherwise should be 8 or greater
    return (
      (countryCode.id === "92" && number.length !== 10) ||
      (countryCode.id !== "92" && number.length < 6)
    );
  };

  const login = async () => {
    if (!number) {
      setError("Please provide mobile number");
      return;
    }

    if (isPhoneNumberValid()) {
      setError("Please provide a valid mobile number");
      return;
    }

    setIsLoading(true);
    sendOTP(countryCode.id + "" + number)
      .then(() => setMode(3))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  const onRegisterClick = () => {
    if (!number) {
      setError("Please provide mobile number");
      return;
    }

    // length should be 10 for PK otherwise should be 8 or greater
    if (isPhoneNumberValid()) {
      setError("Please provide a valid mobile number");
      return;
    }

    if (!isEmail(email)) {
      setError("Please provide a valid email address");
      return;
    }

    setIsLoading(true);
    register(countryCode.id + "" + number, email)
      .then(() => {
        setLastMode(2);
        setMode(3);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  const resendOTP = () => {
    setIsLoading(true);
    sendOTP(countryCode.id + "" + number)
      .then(() => setSeconds(RESEND_TIMER))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return (
    <Container sx={{ display: "flex", height: "100vh", py: 2 }}>
      {mode === 0 && showNewOrExistingAccountStep()}

      {mode === 1 && showNewAccountStep()}
      {mode === 2 && showAccountCreateStep()}
      {mode === 3 && showOTPEntryStep()}
    </Container>
  );
};

export default Account;
