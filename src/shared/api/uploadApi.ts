import { API_URL_1 } from "../../context/configcontext";
import errorHandler from "../errorHandler";

export default async function UploadApi(
  route: string,
  body: any,
  method = "POST"
) {
  var url = API_URL_1 + route;

  if (body != null) {
    body = JSON.stringify(body);
  }

  var config: any = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body != null) {
    config.body = body;
  }

  var Data = await fetch(url, config)
    .then(async (response) => {
      console.log(response);
      if (response.ok) return Promise.resolve(response.json());

      if (!response.ok && response.status === 401) {
        throw "You are unauthorized.";
      }

      return Promise.resolve(response.json()).then((responseInJson) => {
        return Promise.reject(responseInJson);
      });
    })
    .then(function (result) {
      //console.log('API response ==>' + JSON.stringify(result));
      return result;
    })
    .catch(function (error) {
      if (method !== "PUT") {
        //console.log('Error: ' + JSON.stringify(error));
        if (error.Message === undefined) {
          errorHandler(error);
          return;
        }
        if (error.Message !== null) {
          errorHandler(error.Message);
          return;
        }
      }
    });
  return Data;
}
