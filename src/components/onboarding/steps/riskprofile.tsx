import React, { useState, useEffect } from "react";
import { Typography, useMediaQuery, useTheme } from "@mui/material/";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Navigation from "../../controls/navigation";
import { useAuthContext } from "../../../context/authcontext";
import { useValidationContext } from "../../../context/validationcontext";
import GridDX from "../../layout/griddx";
import Profile from "./profile";
import content from "./riskprofilecontent.json";

const RiskProfile = (props: any) => {
  const { getUserDetails, inDiscrepancyMode, isDiscrepantField } =
    useAuthContext();

  const theme = useTheme();
  const useMobileView = useMediaQuery(theme.breakpoints.down("xs"));
  const { errors, validateField, validatevpsSubFundValues } =
    useValidationContext();

  const [userProfiles, setUserProfiles] = useState<any>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [riskProfile, setRiskProfile] = useState("");
  const [investorProfile, setInvestorProfile] = useState("");
  const [allocationScheme, setAllocationScheme] = useState("");

  const assignRiskProfile = (score: number) => {
    if (score >= 50) setRiskProfile("High");
    else if (score >= 36 && score < 50) setRiskProfile("Medium");
    else setRiskProfile("Low");
  };

  const assignInvestorProfile = (score: number) => {
    if (score >= 50) setInvestorProfile("Aggressive");
    else if (score >= 36 && score < 50) setInvestorProfile("Stable");
    else setInvestorProfile("Conservative");
  };

  const assignAllocationScheme = (score: number) => {
    if (score >= 50) setAllocationScheme("High Volatility");
    else if (score >= 36 && score < 50)
      setAllocationScheme("Medium Volatility");
    else setAllocationScheme("Low Volatility or Lower Volatility");
  };

  const calculateScore = (profiles: any) => {
    let score = 0;
    profiles.forEach((element: any) => {
      if (element.selectedOption) {
        let found = element.options.find(
          (opt: any) => opt.id == element.selectedOption
        );
        if (found) {
          score += found.score;
        }
      }
    });
    assignRiskProfile(score);
    assignInvestorProfile(score);
    assignAllocationScheme(score);
    setTotalScore(score);
    return score;
  };

  const onValueSelect = (index: number, e: any) => {
    let newProfile = [
      ...userProfiles.slice(0, index),
      { ...userProfiles[index], selectedOption: e.target.value },
      ...userProfiles.slice(index + 1),
    ];
    setUserProfiles(newProfile);
    let totalScore = calculateScore(newProfile);
    props.onChangeAction(newProfile, totalScore);
  };

  useEffect(() => {
    if (props.data?.riskProfile) {
      let prof = JSON.parse(props.data.riskProfile);
      setUserProfiles(prof);
      calculateScore(prof);
    } else {
      setUserProfiles(content);
    }
  }, [props.data]);

  const onNextClick = () => {
    validateField("riskProfile", props.data.riskProfile);
    props.onNextAction();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      {userProfiles && (
        <GridDX container>
          <GridDX item xs={12}>
            <Typography style={{ color: "#d32f2f", marginBottom: "5px" }}>
              {errors["riskProfile"]}
            </Typography>
          </GridDX>
          <GridDX item container xs={12}>
            {userProfiles.map((profile: any) => {
              return (
                <GridDX
                  item
                  xs={12}
                  style={{ border: "1px solid", borderCollapse: "collapse" }}
                >
                  <Profile
                    content={profile}
                    data={props.data}
                    onChange={onValueSelect}
                    readOnly={props.readOnly}
                  />
                </GridDX>
              );
            })}
          </GridDX>
          <GridDX container item mt={4} xs={12}>
            <GridDX item xs={3}>
              <Typography color="primary">Total Score: </Typography>
              <Typography> {totalScore}</Typography>
            </GridDX>
            <GridDX item xs={3}>
              <Typography color="primary">Risk Profile: </Typography>
              <Typography> {riskProfile}</Typography>
            </GridDX>
            <GridDX item xs={3}>
              <Typography color="primary">Investor Profile: </Typography>
              <Typography>{investorProfile}</Typography>
            </GridDX>
            <GridDX item xs={3}>
              <Typography color="primary">Allocation Scheme: </Typography>
              <Typography>{allocationScheme}</Typography>
            </GridDX>
          </GridDX>
          <GridDX item xs={12}>
            {!props.readOnly && (
              <Navigation
                onPrevAction={props.onPrevAction}
                onNextAction={onNextClick}
              />
            )}
          </GridDX>
        </GridDX>
      )}
    </LocalizationProvider>
  );
};

export default RiskProfile;
