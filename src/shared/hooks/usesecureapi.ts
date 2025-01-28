import { useEffect } from "react";
import { useAuthContext } from "../../context/authcontext";
import { secureAPI } from "../api/secureapi";
import useRefreshToken from "./userefreshtoken";

const useSecureAPI = () => {
  const { token } = useAuthContext();
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept = secureAPI.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = secureAPI.interceptors.response.use(
      (response) => response,
      async (error) => {
        // console.log("secure api response error:", { error });

        const prevRequest = error?.config;
        console.log("error?.response?.status", error?.response?.status);
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          console.log("UNAUTHORIZED");
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return secureAPI(prevRequest);
        }

        if (error.response?.data instanceof Blob) {
          const message = await error.response?.data.text();
          const messageObj = JSON.parse(message);

          if (messageObj) return Promise.reject(messageObj);
          else return Promise.reject(message);
        } else {
          const errorMessage =
            error?.response?.data?.Message ?? error.message ?? error;

          console.log({ errorMessage });
          return Promise.reject(errorMessage);
        }
      }
    );

    return () => {
      secureAPI.interceptors.request.eject(requestIntercept);
      secureAPI.interceptors.response.eject(responseIntercept);
    };
  }, [token, refresh]);

  return secureAPI;
};

export default useSecureAPI;
