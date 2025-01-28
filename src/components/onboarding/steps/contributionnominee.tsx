import React, { useState, useEffect } from "react";
import { useMediaQuery, useTheme, Typography } from "@mui/material/";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Navigation from "../../controls/navigation";
import { useAuthContext } from "../../../context/authcontext";
import { useValidationContext } from "../../../context/validationcontext";
import GridDX from "../../layout/griddx";
import Nominee from "./nominee";
import { LoadingButton } from "@mui/lab";
import Api from "../../../shared/api/api";

const ContributionNominee = (props: any) => {
  const { getToken } = useAuthContext();

  const theme = useTheme();
  const useMobileView = useMediaQuery(theme.breakpoints.down("xs"));
  const { errors, validateField, validatevpsSubFundValues } =
    useValidationContext();

  const [nomineesData, setNomineesData] = useState<any>([]);
  const [totalNominees, setTotalNominees] = useState(1);
  const [disableAddButton, setDisableAddButton] = useState(false);
  const [totalShare, setTotalShare] = useState(0);

  const token = getToken();

  const addNomineeData = (index: number, data: any) => {
    let newNominees = [
      ...nomineesData.slice(0, index),
      data,
      ...nomineesData.slice(index + 1),
    ];

    let share = 0;
    newNominees.forEach((nom) => (share += parseInt(nom.share)));
    validateField("nomineesShare", share);
    setTotalShare(share);
    setNomineesData(newNominees);
  };

  const getUserAppNominees = async () => {
    await Api(
      "UserApplicationNominee/application/" + props.data.userApplicationId,
      null,
      "GET",
      token
    ).then((response) => {
      setNomineesData(response);
      if (response.length > 0) {
        setTotalNominees(response.length);
      }
    });
  };

  useEffect(() => {
    if (props.data && nomineesData.length === 0) {
      getUserAppNominees();
    }
  }, [props.data]);

  const onNextClick = async () => {
    await Api(`UserApplicationNominee`, nomineesData, "POST", token).then(
      (response) => {
        console.log("response", response);
      }
    );

    props.onChangeAction({ target: { name: "nominees", value: nomineesData } });

    props.onNextAction();
  };

  const onDeleteNominee = async (index: number) => {
    let toDelete = nomineesData[index];
    if (toDelete.userApplicationNomineeId > 0) {
      await Api(
        `UserApplicationNominee/` + toDelete.userApplicationNomineeId,
        null,
        "DELETE",
        token
      ).then((response) => {
        console.log("response", response);
      });
    }

    setNomineesData([
      ...nomineesData.slice(0, index),
      ...nomineesData.slice(index + 1),
    ]);
    setTotalNominees(totalNominees - 1);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <GridDX container spacing={props.readOnly ? 2 : useMobileView ? 2 : 4}>
        <GridDX item>
          <Typography style={{ color: "#d32f2f", marginBottom: "5px" }}>
            {errors["nomineesShare"]}
          </Typography>
        </GridDX>
        {(() => {
          const arr = [];
          for (let i = 0; i < totalNominees; i++) {
            arr.push(
              <Nominee
                readOnly={props.readOnly}
                index={i}
                onChangeData={addNomineeData}
                data={props.data}
                nominee={nomineesData[i]}
                onDelete={onDeleteNominee}
              />
            );
          }
          return arr;
        })()}

        {!props.readOnly && (
          <GridDX item xs={12}>
            <LoadingButton
              variant="contained"
              // loading={isNextLoading}

              style={{ height: 36.5 }}
              onClick={() => {
                setTotalNominees(totalNominees + 1);
                if (totalNominees + 1 === 5) {
                  setDisableAddButton(true);
                }
              }}
              // onClick={() => {
              //   setNextLoading(true);
              //   props.onNextAction(resetNav);
              // }}
              disabled={
                (props.disable === undefined ? false : !props.disable) ||
                disableAddButton
              }
            >
              Add Nominee
            </LoadingButton>
            <Navigation
              onPrevAction={props.onPrevAction}
              onNextAction={onNextClick}
            />
          </GridDX>
        )}
      </GridDX>
    </LocalizationProvider>
  );
};

export default ContributionNominee;
