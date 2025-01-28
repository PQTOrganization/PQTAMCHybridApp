import useSecureAPI from "../hooks/usesecureapi";

const useFundsService = () => {
  const secureApi = useSecureAPI();

  const getFunds = async () => {
    var route =
      "fund" +
      (process.env.REACT_APP_CLOUD ? "/" + process.env.REACT_APP_CLOUD : "");
    var response = await secureApi.get(route);
    return response.data;
  };

  const getFundsByAcctCategory = async (accountCategoryID: number) => {
    var route =
      "fund" +
      (process.env.REACT_APP_CLOUD ? "/" + process.env.REACT_APP_CLOUD : "") +
      "/" +
      accountCategoryID;
    var response = await secureApi.get(route);
    return response.data;
  };

  const getFundsWithBanks = async () => {
    var route =
      "fund/banks" +
      (process.env.REACT_APP_CLOUD ? "/" + process.env.REACT_APP_CLOUD : "");
    var response = await secureApi.get(route);
    return response.data;
  };

  return {
    getFunds,
    getFundsByAcctCategory,
    getFundsWithBanks,
  };
};

export default useFundsService;
