import useSecureAPI from "../hooks/usesecureapi";

const useBankAccountService = () => {
  const secureApi = useSecureAPI();

  const getAllBanksforUser = async (userId: number) => {
    var route = "UserBank/user/" + userId;
    var response = await secureApi.get(route);
    return response.data;
  };

  const getUserBankById = async (userbankId: number) => {
    var route = "UserBank/" + userbankId;
    var Data = await secureApi.get(route);
    return Data;
  };

  const updateUserBank = async (userbankId: number, userBank: any) => {
    var route = "UserBank/" + userbankId;
    var Data = await secureApi.put(route, userBank);
    return Data;
  };

  const addUserBank = async (userBank: any) => {
    var route = "UserBank";
    var Data = await secureApi.post(route, userBank);
    return Data;
  };

  return {
    getAllBanksforUser,
    getUserBankById,
    updateUserBank,
    addUserBank,
  };
};

export default useBankAccountService;
