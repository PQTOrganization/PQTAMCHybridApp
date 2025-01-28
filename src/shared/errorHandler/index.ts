export default function errorHandler(error: any) {
  //console.log("Error Handler is Executing...");
  switch (error) {
    case "INVALID_LOGIN_ATTEMPT":
      throw new Error("please enter a valid phone number / password.");

    case "Invalid response from SMS gateway.":
      throw new Error("Please verify phone number");
    case "MEMBER_ALREADY_EXISTS":
      throw new Error("You are already a member of this committee");
    case "MEMBER_REMOVED_BY_ADMIN":
      throw new Error(
        "Your membership request has already been rejected by the admin."
      );
    default:
      throw error;
  }
}
