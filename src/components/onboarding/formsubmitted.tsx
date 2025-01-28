import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/authcontext";

import ButtonDX from "../controls/buttondx";
import GridDX from "../layout/griddx";

const FormSubmitted = (props: any) => {
  const { status } = props;

  const navigate = useNavigate();
  const { signOut } = useAuthContext();

  const [data, setdata] = useState<any>(null);

  useEffect(() => {
    setThanksNessages();
  }, []);

  const btnLoginClick = () => {
    signOut();
    navigate("/login");
  };

  const btnMakeInvestmentClick = () => {
    navigate("/invest");
  };

  const btnOKClick = () => {
    signOut();
    navigate("/");
  };

  const btnProceedClick = () => {
    props.onProceedAction();
  };

  const setThanksNessages = () => {
    switch (status) {
      case 1:
        return setdata({
          thankMsg: (
            <h3 style={{ color: "#747474", marginBottom: 50 }}>
              Thank you for submitting your Application
            </h3>
          ),
          reviewMsg: (
            <div style={{ marginBottom: 50 }}>
              <h3 style={{ margin: 0 }}>
                Your details are under review, please check back shortly
              </h3>
            </div>
          ),
          videoSource: null,
          reviewAction: (
            <p style={{ margin: 0 }}>
              Kindly check your email for any updates regarding your application
            </p>
          ),
          actionBtn: (
            <ButtonDX sx={{ marginTop: 3, px: 5 }} onClick={btnOKClick}>
              OK
            </ButtonDX>
          ),
        });

      case 2:
        return setdata({
          thankMsg: "",
          reviewMsg: (
            <div
              style={{
                marginBottom: 40,
                marginTop: 40,
              }}
            >
              <h2>Dear Applicant</h2>
              <h3>
                Some of your info/documents submited seems to be incorrect
                kindly check and provide correct info/documents and resubmit
                your application.
              </h3>
            </div>
          ),
          reviewAction: (
            <>
              <p style={{ margin: 0, fontSize: 16 }}>
                For further info, please check your email or call us at
                <br />
                (+92-21)1111 2222 (12345)
              </p>
              <p style={{ margin: 5, fontSize: 16 }}>
                <Link style={{ color: "blue" }} to={""}>
                  info@pqamc.com
                </Link>
              </p>
            </>
          ),

          actionBtn: (
            <div
              style={{
                marginTop: 50,
              }}
            >
              <ButtonDX
                //onClick={btnCancelClicked}
                style={{ width: 125, marginRight: 20 }}
              >
                Cancel
              </ButtonDX>
              <ButtonDX onClick={btnProceedClick} style={{ width: 125 }}>
                Proceed
              </ButtonDX>
            </div>
          ),
        });

      case 3:
        return setdata({
          thankMsg: (
            <h3
              style={{
                marginBottom: 50,
                color: "#747474",
                textAlign: "center",
              }}
            >
              Your registration is successful.
            </h3>
          ),
          reviewMsg: "",
          videoSource: "",
          reviewAction: (
            <p style={{ margin: 0 }}>
              Please make investment to complete your registration.
            </p>
          ),
          actionBtn: (
            <ButtonDX
              style={{ marginTop: 20, paddingLeft: 60, paddingRight: 60 }}
              onClick={btnMakeInvestmentClick}
            >
              Make Investment
            </ButtonDX>
          ),
        });

      case 4:
        return setdata({
          thankMsg: "",
          reviewMsg: (
            <h3 style={{ color: "#747474", marginBottom: 50 }}>
              We regret to inform you that your account could not be accepted!
            </h3>
          ),
          videoSource: "",
          reviewAction: (
            <>
              <p style={{ margin: 0, fontSize: 16 }}>
                For further info, please check your email or call us at
                <br />
                (+92-21)1111 2222 (12345)
              </p>
              <p style={{ margin: 5, fontSize: 16 }}>
                <Link style={{ color: "blue" }} to={""}>
                  info@pqamc.com
                </Link>
              </p>
            </>
          ),
          actionBtn: (
            <div
              style={{
                marginTop: 20,
              }}
            >
              <ButtonDX style={{ width: 150 }} onClick={btnOKClick}>
                OK
              </ButtonDX>
            </div>
          ),
        });
      case 6:
        return setdata({
          thankMsg: (
            <h3
              style={{
                marginBottom: 50,
                color: "#747474",
                textAlign: "center",
              }}
            >
              Thank you for submitting your Investment
            </h3>
          ),
          reviewMsg: "",
          videoSource: "",
          reviewAction: (
            <p style={{ margin: 0 }}>
              Your details are under review, please check back shortly
            </p>
          ),
          actionBtn: (
            <ButtonDX
              style={{ marginTop: 20, paddingLeft: 60, paddingRight: 60 }}
              onClick={btnLoginClick}
            >
              Ok
            </ButtonDX>
          ),
        });
      case 7:
        return setdata({
          thankMsg: (
            <h3
              style={{
                marginBottom: 50,
                color: "#747474",
                textAlign: "center",
              }}
            >
              Your registration is successful & your account has been opened
            </h3>
          ),
          reviewMsg: "",
          videoSource: "",
          reviewAction: (
            <p style={{ margin: 0 }}>
              Kindly check your email for credentials to login below
            </p>
          ),
          actionBtn: (
            <ButtonDX
              style={{ marginTop: 20, paddingLeft: 60, paddingRight: 60 }}
              onClick={btnLoginClick}
            >
              Login
            </ButtonDX>
          ),
        });
      case 8:
        return setdata({
          thankMsg: "",
          reviewMsg: (
            <h3 style={{ color: "#747474", marginBottom: 50 }}>
              We regret to inform you that your account could not be accepted!
            </h3>
          ),
          videoSource: "",
          reviewAction: (
            <>
              <p style={{ margin: 0, fontSize: 16 }}>
                For further info, please check your email or call us at
                <br />
                (+92-21)1111 2222 (12345)
              </p>
              <p style={{ margin: 5, fontSize: 16 }}>
                <Link style={{ color: "blue" }} to={""}>
                  info@pqamc.com
                </Link>
              </p>
            </>
          ),
          actionBtn: (
            <ButtonDX
              style={{ marginTop: 20, paddingLeft: 60, paddingRight: 60 }}
              onClick={btnLoginClick}
            >
              Ok
            </ButtonDX>
          ),
        });
    }
  };

  return (
    data && (
      <GridDX
        container
        sx={{ width: "100%", color: "#747474" }}
        justifyContent="center"
        alignContent="center"
      >
        <GridDX item xs={12} justifyContent="center">
          {data.thankMsg}
        </GridDX>
        <GridDX item xs={12} justifyContent="center">
          {data.reviewMsg}
        </GridDX>
        <GridDX item xs={12} justifyContent="center">
          {data.videoSource}
        </GridDX>
        <GridDX item xs={12} justifyContent="center">
          {data.reviewAction}
        </GridDX>
        <GridDX item xs={12} justifyContent="center">
          {data.actionBtn}
        </GridDX>
      </GridDX>
    )
  );
};

export default FormSubmitted;
