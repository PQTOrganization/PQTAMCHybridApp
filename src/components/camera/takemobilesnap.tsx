import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";

import BackIcon from "@mui/icons-material/ArrowBack";

const TakeMobileSnap = (props: any) => {
  const [open, setOpen] = useState<boolean>(props.open);

  useEffect(() => {
    document.addEventListener("message", photoFromApp, false);

    return () => {
      document.removeEventListener("message", photoFromApp, false);
    };
  }, []);

  const photoFromApp = (message: any) => {
    if (message) props.handleClose(message.data, props.docId);
    else props.handleClose(null, props.docId);
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => photoFromApp(null)}
      keepMounted
      fullScreen
    >
      <DialogContent
        style={{
          flex: 1,
          backgroundColor: "black",
          opacity: 0.7,
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
          <IconButton
            sx={{ alignSelf: "flex-start", backgroundColor: "#cdcdcd" }}
            onClick={() => photoFromApp(null)}
          >
            <BackIcon />
          </IconButton>
        </div>
        <p>Loading Device Camera</p>
      </DialogContent>
    </Dialog>
  );
};

export default TakeMobileSnap;
