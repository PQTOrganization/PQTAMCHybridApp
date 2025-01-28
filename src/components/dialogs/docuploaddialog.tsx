import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  SlideProps,
} from "@mui/material";
import { useConfigContext } from "../../context/configcontext";

import selfie from "../../asset/docSamples/SelfieView.jpg";
import cnicFront from "../../asset/docSamples/CNICFront.jpg";
import cnicBack from "../../asset/docSamples/CNICBack.jpg";
import NonMuslim from "../../asset/docSamples/NonMuslim.pdf";
import Muslim from "../../asset/docSamples/Muslim.pdf";
import NonMuslimImg from "../../asset/docSamples/NonMuslim.png";
import MuslimImg from "../../asset/docSamples/Muslim.png";
import AddressProof from "../../asset/docSamples/sample-address-proof.jpg";

const Transition = React.forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DocuploadDialoge = (props: any) => {
  const { open, handleClose, data } = props;
  const { SELFIE, CNIC_FRONT, CNIC_BACK, MUSLIM_ZAKAT, ADDRESS_PROOF } =
    useConfigContext();

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      fullScreen
      onClose={handleClose}
    >
      <DialogTitle>View Sample</DialogTitle>
      <DialogContent style={{ justifyContent: "center", display: "flex" }}>
        {data === "zakatNonMuslim" ? (
          <div style={{ textAlign: "center" }}>
            <object
              data={NonMuslim}
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <img
                src={NonMuslimImg}
                alt="Non-Muslim"
                style={{ width: "100%" }}
              />
              <Button variant="outlined" color="primary">
                {" "}
                <a
                  href={"/asset/NonMuslim.pdf"}
                  target="_blank"
                  style={{ textDecoration: "none", color: "inherit" }}
                  download
                  rel="noreferrer"
                >
                  Click here To Download
                </a>
              </Button>
            </object>
          </div>
        ) : data === MUSLIM_ZAKAT ? (
          <div style={{ textAlign: "center" }}>
            <object
              data={Muslim}
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <img src={MuslimImg} alt="selfie" style={{ width: "100%" }} />
              <Button variant="outlined" color="primary">
                {" "}
                <a
                  href={"/asset/Muslim.pdf"}
                  target="_blank"
                  style={{ textDecoration: "none", color: "inherit" }}
                  download
                  rel="noreferrer"
                >
                  Click here To Download
                </a>
              </Button>
            </object>
          </div>
        ) : (
          <img
            src={
              data === SELFIE
                ? selfie
                : data === CNIC_FRONT
                ? cnicFront
                : data === CNIC_BACK
                ? cnicBack
                : data === ADDRESS_PROOF
                ? AddressProof
                : ""
            }
            alt="Sample Image"
            style={{ height: "100%" }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={handleClose}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocuploadDialoge;
