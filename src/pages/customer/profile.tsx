import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import GridDX from "../../components/layout/griddx";
import { useAuthContext } from "../../context/authcontext";
import { useErrorContext } from "../../context/errorcontext";
import PersonIcon from "@mui/icons-material/Person";
import TextFieldDX from "../../components/controls/textfielddx";
import { zeroPad } from "../../shared/global";

const Profile = () => {
  const { setError, setInfo } = useErrorContext();
  const { getUserDetails } = useAuthContext();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    getUserDetails()
      .then((userDetails: any) => {
        setUserDetails(userDetails);
        console.log("userDetails", userDetails);
      })
      .catch((err: any) => setError(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <GridDX container sx={{ width: "100%" }}>
      {isLoading || userDetails == null ? (
        <Skeleton
          containerClassName="skeleton-container"
          count={2}
          style={{ height: 150, marginBottom: 8 }}
        />
      ) : (
        <GridDX item container sx={{ width: "100%" }}>
          <GridDX item xs={12} sx={{ justifyContent: "center" }}>
            {userDetails.profile ? (
              <Avatar
                alt={userDetails.firstName}
                src={userDetails.profile}
                sx={{ width: 56, height: 56 }}
              />
            ) : (
              <Avatar sx={{ width: 56, height: 56 }}>
                <PersonIcon fontSize="large" />
              </Avatar>
            )}
          </GridDX>
          <GridDX item xs={12}>
            <TextFieldDX
              name="firstName"
              value={userDetails.currentFolioName}
              label="Full Name"
              readOnly
            />
          </GridDX>
          {/* <GridDX item xs={12}>
            <TextFieldDX
              name="lastName"
              value={userDetails.lastName}
              label="Last Name"
              readOnly
            />
          </GridDX> */}
          <GridDX item xs={12}>
            <TextFieldDX
              name="folioNumber"
              value={zeroPad(userDetails.currentFolioNumber, 7)}
              label="Folio Number"
              readOnly
            />
          </GridDX>
          <GridDX item xs={12}>
            <TextFieldDX label="Email" value={userDetails.email} readOnly />
          </GridDX>
          <GridDX item xs={12}>
            <TextFieldDX
              name="mobileNumber"
              label="Mobile Number"
              value={userDetails.mobileNumber}
              readOnly
            />
          </GridDX>
        </GridDX>
      )}
    </GridDX>
  );
};

export default Profile;
