import * as React from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import BoxDX from "./boxdx";
import ButtonDX from "../controls/buttondx";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 250,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
  py: 3,
};

const ModalDX = (props: {
  text?: string;
  secondary?: string;
  buttonLink?: string;
  buttonText?: string;
  icon?: boolean;
}) => {
  const buttonStyle = {
    color: "#8B0037",
    width: "50%",
    mx: "25%",
    fontSize: 18,
    fontWeight: "bold",
    mt: 4,
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <ButtonDX
        onClick={handleOpen}
        color="secondary"
        variant="contained"
        sx={{
          width: "80%",
          mx: "10%",
          backgroundColor: "#8B0037",
        }}
      >
        PROCEED
      </ButtonDX>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <BoxDX sx={style}>
          {props.icon ? (
            <div
              style={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <CheckCircleIcon
                sx={{ color: "#219653", fontSize: 120, mb: 2 }}
              />
            </div>
          ) : (
            ""
          )}

          {props.text ? (
            <Typography
              id="modal-modal-title"
              variant="h4"
              component="h1"
              align="center"
              sx={{
                color: "#263238",
                fontSize: 23,
                fontWeight: 900,
                fontFamily: "Roboto",
              }}
            >
              {props.text}
            </Typography>
          ) : (
            ""
          )}

          {props.secondary ? (
            <Typography
              id="modal-modal-description"
              align="center"
              sx={{ mt: 3, fontSize: 18 }}
            >
              {props.secondary}
            </Typography>
          ) : (
            ""
          )}

          {props.buttonLink ? (
            <Link to={props.buttonLink}>
              <ButtonDX
                onClick={handleClose}
                variant="outlined"
                sx={buttonStyle}
              >
                {props.buttonText}
              </ButtonDX>
            </Link>
          ) : props.buttonText ? (
            <ButtonDX onClick={handleClose} variant="outlined" sx={buttonStyle}>
              {props.buttonText}
            </ButtonDX>
          ) : (
            ""
          )}
        </BoxDX>
      </Modal>
    </div>
  );
};

export default ModalDX;
