import React, { useEffect, useState, useContext } from "react";
import {
  Checkbox,
  FormControlLabel,
  Typography,
  useMediaQuery,
  useTheme,
  Radio,
  RadioGroup,
  FormControl,
  Grid,
} from "@mui/material";
import TextFieldDX from "../../controls/textfielddx";
import SelectListDX from "../../controls/selectlistdx";
import Navigation from "../../controls/navigation";
import YesNoSwitch from "../../controls/yesnoswitch";
import TooltipHelper from "../../controls/tooltip";

import { useAuthContext } from "../../../context/authcontext";
import { useValidationContext } from "../../../context/validationcontext";

import {
  countryList,
  residentialStatusList,
  getCities,
  // getAreas,
} from "../../../shared/lookups";
import { transformAndFilterInput } from "../../../shared/global";
import GridDX from "../../layout/griddx";

const Personal = (props: any) => {
  const RESIDENT_PAK = 1;
  const NON_RESISDENT_PAK = 2;

  const PAKISTAN_DATA = { id: 167, value: "Pakistan" };
  const USA_DATA = { id: 233, value: "United States" };

  const { inDiscrepancyMode, isDiscrepantField } = useAuthContext();
  const { errors, validateField } = useValidationContext();

  const theme = useTheme();
  const useMobileView = useMediaQuery(theme.breakpoints.down("xs"));

  const [resCityList, setResCityList] = useState([]);
  // const [resAreaList, setResAreaList] = useState([]);
  const [birthCityList, setBirthCityList] = useState([]);

  useEffect(() => {
    if (props.data.mailingSameAsResidential)
      props.data.mailingAddress = props.data.residentialAddress;
  }, [props.data.residentialAddress]);

  useEffect(() => {
    if (props.data.countryOfResidenceId) {
      getCities(props.data.countryOfResidenceId.id).then((data: any) => {
        setResCityList(data);

        // if (props.data.cityOfResidenceId) {
        //   getAreas(props.data.cityOfResidenceId.id).then((data: any) => {
        //     setResAreaList(data);
        //   });
        // }
      });

      if (props.data.countryOfBirthId) {
        getCities(props.data.countryOfBirthId.id).then((data: any) => {
          setBirthCityList(data);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (props.data.mailingSameAsResidential) {
      let event = {
        target: {
          name: "mailingAddress",
          value: props.data.residentialAddress,
        },
      };
      props.onChangeAction(event);
    }
  }, [props.data.mailingSameAsResidential]);

  const handleNext = (resetNav: any) => {
    props.onNextAction(resetNav);
  };

  const handleSelectOptions = (e: any, v: any) => {
    let crntValue;
    let name = e.target.id.split("-");

    if (v !== undefined) {
      switch (name[0]) {
        case "residentialStatusId":
          if (v.id === RESIDENT_PAK) {
            let data = [
              { name: name[0], value: v },
              { name: "nationalityId", value: PAKISTAN_DATA },
              {
                name: "countryOfResidenceId",
                value: PAKISTAN_DATA,
              },
              { name: "countryOfBirthId", value: PAKISTAN_DATA },
              { name: "cityOfBirthId", value: null },
              { name: "cityOfResidenceId", value: null },
              { name: "area", value: null },
              {
                name: "isUSResident",
                checked: false,
                type: "checkbox",
              },
              {
                name: "isNonPakTaxResident",
                checked: false,
                type: "checkbox",
              },
            ];

            // Get cities of Pakistan
            getCities(PAKISTAN_DATA.id).then((data: any) => {
              setResCityList(data);
              setBirthCityList(data);
              // setResAreaList([]);
            });

            props.onMultiChangeAction(data);
          } else if (v.id === NON_RESISDENT_PAK) {
            let data = [
              { name: name[0], value: v },
              { name: "countryOfResidenceId", value: null },
              {
                name: "nationalityId",
                value:
                  props.data.nationalityId?.id === PAKISTAN_DATA.id
                    ? null
                    : props.data.nationalityId,
              },
              {
                name: "countryOfBirthId",
                value:
                  props.data.countryOfBirthId?.id === PAKISTAN_DATA.id
                    ? null
                    : props.data.countryOfBirthId,
              },
              { name: "cityOfBirthId", value: null },
              { name: "cityOfResidenceId", value: null },
              { name: "areaId", value: null },
              {
                name: "isUSResident",
                checked: false,
                type: "checkbox",
              },
              {
                name: "isNonPakTaxResident",
                checked: false,
                type: "checkbox",
              },
            ];

            // since country of residence was blanked out, related dropdowns should be blanked out too.
            setResCityList([]);
            // setResAreaList([]);

            // since country of birth will be blanked out, cities of birth dropdown should be set to empty
            if (props.data.countryOfBirthId?.id === PAKISTAN_DATA.id)
              setBirthCityList([]);

            props.onMultiChangeAction(data);
          }

          break;
        case "countryOfResidenceId":
          crntValue = props.data.countryOfResidenceId;
          if (crntValue !== null)
            crntValue = props.data.countryOfResidenceId.id;

          if (v.id !== crntValue) {
            getCities(v.id).then((data: any) => {
              setResCityList(data);
              setBirthCityList(data);
              // setResAreaList([]);
            });
          }

          if (v.id === PAKISTAN_DATA.id) {
            let data = [
              {
                name: name[0],
                value: v,
              },
              { name: "cityOfBirthId", value: null },
              { name: "cityOfResidenceId", value: null },
              { name: "areaId", value: null },
              {
                name: "isUSResident",
                checked: props.data.nationalityId.id === USA_DATA.id, //false,
                type: "checkbox",
              },
              {
                name: "isNonPakTaxResident",
                checked:
                  props.data.nationalityId !== null &&
                  props.data.nationalityId.id !== USA_DATA.id &&
                  props.data.nationalityId.id !== PAKISTAN_DATA.id,
                type: "checkbox",
              },
              {
                name: "countryOfBirthId",
                value: v,
              },
            ];
            props.onMultiChangeAction(data);
          } else if (v.id === USA_DATA.id) {
            let data = [
              {
                name: name[0],
                value: v,
              },
              { name: "cityOfBirthId", value: null },
              { name: "cityOfResidenceId", value: null },
              { name: "areaId", value: null },
              {
                name: "isUSResident",
                checked: true,
                type: "checkbox",
              },
              {
                name: "isNonPakTaxResident",
                checked:
                  props.data.nationalityId &&
                  props.data.nationalityId.id !== USA_DATA.id &&
                  props.data.nationalityId.id !== PAKISTAN_DATA.id,
                type: "checkbox",
              },
              {
                name: "countryOfBirthId",
                value: v,
              },
            ];
            props.onMultiChangeAction(data);
          } else if (v !== null) {
            let data = [
              {
                name: name[0],
                value: v,
              },
              { name: "cityOfBirthId", value: null },
              { name: "cityOfResidenceId", value: null },
              { name: "areaId", value: null },
              {
                name: "isUSResident",
                checked: props.data.nationalityId?.id === USA_DATA.id, //false,
                type: "checkbox",
              },
              {
                name: "isNonPakTaxResident",
                // if non pakistan or non us resident then check nationality
                checked: true,
                type: "checkbox",
              },
              {
                name: "countryOfBirthId",
                value: v,
              },
            ];

            props.onMultiChangeAction(data);
          }
          break;
        case "nationalityId":
          if (v.id === USA_DATA.id) {
            let data = [
              {
                name: name[0],
                value: v,
              },
              {
                name: "isNonPakTaxResident",
                checked:
                  props.data.countryOfResidence &&
                  props.data.countryOfResidence.id !== USA_DATA.id &&
                  props.data.countryOfResidence.id !== PAKISTAN_DATA.id,
                type: "checkbox",
              },
              {
                name: "isUSResident",
                checked: true,
                type: "checkbox",
              },
            ];
            props.onMultiChangeAction(data);
          } else if (v.id === PAKISTAN_DATA.id) {
            let data = [
              {
                name: name[0],
                value: v,
              },
              {
                name: "isNonPakTaxResident",
                checked:
                  props.data.countryOfResidence !== null &&
                  props.data.countryOfResidence.id !== USA_DATA.id &&
                  props.data.countryOfResidence.id !== PAKISTAN_DATA.id,
                type: "checkbox",
              },
              {
                name: "isUSResident",
                checked: props.data.countryOfResidence.id === USA_DATA.id,
                type: "checkbox",
              },
            ];
            props.onMultiChangeAction(data);
          } else if (v !== null) {
            let data = [
              {
                name: name[0],
                value: v,
              },
              {
                name: "isNonPakTaxResident",
                // if non pakistan or non us national then check residence
                checked: true,
                type: "checkbox",
              },
              {
                name: "isUSResident",
                checked: props.data.countryOfResidenceId?.id === USA_DATA.id,
                type: "checkbox",
              },
            ];
            props.onMultiChangeAction(data);
          }
          break;
        case "cityOfResidenceId":
          crntValue = props.data.cityOfResidenceId;
          if (crntValue !== null) crntValue = props.data.cityOfResidenceId.id;

          // if (v.id !== crntValue)
          //   getAreas(v.id).then((data: any) => {
          //     setResAreaList(data);
          //   });

          if (
            props.data.countryOfResidenceId !== null &&
            props.data.countryOfBirthId !== null
          ) {
            if (
              props.data.countryOfResidenceId.id ===
              props.data.countryOfBirthId.id
            ) {
              let data = [
                {
                  name: name[0],
                  value: v,
                },
                { name: "cityOfBirthId", value: v },
                { name: "areaId", value: null },
              ];
              props.onMultiChangeAction(data);
            } else {
              let data = [
                {
                  name: name[0],
                  value: v,
                },
                { name: "cityOfBirth", value: null },
                { name: "area", value: null },
              ];
              props.onMultiChangeAction(data);
            }
          }
          break;
        case "countryOfBirthId":
          crntValue = props.data.countryOfBirth;
          if (crntValue !== "") crntValue = props.data.countryOfBirth.id;

          if (v.id !== crntValue) {
            getCities(v.id).then((data: any) => {
              setBirthCityList(data);
            });
          }

          let countryOfBirth = [
            {
              name: name[0],
              value: v,
            },
            { name: "cityOfBirth", value: null },
          ];
          props.onMultiChangeAction(countryOfBirth);
          break;
        case "cityOfBirthId":
          let cityOfBirth = [
            {
              name: name[0],
              value: v,
            },
          ];
          props.onMultiChangeAction(cityOfBirth);
          break;
        case "areaId":
          let area = [
            {
              name: name[0],
              value: v,
            },
          ];
          props.onMultiChangeAction(area);
          break;
        default:
          return null;
      }
    }
  };

  return (
    <GridDX container spacing={props.readOnly ? 2 : useMobileView ? 2 : 4}>
      <GridDX item xs={12} sm={6} sx={{ flexDirection: "column" }}>
        <TextFieldDX
          label="Residential Address"
          name="residentialAddress"
          value={props.data.residentialAddress}
          onChange={(e: any) => props.onChangeAction(e)}
          error={errors["residentialAddress"] ? true : false}
          helperText={errors["residentialAddress"]}
          readOnly={props.readOnly}
          allowCopyPaste={false}
          onInput={transformAndFilterInput}
          disabled={
            inDiscrepancyMode() && !isDiscrepantField("ResidentialAddress")
          }
          onBlur={() =>
            validateField("residentialAddress", props.data.residentialAddress)
          }
        />
        <GridDX container style={{ marginTop: 10 }}>
          <GridDX item xs={props.readOnly ? 10 : 7}>
            <Typography style={{ fontSize: "12px", textAlign: "justify" }}>
              Is Your residential Address same as address mentioned on your
              Identification Document (CNIC / SNIC / NICOP / SNICOP / POC){" "}
              <TooltipHelper
                show={!props.readOnly}
                style={{ fontSize: "16px" }}
                title={`Residential address must be same with your identity card address. Incase address is different then you are required to provide any of following documents proofing residential address for example Utility Bill, Credit Card Statement, Bank Statement, etc`}
              />
            </Typography>
          </GridDX>
          <GridDX item xs={props.readOnly ? 2 : 5}>
            <YesNoSwitch
              name="isResidentAdressSameAsCNIC"
              readOnly={props.readOnly}
              checked={props.data.isResidentAdressSameAsCNIC}
              onChange={(e: any) => props.onChangeAction(e)}
              disabled={
                inDiscrepancyMode() &&
                !isDiscrepantField("ResidentialNICAddress")
              }
            />
          </GridDX>
        </GridDX>
      </GridDX>
      <GridDX item xs={12} sm={6} sx={{ flexDirection: "column" }}>
        <TextFieldDX
          label="Mailing Address"
          name="mailingAddress"
          value={props.data.mailingAddress}
          onChange={(e: any) => props.onChangeAction(e)}
          error={errors["mailingAddress"] ? true : false}
          helperText={errors["mailingAddress"]}
          readOnly={props.readOnly}
          allowCopyPaste={false}
          onInput={transformAndFilterInput}
          disabled={
            props.data.mailingSameAsResidential ||
            (inDiscrepancyMode() && !isDiscrepantField("mailingAddress"))
          }
          tip={
            "Mailing address will be taken as default address of the applicant and correspondence via post (if required) with the account holder shall be made on the mailing address given while digital account opening"
          }
          onBlur={() =>
            validateField("mailingAddress", props.data.mailingAddress)
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              disabled={
                props.readOnly ||
                (inDiscrepancyMode() &&
                  !isDiscrepantField("SameMailingResident"))
              }
              name="mailingSameAsResidential"
              color="primary"
              checked={props.data.mailingSameAsResidential}
              onChange={(e: any) => props.onChangeAction(e)}
            />
          }
          label="Same as Residential Address"
        />
      </GridDX>
      <GridDX item xs={12} sm={6}>
        <SelectListDX
          id="residentialStatusId"
          name="residentialStatusId"
          label="Residential Status"
          tip={`"Resident Pakistan" are Pakistani nationals residing inside Pakistan for 120 days or more in a tax year.
                "Non-Resident Pakistan" are Pakistani nationals residing outside`}
          list={residentialStatusList}
          value={props.data.residentialStatusId}
          onChange={(e: any, v: any) => handleSelectOptions(e, v)}
          error={errors["residentialStatusId"] ? true : false}
          helperText={errors["residentialStatusId"]}
          readOnly={props.readOnly}
          InputLabelProps={{ style: { pointerEvents: "auto" } }}
          disabled={
            inDiscrepancyMode() && !isDiscrepantField("residentialStatusId")
          }
          onBlur={() =>
            validateField("residentialStatusId", props.data.residentialStatusId)
          }
        />
      </GridDX>
      <GridDX item xs={12} sm={6}>
        <SelectListDX
          id="countryOfResidenceId"
          name="countryOfResidenceId"
          label="Country of Residence"
          list={countryList}
          value={props.data.countryOfResidenceId}
          onChange={(e: any, v: any) => handleSelectOptions(e, v)}
          error={errors["countryOfResidenceId"] ? true : false}
          helperText={errors["countryOfResidenceId"]}
          readOnly={props.readOnly}
          disabled={
            inDiscrepancyMode() && !isDiscrepantField("countryOfResidenceId")
          }
          onBlur={() =>
            validateField(
              "countryOfResidenceId",
              props.data.countryOfResidenceId
            )
          }
        />
      </GridDX>
      <GridDX item xs={12} sm={6}>
        <SelectListDX
          id="cityOfResidenceId"
          name="cityOfResidenceId"
          label="City of Residence"
          list={resCityList}
          value={props.data.cityOfResidenceId}
          onChange={(e: any, v: any) => handleSelectOptions(e, v)}
          error={errors["cityOfResidenceId"] ? true : false}
          helperText={errors["cityOfResidenceId"]}
          readOnly={props.readOnly}
          disabled={
            inDiscrepancyMode() && !isDiscrepantField("cityOfResidenceId")
          }
          onBlur={() =>
            validateField("cityOfResidenceId", props.data.cityOfResidenceId)
          }
        />
      </GridDX>
      <GridDX item xs={12} sm={6}>
        <SelectListDX
          id="nationalityId"
          name="nationalityId"
          label="Nationality"
          list={countryList}
          value={props.data.nationalityId}
          onChange={(e: any, v: any) => handleSelectOptions(e, v)}
          error={errors["nationalityId"] ? true : false}
          helperText={errors["nationalityId"]}
          readOnly={props.readOnly}
          disabled={inDiscrepancyMode() && !isDiscrepantField("nationalityId")}
          onBlur={() =>
            validateField("nationalityId", props.data.nationalityId)
          }
        />
      </GridDX>
      <GridDX item xs={12} sm={6}>
        <SelectListDX
          id="countryOfBirthId"
          name="countryOfBirthId"
          label="Country of Birth"
          list={countryList}
          value={props.data.countryOfBirthId}
          onChange={(e: any, v: any) => handleSelectOptions(e, v)}
          error={errors["countryOfBirthId"] ? true : false}
          helperText={errors["countryOfBirthId"]}
          readOnly={props.readOnly}
          disabled={
            inDiscrepancyMode() && !isDiscrepantField("countryOfBirthId")
          }
          onBlur={() =>
            validateField("countryOfBirthId", props.data.countryOfBirthId)
          }
        />
      </GridDX>
      <GridDX item xs={12} sm={6}>
        <SelectListDX
          id="cityOfBirthId"
          name="cityOfBirthId"
          label="City of Birth"
          list={birthCityList}
          value={props.data.cityOfBirthId}
          onChange={(e: any, v: any) => handleSelectOptions(e, v)}
          error={errors["cityOfBirthId"] ? true : false}
          helperText={errors["cityOfBirthId"]}
          readOnly={props.readOnly}
          disabled={inDiscrepancyMode() && !isDiscrepantField("cityOfBirthId")}
          onBlur={() =>
            validateField("cityOfBirthId", props.data.cityOfBirthId)
          }
        />
      </GridDX>
      <GridDX item xs={props.readOnly ? 10 : 8} sm={10}>
        <Typography style={{ fontSize: "13px", textAlign: "justify" }}>
          Myself or any of my{" "}
          <TooltipHelper
            show={!props.readOnly}
            style={{ fontSize: "16px" }}
            title={`Family Member of a PEP includes spouse, parent, son, daughter, grandparent, grandchild, brother and sister.
Close Associate of a PEP means an individual who is reasonably known to be closely connected with the PEP for any reason including socially or professionally such as partner, close business associate, joint beneficial owner, legal advisor, consultant, etc.
`}
          />{" "}
          Family Member and Closed Associate are Politically Exposed Person
          (PEP){" "}
          <TooltipHelper
            show={!props.readOnly}
            style={{ fontSize: "16px" }}
            title={`Politically Exposed Person or PEP means an individual who is or has been entrusted with a prominent public function either domestically or by a foreign country, or in an international organization.
For example: President, Prime Minister, Chairman Senate, Speaker of National/ Provisional Assembly, MNA, MPA, Senator, Senior Government Official (BPS Grade 20 or above), Senior Judicial Official (Registrar/ Magistrate/ Judge), Senior Military Official (Brigadier/ Commodore/ Air Commodore or above), Senior Executive (e.g. chief executive officer/ managing director, deputy managing director, chief operating officer, company secretary, chief financial officer, chief compliance officer or chief regulatory officer) of State Owned Corporation (e.g. SECP, SBP, FBR, PSO, PPL, OGDCL, etc.), Senior Politician, Senior Executive of International Organization (e.g. UNO, UNESCO, World Bank, IMF, etc.), Member of the Board of International Organization, etc.`}
          />
        </Typography>
      </GridDX>
      <GridDX item xs={props.readOnly ? 2 : 4} sm={2}>
        <YesNoSwitch
          name="isPoliticallyExposedPerson"
          readOnly={props.readOnly}
          checked={props.data.isPoliticallyExposedPerson}
          onChange={(e: any) => props.onChangeAction(e)}
          disabled={
            inDiscrepancyMode() &&
            !isDiscrepantField("isPoliticallyExposedPerson")
          }
        />
      </GridDX>

      <GridDX item xs={props.readOnly ? 10 : 8} sm={10}>
        <Typography style={{ fontSize: "13px", textAlign: "justify" }}>
          Are you a U.S. resident or a U.S. citizen or a U.S. permanent resident
          card holder or a registered U.S tax payer?
        </Typography>
      </GridDX>
      <GridDX item xs={props.readOnly ? 2 : 4} sm={2}>
        <YesNoSwitch
          name="isUSResident"
          readOnly={props.readOnly}
          checked={props.data.isUSResident}
          onChange={(e: any) => props.onChangeAction(e)}
          disabled={inDiscrepancyMode() && !isDiscrepantField("isUSResident")}
        />
      </GridDX>
      <GridDX item xs={props.readOnly ? 10 : 8} sm={10}>
        <Typography style={{ fontSize: "13px", textAlign: "justify" }}>
          Are you a tax resident in any country other than Pakistan and United
          States of America?
        </Typography>
      </GridDX>
      <GridDX item xs={props.readOnly ? 2 : 4} sm={2}>
        <YesNoSwitch
          name="isNonPakTaxResident"
          readOnly={props.readOnly}
          checked={props.data.isNonPakTaxResident}
          onChange={(e: any) => props.onChangeAction(e)}
          disabled={
            inDiscrepancyMode() && !isDiscrepantField("isNonPakTaxResident")
          }
        />
      </GridDX>

      <GridDX item xs={props.readOnly ? 10 : 8} sm={10}>
        <Typography style={{ fontSize: "13px", textAlign: "justify" }}>
          I wish to deduct my zakat from my Account Balance as per applicable
          law of Pakistan.
        </Typography>
      </GridDX>
      <GridDX item xs={props.readOnly ? 2 : 4} sm={2}>
        <YesNoSwitch
          name="isZakatDeduction"
          readOnly={props.readOnly}
          checked={props.data.isZakatDeduction}
          onChange={(e: any) => props.onChangeAction(e)}
          disabled={
            inDiscrepancyMode() && !isDiscrepantField("isZakatDeduction")
          }
        />
      </GridDX>
      {props.readOnly && !props.data.isZakatDeduction ? (
        <GridDX item xs={props.readOnly ? 10 : 8} sm={10}>
          <FormControlLabel
            control={<Radio color="primary" checked={true} disabled={true} />}
            style={{ textAlign: "justify" }}
            label={
              props.data.isNonMuslim === "true"
                ? "I am Non-Muslim and I am not liable to pay Zakat"
                : "I Will provide/upload zakat Affidavit (Cz-50) to PQAMCL for Zakat Exemption"
            }
          />
        </GridDX>
      ) : !props.data.isZakatDeduction ? (
        <GridDX item xs={12}>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="isNonMuslim"
              name="isNonMuslim"
              value={props.data.isNonMuslim}
              onChange={(e) => props.onChangeAction(e)}
            >
              <FormControlLabel
                value={"true"}
                control={<Radio color="primary" disabled={props.readOnly} />}
                label="I am Non-Muslim and I am not liable to pay Zakat"
                disabled={
                  props.readOnly ||
                  (inDiscrepancyMode() && !isDiscrepantField("isNonMuslim"))
                }
              />
              <br />
              <FormControlLabel
                value={"false"}
                control={<Radio color="primary" disabled={props.readOnly} />}
                label="I shall provide/upload zakat Affidavit (CZ-50) to PQAMCL for Zakat Exemption"
                disabled={
                  props.readOnly ||
                  (inDiscrepancyMode() && !isDiscrepantField("isNonMuslim"))
                }
              />
            </RadioGroup>
          </FormControl>
        </GridDX>
      ) : null}

      {!props.readOnly && (
        <GridDX item xs={12}>
          <Navigation
            onPrevAction={props.onPrevAction}
            onNextAction={handleNext}
          />
        </GridDX>
      )}
    </GridDX>
  );
};

export default Personal;
