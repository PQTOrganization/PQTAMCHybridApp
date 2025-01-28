import React, { createRef } from "react";

import { Grid, Typography, IconButton, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";

import Basic from "./basic";
import Personal from "./personal";
import Bank from "./bank";
import KYC from "./kyc";
import FATCA from "./fatca";
import CRS1 from "./crs1";
import AdditionalKYC from "./additionalkyc";
import DocUpload from "./docupload";

import Navigation from "../../controls/navigation";
import Contribution from "./contribution";
import ContributionDeclaration from "./contdeclaration";
import ContributionNominee from "./contributionnominee";
import RiskProfile from "./riskprofile";

const useStyles = makeStyles((theme: Theme) => ({
  reviewSection: {
    borderStyle: "solid",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#010101",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  headingRow: {
    marginTop: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  heading: {
    color: theme.palette.primary.main,
    alignSelf: "center",
    fontWeight: 900,
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.15rem !important",
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: "2rem !important",
      fontWeight: 900,
    },
  },
  headingIconStyle: {
    borderColor: "#21a537",
    borderWidth: 1,
    borderStyle: "solid",
  },
}));

const Review = (props: any) => {
  const classes = useStyles();
  const ref = createRef();
  const isMobile = window.innerWidth <= window.innerHeight;

  return (
    <>
      <div>
        <div className={classes.reviewSection}>
          <div className={classes.headingRow}>
            <Typography variant="h1" className={classes.heading}>
              Basic Information
            </Typography>
            <IconButton
              color="primary"
              component="span"
              size="small"
              className={classes.headingIconStyle}
              onClick={() => props.gotoStep(1)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </div>

          <Basic
            data={props.data}
            readOnly={true}
            onChangeAction={props.onChangeAction}
            handleCheckedBox={props.handleCheckedBox}
          />
        </div>

        <div className={classes.reviewSection}>
          <div className={classes.headingRow}>
            <Typography variant="h1" className={classes.heading}>
              Personal Information
            </Typography>
            <IconButton
              color="primary"
              component="span"
              size="small"
              className={classes.headingIconStyle}
              onClick={() => props.gotoStep(2)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </div>

          <Personal
            data={props.data}
            readOnly={true}
            onChangeAction={props.onChangeAction}
            handleCheckedBox={props.handleCheckedBox}
          />
        </div>

        <div className={classes.reviewSection}>
          <div className={classes.headingRow}>
            <Typography variant="h1" className={classes.heading}>
              Bank Details
            </Typography>
            <IconButton
              color="primary"
              component="span"
              size="small"
              className={classes.headingIconStyle}
              onClick={() => props.gotoStep(3)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </div>
          <Bank
            data={props.data}
            readOnly={true}
            onChangeAction={props.onChangeAction}
            handleCheckedBox={props.handleCheckedBox}
          />
        </div>

        <div className={classes.reviewSection}>
          <div className={classes.headingRow}>
            <Typography variant="h1" className={classes.heading}>
              Know Your Customer
            </Typography>
            <IconButton
              color="primary"
              component="span"
              size="small"
              className={classes.headingIconStyle}
              onClick={() => props.gotoStep(4)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </div>

          <KYC data={props.data} readOnly={true} />
        </div>

        {props.showAddKYC && (
          <div className={classes.reviewSection}>
            <div className={classes.headingRow}>
              <Typography variant="h1" className={classes.heading}>
                Politically Exposed Person
              </Typography>
              <IconButton
                color="primary"
                component="span"
                size="small"
                className={classes.headingIconStyle}
                onClick={() => props.gotoStep(6)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </div>

            <AdditionalKYC data={props.data} readOnly={true} />
          </div>
        )}

        {props.showFATCA && (
          <div className={classes.reviewSection}>
            <div className={classes.headingRow}>
              <Typography variant="h1" className={classes.heading}>
                FATCA
              </Typography>
              <IconButton
                color="primary"
                component="span"
                size="small"
                className={classes.headingIconStyle}
                onClick={() => props.gotoStep(7)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </div>

            <FATCA data={props.data} readOnly={true} />
          </div>
        )}
        {props.showCRS && (
          <div className={classes.reviewSection}>
            <div className={classes.headingRow}>
              <Typography variant="h1" className={classes.heading}>
                CRS-1
              </Typography>
              <IconButton
                color="primary"
                component="span"
                size="small"
                className={classes.headingIconStyle}
                onClick={() => props.gotoStep(8)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </div>
            <CRS1 data={props.data} readOnly={true} />
          </div>
        )}
        {props.showContribution && (
          <>
            {" "}
            <div className={classes.reviewSection}>
              <div className={classes.headingRow}>
                <Typography variant="h1" className={classes.heading}>
                  Contribution Details
                </Typography>
                <IconButton
                  color="primary"
                  component="span"
                  size="small"
                  className={classes.headingIconStyle}
                  onClick={() => props.gotoStep(8)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </div>
              <Contribution data={props.data} readOnly={true} />
            </div>
            <div className={classes.reviewSection}>
              <div className={classes.headingRow}>
                <Typography variant="h1" className={classes.heading}>
                  Contribution Declaration
                </Typography>
                <IconButton
                  color="primary"
                  component="span"
                  size="small"
                  className={classes.headingIconStyle}
                  onClick={() => props.gotoStep(8)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </div>
              <ContributionDeclaration data={props.data} readOnly={true} />
            </div>
            <div className={classes.reviewSection}>
              <div className={classes.headingRow}>
                <Typography variant="h1" className={classes.heading}>
                  Risk Profile
                </Typography>
                <IconButton
                  color="primary"
                  component="span"
                  size="small"
                  className={classes.headingIconStyle}
                  onClick={() => props.gotoStep(8)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </div>
              <RiskProfile data={props.data} readOnly={true} />
            </div>
            <div className={classes.reviewSection}>
              <div className={classes.headingRow}>
                <Typography variant="h1" className={classes.heading}>
                  Contribution Nominee
                </Typography>
                <IconButton
                  color="primary"
                  component="span"
                  size="small"
                  className={classes.headingIconStyle}
                  onClick={() => props.gotoStep(8)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </div>
              <ContributionNominee data={props.data} readOnly={true} />
            </div>
          </>
        )}

        <div className={classes.reviewSection}>
          <div className={classes.headingRow}>
            <Typography variant="h1" className={classes.heading}>
              Document Upload
            </Typography>
            <IconButton
              color="primary"
              component="span"
              size="small"
              className={classes.headingIconStyle}
              onClick={() => props.gotoStep(9)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </div>
          <DocUpload
            data={props.data}
            userDetails={props.userDetails}
            readOnly={true}
          />
        </div>

        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <Navigation
              onPrevAction={props.onPrevAction}
              onNextAction={props.onNextAction}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Review;
