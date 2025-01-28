import useSecureAPI from "../hooks/usesecureapi";

const usePaymentService = () => {
  const secureApi = useSecureAPI();

  const getPaymentKey = async (orderId: string) => {
    var route = "payment/encrypteddata/" + orderId;
    var Data = await secureApi.get(route);
    return Data;
  };
  return { getPaymentKey };
};

export default usePaymentService;
