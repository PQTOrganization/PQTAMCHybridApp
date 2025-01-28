import useSecureAPI from "../hooks/usesecureapi";

const useDashboardervice = () => {
  const secureApi = useSecureAPI();

  const getPortfolioValue = async (folioNumber: number) => {
    var route = "dashboard/PortfolioValue/" + folioNumber;
    var response = await secureApi.get(route);
    return response.data;
  };

  const getInvestmentSummary = async (folioNumber: number) => {
    var route =
      `dashboard/InvestmentSummary${process.env.REACT_APP_CLOUD ?? ""}/` +
      folioNumber;
    var response = await secureApi.get(route);
    return response.data;
  };

  const getCategoryWiseBreakup = async (folioNumber: number) => {
    var route =
      `dashboard/CategoryWiseBreakup${process.env.REACT_APP_CLOUD ?? ""}/` +
      folioNumber;
    var response = await secureApi.get(route);
    return response.data;
  };

  const getRiskWiseBreakup = async (folioNumber: number) => {
    var route =
      `dashboard/RiskWiseBreakup${process.env.REACT_APP_CLOUD ?? ""}/` +
      folioNumber;
    var response = await secureApi.get(route);
    return response.data;
  };

  const getFundWiseSummary = async (folioNumber: number) => {
    var route =
      `dashboard/FundWiseSummary${process.env.REACT_APP_CLOUD ?? ""}/` +
      folioNumber;
    var response = await secureApi.get(route);
    return response.data;
  };

  const getDashboardSummary = async (folioNumber: number) => {
    var route =
      `dashboard/Summary${process.env.REACT_APP_CLOUD ?? ""}/` + folioNumber;
    var response = await secureApi.get(route);
    return response.data;
  };

  return {
    getPortfolioValue,
    getInvestmentSummary,
    getCategoryWiseBreakup,
    getRiskWiseBreakup,
    getFundWiseSummary,
    getDashboardSummary,
  };
};

export default useDashboardervice;
