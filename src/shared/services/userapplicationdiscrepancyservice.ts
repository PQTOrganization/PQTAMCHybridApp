import useSecureAPI from "../hooks/usesecureapi";

const useUserApplicationDiscrepancyService = () => {
  const secureApi = useSecureAPI();

  const getForUserApplication = async (userApplicationID: number) => {
    var route =
      "UserApplicationDiscrepancy/ForApplication/" + userApplicationID;
    var response = await secureApi.get(route);
    return response.data;
  };

  const updateUserApplication = async (
    userApplicationID: number,
    data: any
  ) => {
    var route = "UserApplication/" + userApplicationID;
    var Data = await secureApi.put(route, data);
    return Data;
  };

  const addUserApplication = async (data: any) => {
    var route = "UserApplication";
    var Data = await secureApi.post(route, data);
    return Data;
  };

  return { getForUserApplication, addUserApplication, updateUserApplication };
};

export default useUserApplicationDiscrepancyService;
