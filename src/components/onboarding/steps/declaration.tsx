import React, { useState } from "react";
import {
  FormControlLabel,
  Checkbox,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { Launch } from "@mui/icons-material";

import Navigation from "../../controls/navigation";
import GridDX from "../../layout/griddx";

const Declaration = (props: any) => {
  const [open, showTerms] = useState(false);
  const [isNavLoading, setNavLoading] = useState(false);

  const handleClose = () => {
    showTerms(false);
    props.data.isAgreeTerms = true;
  };

  const accountOpeningTerms = () => {
    return (
      <>
        <h4>
          <u>ACCOUNT OPENING</u>
        </h4>
        <p>I hereby declare that:</p>
        <ol type="a">
          <li>
            the information provided in this account opening process is correct,
            complete and up-to-date to the best of my knowledge and belief and
            the document(s) submitted during this account opening process are
            complete and valid in all respects. I will inform PQAMCL if there is
            any change in the information/ document provided;
          </li>
          <li>
            the funds to be invested in the Collective Investment Schemes and/or
            Voluntary Pension Schemes managed by PQAMCL are my own funds and the
            funds beneficially owned by any other person will not be used for
            making investment in PQAMCL Schemes;
          </li>
          <li>
            I authorize PQAMCL to use my information and documents for necessary
            due diligence and verification;
          </li>
          <li>
            I understand that PQAMCL may request for additional application
            form(s)/ document(s) to process my current and future investments in
            accordance with the requirements of the Anti-Money Laundering Act
            (“AML Act”), the Securities and Exchange Commission of Pakistan
            (Anti Money Laundering and Countering Financing of Terrorism)
            Regulations (“AML Regulations”), Guidelines on Anti-Money
            Laundering, Countering financing of Terrorism and Proliferation
            financing (“AML Guidelines”) and AML/CFT and CDD/KYC Policies and
            Procedures of PQAMCL. I will ensure to provide these required
            application form(s)/ document(s) within specified time. I also
            understand that in order to ensure compliance with aforesaid
            statutory laws and regulations, PQAMCL may reject my investment
            and/or close my account if the required application form/ document
            is not provided to PQAMCL within specified time or the required
            application form/ document is not complete and valid in all
            respects;
          </li>
          {/* <li>
            I have read and understood the PQAMCL terms and conditions available
            at the link:
            <a
              href="https://www.acme.com/terms-conditions/"
              target="_blank"
              rel="noreferrer"
            >
              https://www.acme.com/terms-conditions/
            </a>
          </li> */}
          <li>
            I understand that investment in PQAMCL Scheme will be subjected to
            Zakat deduction if duly executed Zakat Affidavit (CZ-50) is not
            submitted to PQAMCL; and
          </li>
          <li>
            I understand that the amount withheld by PQAMCL on account of
            Capital Gain Tax (CGT) against disposal, in any form, of my holdings
            can be less than that as calculated by NCCPL. In this case, the
            differential amount shall be collected from my investment account in
            accordance with the relevant laws.
          </li>
        </ol>
      </>
    );
  };

  const factaTerms = () => {
    return (
      <>
        <h4>
          <u>FOREIGN ACCOUNT TAX COMPLIANCE ACT (FATCA)</u>
        </h4>
        <ol type="a">
          <li>
            I hereby confirm that the information provided for FATCA purposes is
            true, accurate and complete;
          </li>
          <li>
            Subject to the requirements of domestic or overseas laws, I consent
            and agree that PQAMCL or the Trustee of the Collective Investment
            Schemes/ Voluntary Pension Schemes may withhold from my account(s)
            such amounts as may be required according to applicable laws,
            regulations and directives;
          </li>
          <li>
            Subject to the requirements of domestic or overseas laws, I consent
            and agree that PQAMCL or the Trustee of the Collective Investment
            Schemes/ Voluntary Pension Schemes may withhold from my account(s)
            such amounts as may be required according to applicable laws,
            regulations and directives
          </li>
          <li>
            I hereby undertake not to initiate any proceedings against PQAMCL
            and the Trustee of the Collective Investment Schemes/ Voluntary
            Pension Schemes in case any amounts are withheld from my account and
            remitted to the local or foreign authorities/regulators;
          </li>
          <li>
            I hereby undertake that I have not granted a Power of Attorney to a
            person who has an address outside Pakistan to operate the Investor
            Account (either physically or electronically);
          </li>
          <li>
            I hereby undertake that I have no intention to set up Payment
            Standing Instruction(s) for the banking account(s) and beneficiary
            account(s) in a country outside Pakistan;
          </li>
          <li>
            I hereby undertake to notify PQAMCL within thirty (30) calendar days
            in case of any change in any information whatsoever which I have
            provided to PQAMCL; and
          </li>
          <li>
            I further agree and accept that the terms and conditions as
            contained herein shall form part and parcel of the account opening
            and the terms and conditions of the account opening as well other
            documentation shall remain in full force and effect.
          </li>
        </ol>
      </>
    );
  };

  const crs1Terms = () => {
    return (
      <>
        {" "}
        <h4>
          <u>INDIVIDUAL TAX RESIDENCY SELF-CERTIFICATION (CRS-1)</u>
        </h4>
        <ol type="a">
          <li>
            I understand that the information supplied by me is covered by the
            full provisions of the terms and conditions governing the Account
            Holder’s relationship with PQAMCL and PQAMCL Schemes setting out how
            PQAMCL and PQAMCL Schemes may use and share the information supplied
            by me;
          </li>
          <li>
            I acknowledge that the information provided during this account
            opening process and information regarding the Account Holder and any
            Reportable Account(s) may be provided to the tax authorities of the
            country in which this account is maintained and exchanged with tax
            authorities of another country or countries in which the Account
            Holder may be tax resident pursuant to intergovernmental agreements
            to exchange financial account information;
          </li>
          <li>
            I certify that I am the Account Holder of the account to which this
            information relates;
          </li>
          <li>
            I declare that I have neither asked for, nor received, any advice
            from PQAMCL and PQAMCL Schemes in determining my classification as a
            Reportable Person or otherwise;
          </li>
          <li>
            I declare that all statements made in this declaration are, to the
            best of my knowledge and belief, correct and complete; and
          </li>
          <li>
            I undertake to advise PQAMCL and PQAMCL Schemes within thirty (30)
            days of any change in circumstances which affects my tax residency
            status or causes the information contained herein to become
            incorrect or incomplete, and to provide PQAMCL with a suitably
            updated self-certification and declaration within thirty (30) days
            of such change in circumstances.
          </li>
        </ol>
      </>
    );
  };

  const drawTermsDialog = () => {
    return (
      <Dialog
        open={open}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Terms & Conditions</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            {accountOpeningTerms()}
            {props.data.isUSResident && factaTerms()}
            {props.data.isNonPakTaxResident && crs1Terms()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const submitApplication = async () => {
    setNavLoading(true);
    props.onNextAction().finally(() => setNavLoading(false));
  };

  return (
    <GridDX container spacing={2}>
      {drawTermsDialog()}
      <GridDX item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              name="isReceiveStatememt"
              checked={props.data.isReceiveStatememt}
              onChange={(e) => props.onChangeAction(e)}
              color="primary"
              style={{ visibility: "hidden" }}
            />
          }
          label="I understand that I will receive Statement of Account through electronic mail only."
        />
      </GridDX>
      <GridDX item xs={12}>
        <Divider variant="middle" />
      </GridDX>
      <GridDX item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              name="isReinvest"
              checked={props.data.isReinvest}
              onChange={(e) => props.onChangeAction(e)}
              color="primary"
              style={{ visibility: "hidden" }}
            />
          }
          label="I understand that my dividend proceeds will be re-invested in accordance with the requirements of the Offering Document of relevant Scheme."
        />
      </GridDX>
      {props.data.contactOwnershipId?.id === 2 && (
        <>
          <GridDX item xs={12}>
            <Divider variant="middle" />
          </GridDX>
          <GridDX item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="cellOwnerConsent"
                  checked={props.data.cellOwnerConsent}
                  onChange={(e) => props.onChangeAction(e)}
                  color="primary"
                />
              }
              label="I undertake and confirm that I have taken permission from my closed family member to use his/her mobile number for opening an account with Pak Qatar AMC"
            />
          </GridDX>
        </>
      )}
      <GridDX item xs={12}>
        <Divider variant="middle" />
      </GridDX>
      <GridDX
        item
        xs={12}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              name="isAgreeTerms"
              checked={props.data.isAgreeTerms}
              color="primary"
              onChange={(e) => {
                showTerms(e.target.checked);
                props.onChangeAction(e);
              }}
            />
          }
          label="I acknowledge that I have read, understood and agreed to the Declaration and Terms and Conditions."
        />
        <Launch
          style={{
            cursor: "pointer",
          }}
          onClick={() => showTerms(true)}
        />
      </GridDX>
      <GridDX item xs={12}>
        <Navigation
          onPrevAction={props.onPrevAction}
          onNextAction={
            props.data.isAgreeTerms &&
            (props.data.contactOwnershipId?.id !== 2 ||
              (props.data.contactOwnershipId?.id === 2 &&
                props.data.cellOwnerConsent))
              ? submitApplication
              : null
          }
          isDeclaration={true}
          loadingIndicator={isNavLoading}
        />
      </GridDX>
    </GridDX>
  );
};

export default Declaration;
