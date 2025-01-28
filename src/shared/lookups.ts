import Api from "./api/api";

var netOperatorList: any = [];
var countryCodeList: any = [];
var genderList: any = [];
var mobileOwnList: any = [];
var fundPreferenceList: any = [];
var languagePrefList: any = [];
var residentialStatusList: any = [];
var countryList: any = [];
var cityList: any = [];
var birthCityList: any = [];
var areaList: any = [];
var bankList: any = [];
var educationList: any = [];
var incomeSourceList: any = [];
var professionList: any = [];
var occupationList: any = [];
var annualIncomeList: any = [];
var annualInvestAmountList: any = [
  { id: 1, value: "UPTO RS. 500,000/-" },
  { id: 2, value: "UPTO RS. 800,000/-" },
  { id: 3, value: "UPTO RS. 1,000,000/-" },
  { id: 4, value: "UPTO RS. 2,000,000/-" },
  { id: 5, value: "UPTO RS. 3,000,000/-" },
  { id: 6, value: "UPTO RS. 4,000,000/-" },
  { id: 7, value: "UPTO RS. 5,000,000/-" },
  { id: 8, value: "UPTO RS. 6,000,000/-" },
  { id: 9, value: "UPTO RS. 7,000,000/-" },
  { id: 10, value: "UPTO RS. 8,000,000/-" },
  { id: 11, value: "UPTO RS. 9,000,000/-" },
  { id: 12, value: "UPTO RS. 10,000,000/-" },
  { id: 13, value: "ABOVE RS. 10,000,000/-" },
];
var relationshipList: any = [];
var accountCategoryList: any = [];
var reasonList: any = [];
var natureOfPEPList: any = [];
var documentList: any = [];
var retirementAgeList: any = [];
var vpsFundsList: any = [];
var crsCountriesList: any = [];
var modeOfPaymentList: any = [];
var modeOfContributionList: any = [];
var contributionFrequencyList: any = [];
var sessionToken = "";

export const initializeEssentialData = async () => {
  return await getCountryCode().catch((e) =>
    console.log("Language preference Api", e)
  );
};

export const initializeListData = async (token: string) => {
  sessionToken = token;

  await getGenderData().catch((e) => console.log("Gender Api", e));

  await getRelationshipData().catch((e) => console.log("RelationShip Api", e));
  await getEducationData().catch((e) => console.log("Education Api", e));
  await getOccupations().catch((e) => console.log("Occupation Api", e));
  await getSourceOfIncomes().catch((e) => console.log("SourceOfIncome Api", e));
  await getBanks().catch((e) => console.log("Banks Api", e));
  await getAccountCategories().catch((e) =>
    console.log("AccountCategory Api", e)
  );
  await getMobileOwners().catch((e) => console.log("MobileOwner Api", e));
  await getTinUnavailabilityReason().catch((e) => console.log("Tin Api", e));
  await getResidentialList().catch((e) => console.log("Reseident Api", e));
  await getAnnualIncomeList().catch((e) => console.log("Annual Api", e));
  await getProfessions().catch((e) => console.log("Profession Api", e));

  /** INITIALIZE COUNTRY, CITY, AND AREA TO PAKISTAN DATA */
  await getCountryData().catch((e) => console.log("Country Api", e));
  cityList = await getCities(167).catch((e) => console.log("Cities Api", e));
  areaList = await getAreas(1).catch((e) => console.log("Areas Api", e));
  birthCityList = cityList.slice();

  await getPEPNature().catch((e) => console.log("PEP Nature Api", e));
  await getFundPreference().catch((e) => console.log("Fund preference Api", e));
  await getRetirementAges();
  await getVPSFunds();
  await getCRSCountries();

  await getModesOfPaymentList().catch((e) =>
    console.log("Modes of Payment Api", e)
  );

  await getModesOfContributionList().catch((e) =>
    console.log("Modes of Contribution Api", e)
  );

  await getContributionFrequencyList().catch((e) =>
    console.log("Modes of Contribution Frequency Api", e)
  );

  return Promise.resolve();
};

const getLOVData = async (apiRoute: string) => {
  return [];

  var data = await Api(apiRoute, null, "GET", sessionToken);

  if (data.ResultSet.LOVItems == null) return {};
  else {
    return data.ResultSet.LOVItems.map((x: any) => {
      return {
        id: x.LOVSNO,
        value: x.LOVValue,
      };
    });
  }
};

const getGenderData = async () => {
  var route = "Gender";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    let lookupList = Data.map((x: any) => {
      return {
        id: x.genderId,
        value: x.name,
      };
    });

    genderList = lookupList.slice();
  }

  return true;
};

const getAccountCategories = async () => {
  var route = "accountcategory";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    Data = Data.filter((item: any) => item.displayOrder != -1);
    let lookupList = Data.map((x: any) => {
      return {
        id: x.accountCategoryId,
        value: x.name,
        title: x.title,
        subtitle: x.subTitle,
        description: x.description,
        displayOrder: x.displayOrder,
      };
    });

    accountCategoryList = lookupList.slice();
  }

  return true;
};

const getMobileOwners = async () => {
  var route = "contactownership";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    let lookupList = Data.map((x: any) => {
      return {
        id: x.contactOwnerShipId,
        value: x.name,
      };
    });

    mobileOwnList = lookupList.slice();
  }

  return true;
};

const getCountryData = async () => {
  var route = "Country";
  var Data = await Api(route, null, "GET", sessionToken);
  if (Data) {
    let lookupList = Data.map((x: any) => {
      return {
        id: x.countryId,
        value: x.name,
      };
    });

    countryList = lookupList.slice();
    countryList.sort(function (a: any, b: any) {
      var textA = a.value.toUpperCase();
      var textB = b.value.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }

  return true;
};

const getCities = async (id: number) => {
  let lookupList = [];

  if (!id) id = 167;

  var route = `City/bycountry/` + id;
  var Data = await Api(route, null, "GET", sessionToken);
  if (Data) {
    lookupList = Data.map((x: any) => {
      return {
        id: x.cityId,
        value: x.name,
      };
    });

    lookupList = lookupList.sort(function (a: any, b: any) {
      var textA = a.value.toUpperCase();
      var textB = b.value.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }

  return lookupList;
};

const getAreas = async (id: number) => {
  var lookupList = [];

  if (!id) id = 1;

  var route = `Area/byCity/` + id;
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    lookupList = Data.map((x: any) => {
      return {
        id: x.areaId,
        value: x.name,
      };
    });

    lookupList = lookupList.sort(function (a: any, b: any) {
      var textA = a.value.toUpperCase();
      var textB = b.value.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }

  return lookupList;
};

const updateCities = async (id: number) => {
  cityList = await getCities(id);
};

const updateAreas = async (id: number) => {
  areaList = await getAreas(id);
};

const updateBirthCities = async (id: number) => {
  birthCityList = await getCities(id);
};

const getRelationshipData = async () => {
  return [];

  //console.log("Loading Relationship Data...");

  var route = "BasicInfo/getRelations";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data.ResultSet.Relationship) {
    let lookupList = Data.ResultSet.Relationship.map((x: any) => {
      return {
        id: x.RelationValue,
        value: x.RelationName,
      };
    });

    relationshipList = lookupList.slice();
    relationshipList.sort(function (a: any, b: any) {
      var textA = a.value.toUpperCase();
      var textB = b.value.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }

  return true;
};

const getEducationData = async () => {
  var route = "Education";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    let lookupList = Data.map((x: any) => {
      return {
        id: x.educationId,
        value: x.name,
      };
    });

    educationList = lookupList.slice();
    educationList.sort(function (a: any, b: any) {
      var textA = a.value.toUpperCase();
      var textB = b.value.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }

  return true;
};

const getOccupations = async () => {
  var route = "Occupation";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    let lookupList = Data.map((x: any) => {
      return {
        id: x.occupationId,
        value: x.name,
      };
    });

    occupationList = lookupList.slice();
    occupationList.sort(function (a: any, b: any) {
      var textA = a.value.toUpperCase();
      var textB = b.value.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }

  return true;
};

const getSourceOfIncomes = async () => {
  var route = "IncomeSource";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    let lookupList = Data.map((x: any) => {
      return {
        id: x.incomeSourceId,
        value: x.name,
      };
    });

    incomeSourceList = lookupList.slice();
    incomeSourceList.sort(function (a: any, b: any) {
      var textA = a.value.toUpperCase();
      var textB = b.value.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }

  return true;
};

export const getBanks = async () => {
  var route = "Bank";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    let lookupList = Data.map((x: any) => {
      return {
        id: x.bankId,
        value: x.name,
        BankIMD: x.bankId,
      };
    });

    bankList = lookupList.slice();
    bankList.sort(function (a: any, b: any) {
      var textA = a.value.toUpperCase();
      var textB = b.value.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }

  return true;
};

const getNetworkOperators = async () => {
  return [];

  var route = "BasicInfo/getNetworkOperators";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data.ResultSet.networks) {
    let lookupList = Data.ResultSet.networks.map((x: any) => {
      return {
        id: x.NetworkCode,
        value: x.NetworkName,
      };
    });

    netOperatorList = lookupList.slice();
    netOperatorList.sort(function (a: any, b: any) {
      var textA = a.value.toUpperCase();
      var textB = b.value.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }

  return true;
};

const getTinUnavailabilityReason = async () => {
  var route = "TINReason";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    let lookupList = Data.map((x: any) => {
      return {
        id: x.tinReasonId,
        value: x.name,
      };
    });

    reasonList = lookupList.slice();
  }

  return true;
};

const getResidentialList = async () => {
  var route = "ResidentialStatus";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    let lookupList = Data.map((x: any) => {
      return {
        id: x.residentialStatusId,
        value: x.name,
      };
    });

    residentialStatusList = lookupList.slice();
  }

  return true;
};

const getAnnualIncomeList = async () => {
  var route = "AnnualIncome";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    let lookupList = Data.map((x: any) => {
      return {
        id: x.annualIncomeId,
        value: x.name,
      };
    });

    annualIncomeList = lookupList.slice();
  }

  return true;
};

const getProfessions = async () => {
  var route = "Profession";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    let lookupList = Data.map((x: any) => {
      return {
        id: x.professionId,
        value: x.name,
      };
    });

    professionList = lookupList.slice();
  }

  return true;
};

const getPEPNature = async () => {
  natureOfPEPList = [
    {
      id: 1,
      value: "MYSELF",
    },
    {
      id: 2,
      value: "FAMILY MEMBER",
    },
    {
      id: 3,
      value: "CLOSED ASSOCIATE",
    },
  ];
};

const getFundPreference = async () => {
  fundPreferenceList = [];
};

const getLanguagePreference = async () => {
  languagePrefList = []; //await getLOVData("BasicInfo/GetLanguagePerference");
};

const getCountryCode = async () => {
  countryCodeList = [
    {
      id: "382",
      value: "Montenegro",
    },
    {
      id: "64",
      value: "New Zealand",
    },
    {
      id: "675",
      value: "Papua New Guinea",
    },
    {
      id: "290",
      value: "St Helena",
    },
    {
      id: "421",
      value: "Slovakia",
    },
    {
      id: "249",
      value: "Sudan",
    },
    {
      id: "963",
      value: "Syria",
    },
    {
      id: "216",
      value: "Tunisia",
    },
    {
      id: "380",
      value: "Ukraine",
    },
    {
      id: "39",
      value: "Vatican City",
    },
    {
      id: "93",
      value: "Afghanistan",
    },
    {
      id: "355",
      value: "Albania",
    },
    {
      id: "213",
      value: "Algeria",
    },
    {
      id: "685",
      value: "American Samoa",
    },
    {
      id: "376",
      value: "Andorra",
    },
    {
      id: "244",
      value: "Angola",
    },
    {
      id: "672",
      value: "Australian Antarctic Territory",
    },
    {
      id: "599",
      value: "Antilles",
    },
    {
      id: "54",
      value: "Argentina",
    },
    {
      id: "374",
      value: "Armenia",
    },
    {
      id: "297",
      value: "Aruba",
    },
    {
      id: "247",
      value: "Ascension Island",
    },
    {
      id: "61",
      value: "Australia",
    },
    {
      id: "43",
      value: "Austria",
    },
    {
      id: "994",
      value: "Azerbaijan",
    },
    {
      id: "351",
      value: "Azores",
    },
    {
      id: "973",
      value: "Bahrain",
    },
    {
      id: "880",
      value: "Bangladesh",
    },
    {
      id: "375",
      value: "Belarus",
    },
    {
      id: "32",
      value: "Belgium",
    },
    {
      id: "501",
      value: "Belize",
    },
    {
      id: "229",
      value: "Benin",
    },
    {
      id: "975",
      value: "Bhutan",
    },
    {
      id: "591",
      value: "Bolivia",
    },
    {
      id: "387",
      value: "Bosnia Herzegovina",
    },
    {
      id: "267",
      value: "Botswana",
    },
    {
      id: "55",
      value: "Brazil",
    },
    {
      id: "673",
      value: "Brunei Darussalam",
    },
    {
      id: "359",
      value: "Bulgaria",
    },
    {
      id: "226",
      value: "Burkina Faso",
    },
    {
      id: "95",
      value: "Burma (Myanmar)",
    },
    {
      id: "257",
      value: "Burundi",
    },
    {
      id: "855",
      value: "Cambodia",
    },
    {
      id: "237",
      value: "Cameroon",
    },
    {
      id: "1",
      value: "Canada",
    },
    {
      id: "238",
      value: "Cape Verde Islands",
    },
    {
      id: "236",
      value: "Central African Republic",
    },
    {
      id: "235",
      value: "Chad",
    },
    {
      id: "56",
      value: "Chile",
    },
    {
      id: "86",
      value: "China",
    },
    {
      id: "57",
      value: "Colombia",
    },
    {
      id: "269",
      value: "Comoros",
    },
    {
      id: "242",
      value: "Congo",
    },
    {
      id: "682",
      value: "Cook Islands",
    },
    {
      id: "506",
      value: "Costa Rica",
    },
    {
      id: "225",
      value: "Cote D'Ivoire (Ivory Coast)",
    },
    {
      id: "385",
      value: "Croatia",
    },
    {
      id: "53",
      value: "Cuba",
    },
    {
      id: "357",
      value: "Cyprus",
    },
    {
      id: "42",
      value: "Czech Republic",
    },
    {
      id: "45",
      value: "Denmark",
    },
    {
      id: "253",
      value: "Djibouti",
    },
    {
      id: "593",
      value: "Ecuador",
    },
    {
      id: "20",
      value: "Egypt",
    },
    {
      id: "503",
      value: "El Salvador",
    },
    {
      id: "240",
      value: "Equatorial Guinea",
    },
    {
      id: "291",
      value: "Eritrea",
    },
    {
      id: "372",
      value: "Estonia",
    },
    {
      id: "251",
      value: "Ethiopia",
    },
    {
      id: "500",
      value: "Falkland Islands",
    },
    {
      id: "298",
      value: "Faroe Islands",
    },
    {
      id: "679",
      value: "Fiji",
    },
    {
      id: "358",
      value: "Finland",
    },
    {
      id: "33",
      value: "France",
    },
    {
      id: "594",
      value: "French Guiana",
    },
    {
      id: "689",
      value: "French Polynesia",
    },
    {
      id: "241",
      value: "Gabon",
    },
    {
      id: "220",
      value: "Gambia",
    },
    {
      id: "995",
      value: "Georgia",
    },
    {
      id: "49",
      value: "Germany",
    },
    {
      id: "233",
      value: "Ghana",
    },
    {
      id: "350",
      value: "Gibraltar",
    },
    {
      id: "30",
      value: "Greece",
    },
    {
      id: "299",
      value: "Greenland",
    },
    {
      id: "590",
      value: "Guadeloupe",
    },
    {
      id: "671",
      value: "Guam",
    },
    {
      id: "502",
      value: "Guatemala",
    },
    {
      id: "224",
      value: "Guinea",
    },
    {
      id: "245",
      value: "Guinea-Bissau",
    },
    {
      id: "592",
      value: "Guyana",
    },
    {
      id: "509",
      value: "Haiti",
    },
    {
      id: "504",
      value: "Honduras",
    },
    {
      id: "852",
      value: "Hong Kong",
    },
    {
      id: "36",
      value: "Hungary",
    },
    {
      id: "354",
      value: "Iceland",
    },
    {
      id: "91",
      value: "India",
    },
    {
      id: "62",
      value: "Indonesia",
    },
    {
      id: "98",
      value: "Iran",
    },
    {
      id: "964",
      value: "Iraq",
    },
    {
      id: "353",
      value: "Ireland",
    },
    {
      id: "972",
      value: "Israel",
    },
    {
      id: "81",
      value: "Japan",
    },
    {
      id: "962",
      value: "Jordan",
    },
    {
      id: "7",
      value: "Kazakhstan",
    },
    {
      id: "254",
      value: "Kenya",
    },
    {
      id: "686",
      value: "Kiribati",
    },
    {
      id: "381",
      value: "Kosovo",
    },
    {
      id: "965",
      value: "Kuwait",
    },
    {
      id: "856",
      value: "Laos",
    },
    {
      id: "371",
      value: "Latvia",
    },
    {
      id: "961",
      value: "Lebanon",
    },
    {
      id: "266",
      value: "Lesotho",
    },
    {
      id: "231",
      value: "Liberia",
    },
    {
      id: "218",
      value: "Libya",
    },
    {
      id: "423",
      value: "Liechtenstein",
    },
    {
      id: "370",
      value: "Lithuania",
    },
    {
      id: "352",
      value: "Luxembourg",
    },
    {
      id: "853",
      value: "Macao",
    },
    {
      id: "389",
      value: "Macedonia",
    },
    {
      id: "261",
      value: "Madagascar",
    },
    {
      id: "265",
      value: "Malawi",
    },
    {
      id: "60",
      value: "Malaysia",
    },
    {
      id: "960",
      value: "Maldives",
    },
    {
      id: "223",
      value: "Mali",
    },
    {
      id: "356",
      value: "Malta",
    },
    {
      id: "692",
      value: "Marshall Islands",
    },
    {
      id: "596",
      value: "Martinique",
    },
    {
      id: "222",
      value: "Mauritania",
    },
    {
      id: "230",
      value: "Mauritius",
    },
    {
      id: "52",
      value: "Mexico",
    },
    {
      id: "691",
      value: "Micronesia",
    },
    {
      id: "373",
      value: "Moldova",
    },
    {
      id: "377",
      value: "Monaco",
    },
    {
      id: "976",
      value: "Mongolia",
    },
    {
      id: "212",
      value: "Morocco",
    },
    {
      id: "258",
      value: "Mozambique",
    },
    {
      id: "264",
      value: "Namibia",
    },
    {
      id: "674",
      value: "Nauru",
    },
    {
      id: "977",
      value: "Napal",
    },
    {
      id: "31",
      value: "Netherlands (Holland)",
    },
    {
      id: "687",
      value: "New Caledonia",
    },
    {
      id: "505",
      value: "Nicaragua",
    },
    {
      id: "227",
      value: "Niger Republic",
    },
    {
      id: "234",
      value: "Nigeria",
    },
    {
      id: "47",
      value: "Norway",
    },
    {
      id: "850",
      value: "North Korea",
    },
    {
      id: "968",
      value: "Oman",
    },
    {
      id: "92",
      value: "Pakistan",
    },
    {
      id: "507",
      value: "Panama",
    },
    {
      id: "595",
      value: "Paraguay",
    },
    {
      id: "51",
      value: "Peru",
    },
    {
      id: "63",
      value: "Philippines",
    },
    {
      id: "649",
      value: "Pitcairn Island",
    },
    {
      id: "48",
      value: "Poland",
    },
    {
      id: "974",
      value: "Qatar",
    },
    {
      id: "40",
      value: "Romania",
    },
    {
      id: "250",
      value: "Rwanda",
    },
    {
      id: "378",
      value: "San Marino",
    },
    {
      id: "966",
      value: "Saudi Arabia",
    },
    {
      id: "221",
      value: "Senegal",
    },
    {
      id: "248",
      value: "Seychelles",
    },
    {
      id: "232",
      value: "Sierra Leone",
    },
    {
      id: "65",
      value: "Singapore",
    },
    {
      id: "386",
      value: "Slovenia",
    },
    {
      id: "677",
      value: "Solomon Islands",
    },
    {
      id: "252",
      value: "Somalia",
    },
    {
      id: "27",
      value: "South Africa",
    },
    {
      id: "82",
      value: "South Korea",
    },
    {
      id: "349",
      value: "Spain",
    },
    {
      id: "94",
      value: "Sri Lanka",
    },
    {
      id: "597",
      value: "Surinam",
    },
    {
      id: "268",
      value: "Swaziland",
    },
    {
      id: "46",
      value: "Sweden",
    },
    {
      id: "41",
      value: "Switzerland",
    },
    {
      id: "886",
      value: "Taiwan",
    },
    {
      id: "255",
      value: "Tanzania",
    },
    {
      id: "66",
      value: "Thailand",
    },
    {
      id: "228",
      value: "Togo",
    },
    {
      id: "676",
      value: "Tonga",
    },
    {
      id: "90",
      value: "Turkey",
    },
    {
      id: "688",
      value: "Tuvalu",
    },
    {
      id: "256",
      value: "Uganda",
    },
    {
      id: "971",
      value: "United Arab Emirates",
    },
    {
      id: "44",
      value: "United Kingdom",
    },
    {
      id: "598",
      value: "Uraguay",
    },
    {
      id: "998",
      value: "Uzbekistan",
    },
    {
      id: "678",
      value: "Vanuatu",
    },
    {
      id: "58",
      value: "Venezuela",
    },
    {
      id: "84",
      value: "Vietnam",
    },
    {
      id: "967",
      value: "Yemen",
    },
    {
      id: "243",
      value: "Zaire (Congo)",
    },
    {
      id: "260",
      value: "Zambia",
    },
    {
      id: "263",
      value: "Zimbabwe",
    },
  ];

  return;

  var Data = await Api("BasicInfo/GetCountryCode", null, "GET", sessionToken);

  if (Data.ResultSet.LOVItems == null) countryCodeList = [];
  else {
    //console.log("Countries: ", Data.ResultSet.LOVItems);

    const distinctCodes = Data.ResultSet.LOVItems.filter(
      (country: any, index: any, self: any) =>
        self.findIndex((t: any) => t.LOVSNO === country.LOVSNO) === index
    );

    countryCodeList = distinctCodes.map((x: any) => {
      return {
        id: x.LOVSNO,
        value: x.LOVValue,
      };
    });
  }
};

const getCRSCountries = async () => {
  crsCountriesList = countryList.slice();
};

const getDocumentList = async (digitalAcctSno: number) => {
  documentList = [
    {
      id: "13",
      title: "Real Time Photograph / Selfie",
      tag: "13",
      isMandatory: true,
      document: "",
      modified: false,
    },
    {
      id: "14",
      title: "CNIC/NICOP Front",
      tag: "14",
      isMandatory: true,
      document: "",
      modified: false,
    },
    {
      id: "15",
      title: "CNIC/NICOP Back",
      tag: "15",
      isMandatory: true,
      document: "",
      modified: false,
    },
  ];

  return;

  var Data = await Api(
    "Document/GetDocList?digitalAcctSno=" + digitalAcctSno,
    null,
    "GET",
    sessionToken
  );

  console.log("Document list from API: ", Data);

  if (Data.ResultSet.LOVItems == null) documentList = [];
  else
    documentList = Data.ResultSet.LOVItems.map((x: any) => {
      return {
        id: x.LOVSNO,
        title: x.LOVValue,
        tag: x.LOVSNO,
        isMandatory: x.isMandatory === "Y",
        document: "",
        modified: false,
      };
    });
};

const getProfessionsByOccupationId = async (id: number) => {
  await getProfessions();
  return professionList;
};

const getRetirementAges = async () => {
  retirementAgeList = [];

  for (var age = 60; age <= 70; age++) {
    retirementAgeList.push({ id: age, value: age.toString() });
  }
};

const getVPSFunds = async () => {
  var route = "VPSPlan";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    let lookupList = Data.map((x: any) => {
      return {
        id: x.vpsPlanId,
        value: x.allocationScheme,
        debtSubFund: x.debtSubFund,
        equitySubFund: x.equitySubFund,
        moneyMarketSubFund: x.moneyMarketSubFund,
        accountCategoryId: x.accountCategoryID,
      };
    });

    vpsFundsList = lookupList.slice();
  }

  // vpsFundsList = [];

  // vpsFundsList.push({ id: 1, value: "PPF - High Volatility Scheme" });
  // vpsFundsList.push({ id: 2, value: "PPF - Medium Volatility Scheme" });
};

const getPlanListByAccountCategory = async (categoryId: any) => {
  let list = vpsFundsList.filter((item: any) => {
    return item.accountCategoryId === categoryId;
  });
  return list;
};

const getModesOfPaymentList = async () => {
  var route = "list/modesOfPayment";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    let lookupList = Data.map((x: any) => {
      return {
        id: x.id,
        value: x.name,
      };
    });

    modeOfPaymentList = lookupList.slice();
  }

  return true;
};

const getModesOfContributionList = async () => {
  var route = "list/modesOfContribution";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    let lookupList = Data.map((x: any) => {
      return {
        id: x.id,
        value: x.name,
      };
    });

    modeOfContributionList = lookupList.slice();
  }

  return true;
};

const getContributionFrequencyList = async () => {
  var route = "list/contributionFrequency";
  var Data = await Api(route, null, "GET", sessionToken);

  if (Data) {
    let lookupList = Data.map((x: any) => {
      return {
        id: x.id,
        value: x.name,
      };
    });

    contributionFrequencyList = lookupList.slice();
  }

  return true;
};

// const getPlanListByAccountCategory = async (categoryId: number) => {
//   return [
//     { id: 1, value: "Plan 1" },
//     { id: 2, value: "Plan 2" },
//   ];

//   if (categoryId === 1) return [];

//   var data = await Api(
//     "BasicInfo/GetPlanList?accountCategory=" + categoryId,
//     null,
//     "GET",
//     sessionToken
//   );

//   console.log({ data });
//   var result;

//   if (data.ResultSet) {
//     // group by planSNo
//     result = data.ResultSet.reduce((r: any, a: any) => {
//       if (!r[a.PlanSno]) {
//         r[a.PlanSno] = {
//           planSno: a.PlanSno,
//           planName: a.PlanName,
//           funds: [],
//         };
//       }

//       r[a.PlanSno].funds.push({
//         fundName: a.FundName.replace("PPF", "").replace("SUB FUND", "").trim(),
//         sharePercentage: a.SharePercentage,
//       });

//       return r;
//     }, Object.create(null));
//   } else result = [];

//   return result;
// };

export {
  countryCodeList,
  netOperatorList,
  genderList,
  mobileOwnList,
  fundPreferenceList,
  languagePrefList,
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
  annualInvestAmountList,
  relationshipList,
  accountCategoryList,
  reasonList,
  natureOfPEPList,
  documentList,
  retirementAgeList,
  vpsFundsList,
  crsCountriesList,
  modeOfPaymentList,
  modeOfContributionList,
  contributionFrequencyList,
  getCities,
  getAreas,
  updateCities,
  updateBirthCities,
  updateAreas,
  getDocumentList,
  getProfessionsByOccupationId,
  getPlanListByAccountCategory,
  getCRSCountries,
};
