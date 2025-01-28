import React, { useEffect, useState } from "react";
import { Typography, IconButton } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DelIcon from "@mui/icons-material/Delete";

import TextFieldDX from "../../controls/textfielddx";
import SelectListDX from "../../controls/selectlistdx";
import Navigation from "../../controls/navigation";
import TooltipHelper from "../../controls/tooltip";

import { useAuthContext } from "../../../context/authcontext";

import {
  educationList,
  incomeSourceList,
  occupationList,
  annualIncomeList,
  getProfessionsByOccupationId,
} from "../../../shared/lookups";

import { useValidationContext } from "../../../context/validationcontext";
import GridDX from "../../layout/griddx";
import BoxDX from "../../layout/boxdx";

const KYC = (props: any) => {
  const { inDiscrepancyMode, isDiscrepantField } = useAuthContext();
  const { errors, validateField } = useValidationContext();

  const [sourceOfIncome, setSourceOfIncome] = useState(
    props.data.sourceOfIncome
  );
  const [index, setIndex] = useState(0);
  const [professionList, setProfessionList] = useState([]);
  const INCOME_ALLOWED = 2;

  const AddIncome = () => {
    setIndex(index + 1);
    let newSource = sourceOfIncome;
    newSource.push(0);
    setSourceOfIncome(newSource);
  };

  const DeleteIncome = (index: number) => {
    let newSource = sourceOfIncome.slice();
    newSource.splice(index, 1);

    console.log({ sourceOfIncome }, { newSource });

    setSourceOfIncome(newSource);
    props.onChangeAction(
      {
        target: { id: "sourceOfIncome", value: newSource },
      },
      newSource
    );
    setIndex(index - 1);
  };

  const handleSourceOfIncome = (e: any, i: any, v: any) => {
    let sourceOfIncome = props.data.sourceOfIncome;
    let newSource = sourceOfIncome;
    newSource[i] = v;
    setSourceOfIncome(newSource);
    props.onChangeAction(
      {
        target: { id: "sourceOfIncome", value: newSource },
      },
      newSource
    );
  };

  const handleNext = (resetNav: any) => {
    props.onNextAction(resetNav);
  };

  const onOccupationChange = async (e: any, v: any) => {
    props.onChangeAction(e, v);
    var list = await getProfessionsByOccupationId(v.id);
    setProfessionList(list);
  };

  const toInputUppercase = (e: any) => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };

  useEffect(() => {
    if (props.data) {
      if (professionList.length === 0 && props.data.occupationId) {
        getProfessionsByOccupationId(props.data.occupationId.id)
          .then((list) => {
            setProfessionList(list);
          })
          .catch((ex) => console.log(ex));
      }
    }
  }, [props.data]);

  return (
    <>
      <GridDX container spacing={props.readOnly ? 2 : 4}>
        <GridDX item xs={12} sm={6}>
          <SelectListDX
            id="educationId"
            name="educationId"
            label="Education"
            list={educationList}
            value={props.data.educationId}
            onChange={(e: any, v: any) => props.onChangeAction(e, v)}
            error={errors["educationId"] ? true : false}
            helperText={errors["educationId"]}
            readOnly={props.readOnly}
            disabled={inDiscrepancyMode() && !isDiscrepantField("educationId")}
            onBlur={() => validateField("educationId", props.data.educationId)}
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <SelectListDX
            id="occupationId"
            name="occupationId"
            label="Occupation"
            list={occupationList}
            value={props.data.occupationId}
            onChange={(e: any, v: any) => onOccupationChange(e, v)}
            error={errors["occupationId"] ? true : false}
            helperText={errors["occupationId"]}
            readOnly={props.readOnly}
            disabled={inDiscrepancyMode() && !isDiscrepantField("occupationId")}
            onBlur={() =>
              validateField("occupationId", props.data.occupationId)
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <SelectListDX
            id="professionId"
            name="professionId"
            label="Profession"
            tip={`Please search and select your profession from the list and if you cannot find your relevant profession then choose value close to your profession`}
            list={professionList}
            value={props.data.professionId}
            onChange={(e: any, v: any) => props.onChangeAction(e, v)}
            error={errors["professionId"] ? true : false}
            helperText={errors["professionId"]}
            readOnly={props.readOnly}
            disabled={inDiscrepancyMode() && !isDiscrepantField("professionId")}
            onBlur={() =>
              validateField("professionId", props.data.professionId)
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <SelectListDX
            id="annualIncomeId"
            name="annualIncomeId"
            label="Annual Income"
            tip={`Annual income is the amount of income you earn in one fiscal year. Your annual income includes everything from your yearly salary, bonuses, commissions, freelance income, overtime and any other business income.`}
            list={annualIncomeList}
            value={props.data.annualIncomeId}
            onChange={(e: any, v: any) => props.onChangeAction(e, v)}
            error={errors["annualIncomeId"] ? true : false}
            helperText={errors["annualIncomeId"]}
            readOnly={props.readOnly}
            disabled={
              inDiscrepancyMode() && !isDiscrepantField("annualIncomeId")
            }
            onBlur={() =>
              validateField("annualIncomeId", props.data.annualIncomeId)
            }
          />
        </GridDX>
        <GridDX item xs={12} sm={6}>
          <GridDX container sx={{ width: "100%" }} spacing={0}>
            <GridDX item xs={12} sx={{ flexDirection: "column" }}>
              {sourceOfIncome.map((d: any, index: number) => (
                <div
                  key={"inc_" + index}
                  style={{ display: "flex", flexDirection: "row", flex: 1 }}
                >
                  <SelectListDX
                    id={"sourceOfIncome" + index}
                    name="sourceOfIncome"
                    label="Regular Source of Income/Funds"
                    list={incomeSourceList}
                    value={d}
                    onChange={(e: any, v: any) =>
                      handleSourceOfIncome(e, index, v)
                    }
                    error={errors["sourceOfIncome"] ? true : false}
                    helperText={errors["sourceOfIncome"]}
                    readOnly={props.readOnly}
                    style={{
                      marginBottom: index <= sourceOfIncome.length - 1 ? 10 : 0,
                      marginTop: index === 0 ? 0 : 10,
                    }}
                    disabled={
                      inDiscrepancyMode() &&
                      !isDiscrepantField("sourceOfIncome")
                    }
                    onBlur={() =>
                      validateField("sourceOfIncome", props.data.sourceOfIncome)
                    }
                  />

                  {props.readOnly ||
                  (inDiscrepancyMode() && !isDiscrepantField("sourceOfIncome"))
                    ? null
                    : index > 0 && (
                        <IconButton
                          color="error"
                          size="small"
                          style={{
                            margin: 5,
                          }}
                          onClick={() => DeleteIncome(index)}
                        >
                          <DelIcon fontSize="small" />
                        </IconButton>
                      )}
                </div>
              ))}
            </GridDX>
            {props.readOnly ||
            (inDiscrepancyMode() && !isDiscrepantField("sourceOfIncome"))
              ? null
              : sourceOfIncome.length < INCOME_ALLOWED && (
                  <GridDX item xs={12}>
                    <BoxDX
                      style={{
                        display: "flex",
                        marginTop: 10,
                        marginBottom: 10,
                        fontSize: 12,
                        alignItems: "center",
                        color:
                          sourceOfIncome.length === INCOME_ALLOWED
                            ? "#eaeaf0"
                            : "#8B0037",
                      }}
                    >
                      <IconButton
                        color="primary"
                        style={{
                          background:
                            sourceOfIncome.length === INCOME_ALLOWED
                              ? "#eaeaf0"
                              : "#8B0037",
                          color:
                            sourceOfIncome.length === INCOME_ALLOWED
                              ? "black"
                              : "#fff",
                          borderRadius: "0px",
                          padding: 0,
                          maxHeight: 24,
                        }}
                        onClick={AddIncome}
                        disabled={sourceOfIncome.length === INCOME_ALLOWED}
                      >
                        <AddIcon />
                      </IconButton>
                      <Typography variant={"body1"} sx={{ ml: 1 }}>
                        Add Another Regular Source of Income/Funds
                      </Typography>
                    </BoxDX>
                  </GridDX>
                )}
          </GridDX>
        </GridDX>
        {/* {props.data.accountCategoryId.id === 1 && (
          <div style={{ display: "none" }}>
            <GridDX item xs={12} style={{ padding: 16, paddingBottom: 8 }}>
              <Typography
                variant={"h6"}
                style={{ fontSize: "16px", fontWeight: "bold" }}
              >
                Next to Kin Detail{" "}
                <TooltipHelper
                  show={!props.readOnly}
                  title="Determining next-of-kin relationship details are important in case we are unable to get in touch with you.
                        A person's next of kin could be their closest living blood relative, including spouses and adopted family members."
                />
              </Typography>
            </GridDX>
            <GridDX item xs={12} sm={6}>
              <TextFieldDX
                name="nokName"
                value={props.data.nokName}
                label="Name"
                onChange={(e: any) => props.onChangeAction(e)}
                error={errors["nokName"] ? true : false}
                helperText={errors["name"]}
                readOnly={props.readOnly}
                onInput={toInputUppercase}
                onBlur={() => validateField("nokName", props.data.nokName)}
              />
            </GridDX>
            <GridDX item xs={12} sm={6}>
              <TextFieldDX
                name="nokmobileNumber"
                value={props.data.nokmobileNumber}
                label="Mobile Number"
                onChange={(e: any) => props.onChangeAction(e)}
                error={errors["nokmobileNumber"] ? true : false}
                helperText={errors["nokmobileNumber"]}
                readOnly={props.readOnly}
                type="number"
                onInput={(e: any) => {
                  e.target.value = Math.max(0, parseInt(e.target.value))
                    .toString()
                    .slice(0, 11);
                }}
              />
            </GridDX>
          </div>
        )} */}

        {!props.readOnly && (
          <GridDX item xs={12}>
            <Navigation
              onPrevAction={props.onPrevAction}
              onNextAction={handleNext}
            />
          </GridDX>
        )}
      </GridDX>
    </>
  );
};

export default KYC;
