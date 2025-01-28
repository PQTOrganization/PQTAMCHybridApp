import React, { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";

const AuthContext = createContext<any | null>(null);
const useAuthContext = () => useContext(AuthContext);

interface AuxProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuxProps) => {
  useEffect(() => {
    const sessionInfo = localStorage.getItem("userOnboardSession");

    if (sessionInfo && sessionInfo.length > 0) {
      try {
        const sessionInfoJSON = JSON.parse(sessionInfo);

        if (sessionInfoJSON.token) {
          const userData = sessionInfoJSON;
          const token = sessionInfoJSON.token;

          dispatch({ type: "SIGN_IN", userData: userData, token: token });
        }
      } catch (ex) {
        console.log("Error parsing session info:", ex);
      }
    }
  }, []);

  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLogedIn: true,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isLoggedIn: true,
            userData: action.userData,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isLoggedIn: false,
            userData: null,
            userToken: null,
            discrepantData: null,
          };

        case "UPDATE_APPLICATION_STATUS":
          return {
            ...prevState,
            userData: {
              ...prevState.userData,
              applicationStatusId: action.status,
            },
          };

        case "SET_ACCOUNT_LEVEL":
          return {
            ...prevState,
            userAccountLevel: action.payload,
          };

        case "SET_DISCREPANT_DATA":
          return {
            ...prevState,
            discrepantData: action.payload,
          };

        case "SET_DEVICE_SOURCE":
          return {
            ...prevState,
            deviceSource: action.payload,
          };
      }
    },
    {
      isLoggedIn: false,
      userData: null,
      userToken: null,
      userAccountLevel: 0,
      discrepantData: null,
      deviceSource: "",
    }
  );

  const signUp = async (data: any, token: string) => {
    const encodedToken = window.btoa(token);

    localStorage.setItem(
      "userOnboardSession",
      JSON.stringify({ ...data, token: encodedToken })
    );
    dispatch({
      type: "SIGN_IN",
      userData: data.UserSession,
      token: encodedToken,
    });
  };

  const signIn = async (data: any, token: string) => {
    const encodedToken = window.btoa(token);

    localStorage.setItem(
      "userOnboardSession",
      JSON.stringify({ ...data, token: encodedToken })
    );
    dispatch({
      type: "SIGN_IN",
      userData: data,
      token: encodedToken,
    });
  };

  const signOut = () => {
    localStorage.removeItem("userOnboardSession");
    dispatch({ type: "SIGN_OUT" });
  };

  const getToken = () => {
    return window.atob(state.userToken);
  };

  const getUserDetails = async () => {
    const sessionInfo = localStorage.getItem("userOnboardSession");

    if (sessionInfo && sessionInfo.length > 0) {
      try {
        const sessionInfoJSON = JSON.parse(sessionInfo);
        return sessionInfoJSON;
      } catch (ex) {
        console.log("Error parsing session info:", ex);
        return {};
      }
    }
  };

  const getReloginDetails = () => {
    const sessionInfo = localStorage.getItem("reloginDetails");

    if (sessionInfo && sessionInfo.length > 0) {
      try {
        const sessionInfoJSON = JSON.parse(sessionInfo);
        return sessionInfoJSON;
      } catch (ex) {
        console.log("Error parsing session info:", ex);
        return {};
      }
    }
  };

  const setReloginDetails = async (reloginDetails: any) => {
    if (reloginDetails === null) {
      localStorage.removeItem("reloginDetails");
    } else {
      localStorage.setItem("reloginDetails", JSON.stringify(reloginDetails));
      console.log("loginDetails: " + JSON.stringify(reloginDetails));
    }
  };

  const getThanksData = async () => {
    const sessionInfo = localStorage.getItem("finalSubmitted");

    if (sessionInfo && sessionInfo.length > 0) {
      try {
        const sessionInfoJSON = JSON.parse(sessionInfo);
        return sessionInfoJSON;
      } catch (ex) {
        console.log("Error parsing session info:", ex);
        return {};
      }
    }
  };

  const setThanksData = async (finalSubmitted: any) => {
    if (finalSubmitted === null) {
      localStorage.removeItem("finalSubmitted");
    } else {
      localStorage.setItem("finalSubmitted", JSON.stringify(finalSubmitted));
    }
  };

  const updateUserApplicationId = async (userApplicationId: number) => {
    const sessionInfo = localStorage.getItem("userOnboardSession");

    if (sessionInfo && sessionInfo.length > 0) {
      try {
        const sessionInfoJSON = JSON.parse(sessionInfo);

        const updatedSessionInfo = {
          ...sessionInfoJSON,
          userApplicationId: userApplicationId,
        };

        localStorage.setItem(
          "userOnboardSession",
          JSON.stringify(updatedSessionInfo)
        );
      } catch (ex) {
        console.log("Error parsing session info:", ex);
        return {};
      }
    }
  };

  const updateUserApplicationStatus = async (statusValue: number) => {
    const sessionInfo = localStorage.getItem("userOnboardSession");

    if (sessionInfo && sessionInfo.length > 0) {
      try {
        const sessionInfoJSON = JSON.parse(sessionInfo);

        const updatedSessionInfo = {
          ...sessionInfoJSON,
          applicationStatusId: statusValue,
        };

        localStorage.setItem(
          "userOnboardSession",
          JSON.stringify(updatedSessionInfo)
        );

        dispatch({
          type: "UPDATE_APPLICATION_STATUS",
          status: statusValue,
        });
      } catch (ex) {
        console.log("Error parsing session info:", ex);
        return {};
      }
    }
  };

  const removeUserData = async () => {
    localStorage.removeItem("userOnboardSession");
  };

  const setDiscrepantData = (discrepantData: any) => {
    dispatch({ type: "SET_DISCREPANT_DATA", payload: discrepantData });
  };

  const getDiscrepantData = () => {
    return state.discrepantData;
  };

  const inDiscrepancyMode = () => {
    if (state.discrepantData) return true;
    else return false;
  };

  const isDiscrepantField = (fieldName: string) => {
    if (state.discrepantData && state.discrepantData.length > 0) {
      const discrepantData = state.discrepantData;

      if (discrepantData.length > 0) {
        const index = discrepantData.findIndex(
          (x: string) => x.toLowerCase() === fieldName.toLowerCase()
        );

        return index > -1;
      } else return false;
    }
    return false;
  };

  const isDiscrepantDoc = (docId: number) => {
    if (state.discrepantData && state.discrepantData.length > 0) {
      const discrepantDocs = state.discrepantData.filter((d: string) =>
        d.includes("doc_")
      );

      console.log({ discrepantDocs }, docId);
      if (discrepantDocs.length > 0) {
        const index = discrepantDocs.findIndex((x: string) =>
          x.includes("doc_" + docId)
        );
        return index > -1;
      } else return false;
    }
    return false;
  };

  const getDeviceSource = () => {
    return state.deviceSource;
  };

  const setDeviceSource = (source: any) => {
    dispatch({ type: "SET_DEVICE_SOURCE", payload: source });
  };

  const updateCurrentFolioNumber = async (
    newFolioNumber: string,
    newFolioName: string
  ) => {
    const sessionInfo = localStorage.getItem("userOnboardSession");

    if (sessionInfo && sessionInfo.length > 0) {
      try {
        const sessionInfoJSON = JSON.parse(sessionInfo);

        const updatedSessionInfo = {
          ...sessionInfoJSON,
          currentFolioNumber: newFolioNumber,
          currentFolioName: newFolioName,
        };

        localStorage.setItem(
          "userOnboardSession",
          JSON.stringify(updatedSessionInfo)
        );
      } catch (ex) {
        console.log("Error parsing session info:", ex);
        return {};
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: state.isLoggedIn,
        applicationStatus: state.userData?.applicationStatusId,
        token: window.atob(state.userToken),
        signUp,
        signIn,
        signOut,
        getToken,
        getUserDetails,
        getReloginDetails,
        setReloginDetails,
        getThanksData,
        setThanksData,
        updateUserApplicationId,
        updateUserApplicationStatus,
        removeUserData,
        setDiscrepantData,
        getDiscrepantData,
        inDiscrepancyMode,
        isDiscrepantField,
        isDiscrepantDoc,
        getDeviceSource,
        setDeviceSource,
        updateCurrentFolioNumber,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuthContext };
