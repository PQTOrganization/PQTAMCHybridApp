import useSecureAPI from "../hooks/usesecureapi";

const useInvestementService = () => {
  const secureApi = useSecureAPI();

  const createInitialInvestmentRequest = async (
    userId: number,
    userApplicationId: number | null,
    fundId: number,
    investmentAmount: number,
    paymentMode: number,
    frontEndLoad: number,
    navApplied: number,
    proofOfPayment: string | null,
    bankId: number | null
  ) => {
    var route = "investmentrequest/initial";
    var body = {
      userId,
      userApplicationId,
      fundId,
      investmentAmount,
      paymentMode,
      frontEndLoad,
      navApplied,
      proofOfPayment,
      bankId,
    };
    var response = await secureApi.post(route, body);
    return response.data;
  };

  const createInvestmentRequest = async (
    userId: number,
    folioNumber: number,
    fundId: number,
    investmentAmount: number,
    paymentMode: number,
    frontEndLoad: number,
    navApplied: number,
    proofOfPayment: string | null,
    bankId: number | null,
    branchId: string | null,
    bankName: string | null,
    accountNo: string | null,
    itMindsBankID: string | null
  ) => {
    var route = "investmentrequest";
    var body = {
      userId,
      folioNumber,
      fundId,
      investmentAmount,
      paymentMode,
      frontEndLoad,
      navApplied,
      proofOfPayment,
      bankId: bankId,
      branchId,
      bankName,
      accountNumber: accountNo,
      itMindsBankID: itMindsBankID,
    };
    var response = await secureApi.post(route, body);
    return response.data;
  };

  const createRedemptionRequest = async (
    userId: number,
    folioNumber: number,
    fundId: number,
    redemptionAmount: number,
    backEndLoad: number,
    navApplied: number,
    bankID: string,
    bankAccountNo: string
  ) => {
    var route = "redemptionrequest";
    var body = {
      userId,
      folioNumber,
      fundId,
      redemptionAmount,
      backEndLoad,
      navApplied,
      bankID,
      bankAccountNo,
    };
    var response = await secureApi.post(route, body);
    return response.data;
  };

  const createFundToFundTransferRequest = async (
    userId: number,
    folioNumber: number,
    fromFundId: number,
    transferAmount: number,
    fromNavApplied: number,
    fromNumOfUnits: number,
    toFundId: number,
    toNavApplied: number,
    toNumOfUnits: number
  ) => {
    var route = "fundtransferrequest";
    var body = {
      userId,
      folioNumber,
      fromFundId,
      transferAmount,
      fromNavApplied,
      fromNumOfUnits,
      toFundId,
      toNavApplied,
      toNumOfUnits,
    };
    var response = await secureApi.post(route, body);
    return response.data;
  };

  const getFundWisePosition = async (folioNumber: number) => {
    console.log("cloud", process.env.REACT_APP_CLOUD);
    var route =
      `investment/fundwiseposition/${
        process.env.REACT_APP_CLOUD ? process.env.REACT_APP_CLOUD + "/" : ""
      }` + folioNumber;
    console.log("route", route);
    var response = await secureApi.get(route);
    return response.data;
  };

  const getAllFundWisePosition = async (folioNumber: number) => {
    var route = "investment/allfundwiseposition/" + folioNumber;
    var response = await secureApi.get(route);
    return response.data;
  };

  const getFolioBanks = async (userId: number) => {
    var route = "redemptionrequest/banks/" + userId;

    var response = await secureApi.get(route);
    return response.data;
  };

  return {
    createInitialInvestmentRequest,
    createInvestmentRequest,
    createRedemptionRequest,
    createFundToFundTransferRequest,
    getFundWisePosition,
    getAllFundWisePosition,
    getFolioBanks,
  };
};

export default useInvestementService;
