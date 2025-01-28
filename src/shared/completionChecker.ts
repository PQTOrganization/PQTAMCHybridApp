import moment from "moment";
import { documentList } from "./lookups";
import {
  ACT_CATEGORY_VPS,
  MAXIMUM_FRONT_END_LOAD,
  MINIMUM_CONTRIBUTION_AMOUNT,
  VPSCategoryList,
} from "./global";
import { Foundation } from "@mui/icons-material";

export const isBasicStepComplete = (data: any) => {
  return (
    data.accountCategoryId &&
    (data.accountCategoryId.id !== ACT_CATEGORY_VPS ||
      (data.accountCategoryId.id === ACT_CATEGORY_VPS &&
        data.expectedRetirementAge &&
        data.vpsFundId)) &&
    data.name !== "" &&
    data.fatherHusbandName !== "" &&
    data.genderId &&
    data.dateOfBirth !== null &&
    data.motherMaidenName !== "" &&
    data.cnic !== "" &&
    data.cnic?.length === 13 &&
    data.cnicIssueDate !== null &&
    ((data.isCNICLifeTime && data.cnicExpiryDate === null) ||
      (!data.isCNICLifeTime &&
        data.cnicExpiryDate !== null &&
        data.cnicExpiryDate > moment(new Date()))) &&
    data.contactOwnershipId
  );
};

export const isPersonalStepComplete = (data: any) => {
  return (
    data.residentialAddress !== "" &&
    data.mailingAddress !== "" &&
    data.residentialStatus !== "" &&
    data.countryOfResidenceId &&
    data.cityOfResidenceId &&
    // data.areaId &&
    data.nationalityId
  );
};

export const isBankStepComplete = (data: any) => {
  return data.bankId && data.ibanNumber !== ""; //&& data.oneLinkTitle !== ""
};

export const isKYCStepComplete = (data: any) => {
  return (
    data.educationId &&
    data.professionId &&
    // atleast one blank entry is always present in sourceofincome
    data.sourceOfIncome.filter((x: any) => x !== 0).length > 0 &&
    data.occupationId &&
    data.annualIncomeId
  );
};

export const isAdditionalStepComplete = (data: any) => {
  return false;
};

export const isAddKYCStepComplete = (data: any) => {
  return (
    (data.isHeadOfState ||
      data.isHeadOfGovt ||
      data.isSeniorPolitician ||
      data.isSeniorGovtOfficial ||
      data.isSeniorJudicialOfficial ||
      data.isSeniorMilitaryOfficial ||
      data.isSeniorExecSOC ||
      data.isImportantPoliticalPartyOfficial ||
      data.isSeniorExecIO ||
      data.isMemberOfBOIO) &&
    (data.natureOfPEPId?.id === 1 ||
      (data.natureOfPEPId?.id !== 1 &&
        ((data.natureOfPEPId?.id === 2 && data.pepNameOfFamilyMember !== "") ||
          (data.natureOfPEPId?.id === 3 &&
            data.pepNameOfCloseAssociate !== "")) &&
        data.pepNatureOfDepartment !== "" &&
        data.pepDesignation !== "" &&
        data.pepGrade !== ""))
  );
};

export const isFATCAStepComplete = (data: any) => {
  return (
    data.w9Name !== "" &&
    data.w9Address !== "" &&
    (data.w9SSN !== "" || data.w9EIN !== "") &&
    data.isCertify
  );
};

export const isCRSStepComplete = (data: any) => {
  return (
    data.countryOfTaxId &&
    ((data.isTINAvailable && data.tinNumber !== "") ||
      (!data.isTINAvailable &&
        data.tinReasonId &&
        (data.tinReasonId !== "2" ||
          (data.tinReasonId === "2" && data.tinReasonDetail !== ""))))
  );
};

export const isDocUploadStepComplete = (data: any) => {
  const allDocsUploaded = documentList.filter(
    (x: any) => x.isMandatory && x.document === ""
  );

  return allDocsUploaded.length === 0;
};

export const isContributionStepComplete = (data: any) => {
  return (
    VPSCategoryList.includes(data.accountCategoryId?.id) &&
    data.modeOfContribution &&
    data.initialContributionAmount &&
    data.initialContributionAmount >= MINIMUM_CONTRIBUTION_AMOUNT &&
    data.amountInWords &&
    data.frontEndLoad &&
    data.frontEndLoad <= MAXIMUM_FRONT_END_LOAD &&
    data.contributionPaymentMode &&
    data.contributionReferenceNumber &&
    data.drawnOn &&
    data.contributionFrequency &&
    data.periodicContributionAmount &&
    data.periodicContributionAmount >= MINIMUM_CONTRIBUTION_AMOUNT &&
    data.yearlyContributionAmount &&
    data.yearlyContributionAmount >= MINIMUM_CONTRIBUTION_AMOUNT
  );
};

export const isContributionDeclarationStepComplete = (data: any) => {
  return (
    VPSCategoryList.includes(data.accountCategoryId?.id) &&
    data.contributionDeclaration
  );
};

export const isRiskProfileStepComplete = (data: any) => {
  let found = null;
  if (VPSCategoryList.includes(data.accountCategoryId?.id)) {
    if (data.riskProfile) {
      found = JSON.parse(data.riskProfile).find((profile: any) => {
        return (
          profile.selectedOption === null ||
          profile.selectedOption === undefined ||
          profile.selectedOption === ""
        );
      });
    } else {
      found = "found";
    }
  }

  return found === null || found === undefined;
};

export const isNomineesStepComplete = (data: any) => {
  let isComplete = true;
  if (VPSCategoryList.includes(data.accountCategoryId?.id)) {
    if (
      data.nominees === undefined ||
      data.nominees === null ||
      data.nominees?.length === 0
    ) {
      isComplete = false;
    }
    data.nominees?.forEach((element: any) => {
      if (
        element.name === "" ||
        element.relationship === "" ||
        element.share === 0
      )
        isComplete = false;
    });
  }

  return isComplete;
};
