import axios from "axios";

export const apiCall = axios.create({
  baseURL: process.env.REACT_APP_BASE_API,
});

export const secureAPI = axios.create({
  baseURL: process.env.REACT_APP_BASE_API,
});

// Add a response interceptor
apiCall.interceptors.response.use(
  // Any status code that lie within the range of 2xx cause this function to trigger
  (response) => response,
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  async (error) => {
    console.log("secure api response error:", { error });

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

/* 
EXAMPLE CALL
  
  var response = await apiCall.get("client");
  return response.data;
  
*/
