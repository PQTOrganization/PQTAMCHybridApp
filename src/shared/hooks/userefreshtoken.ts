import { useAuthContext } from "../../context/authcontext";
import { apiCall } from "../api/secureapi";

const useRefreshToken = () => {
  const { updateTokenInfo, fullToken } = useAuthContext();

  const refresh = async () => {
    const response = await apiCall.post("/user/RefreshToken", fullToken);
    updateTokenInfo(response.data);
    return response.data.token;
  };

  return refresh;
};

export default useRefreshToken;
