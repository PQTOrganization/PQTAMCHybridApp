import { useEffect, useState } from "react";
import Loading from "../../components/loading";
import FormSubmitted from "../../components/onboarding/formsubmitted";
import Onboarding from "../../components/onboarding/onboarding";
import { useAuthContext } from "../../context/authcontext";
import { useErrorContext } from "../../context/errorcontext";
import { useNavigate, useLocation } from "react-router-dom";

const OnboardingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { getUserDetails, applicationStatus } = useAuthContext();
  const { setError } = useErrorContext();

  const [isLoading, setIsLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState(0);
  const [accountType, setAccountType] = useState(-1);

  useEffect(() => {
    if (location.state != null) {
      setAccountType(location?.state?.accountTypeID);
    } else {
      navigate("/accounttype");
    }
  }, []);

  console.log({ location });

  useEffect(() => {
    getUserDetails()
      .then((userData: any) => {
        if (
          userData.userApplicationId > 0 &&
          userData.applicationStatusId != 0 // Not In Progress
        )
          setDisplayMode(2);
        else setDisplayMode(1);
      })
      .catch((ex: any) => setError(ex))
      .finally(() => setIsLoading(false));
  }, [applicationStatus]);

  const addressDiscrepancy = () => {
    setDisplayMode(3);
  };

  if (displayMode === 1 || displayMode === 3)
    return <Onboarding accountTypeID={location?.state?.accountTypeID} />;
  else if (displayMode === 2)
    return (
      <FormSubmitted
        status={applicationStatus}
        onProceedAction={addressDiscrepancy}
      />
    );
  else return <Loading />;
};

export default OnboardingPage;
