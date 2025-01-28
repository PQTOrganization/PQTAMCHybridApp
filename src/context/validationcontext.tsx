import React, { createContext, useContext, useState } from "react";
import { ReactNode } from "react";
import moment from "moment";
import {
  ACT_CATEGORY_VPS,
  MAXIMUM_FRONT_END_LOAD,
  MINIMUM_CONTRIBUTION_AMOUNT,
  VPSCategoryList,
} from "../shared/global";

const ValidationContext = createContext<any | null>(null);
const useValidationContext = () => useContext(ValidationContext);

interface AuxProps {
  children: ReactNode;
}

const ValidationProvider = ({ children }: AuxProps) => {
  const [errors, setErrors] = useState({});

  const validateStepData = async (
    onboardingData: any,
    stepNumber: Number,
    isNewApplication: boolean
  ) => {
    let newErrors: any = [];
    let showFacta =
      onboardingData.isUSResident || onboardingData.isNonPakTaxResident;

    if (stepNumber > -1 || !isNewApplication) {
      if (!isRequired(onboardingData.accountCategoryId))
        newErrors["accountCategoryId"] = "Account category is required";
      else if (onboardingData.accountCategoryId.id === ACT_CATEGORY_VPS) {
        if (!isRequired(onboardingData.expectedRetirementAge))
          newErrors["expectedRetirementAge"] = "Retirement age is required";

        if (!isRequired(onboardingData.vpsfundId))
          newErrors["vpsfundId"] = "VPS fund is required";
      }

      if (!isRequired(onboardingData.name))
        newErrors["name"] = "Name is required";

      if (!isRequired(onboardingData.fatherHusbandName))
        newErrors["fatherHusbandName"] = "Father/Husband name is required";

      if (!isRequired(onboardingData.genderId))
        newErrors["genderId"] = "Gender is required";

      if (!isRequired(onboardingData.dateOfBirth))
        newErrors["dateOfBirth"] = "Date of birth is required";

      if (!isRequired(onboardingData.motherMaidenName))
        newErrors["motherMaidenName"] = "Mother's maiden name is required";

      if (!isRequired(onboardingData.cnic))
        newErrors["cnic"] = "CNIC/NICOP number is required";
      else if (onboardingData.cnic.length !== 13)
        newErrors["cnic"] = "CNIC/NICOP number is not complete";

      if (!isRequired(onboardingData.cnicIssueDate))
        newErrors["cnicIssueDate"] = "CNIC Issue Date is required";

      if (!onboardingData.isCNICLifeTime) {
        if (!isRequired(moment(onboardingData.cnicExpiryDate).format()))
          newErrors["cnicExpiryDate"] = "CNIC Expiry Date is required";
        else if (onboardingData.cnicExpiryDate <= moment(new Date()))
          newErrors["cnicExpiryDate"] =
            "CNIC Expiry Date should be greater than today";
      }

      if (!isRequired(onboardingData.contactOwnershipId))
        newErrors["contactOwnershipId"] = "Mobile Ownership is required";
    }

    // step 2
    if (stepNumber > 1 || !isNewApplication) {
      if (!isRequired(onboardingData.residentialAddress))
        newErrors["residentialAddress"] = "Residential Address is required";

      if (
        !onboardingData.mailingSameAsResidential &&
        !isRequired(onboardingData.mailingAddress)
      )
        newErrors["mailingAddress"] = "Mailing Address is required";

      if (!isRequired(onboardingData.residentialStatusId))
        newErrors["residentialStatusId"] = "Residential Status is required";

      if (!isRequired(onboardingData.countryOfResidenceId))
        newErrors["countryOfResidenceId"] = "Country Of Residence is required";

      if (!isRequired(onboardingData.cityOfResidenceId))
        newErrors["cityOfResidenceId"] = "City Of Residence is required";

      // if (!isRequired(onboardingData.areaId))
      //   newErrors["areaId"] = "Area is required";

      if (!isRequired(onboardingData.nationalityId))
        newErrors["nationalityId"] = "Nationality is required";
      if (!isRequired(onboardingData.countryOfBirthId))
        newErrors["countryOfBirthId"] = "Country Of Birth is required";

      if (!isRequired(onboardingData.cityOfBirthId))
        newErrors["cityOfBirthId"] = "City Of Birth is required";
    }

    if (stepNumber > 2 || !isNewApplication) {
      if (!isRequired(onboardingData.bankId))
        newErrors["bankId"] = "Bank Name is required";

      if (!isRequired(onboardingData.ibanNumber))
        newErrors["ibanNumber"] = "IBAN Number is required";

      if (onboardingData.ibanNumber?.length !== 24)
        newErrors["ibanNumber"] = "IBAN Number is incomplete";
    }

    if (stepNumber > 3 || !isNewApplication) {
      if (!isRequired(onboardingData.educationId))
        newErrors["educationId"] = "Education is required";

      if (!isRequired(onboardingData.professionId))
        newErrors["professionId"] = "Profession is required";

      if (
        onboardingData.sourceOfIncome.length === 0 ||
        onboardingData.sourceOfIncome[0] === 0
      )
        newErrors["sourceOfIncome"] = "Source Of Income is required";

      if (
        onboardingData.sourceOfIncome.length > 1 &&
        onboardingData.sourceOfIncome[1] === 0
      )
        newErrors["sourceOfIncome"] = "2nd Source Of Income is required";

      if (!isRequired(onboardingData.occupationId))
        newErrors["occupationId"] = "Occupation is required";

      if (!isRequired(onboardingData.annualIncomeId))
        newErrors["annualIncomeId"] = "Annual Income is required";
    }

    if (onboardingData.isPoliticallyExposedPerson) {
      if (!isRequired(onboardingData.natureOfPEPId))
        newErrors["natureOfPEPId"] = "Nature Of PEP is required";

      if (!isRequired(onboardingData.pepNameOfFamilyMember))
        newErrors["pepNameOfFamilyMember"] =
          "Name of Close Family Member is required";

      if (!isRequired(onboardingData.pepNameOfCloseAssociate))
        newErrors["pepNameOfCloseAssociate"] =
          "Name of Closed Associate is required";

      if (!isRequired(onboardingData.pepNatureOfDepartment))
        newErrors["pepNatureOfDepartment"] =
          "Name of Department/Compamy is required";

      if (!isRequired(onboardingData.pepDesignation))
        newErrors["pepDesignation"] = "Designation is required";

      if (!isRequired(onboardingData.pepGrade))
        newErrors["pepGrade"] = "Grade is required";
    }

    const checkFacta =
      showFacta &&
      ((onboardingData.isPoliticallyExposedPerson && stepNumber > 5) ||
        (!onboardingData.isPoliticallyExposedPerson && stepNumber > 4));

    if (checkFacta || !isNewApplication) {
      if (!isRequired(onboardingData.w9Name))
        newErrors["w9Name"] = "W9 name is required";

      if (!isRequired(onboardingData.w9Address))
        newErrors["w9Address"] = "W9 Address is required";

      if (
        !isRequired(onboardingData.w9EIN) &&
        !isRequired(onboardingData.w9SSN)
      )
        newErrors["w9EINSSN"] = "W9 SSN or EIN is required";
    }

    const checkCRS =
      showFacta &&
      ((onboardingData.isPoliticallyExposedPerson && stepNumber > 6) ||
        (!onboardingData.isPoliticallyExposedPerson && stepNumber > 5));

    if (checkCRS || !isNewApplication) {
      if (!isRequired(onboardingData.countryOfTaxId))
        newErrors["countryOfTaxId"] = "Country Of Tax is required";

      if (
        onboardingData.isTINAvailable &&
        !isRequired(onboardingData.tinNumber)
      )
        newErrors["tinNumber"] = "Tin number is required";

      if (
        !onboardingData.isTINAvailable &&
        !isRequired(onboardingData.tinReasonId)
      )
        newErrors["tinReasonId"] = "TIN Non Availability Reason is required";

      if (
        !onboardingData.isTINAvailable &&
        onboardingData.tinReasonId === "2" &&
        !isRequired(onboardingData.tinReasonDetail)
      )
        newErrors["tinReasonDetail"] = "Justification for Reason B is required";
    }

    const checkContributionFields = VPSCategoryList.includes(
      onboardingData.accountCategoryId?.id
    );

    if (checkContributionFields) {
      if (!isRequired(onboardingData.modeOfContribution)) {
        newErrors["modeOfContribution"] = "Mode of Contribution is required";
      }

      if (!isRequired(onboardingData.initialContributionAmount)) {
        newErrors["initialContributionAmount"] =
          "Initial Contribution Amount is required";
      }

      if (
        onboardingData.initialContributionAmount &&
        onboardingData.initialContributionAmount < MINIMUM_CONTRIBUTION_AMOUNT
      ) {
        newErrors["initialContributionAmount"] =
          "Initial Contribution Amount should be greater than " +
          MINIMUM_CONTRIBUTION_AMOUNT;
      }

      if (!isRequired(onboardingData.amountInWords)) {
        newErrors["amountInWords"] = "Amount in Words is required";
      }

      if (!isRequired(onboardingData.frontEndLoad)) {
        newErrors["frontEndLoad"] = "Front End Load is required";
      }

      if (
        onboardingData.frontEndLoad &&
        onboardingData.frontEndLoad < MAXIMUM_FRONT_END_LOAD
      ) {
        newErrors["frontEndLoad"] =
          "Front End Load cannot be more than " + MAXIMUM_FRONT_END_LOAD;
      }

      if (!isRequired(onboardingData.contributionPaymentMode)) {
        newErrors["contributionPaymentMode"] =
          "Contribution Payment Mode is required";
      }

      if (!isRequired(onboardingData.contributionReferenceNumber)) {
        newErrors["contributionReferenceNumber"] =
          "Contribution Reference Number is required";
      }

      if (!isRequired(onboardingData.drawnOn)) {
        newErrors["drawnOn"] = "Drawn On is required";
      }

      if (!isRequired(onboardingData.modeOfContribution)) {
        newErrors["contributionFrequency"] =
          "Contribution Frequency is required";
      }

      if (!isRequired(onboardingData.periodicContributionAmount)) {
        newErrors["periodicContributionAmount"] =
          "Periodic Contribution Amount is required";
      }

      if (
        onboardingData.periodicContributionAmount &&
        onboardingData.periodicContributionAmount < MINIMUM_CONTRIBUTION_AMOUNT
      ) {
        newErrors["periodicContributionAmount"] =
          "Periodic Contribution Amount should be greater than " +
          MINIMUM_CONTRIBUTION_AMOUNT;
      }

      if (!isRequired(onboardingData.yearlyContributionAmount)) {
        newErrors["yearlyContributionAmount"] =
          "Yearly Contribution Amount is required";
      }

      if (
        onboardingData.yearlyContributionAmount &&
        onboardingData.yearlyContributionAmount < MINIMUM_CONTRIBUTION_AMOUNT
      ) {
        newErrors["yearlyContributionAmount"] =
          "Yearly Contribution Amount should be greater than " +
          MINIMUM_CONTRIBUTION_AMOUNT;
      }

      if (onboardingData.riskProfile) {
        let found = null;

        found = JSON.parse(onboardingData.riskProfile).find((profile: any) => {
          return (
            profile.selectedOption === null ||
            profile.selectedOption === undefined ||
            profile.selectedOption === ""
          );
        });

        if (found != null && found != undefined) {
          newErrors["riskProfile"] = "Please select one from all profiles";
        }
      }

      if (onboardingData.nominees?.length > 0) {
        let share = 0;
        for (let i = 0; i < onboardingData.nominees.length; i++) {
          let element = onboardingData.nominees[i];
          if (!isRequired(element.name)) {
            newErrors["nomineename" + isRequired] =
              "Name " + i + " is required";
          }
          if (!isRequired(element.relationship)) {
            newErrors["nomineerelationship" + i] = "Relationship is required";
          }
          if (!isRequired(element.cnic)) {
            newErrors["nomineecnic" + i] = "CNIC/NICOP/B-Form No. is required";
          }
          share += element.share;
        }

        if (share !== 100) {
          newErrors["nomineesShare"] =
            "Sum of all nominee's share should be equal to 100";
        }
      }
    }
    setErrors(newErrors);
  };

  const isRequired = (fieldValue: any) => {
    return fieldValue && fieldValue.toString().trim().length;
  };

  const validateField = (fieldName: string, fieldValue: any) => {
    // isCNICLifeTime, cnicExpiryDate
    // mailingSameAsResidential mailingAddress
    // onboardingData.isPEP
    const newErrors: any = { ...errors };

    if (newErrors[fieldName]) {
      let isValid = false;

      switch (fieldName) {
        case "sourceOfIncome": {
          if (fieldValue.length === 0 || fieldValue[0] === 0)
            newErrors[fieldName] = "Source Of Income is required";
          else if (fieldValue.length > 1 && fieldValue[1] === 0)
            newErrors[fieldName] = "2nd Source Of Income is required";
          else delete newErrors[fieldName];

          break;
        }

        case "reasonDetail": {
          if (!isRequired(fieldValue))
            newErrors[fieldName] = "Justification for Reason B is required";
          else delete newErrors[fieldName];

          break;
        }

        case "cnic": {
          if (!isRequired(fieldValue))
            newErrors["cnic"] = "CNIC/NICOP number is required";
          else if (fieldValue.length !== 13)
            newErrors["cnic"] = "CNIC/NICOP number is not complete";
          else delete newErrors[fieldName];

          break;
        }

        case "w9SSN":
        case "w9EIN": {
          if (!isRequired(fieldValue) && !isRequired(fieldValue))
            newErrors["w9EINSSN"] = "W9 SSN or EIN is required";
          else delete newErrors["w9EINSSN"];

          break;
        }
        case "initialContributionAmount":
          if (fieldValue < MINIMUM_CONTRIBUTION_AMOUNT)
            newErrors["initialContributionAmount"] =
              "Initial Contribution Amount should be greater than " +
              MINIMUM_CONTRIBUTION_AMOUNT;
          else delete newErrors["initialContributionAmount"];
          break;
        case "frontEndLoad":
          if (fieldValue > MAXIMUM_FRONT_END_LOAD)
            newErrors["frontEndLoad"] =
              "Front End Load cannot be more than " + MAXIMUM_FRONT_END_LOAD;
          else delete newErrors["frontEndLoad"];
          break;
        case "periodicContributionAmount":
          if (fieldValue < MINIMUM_CONTRIBUTION_AMOUNT)
            newErrors["periodicContributionAmount"] =
              "Periodic Contribution Amount should be greater than " +
              MINIMUM_CONTRIBUTION_AMOUNT;
          else delete newErrors["periodicContributionAmount"];
          break;
        case "yearlyContributionAmount":
          if (fieldValue < MINIMUM_CONTRIBUTION_AMOUNT)
            newErrors["yearlyContributionAmount"] =
              "Yearly Contribution Amount should be greater than " +
              MINIMUM_CONTRIBUTION_AMOUNT;
          else delete newErrors["yearlyContributionAmount"];
          break;
        case "riskProfile":
          let found = null;

          found = JSON.parse(fieldValue).find((profile: any) => {
            return (
              profile.selectedOption === null ||
              profile.selectedOption === undefined ||
              profile.selectedOption === ""
            );
          });

          if (found != null && found != undefined) {
            newErrors["riskProfile"] = "Please select one from all profiles";
          } else {
            console.log("here deleting");
            delete newErrors[fieldName];
          }
          break;
        case "nomineesShare":
          if (fieldValue !== 100) {
            newErrors["nomineesShare"] =
              "Sum of all nominee's share should be equal to 100";
          } else {
            delete newErrors[fieldName];
          }
          break;
        default: {
          isValid = isRequired(fieldValue);
          console.log("is Valid", isValid);
          if (isValid) delete newErrors[fieldName];
          else newErrors[fieldName] = fieldName + " is required";

          // if required check is fullfilled then check length
          if (
            isValid &&
            fieldName === "ibanNumber" &&
            fieldValue?.length !== 24
          )
            newErrors[fieldName] = "IBAN Number is incomplete";
        }
      }

      setErrors(newErrors);
    }
  };

  const clearValidationData = () => {
    setErrors([]);
  };

  const validatevpsSubFundValues = (
    equity: string,
    debt: string,
    moneyMarket: string
  ) => {
    let isError = false;
    const newErrors: any = { ...errors };
    if (parseInt(equity) + parseInt(debt) + parseInt(moneyMarket) != 100) {
      isError = true;
      newErrors["vpsSubFund"] = "Sum of all Funds should be equal to 100";
    } else delete newErrors["vpsSubFund"];

    setErrors(newErrors);
    return isError;
  };
  return (
    <ValidationContext.Provider
      value={{
        errors,
        validateField,
        validateStepData,
        clearValidationData,
        validatevpsSubFundValues,
      }}
    >
      {children}
    </ValidationContext.Provider>
  );
};

export { ValidationProvider, useValidationContext };
