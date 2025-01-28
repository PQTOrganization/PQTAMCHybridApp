import moment from "moment";

import {
  genderList,
  mobileOwnList,
  fundPreferenceList,
  residentialStatusList,
  countryList,
  cityList,
  birthCityList,
  areaList,
  bankList,
  educationList,
  incomeSourceList,
  professionList,
  occupationList,
  annualIncomeList,
  updateCities,
  updateBirthCities,
  updateAreas,
  natureOfPEPList,
  accountCategoryList,
  getPlanListByAccountCategory,
  retirementAgeList,
  modeOfContributionList,
  modeOfPaymentList,
  contributionFrequencyList,
} from "./lookups";

export const totalSteps = [
  {
    id: 1,
    name: "Basic Information",
    required: true,
    subtitle: "All information is mandatory",
    alterSubtitle: "Click to fill required information",
    active: false,
    complete: false,
    icon: "general",
  },
  {
    id: 2,
    name: "Personal Information",
    required: true,
    subtitle: "All information is mandatory",
    alterSubtitle: "Click to fill required information",
    complete: false,
    icon: "general",
  },
  {
    id: 3,
    name: "Bank Details",
    required: true,
    subtitle: "All information is mandatory",
    alterSubtitle: "Click to fill required information",
    complete: false,
    icon: "general",
  },
  {
    id: 4,
    name: "Know Your Customer",
    required: true,
    subtitle: "All information is mandatory",
    alterSubtitle: "Click to fill required information",
    complete: false,
    icon: "general",
  },
  {
    id: 5,
    name: "Additional Information",
    required: false,
    subtitle: "All information is mandatory",
    alterSubtitle: "Click to fill required information",
    complete: false,
    icon: "general",
  },
  {
    id: 6,
    name: "Additional Information - KYC",
    required: false,
    subtitle: "All information is mandatory",
    alterSubtitle: "Click to fill required information",
    complete: false,
    icon: "general",
  },
  {
    id: 7,
    name: "FATCA",
    required: false,
    subtitle:
      "W-9 (Request for Taxpayer Identification Number & Certification)",
    alterSubtitle: "Click to fill required information",
    complete: false,
    icon: "general",
  },
  {
    id: 8,
    name: "CRS-1",
    required: false,
    subtitle: "Click to fill required information",
    alterSubtitle: "Click to fill required information",
    complete: false,
    icon: "general",
  },
  {
    id: 9,
    name: "Sales Representative",
    required: true,
    subtitle: "",
    alterSubtitle: "",
    complete: false,
    icon: "general",
  },
  {
    id: 10,
    name: "Contribution",
    required: false,
    subtitle: "",
    alterSubtitle: "",
    complete: false,
    icon: "general",
  },
  {
    id: 11,
    name: "Contribution Declaration",
    required: false,
    subtitle: "",
    alterSubtitle: "",
    complete: false,
    icon: "general",
  },
  {
    id: 12,
    name: "Risk Profile",
    required: false,
    subtitle: "Customized options for your investment goals",
    alterSubtitle: "Customized options for your investment goals",
    complete: false,
    icon: "general",
  },
  {
    id: 13,
    name: "Nominee",
    required: false,
    subtitle: "Nominees to receive proceeds from individual pension accounts",
    alterSubtitle:
      "Nominees to receive proceeds from individual pension accounts",
    complete: false,
    icon: "general",
  },
  {
    id: 14,
    name: "Document Upload",
    required: true,
    subtitle: "Please update required documents",
    alterSubtitle: "Please update required documents",
    complete: false,
    icon: "general",
  },
  {
    id: 15,
    name: "Account Application Review",
    required: true,
    subtitle: "Please review and verify all information entered",
    alterSubtitle: "Please review and verify all information entered",
    complete: false,
    icon: "preview",
  },
  {
    id: 16,
    name: "Declaration",
    required: true,
    subtitle: "Please accept terms & conditions",
    alterSubtitle: "Please accept terms & conditions",
    complete: false,
    icon: "preview",
  },
];

const convertAPIDate = (apiDate: any) => {
  if (apiDate) return moment(apiDate); //keeping the dates in moment format;
  else return null;
};

const getFormDataLookupKey = (lookup: any, apiDataId: any) => {
  var dataList = [];

  if (apiDataId === "" || !apiDataId) return null;

  switch (lookup) {
    case "GENDER":
      if (genderList && genderList.length > 0) dataList = genderList.slice();
      break;

    case "MOBILE_OWN":
      if (mobileOwnList && mobileOwnList.length > 0)
        dataList = mobileOwnList.slice();
      break;

    case "FUND_PREF":
      if (fundPreferenceList && fundPreferenceList.length > 0)
        dataList = fundPreferenceList.slice();
      break;

    case "RES_STATUS":
      if (residentialStatusList && residentialStatusList.length > 0)
        dataList = residentialStatusList.slice();
      break;

    case "COUNTRY":
      if (countryList && countryList.length > 0) dataList = countryList.slice();
      break;

    case "CITY":
      if (cityList && cityList.length > 0) dataList = cityList.slice();
      break;

    case "CITYB":
      if (birthCityList && birthCityList.length > 0)
        dataList = birthCityList.slice();
      break;

    case "AREA":
      if (areaList && areaList.length > 0) dataList = areaList.slice();
      break;

    case "BANK":
      if (bankList && bankList.length > 0) dataList = bankList.slice();
      break;

    case "EDUCATION":
      if (educationList && educationList.length > 0)
        dataList = educationList.slice();
      break;

    case "PROFESSION":
      if (professionList && professionList.length > 0)
        dataList = professionList.slice();
      break;

    case "OCCUPATION":
      if (occupationList && occupationList.length > 0)
        dataList = occupationList.slice();
      break;

    case "PEP":
      if (natureOfPEPList && natureOfPEPList.length > 0)
        dataList = natureOfPEPList.slice();
      break;

    case "INCOME":
      if (annualIncomeList && annualIncomeList.length > 0)
        dataList = annualIncomeList.slice();
      break;

    case "RETIRE_AGE":
      if (retirementAgeList && retirementAgeList.length > 0)
        dataList = retirementAgeList.slice();
      break;

    case "ACCOUNT_CATEGORY":
      if (accountCategoryList && accountCategoryList.length > 0)
        dataList = accountCategoryList.slice();
      break;
    case "MODE_OF_CONTRIBUTION":
      if (modeOfContributionList && modeOfContributionList.length > 0)
        dataList = modeOfContributionList.slice();
      break;
    case "CONTRIBUTION_PAYMENT_MODE":
      if (modeOfPaymentList && modeOfPaymentList.length > 0)
        dataList = modeOfPaymentList.slice();
      break;
    case "CONTRIBUTION_FREQUENCY":
      if (contributionFrequencyList && contributionFrequencyList.length > 0)
        dataList = contributionFrequencyList.slice();
      break;

    default:
      break;
  }

  if (dataList && dataList.length > 0) {
    return dataList.find((x: any) => x.id === apiDataId);
  } else return null;
};

const getPlanLookupKey = async (categoryId: any, planSno: any) => {
  return getPlanListByAccountCategory(categoryId).then((plans) => {
    let selectedPlan = plans.filter((item: any) => item.id === planSno);
    return selectedPlan ? selectedPlan[0] : "";
  });
};

export const getIncomeSourceDataLookupKeys = (incomeData: any) => {
  if (!incomeData || incomeData.length === 0) return [0];
  else {
    return incomeData.map((x: any) => {
      if (x === 0) return 0;
      else return incomeSourceList.find((i: any) => i.id === Number(x));
    });
  }
};

export const translateAPIDataToFormData = async (apiData: any) => {
  if (apiData.countryOfResidentId)
    try {
      await updateCities(Number(apiData.countryOfResidentId));
    } catch (ex) {
      console.log("Error getting cities for :", apiData.countryOfResidentId);
      console.log(ex);
    }

  if (apiData.cityOfResidentId)
    try {
      await updateAreas(Number(apiData.cityOfResidentId));
    } catch (ex) {
      console.log("Error getting areas for :", apiData.cityOfResidentId);
      console.log(ex);
    }

  if (apiData.countryOfBirthId)
    try {
      await updateBirthCities(Number(apiData.countryOfBirthId));
    } catch (ex) {
      console.log("Error getting birth cities for :", apiData.countryOfBirthId);
      console.log(ex);
    }

  let vpsFundCode = apiData.vpsFundId
    ? await getPlanLookupKey(
        Number(apiData.accountCategoryId),
        Number(apiData.vpsFundId)
      )
    : "";

  let data: any = {
    ...apiData,
    accountCategoryId: getFormDataLookupKey(
      "ACCOUNT_CATEGORY",
      Number(apiData.accountCategoryId)
    ),
    genderId: getFormDataLookupKey("GENDER", apiData.genderId),
    dateOfBirth: convertAPIDate(apiData.dateOfBirth),
    cnicIssueDate: convertAPIDate(apiData.cnicIssueDate),
    cnicExpiryDate: convertAPIDate(apiData.cnicExpiryDate),
    contactOwnershipId: getFormDataLookupKey(
      "MOBILE_OWN",
      apiData.contactOwnershipId
    ),
    expectedRetirementAge: getFormDataLookupKey(
      "RETIRE_AGE",
      apiData.expectedRetirementAge
    ),
    vpsFundId: vpsFundCode,
    //fundPreference: getFormDataLookupKey("FUND_PREF", apiData.AcctPreference),
    //vpsfundId: vpsFundCode,

    residentialStatusId: getFormDataLookupKey(
      "RES_STATUS",
      apiData.residentialStatusId
    ),
    countryOfResidenceId: getFormDataLookupKey(
      "COUNTRY",
      Number(apiData.countryOfResidenceId)
    ),
    cityOfResidenceId: getFormDataLookupKey(
      "CITY",
      Number(apiData.cityOfResidenceId)
    ),
    areaId: getFormDataLookupKey("AREA", Number(apiData.areaId)),
    nationalityId: getFormDataLookupKey(
      "COUNTRY",
      Number(apiData.nationalityId)
    ),
    countryOfBirthId: getFormDataLookupKey(
      "COUNTRY",
      Number(apiData.countryOfBirthId)
    ),
    cityOfBirthId: getFormDataLookupKey("CITYB", Number(apiData.cityOfBirthId)),
    isNonMuslim: apiData.isNonMuslim.toString(), // IMPORTANT

    bankId: getFormDataLookupKey("BANK", apiData.bankId),

    educationId: getFormDataLookupKey("EDUCATION", apiData.educationId),
    professionId: getFormDataLookupKey("PROFESSION", apiData.professionId),
    sourceOfIncome: getIncomeSourceDataLookupKeys(apiData.sourceOfIncome),
    occupationId: getFormDataLookupKey(
      "OCCUPATION",
      Number(apiData.occupationId)
    ),
    annualIncomeId: getFormDataLookupKey("INCOME", apiData.annualIncomeId),

    countryOfTaxId: getFormDataLookupKey(
      "COUNTRY",
      Number(apiData.countryOfTaxId)
    ),
    tinReasonId: apiData.tinReasonId ? apiData.tinReasonId.toString() : "", // IMPORTANT due to radio control

    natureOfPEPId: getFormDataLookupKey("PEP", Number(apiData.natureOfPEPId)),
    SalesRepresentativeMobileNumber: apiData.salesRepresentativeMobileNumber,
    SalesRepresentativeNameCode: apiData.salesRepresentativeNameCode,
    modeOfContribution: getFormDataLookupKey(
      "MODE_OF_CONTRIBUTION",
      Number(apiData.modeOfContribution)
    ),
    contributionPaymentMode: getFormDataLookupKey(
      "CONTRIBUTION_PAYMENT_MODE",
      Number(apiData.contributionPaymentMode)
    ),
    contributionFrequency: getFormDataLookupKey(
      "CONTRIBUTION_FREQUENCY",
      Number(apiData.contributionFrequency)
    ),
    drawnOn: bankList.find((item: any) => item.value === apiData.drawnOn),

    allDocsUploaded: false,
  };

  data.showPep =
    data.isHeadOfState ||
    data.isHeadOfGovt ||
    data.isSeniorPolitician ||
    data.isSeniorGovtOfficial ||
    data.isSeniorJudicialOfficial ||
    data.isSeniorMilitaryOfficial ||
    data.isSeniorExecSOC ||
    data.isImportantPoliticalPartyOfficial ||
    data.isSeniorExecIO ||
    data.isMemberOfBOIO;

  return data;
};

export const cleanMaskedInputValue = (inputValue: any) => {
  if (!inputValue) return "";

  let newValue = inputValue.replace(/_/g, "").replace(/-/g, "");

  if (newValue === "PK") newValue = "";

  return newValue;
};

export const getBankIMD = (bankSNo: any) => {
  return bankSNo;
};

export const pad = (num: any) => {
  return ("0" + num).slice(-2);
};

export const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");

export const formatTimerToMinAndSecs = (seconds: any) => {
  return pad(Math.floor(seconds / 60)) + ":" + pad(seconds % 60);
};

export const transformAndFilterInput = (e: any) => {
  let value = e.target.value;
  value = value.replace(/[^A-Za-z0-9.,/\- ]/gi, "");
  e.target.value = ("" + value).toUpperCase();
};

export const convertToAPIDate = (formDate: any) => {
  if (formDate) return moment(formDate).format();
  else return null;
};

export const formattedNumber = (numberValue: number, digits: number = 4) => {
  if (numberValue)
    return Intl.NumberFormat("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(numberValue);
  else return "0";
};

export const sumArray = (arrayOfNumbers: number[]) => {
  if (arrayOfNumbers)
    return arrayOfNumbers.reduce((partialSum, a) => partialSum + a, 0);
  else return 0;
};

export function toBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export const FV = (
  rate: number,
  nper: number,
  pmt: number,
  pv: number,
  type: number
) => {
  var pow = Math.pow(1 + rate, nper),
    fv;
  if (rate) {
    fv = (pmt * (1 + rate * type) * (1 - pow)) / rate - pv * pow;
  } else {
    fv = -1 * (pv + pmt * nper);
  }
  return fv;
};

export const isEmail = (val: string) => {
  let regEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,2}\.[0-9]{1,3}\.[0-9]{1,2}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;

  return regEmail.test(val);
};

export const openURLInBrowser = (url: string) => {
  const win: any = window;

  if (url)
    if (win?.ReactNativeWebView)
      win.ReactNativeWebView.postMessage(
        JSON.stringify({ messageType: "webpage", data: url })
      );
    else window.open(url, "_new");
};

export const handleCall = (number: string = "021111825238") => {
  const win: any = window;

  if (win?.ReactNativeWebView)
    win.ReactNativeWebView.postMessage(
      JSON.stringify({ messageType: "call", data: number })
    );
  else window.alert("No dialer available");
};

export const handleEmail = (email: string) => {
  const win: any = window;

  if (email)
    if (win?.ReactNativeWebView)
      win.ReactNativeWebView.postMessage(
        JSON.stringify({ messageType: "email", data: email })
      );
    else window.open(`mailto:${email}`, "_new");
};

export enum HighRiskFunds {
  IncomePlan = 5,
  MonthlyIncomePlan = 3,
  KhalisBachatPlan = 6,
  IslamicStockFund = 7,
}

export const ACT_CATEGORY_GENERAL = 1;
export const ACT_CATEGORY_VPS = 2;
export const ACT_CATEGORY_SAHULAT = 3;
export const ACT_CATEGORY_VPS_SAHULAT = 4;

export const VPSCategoryList = [2, 4];
export const API_DATE_FORMAT = "DD/MM/YYYY";

export enum TransferToFundNotAllowed {
  DividendPlan = 1,
}

export const MINIMUM_CONTRIBUTION_AMOUNT = 1000;
export const MAXIMUM_FRONT_END_LOAD = 3;
