import React, { useState, useEffect } from "react";
import {
  useTheme,
  useMediaQuery,
  Container,
  Stepper,
  Step,
  StepButton,
  StepContent,
  Typography,
  StepLabel,
  Grid,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import {
  VisibilityOutlined,
  Check,
  ErrorOutline as ErrorOutlineIcon,
} from "@mui/icons-material";

import Loading from "../loading";

import Basic from "./steps/basic";
import Personal from "./steps/personal";
import Bank from "./steps/bank";
import KYC from "./steps/kyc";
import Additional from "./steps/additional";
import AdditionalKYC from "./steps/additionalkyc";
import FATCA from "./steps/fatca";
import CRS1 from "./steps/crs1";
import Review from "./steps/review";
import DocUpload from "./steps/docupload";
import Declaration from "./steps/declaration";
import { onboardingData } from "../../shared/classes";
import { getDocumentList, initializeListData } from "../../shared/lookups";
import SubmitAlert from "../alerts/submitAlert";
import {
  ACT_CATEGORY_VPS,
  cleanMaskedInputValue,
  convertToAPIDate,
  totalSteps,
  translateAPIDataToFormData,
  VPSCategoryList,
} from "../../shared/global";
import Api from "../../shared/api/api";
import { useAuthContext } from "../../context/authcontext";
import { useErrorContext } from "../../context/errorcontext";
import { useValidationContext } from "../../context/validationcontext";
import {
  isAdditionalStepComplete,
  isAddKYCStepComplete,
  isBankStepComplete,
  isBasicStepComplete,
  isContributionDeclarationStepComplete,
  isContributionStepComplete,
  isCRSStepComplete,
  isDocUploadStepComplete,
  isFATCAStepComplete,
  isKYCStepComplete,
  isNomineesStepComplete,
  isPersonalStepComplete,
  isRiskProfileStepComplete,
} from "../../shared/completionChecker";
import { accountCategoryList } from "../../shared/lookups";
import SalesRepresentative from "./steps/salesrepresentative";
import Contribution from "./steps/contribution";
import ContributionDeclaration from "./steps/contdeclaration";
import ContributionNominee from "./steps/contributionnominee";
import RiskProfile from "./steps/riskprofile";
import useUserApplicationService from "../../shared/services/userapplicationservice";
import useUserApplicationDiscrepancyService from "../../shared/services/userapplicationdiscrepancyservice";

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
  },
  active: {
    color: "#35489C",
  },
  text: {
    color: "#fff",
    textAlign: "center",
    // marginLeft: 5,
    margin: "auto",
  },
  circle: {
    borderRadius: "50%",
    backgroundColor: "currentColor",
    display: "flex",
    alignItems: "center",
    zIndex: 1,
    fontSize: 20,
    width: "1.3em",
    height: "1.3em",
    textAlign: "center",
  },
  completed: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
    zIndex: 1,
    fontSize: 20,
    width: "1.3em",
    height: "1.3em",
    borderRadius: "50%",
    backgroundColor: "green",
    textAlign: "center",
  },
  inCompleted: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
    zIndex: 1,
    fontSize: 20,
    width: "1.3em",
    height: "1.3em",
    borderRadius: "50%",
    backgroundColor: "orange",
    textAlign: "center",
  },
});

const generalStyles = makeStyles({
  loadingError: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    textAlign: "center",
    justifyContent: "center",
    height: "200px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "red",
  },
  backButton: {
    position: "fixed",
    top: 0,
    right: 0,
    margin: 10,
    zIndex: 999,
    marginTop: 12,
    backgroundColor: "gray",
  },
});

function QontoStepIcon(props: any) {
  const classes = useQontoStepIconStyles();
  const { active, completed, inComplete, index, isActive, icon } = props;

  var check =
    icon === "general" ? (
      <Check className={classes.completed} />
    ) : (
      <VisibilityOutlined className={classes.completed} />
    );
  var incomplete =
    icon === "general" ? (
      <ErrorOutlineIcon className={classes.inCompleted} />
    ) : icon === "preview" ? (
      <VisibilityOutlined className={classes.inCompleted} />
    ) : (
      <VisibilityOutlined className={classes.inCompleted} />
    );

  return (
    <div
      className={clsx(
        classes.root,
        {
          [classes.active]: index === active,
        },
        isActive ? classes.active : null
      )}
    >
      {completed ? (
        check
      ) : inComplete ? (
        incomplete
      ) : (
        <div className={classes.circle}>
          <Typography className={classes.text}>{index + 1}</Typography>
        </div>
      )}
    </div>
  );
}

const Onboarding = (props: any) => {
  const theme = useTheme();
  const useMobileView = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = generalStyles();

  const {
    getUserDetails,
    updateUserApplicationId,
    getToken,
    updateUserApplicationStatus,
    setDiscrepantData,
  } = useAuthContext();
  const { setError } = useErrorContext();
  const { clearValidationData, validateStepData } = useValidationContext();
  const { getUserApplication, addUserApplication, updateUserApplication } =
    useUserApplicationService();
  const { getForUserApplication } = useUserApplicationDiscrepancyService();

  const [data, setOnboardingData] = useState<any | null>(onboardingData);
  const [initializing, setInitializing] = useState(false);
  const [crntStepNumber, setStepNumber] = useState(0);

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const [submitAlert, setSubmitAlert] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const [steps, setSteps] = useState(totalSteps);
  const [availableSteps, setAvailableSteps] = useState<any>([]);
  const [isNewApplication, setNewApplication] = useState(false);
  const [salesRepPageDone, setSalesRepPageDone] = useState(false);
  const [contDeclDone, setContDeclDone] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (data && initializing) {
      evaluateStepsCompletion();
      setOptionalStepsVisibility();
    }
  }, [data, initializing]);

  useEffect(() => {
    setAvailableSteps(steps.filter((step: any) => step.required === true));
  }, [steps]);

  const initialize = async () => {
    const token = "";

    setInitializing(true);

    // clean any validations erros within the session
    clearValidationData();

    initializeListData(token)
      .then(() => {
        return getUserDetails().then((userData: any) => {
          if (userData.userApplicationId > 0) {
            return getUserApplication(userData.userApplicationId)
              .then(async (applicationData) => {
                // discrepancy
                if (applicationData.applicationStatusId === 2) {
                  await getForUserApplication(applicationData.userApplicationId)
                    .then((discrepentData) => {
                      console.log({ discrepentData });
                      const fieldsArray =
                        discrepentData.discrepantFields.split(",");
                      setDiscrepantData(fieldsArray);
                    })
                    .catch((err) => {
                      console.log(err);
                      setDiscrepantData(null);
                    });
                }

                return translateAPIDataToFormData(applicationData).then(
                  (transData) => {
                    setOnboardingData(transData);
                    console.log({ transData });
                    return validateStepData(transData, crntStepNumber, false);
                  }
                );
              })
              .catch((ex) => {
                console.log(ex);
                setError(ex);
              });
          } else {
            setNewApplication(true);
            let newOnboardingData;
            let item = accountCategoryList.filter(
              (item: any) => item.id === props.accountTypeID
            );
            if (item) {
              if (item.id != ACT_CATEGORY_VPS) {
                newOnboardingData = {
                  ...onboardingData,
                  userId: userData.userId,
                  userApplicationId: userData.userApplicationId,
                  accountCategoryId: item[0],
                  fundPreference: "",
                  expectedRetirementAge: null,
                  vpsFundId: null,
                };
              } else {
                newOnboardingData = {
                  ...onboardingData,
                  userId: userData.userId,
                  userApplicationId: userData.userApplicationId,
                  accountCategoryId: item[0],
                };
              }
            }

            // New application and international mobile number
            if (
              userData.mobileNumber &&
              userData.mobileNumber.length > 1 &&
              userData.mobileNumber.substring(0, 2) !== "92"
            )
              // International number
              setOnboardingData({
                ...newOnboardingData,
                contactOwnershipId: {
                  id: "4",
                  value: "International mobile number",
                },
              });
            else setOnboardingData(newOnboardingData);
          }
        });
      })
      .finally(() => setInitializing(false));
  };

  const evaluateStepsCompletion = () => {
    const crntSteps = steps.slice();

    crntSteps.forEach((s: any) => {
      switch (s.id) {
        case 1:
          s.complete = isBasicStepComplete(data);
          break;
        case 2:
          s.complete = isPersonalStepComplete(data);
          break;
        case 3:
          s.complete = isBankStepComplete(data);
          break;
        case 4:
          s.complete = isKYCStepComplete(data);
          break;
        case 5:
          s.complete = isAdditionalStepComplete(data);
          break;
        case 6:
          s.complete =
            data.isPoliticallyExposedPerson && isAddKYCStepComplete(data);
          break;
        case 7:
          s.complete = data.isUSResident && isFATCAStepComplete(data);
          break;
        case 8:
          s.complete = data.isNonPakTaxResident && isCRSStepComplete(data);
          break;
        case 9:
          s.complete = salesRepPageDone;
          break;
        case 10:
          s.complete = isContributionStepComplete(data);
          break;
        case 11:
          s.complete = contDeclDone; //isContributionDeclarationStepComplete(data);
          break;
        case 12:
          s.complete = isRiskProfileStepComplete(data);
          break;
        case 13:
          s.complete = isNomineesStepComplete(data);
          break;
        case 14:
          s.complete = data.allDocsUploaded;
          break;
        case 15:
          if (crntStepNumber >= availableSteps.length - 2) s.complete = true;
          else s.complete = false;
          break;
        case 16:
          if (crntStepNumber > 12) s.complete = true;
          else s.complete = false;
          break;
        default:
          s.complete = false;
      }
    });

    setSteps(crntSteps);
  };

  const setOptionalStepsVisibility = () => {
    const crntSteps = steps.slice();

    let isVPSAccount = VPSCategoryList.includes(data.accountCategoryId?.id);
    crntSteps[5].required = data.isPoliticallyExposedPerson;
    crntSteps[6].required = data.isUSResident;
    crntSteps[7].required = data.isNonPakTaxResident;

    crntSteps[9].required = isVPSAccount;
    crntSteps[10].required = isVPSAccount;
    crntSteps[11].required = isVPSAccount;
    crntSteps[12].required = isVPSAccount;

    setSteps(crntSteps);
  };

  const saveAccountData = async () => {
    //setSaveError(false);
    var result = false;

    // this is necessary so that if somebody changes mind from yes => no => yes
    if (!data.isPoliticallyExposedPerson) {
      data.isHeadOfState = false;
      data.isHeadOfGovt = false;
      data.isSeniorPolitician = false;
      data.isSeniorGovtOfficial = false;
      data.isSeniorJudicialOfficial = false;
      data.isSeniorMilitaryOfficial = false;
      data.isSeniorExecSOC = false;
      data.isImportantPoliticalPartyOfficial = false;
      data.isSeniorExecIO = false;
      data.isMemberOfBOIO = false;
    }

    console.log("data before save:", data);

    // we want to make sure that if no sources of income are defined the array will have one element of ''
    const newSourceOfIncomeValue =
      data.sourceOfIncome && data.sourceOfIncome.length > 0
        ? data.sourceOfIncome.map((x: any) => {
            if (x === 0) return 0;
            else return x.id;
          })
        : [];

    var info = {
      ...data,
      accountCategoryId: data.accountCategoryId
        ? data.accountCategoryId.id
        : null,
      genderId: data.genderId ? data.genderId.id : null,
      cnic: cleanMaskedInputValue(data.cnic), // cleaning necessary due to old saved data
      dateOfBirth: convertToAPIDate(data.dateOfBirth),
      cnicIssueDate: convertToAPIDate(data.cnicIssueDate),
      cnicExpiryDate: convertToAPIDate(data.cnicExpiryDate),
      contactOwnershipId: data.contactOwnershipId
        ? data.contactOwnershipId.id
        : null,
      //AcctPreference: data.fundPreference ? data.fundPreference.id : "",
      expectedRetirementAge:
        data.accountCategoryId &&
        VPSCategoryList.includes(data.accountCategoryId.id) &&
        data.expectedRetirementAge
          ? data.expectedRetirementAge.id
          : null,

      vpsFundId:
        data.accountCategoryId &&
        VPSCategoryList.includes(data.accountCategoryId.id) &&
        data.vpsFundId
          ? data.vpsFundId.id
          : null,
      debtSubFund:
        data.accountCategoryId &&
        VPSCategoryList.includes(data.accountCategoryId.id) &&
        data.vpsFundId
          ? data.debtSubFund
          : null,
      equitySubFund:
        data.accountCategoryId &&
        VPSCategoryList.includes(data.accountCategoryId.id) &&
        data.vpsFundId
          ? data.equitySubFund
          : null,
      moneyMarketSubFund:
        data.accountCategoryId &&
        VPSCategoryList.includes(data.accountCategoryId.id) &&
        data.vpsFundId
          ? data.moneyMarketSubFund
          : null,
      // PlanSno:
      //   data.accountCategoryId && data.accountCategory.id !== 1 && data.vpsfund
      //     ? data.vpsfund.id
      //     : "",

      residentialStatusId: data.residentialStatusId
        ? data.residentialStatusId.id
        : null,
      countryOfResidenceId: data.countryOfResidenceId
        ? data.countryOfResidenceId.id
        : null,
      cityOfResidenceId: data.cityOfResidenceId
        ? data.cityOfResidenceId.id
        : null,
      areaId: null, // data.areaId ? data.areaId.id : null,
      nationalityId: data.nationalityId ? data.nationalityId.id : null,
      countryOfBirthId: data.countryOfBirthId ? data.countryOfBirthId.id : null,
      cityOfBirthId: data.cityOfBirthId ? data.cityOfBirthId.id : null,
      isNonMuslim: data.isZakatDeduction ? false : data.isNonMuslim === "true",

      bankId: data.bankId ? data.bankId.id : null,
      ibanNumber: cleanMaskedInputValue(data.ibanNumber), // cleaning necessary due to old saved data

      educationId: data.educationId ? data.educationId.id : null,
      occupationId: data.occupationId ? data.occupationId.id : null,
      professionId: data.professionId ? data.professionId.id : null,
      annualIncomeId: data.annualIncomeId ? data.annualIncomeId.id : null,
      sourceOfIncome: newSourceOfIncomeValue,

      natureOfPEPId:
        data.isPoliticallyExposedPerson && data.natureOfPEPId
          ? data.natureOfPEPId.id
          : null,
      pepNameOfFamilyMember:
        data.isPoliticallyExposedPerson && data.natureOfPEPId
          ? data.natureOfPEPId.id === 2
            ? data.pepNameOfFamilyMember
            : ""
          : "",
      pepNameOfCloseAssociate:
        data.isPoliticallyExposedPerson && data.natureOfPEPId
          ? data.natureOfPEPId.id === 3
            ? data.pepNameOfCloseAssociate
            : ""
          : "",
      pepNatureOfDepartment:
        data.isPoliticallyExposedPerson && data.natureOfPEPId
          ? data.pepNatureOfDepartment
          : "",
      pepDesignation:
        data.isPoliticallyExposedPerson && data.natureOfPEPId
          ? data.pepDesignation
          : "",
      pepGrade:
        data.isPoliticallyExposedPerson && data.natureOfPEPId
          ? data.pepGrade
          : "",

      w9Address: data.isUSResident ? data.w9Address : "",
      w9TIN: data.isUSResident ? data.w9TIN : "",
      w9SSN: data.isUSResident ? data.w9SSN : "",
      w9EIN: data.isUSResident ? data.w9EIN : "",
      isCertify: data.isUSResident && data.isCertify,

      countryOfTaxId:
        data.isNonPakTaxResident && data.countryOfTaxId
          ? data.countryOfTaxId.id
          : null,
      isTINAvailable: data.isNonPakTaxResident && data.isTINAvailable,
      tinNumber:
        data.isNonPakTaxResident && data.isTINAvailable ? data.tinNumber : "",
      tinReasonId:
        data.isNonPakTaxResident && !data.isTINAvailable
          ? Number(data.tinReasonId)
          : null,
      tinReasonDetail:
        data.isNonPakTaxResident &&
        !data.isTINAvailable &&
        data.tinReasonId === "2"
          ? data.tinReasonDetail
          : "",
      modeOfContribution: data.modeOfContribution
        ? data.modeOfContribution.id
        : null,
      contributionPaymentMode: data.contributionPaymentMode
        ? data.contributionPaymentMode.id
        : null,
      contributionFrequency: data.contributionFrequency
        ? data.contributionFrequency.id
        : null,
      frontEndLoad: data.frontEndLoad ? data.frontEndLoad : null,
      periodicContributionAmount: data.periodicContributionAmount
        ? data.periodicContributionAmount
        : null,
      initialContributionAmount: data.initialContributionAmount
        ? data.initialContributionAmount
        : null,
      yearlyContributionAmount: data.yearlyContributionAmount
        ? data.yearlyContributionAmount
        : null,
      drawnOn: data.drawnOn ? data.drawnOn.value : null,
    };

    const token = getToken();
    console.log("api data to save", info);
    if (info.userApplicationId === 0) {
      setLoading(true);

      await addUserApplication(info)
        .then((response) => {
          setOnboardingData({
            ...data,
            userApplicationId: response.userApplicationId,
          });
          updateUserApplicationId(response.userApplicationId);

          result = true;
        })
        .catch((ex) => {
          console.log(ex);
          setError(ex);
          setOnboardingData({ ...data, isFinalSubmit: false });
        })
        .finally(() => setLoading(false));
    }

    if (info.userApplicationId > 0) {
      // await Api("UserApplication/" + info.userApplicationId, info, "PUT", token)
      await updateUserApplication(info.userApplicationId, info)
        .then((response) => {
          // banking
          if (crntStepNumber === 2) {
            setOnboardingData({
              ...data,
              userBankId: response.userBankId,
            });
          }

          result = true;
        })
        .catch((ex) => {
          console.log(ex);
          setError(ex);
          setOnboardingData({ ...data, isFinalSubmit: false });
        })
        .finally(() => setLoading(false));
    }

    return result;
  };

  const gotoNext = async (resetNav: any) => {
    const isLastStep = crntStepNumber === availableSteps.length - 1;

    if (isLastStep) {
      const allIncompleteSteps = steps.filter(
        (x) => !x.complete && x.required && x.id <= 15
        // x.id <= 9
      );

      if (allIncompleteSteps.length > 0) {
        const stepNames: string = allIncompleteSteps
          .map((x, index) => {
            return index + 1 + ". " + x.name;
          })
          .join("\n");

        showSubmitAlert(stepNames);

        data.isFinalSubmit = false;

        return;
      } else data.isFinalSubmit = true;
    }

    // don't do anything on pressing next for document page
    if (
      availableSteps[crntStepNumber].id === 13 ||
      availableSteps[crntStepNumber].id === 14
    )
      setStepNumber(crntStepNumber + 1);
    else if (await saveAccountData()) {
      console.log({ isLastStep });

      if (isLastStep) {
        await updateUserApplicationStatus(1);
      } else {
        await validateStepData(data, crntStepNumber, isNewApplication);

        evaluateStepsCompletion();

        const newSteps = steps.slice();

        const fatcaIndex = newSteps.findIndex((x) => x.id === 7);

        newSteps[fatcaIndex - 1].required = data.isPoliticallyExposedPerson;
        newSteps[fatcaIndex].required = data.isUSResident;
        newSteps[fatcaIndex + 1].required = data.isNonPakTaxResident; // crs1

        setOptionalStepsVisibility();

        if (data.isUSResident) data.w9Name = data.name;

        setSteps(newSteps);
        setStepNumber(crntStepNumber + 1);
      }
    }

    if (resetNav) resetNav();
  };

  const gotoPrevious = async () => {
    if (crntStepNumber > 0) {
      // don't do anything on pressing back for preview page
      if (availableSteps[crntStepNumber].id === 10)
        setStepNumber(crntStepNumber - 1);
      else if (await saveAccountData()) {
        await validateStepData(data, crntStepNumber, isNewApplication);

        evaluateStepsCompletion();

        setStepNumber(crntStepNumber - 1);
      }
    }
  };

  const gotoStep = async (stepId: number) => {
    const stepNumber = availableSteps.findIndex(
      (step: any) => step.id === stepId
    );
    if (crntStepNumber >= stepNumber) setStepNumber(stepNumber);
  };

  const getCurrentStepComponent = (stepNumber: number = -1) => {
    const stepNumberToUse = stepNumber === -1 ? crntStepNumber : stepNumber;
    let available = availableSteps[stepNumberToUse];
    const stepId = available && available.id ? available.id : 1;

    switch (stepId) {
      case 1:
        return (
          <Basic
            data={data}
            // saveError={saveError}
            // updateWithData={updateWithOldUserData}
            onNextAction={gotoNext}
            onChangeAction={onHandleChange}
          />
        );
      case 2:
        return (
          <Personal
            data={data}
            // saveError={saveError}
            onPrevAction={gotoPrevious}
            onNextAction={gotoNext}
            onChangeAction={onHandleChange}
            onMultiChangeAction={onHandleMultipleChange}
          />
        );
      case 3:
        return (
          <Bank
            data={data}
            // saveError={saveError}
            onPrevAction={gotoPrevious}
            onNextAction={gotoNext}
            onChangeAction={onHandleChange}
            onMultiChangeAction={onHandleMultipleChange}
          />
        );
      case 4:
        return (
          <KYC
            data={data}
            // saveError={saveError}
            onPrevAction={gotoPrevious}
            onNextAction={gotoNext}
            onChangeAction={onHandleChange}
            // handleBeneficiary={handleBeneficiary}
          />
        );
      case 5:
        return (
          <Additional
            //data={data}
            // saveError={saveError}
            onPrevAction={gotoPrevious}
            onNextAction={gotoNext}
            onChangeAction={onHandleChange}
            // handleCheckedBox={forPersonalCheckedBox}
          />
        );
      case 6:
        return (
          <AdditionalKYC
            data={data}
            // saveError={saveError}
            onPrevAction={gotoPrevious}
            onNextAction={gotoNext}
            onChangeAction={onHandleChange}
            // handleCheckedBox={forPersonalCheckedBox}
            // gotoStep={gotoStep}
          />
        );
      case 7:
        return (
          <FATCA
            data={data}
            onPrevAction={gotoPrevious}
            onNextAction={gotoNext}
            onChangeAction={onHandleChange}
          />
        );
      case 8:
        return (
          <CRS1
            data={data}
            // saveError={saveError}
            onPrevAction={gotoPrevious}
            onNextAction={gotoNext}
            onChangeAction={onHandleChange}
          />
        );
      case 9:
        return (
          <SalesRepresentative
            data={data}
            // saveError={saveError}
            onStepComplete={() => {
              setSalesRepPageDone(true);
            }}
            onPrevAction={gotoPrevious}
            onNextAction={gotoNext}
            onChangeAction={onHandleChange}
          />
        );
      case 10:
        return (
          <Contribution
            data={data}
            // saveError={saveError}
            onPrevAction={gotoPrevious}
            onNextAction={gotoNext}
            onChangeAction={onHandleChange}
          />
        );
      case 11:
        return (
          <ContributionDeclaration
            data={data}
            onStepComplete={() => {
              setContDeclDone(true);
            }}
            onPrevAction={gotoPrevious}
            onNextAction={gotoNext}
            onChangeAction={onHandleChange}
          />
        );
      case 12:
        return (
          <RiskProfile
            data={data}
            // saveError={saveError}
            onPrevAction={gotoPrevious}
            onNextAction={gotoNext}
            onChangeAction={onRiskProfileUpdate}
          />
        );
      case 13:
        return (
          <ContributionNominee
            data={data}
            // saveError={saveError}
            onPrevAction={gotoPrevious}
            onNextAction={gotoNext}
            onChangeAction={onHandleChange}
          />
        );
      case 14:
        return (
          <DocUpload
            data={data}
            // saveError={saveError}
            onPrevAction={gotoPrevious}
            onNextAction={gotoNext}
            onChangeAction={onHandleChange}
          />
        );
      case 15:
        return (
          <Review
            data={data}
            // showAddKYC={data.isPoliticallyExposedPerson}
            // showFATCA={data.isUSResident}
            // showCRS={data.isNonePakTaxResident}
            // handleCheckedBox={forPersonalCheckedBox}
            showContribution={VPSCategoryList.includes(
              data.accountCategoryId.id
            )}
            onChangeAction={onHandleChange}
            onPrevAction={gotoPrevious}
            onNextAction={gotoNext}
            gotoStep={gotoStep}
          />
        );
      case 16:
        return (
          <Declaration
            data={data}
            onPrevAction={gotoPrevious}
            onNextAction={gotoNext}
            onChangeAction={onHandleChange}
          />
        );
      default:
        return <></>;
    }
  };

  const onRiskProfileUpdate = async (profile: any, score: number) => {
    let str = JSON.stringify(profile);
    let newData = {
      ...data,
      totalScore: score,
      riskProfile: JSON.stringify(profile),
    };
    setOnboardingData(newData);
  };

  const onHandleChange = async ({ target }: any, v: any) => {
    let newData = {};

    if (v !== undefined && target.id !== undefined) {
      let name = target.id.split("-");

      if (name[0] === "vpsFundId") {
        newData = {
          ...data,
          [name[0]]: v,
          debtSubFund: v.debtSubFund,
          equitySubFund: v.equitySubFund,
          moneyMarketSubFund: v.moneyMarketSubFund,
        };
      } else {
        newData = {
          ...data,
          [name[0]]: v,
        };
      }
    } else if (target.type === "checkbox") {
      newData = {
        ...data,
        [target.name]: target.checked,
      };
    } else {
      let cleanedValue = target.value;

      // data is coming from masked input
      if (target.name === "ibanNumber" || target.name === "cnic")
        cleanedValue = cleanMaskedInputValue(target.value);
      newData = {
        ...data,
        [target.name]: cleanedValue,
      };
    }

    setOnboardingData(newData);
  };

  const onHandleMultipleChange = (value: any) => {
    let newData = { ...data };

    value.map((e: any) => {
      if (e.type === "checkbox") {
        newData = {
          ...newData,
          [e.name]: e.checked,
        };
      } else {
        newData = {
          ...newData,
          [e.name]: e.value,
        };
      }
      return null;
    });

    setOnboardingData(newData);
  };

  const showSubmitAlert = (stepsDetail: string) => {
    setSubmitMessage(stepsDetail);
    setSubmitAlert(true);
  };

  const hideSubmitAlert = () => {
    setSubmitAlert(false);
    setSubmitMessage("");
  };

  return (
    <Container>
      <SubmitAlert
        open={submitAlert}
        stepsDetail={submitMessage}
        handleClose={hideSubmitAlert}
      />

      <Grid container spacing={1} style={{}}>
        {initializing ? (
          <Loading />
        ) : data ? (
          <Grid container>
            <Grid item xs={12}>
              <Stepper
                nonLinear
                alternativeLabel={!useMobileView}
                activeStep={crntStepNumber}
                orientation={useMobileView ? "vertical" : "horizontal"}
                style={
                  useMobileView ? {} : { paddingTop: 16, paddingBottom: 16 }
                }
              >
                {availableSteps.map((step: any, index: number) => {
                  return (
                    <Step key={"stepNum_" + index} completed={step.complete}>
                      <StepButton
                        onClick={() => gotoStep(step.id)}
                        optional={
                          <Typography
                            style={{
                              fontSize: 10,
                              textAlign: useMobileView ? "left" : "center",
                            }}
                          >
                            {index === crntStepNumber
                              ? step.subtitle
                              : step.alterSubtitle}
                          </Typography>
                        }
                      >
                        <StepLabel
                          StepIconComponent={() => (
                            <QontoStepIcon
                              active={crntStepNumber}
                              completed={step.complete}
                              inComplete={!step.complete}
                              index={index}
                              isActive={step.active}
                              icon={step.icon}
                            />
                          )}
                        >
                          <Typography
                            style={{
                              fontSize: 14,
                              textAlign: useMobileView ? "left" : "center",
                            }}
                          >
                            {step.name}
                          </Typography>
                        </StepLabel>
                      </StepButton>
                      {useMobileView && (
                        <StepContent>
                          {getCurrentStepComponent(index)}
                        </StepContent>
                      )}
                    </Step>
                  );
                })}
              </Stepper>
            </Grid>
            <Grid item xs={12}>
              {!useMobileView && getCurrentStepComponent()}
            </Grid>
          </Grid>
        ) : (
          <div className={classes.loadingError}>
            Error loading application data. Please contact site administrator
          </div>
        )}
      </Grid>
    </Container>
  );
};

export default Onboarding;
