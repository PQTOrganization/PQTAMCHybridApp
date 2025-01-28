import React, { useEffect, useState, useContext } from "react";
import {
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";

import SelectListDX from "../../controls/selectlistdx";
import Navigation from "../../controls/navigation";
import TextFieldDX from "../../controls/textfielddx";
import YesNoSwitch from "../../controls/yesnoswitch";
import GridDX from "../../layout/griddx";

import { natureOfPEPList } from "../../../shared/lookups";
import Alert from "../../alerts/alert";

import { useAuthContext } from "../../../context/authcontext";
import { useValidationContext } from "../../../context/validationcontext";

const AdditionalKYC = (props: any) => {
  const theme = useTheme();
  const useMobileView = useMediaQuery(theme.breakpoints.down("xs"));
  const { inDiscrepancyMode, isDiscrepantField } = useAuthContext();
  const { errors, validateField } = useValidationContext();

  const [showPEP, setShoWPep] = useState(false);
  const [open, setOpen] = useState(false);
  const [isNavLoading, setNavLoading] = useState(false);

  useEffect(() => {
    setShoWPep(IsAnyPEPOptionSelected);
  }, []);

  const handleClose = () => {
    setNavLoading(false);
    setOpen(false);
  };

  const handleCloseOk = () => {
    props.gotoStep(2);
    setOpen(false);
  };

  const handleCheck = (e: any) => {
    props.onChangeAction(e);
    setTimeout(() => {
      if (e.target.checked) {
        setShoWPep(true);
        let data = [
          { name: e.target.name, checked: true, type: "checkbox" },
          { name: "showPep", value: true },
        ];
        props.handleCheckedBox(data);
      } else {
        let checkAllFalse = checkPEPValue();
        if (checkAllFalse) {
          setShoWPep(true);
        } else {
          setShoWPep(false);
          let data = [
            { name: e.target.name, checked: false, type: "checkbox" },
            { name: "showPep", value: false },
          ];
          props.handleCheckedBox(data);
        }
      }
    }, 200);
  };

  const checkPEPValue = () => {
    let array = [
      props.data.isHeadOfState,
      props.data.isHeadOfGovt,
      props.data.isSeniorPolitician,
      props.data.isSeniorGovtOfficial,
      props.data.isSeniorJudicialOfficial,
      props.data.isSeniorMilitaryOfficial,
      props.data.isSeniorExecSOC,
      props.data.isImportantPoliticalPartyOfficial,
      props.data.isSeniorExecIO,
      props.data.isMemberOfBOIO,
    ];
    array = array.filter((t) => t === true);
    console.log(array);
    return array.length > 1 ? true : false;
  };

  const IsAnyPEPOptionSelected = () => {
    return (
      props.data.isHeadOfState ||
      props.data.isHeadOfGovt ||
      props.data.isSeniorPolitician ||
      props.data.isSeniorGovtOfficial ||
      props.data.isSeniorJudicialOfficial ||
      props.data.isSeniorMilitaryOfficial ||
      props.data.isSeniorExecSOC ||
      props.data.isImportantPoliticalPartyOfficial ||
      props.data.isSeniorExecIO ||
      props.data.isMemberOfBOIO
    );
  };

  const handleNext = (resetNav: any) => {
    if (IsAnyPEPOptionSelected()) props.onNextAction(resetNav);
    else {
      setNavLoading(true);
      setOpen(true);
    }
  };

  return (
    <GridDX container spacing={props.readOnly ? 2 : useMobileView ? 2 : 4}>
      <GridDX item xs={12} sx={{ textAlign: "justify" }}>
        Are you/your family member/your close associate OR have you/your family
        member/your close assoicate ever been entrusted with the following
        functions either in Pakistan or Aboard?
      </GridDX>
      <GridDX item xs={12}>
        <List style={{ width: "100%" }}>
          <ListItem>
            <ListItemText primary="1. HEAD OF STATE" />
            <ListItemIcon>
              <YesNoSwitch
                name="isHeadOfState"
                readOnly={props.readOnly}
                checked={props.data.isHeadOfState}
                onChange={(e: any) => handleCheck(e)}
                disabled={
                  inDiscrepancyMode() && !isDiscrepantField("isHeadOfState")
                }
              />
            </ListItemIcon>
          </ListItem>
          <ListItem>
            <ListItemText primary="2. HEAD OF GOVERNMENT" />
            <ListItemIcon>
              <YesNoSwitch
                name="isHeadOfGovt"
                readOnly={props.readOnly}
                checked={props.data.isHeadOfGovt}
                onChange={(e: any) => handleCheck(e)}
                disabled={
                  inDiscrepancyMode() && !isDiscrepantField("isHeadOfGovt")
                }
              />
            </ListItemIcon>
          </ListItem>
          <ListItem>
            <ListItemText primary="3. SENIOR POLITICIAN" />
            <ListItemIcon>
              <YesNoSwitch
                name="isSeniorPolitician"
                readOnly={props.readOnly}
                checked={props.data.isSeniorPolitician}
                onChange={(e: any) => handleCheck(e)}
                disabled={
                  inDiscrepancyMode() &&
                  !isDiscrepantField("isSeniorPolitician")
                }
              />
            </ListItemIcon>
          </ListItem>
          <ListItem>
            <ListItemText primary="4. SENIOR GOVERNMENT OFFICIAL" />
            <ListItemIcon>
              <YesNoSwitch
                name="isSeniorGovtOfficial"
                readOnly={props.readOnly}
                checked={props.data.isSeniorGovtOfficial}
                onChange={(e: any) => handleCheck(e)}
                disabled={
                  inDiscrepancyMode() &&
                  !isDiscrepantField("isSeniorGovtOfficial")
                }
              />
            </ListItemIcon>
          </ListItem>
          <ListItem>
            <ListItemText primary="5. SENIOR JUDICIAL OFFICIAL" />
            <ListItemIcon>
              <YesNoSwitch
                name="isSeniorJudicialOfficial"
                readOnly={props.readOnly}
                checked={props.data.isSeniorJudicialOfficial}
                onChange={(e: any) => handleCheck(e)}
                disabled={
                  inDiscrepancyMode() &&
                  !isDiscrepantField("isSeniorJudicialOfficial")
                }
              />
            </ListItemIcon>
          </ListItem>
          <ListItem>
            <ListItemText primary="6. SENIOR MILITARY OFFICIAL" />
            <ListItemIcon>
              <YesNoSwitch
                name="isSeniorMilitaryOfficial"
                readOnly={props.readOnly}
                checked={props.data.isSeniorMilitaryOfficial}
                onChange={(e: any) => handleCheck(e)}
                disabled={
                  inDiscrepancyMode() &&
                  !isDiscrepantField("isSeniorMilitaryOfficial")
                }
              />
            </ListItemIcon>
          </ListItem>
          <ListItem>
            <ListItemText primary="7. SENIOR EXECUTIVE OF STATE OWNED CORPORATIONS" />
            <ListItemIcon>
              <YesNoSwitch
                name="isSeniorExecSOC"
                readOnly={props.readOnly}
                checked={props.data.isSeniorExecSOC}
                onChange={(e: any) => handleCheck(e)}
                disabled={
                  inDiscrepancyMode() && !isDiscrepantField("isSeniorExecSOC")
                }
              />
            </ListItemIcon>
          </ListItem>
          <ListItem>
            <ListItemText primary="8. IMPORTANT POLITICAL PARTY OFFICIAL" />
            <ListItemIcon>
              <YesNoSwitch
                name="isImportantPoliticalPartyOfficial"
                readOnly={props.readOnly}
                checked={props.data.isImportantPoliticalPartyOfficial}
                onChange={(e: any) => handleCheck(e)}
                disabled={
                  inDiscrepancyMode() &&
                  !isDiscrepantField("isImportantPoliticalPartyOfficial")
                }
              />
            </ListItemIcon>
          </ListItem>
          <ListItem>
            <ListItemText primary="9. SENIOR EXECUTIVE OF INTERNATIONAL ORGANIZATION" />
            <ListItemIcon>
              <YesNoSwitch
                name="isSeniorExecIO"
                readOnly={props.readOnly}
                checked={props.data.isSeniorExecIO}
                onChange={(e: any) => handleCheck(e)}
                disabled={
                  inDiscrepancyMode() && !isDiscrepantField("isSeniorExecIO")
                }
              />
            </ListItemIcon>
          </ListItem>
          <ListItem>
            <ListItemText primary="10. MEMBER OF THE BOARD OF INT'L ORGANIZATION" />
            <ListItemIcon>
              <YesNoSwitch
                name="isMemberOfBOIO"
                readOnly={props.readOnly}
                checked={props.data.isMemberOfBOIO}
                onChange={(e: any) => handleCheck(e)}
                disabled={
                  inDiscrepancyMode() && !isDiscrepantField("isMemberOfBOIO")
                }
              />
            </ListItemIcon>
          </ListItem>
        </List>
      </GridDX>
      {showPEP && (
        <GridDX item xs={12} sm={6}>
          <SelectListDX
            id="natureOfPEPId"
            name="natureOfPEPId"
            label="Nature of PEP"
            key="natureOfPEP"
            list={natureOfPEPList}
            value={props.data.natureOfPEPId}
            onChange={(e: any, v: any) => props.onChangeAction(e, v)}
            readOnly={props.readOnly}
            error={errors["natureOfPEPId"] ? true : false}
            helperText={errors["natureOfPEPId"]}
            disabled={
              inDiscrepancyMode() && !isDiscrepantField("natureOfPEPId")
            }
            onBlur={() =>
              validateField("natureOfPEPId", props.data.natureOfPEPId)
            }
          />
        </GridDX>
      )}

      {showPEP && props.data.natureOfPEPId && (
        <>
          {props.data.natureOfPEPId.id === 2 && (
            <GridDX item xs={12} sm={6}>
              <TextFieldDX
                name="pepNameOfFamilyMember"
                value={props.data.pepNameOfFamilyMember}
                label="Name Of Close Family Member"
                onChange={(e: any) => props.onChangeAction(e)}
                readOnly={props.readOnly}
                error={errors["pepNameOfFamilyMember"] ? true : false}
                helperText={errors["pepNameOfFamilyMember"]}
                disabled={
                  inDiscrepancyMode() &&
                  !isDiscrepantField("pepNameOfFamilyMember")
                }
                onBlur={() =>
                  validateField(
                    "pepNameOfFamilyMember",
                    props.data.pepNameOfFamilyMember
                  )
                }
              />
            </GridDX>
          )}

          {props.data.natureOfPEPId.id === 3 && (
            <GridDX item xs={12} sm={6}>
              <TextFieldDX
                name="pepNameOfCloseAssociate"
                value={props.data.pepNameOfCloseAssociate}
                label="Name Of Closed Associate"
                onChange={(e: any) => props.onChangeAction(e)}
                readOnly={props.readOnly}
                error={errors["pepNameOfCloseAssociate"] ? true : false}
                helperText={errors["pepNameOfCloseAssociate"]}
                disabled={
                  inDiscrepancyMode() &&
                  !isDiscrepantField("pepNameOfCloseAssociate")
                }
                onBlur={() =>
                  validateField(
                    "pepNameOfCloseAssociate",
                    props.data.pepNameOfCloseAssociate
                  )
                }
              />
            </GridDX>
          )}

          <GridDX item xs={12} sm={6}>
            <TextFieldDX
              name="pepNatureOfDepartment"
              value={props.data.pepNatureOfDepartment}
              label="Name of Department / Company"
              onChange={(e: any) => props.onChangeAction(e)}
              readOnly={props.readOnly}
              error={errors["pepNatureOfDepartment"] ? true : false}
              helperText={errors["pepNatureOfDepartment"]}
              disabled={
                inDiscrepancyMode() &&
                !isDiscrepantField("pepNatureOfDepartment")
              }
              onBlur={() =>
                validateField(
                  "pepNatureOfDepartment",
                  props.data.pepNatureOfDepartment
                )
              }
            />
          </GridDX>
          <GridDX item xs={12} sm={6}>
            <TextFieldDX
              name="pepDesignation"
              value={props.data.pepDesignation}
              label="Designation"
              onChange={(e: any) => props.onChangeAction(e)}
              readOnly={props.readOnly}
              error={errors["pepDesignation"] ? true : false}
              helperText={errors["pepDesignation"]}
              disabled={
                inDiscrepancyMode() && !isDiscrepantField("pepDesignation")
              }
              onBlur={() =>
                validateField("pepDesignation", props.data.pepDesignation)
              }
            />
          </GridDX>
          <GridDX item xs={12} sm={6}>
            <TextFieldDX
              name="pepGrade"
              value={props.data.pepGrade}
              label="Grade / Rank"
              onChange={(e: any) => props.onChangeAction(e)}
              readOnly={props.readOnly}
              error={errors["pepGrade"] ? true : false}
              helperText={errors["pepGrade"]}
              disabled={inDiscrepancyMode() && !isDiscrepantField("pepGrade")}
              onBlur={() => validateField("pepGrade", props.data.pepGrade)}
            />
          </GridDX>
        </>
      )}

      {!props.readOnly && (
        <GridDX item xs={12}>
          <Navigation
            onPrevAction={props.onPrevAction}
            onNextAction={handleNext}
            loadingIndicator={isNavLoading}
          />
          <Alert
            open={open}
            handleClose={handleClose}
            handleCloseOk={handleCloseOk}
            alert={
              "If none applies to you then mark PEP disclosure as No to continue"
            }
          />
        </GridDX>
      )}
    </GridDX>
  );
};

export default AdditionalKYC;
