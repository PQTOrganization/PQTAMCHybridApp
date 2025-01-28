import useSecureAPI from "../hooks/usesecureapi";

const useUserApplicationService = () => {
  const secureApi = useSecureAPI();

  const getUserApplication = async (id: number) => {
    var route = "UserApplication/" + id;
    var response = await secureApi.get(route);
    return response.data;
  };

  const updateUserApplication = async (
    userApplicationID: number,
    data: any
  ) => {
    var route = "UserApplication/" + userApplicationID;
    var response = await secureApi.put(route, data);
    return response.data;
  };

  const addUserApplication = async (data: any) => {
    var route = "UserApplication";
    var response = await secureApi.post(route, data);
    return response.data;
  };

  return { getUserApplication, addUserApplication, updateUserApplication };
};

export default useUserApplicationService;
