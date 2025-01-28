import useSecureAPI from "../hooks/usesecureapi";

const useTransactionService = () => {
  const secureApi = useSecureAPI();

  const getTransactionsForFolio = async (folioNumber: number) => {
    var route =
      `transactions/ForFolio/${
        process.env.REACT_APP_CLOUD ? process.env.REACT_APP_CLOUD + "/" : ""
      }` + folioNumber;

    var response = await secureApi.get(route);
    return response.data;
  };

  const getPendingTransactionsForFolio = async (folioNumber: number) => {
    var route = "transactions/Pending/ForFolio/" + folioNumber;
    var response = await secureApi.get(route);
    return response.data;
  };

  return { getPendingTransactionsForFolio, getTransactionsForFolio };
};

export default useTransactionService;
