import useSecureAPI from "../hooks/usesecureapi";

const useReportService = () => {
  const secureApi = useSecureAPI();

  const getAccountStatement = async (request: any) => {
    var route = "ITMinds/AccountStatementReport";
    var response = await secureApi.post(route, request);
    return response.data;
  };

  const getAccountStatementReport = async (request: any) => {
    var route = "ITMinds/AccountStatement";
    var response = await secureApi.post(route, request);
    return response.data;
  };

  return {
    getAccountStatement,
    getAccountStatementReport,
  };
};

export default useReportService;
