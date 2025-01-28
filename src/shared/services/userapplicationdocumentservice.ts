import useSecureAPI from "../hooks/usesecureapi";

const useUserApplicationDocumentService = () => {
  const secureApi = useSecureAPI();

  const allforUser = async (id: number) => {
    var route = "UserApplicationDocument/AllForUser/" + id;
    var response = await secureApi.get(route);
    return response.data;
  };

  return { allforUser };
};

export default useUserApplicationDocumentService;
