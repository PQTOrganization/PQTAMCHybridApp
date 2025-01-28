import Api from "../api/api";

export async function sendOTP(number: string) {
  var route = "User/sendOTP";
  var body = {
    email: "",
    mobile_number: number,
    otp: "0",
  };
  var Data = await Api(route, body, "POST");
  return Data;
}

export async function register(number: string, email: string) {
  var route = "User";
  var body = {
    email: email,
    mobileNumber: number,
  };
  var Data = await Api(route, body, "POST");
  return Data;
}

export async function verifyOTP(otp: string, number: string) {
  var route = "User/login";
  var body = {
    email: "",
    mobile_number: number,
    otp: otp,
  };
  var Data = await Api(route, body, "POST");
  return Data;
}
