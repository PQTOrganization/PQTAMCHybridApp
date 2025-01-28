import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";

import BackIcon from "@mui/icons-material/ArrowBack";

import selfieBg from "../../asset/overlays/selfie_overlay.png";
import selfiBgDesktop from "../../asset/overlays/selfie_overlay_desktop_2.png";
import cnicFrontBg from "../../asset/overlays/cnic_front_overlay.png";
import cnicBackBg from "../../asset/overlays/cnic_back_overlay.png";
import cnicWatermark from "../../asset/overlays/cnic_watermark.png";
import { useConfigContext } from "../../context/configcontext";

const useStyles = (props: any) => {
  const theme = useTheme();
  const { SELFIE, CNIC_FRONT, CNIC_BACK } = useConfigContext();

  const useMobileView = useMediaQuery(theme.breakpoints.down("sm"));

  let overlay = {};

  switch (props) {
    case SELFIE:
      overlay = {
        backgroundImage: useMobileView
          ? `url(${selfieBg})`
          : `url(${selfiBgDesktop})`,
        backgroundRepeat: "no-repeat",
        backgroundPositionY: "top",
        backgroundPositionX: "center",
        backgroundSize: "cover", //useMobileView ? "cover" : "contain",
      };
      break;

    case CNIC_FRONT:
      overlay = {
        backgroundImage: `url(${cnicFrontBg})`,
        backgroundRepeat: "no-repeat",
        backgroundPositionY: "top",
        backgroundPositionX: "center",
        backgroundSize: "cover",
      };
      break;

    case CNIC_BACK:
      overlay = {
        backgroundImage: `url(${cnicBackBg})`,
        backgroundRepeat: "no-repeat",
        backgroundPositionY: "top",
        backgroundPositionX: "center",
        backgroundSize: "cover",
      };
      break;

    default:
      overlay = {};
  }

  return {
    app: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      justifyContent: "flex-start",
      overflow: "hidden",
    },

    row1: {
      display: "flex",
      flexDirection: "row",
      backgroundColor: "black",
      height: "90vh",
      justifyContent: "space-evenly",
      width: "100%",
    },

    app__container: {
      position: "relative",
      overflow: "hidden",
    },

    app__input: {
      position: "absolute",
      bottom: 0,
      backgroundColor: "transparent",
      //opacity: 0.5,
      width: "100%",
      justifyContent: "space-evenly",
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      height: "75px",
      zIndex: 100,
    },

    docupload_overlay: {
      ...overlay,
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 20,

      width: "100%",
      height: "100%",
    },

    photoframe: {
      top: 0,
      left: 0,
      zIndex: 10,
      borderWidth: 1,
      borderColor: "red",
      borderStyle: "dashed",
    },
  };
};

const TakeSnap = (props: any) => {
  const { open, handleClose, docType, facing } = props;

  const classes: any = useStyles(docType);
  const { CNIC_FRONT, CNIC_BACK } = useConfigContext();

  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [snapTaken, setSnapTaken] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [cropImageData, setCropImageData] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [isCameraReady, setCameraReady] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const platform = navigator?.userAgent ?? "";
    console.log(platform);

    if (
      platform.toLowerCase().includes("windows") ||
      platform.toLowerCase().includes("android")
    )
      setShowOverlay(true);
    else setShowOverlay(false);

    if (open) startVideo();
    else stopVideo();
  }, [open]);

  const startVideo = async () => {
    // reset zoom everytime video starts
    setZoomScale(1);

    var devices = navigator.mediaDevices;

    if (devices) {
      devices
        .getUserMedia({
          video: {
            facingMode: facing,
            width: { ideal: 1920 },
          },
        })
        .then((stream) => {
          let video: any = document.getElementById("videoPlayer");

          if (video) {
            video.srcObject = stream;
            setPlaying(true);
            setCameraReady(true);
          }
        })
        .catch((err) => {
          console.log("Get User Media Error: ", err);
          alert("Camera is not available");
          setCameraReady(false);
          handleClose(null);
        });
    } else {
      console.log("devices not found");
      alert("Devices are not available");
      setCameraReady(false);
      handleClose(null);
    }
  };

  const stopVideo = () => {
    if (playing) {
      setPlaying(false);
      let video: any = document.getElementById("videoPlayer");
      video.srcObject.getTracks()[currentTrack].stop();
    }
  };

  const resizeCanvas = () => {
    if (playing) {
      // var cv = document.getElementById("pictureFrame");
      // if (cv) {
      //   cv.style.position = "absolute";
      //   var ovrlay = document.getElementById("overlay");
      //   if (ovrlay) {
      //     var h = ovrlay.offsetHeight;
      //     var w = ovrlay.offsetWidth;
      //     switch (docType) {
      //       case SELFIE:
      //         cv.height = h * 0.46;
      //         cv.width = h * 0.47;
      //         cv.style.top = h * 0.18 + "px";
      //         cv.style.left = Math.round((w - cv.width) / 2) + "px";
      //         break;
      //       case CNIC_FRONT:
      //       case CNIC_BACK:
      //         cv.height = h * 0.333;
      //         cv.width = h * 0.47;
      //         cv.style.top = h * 0.18 + "px";
      //         cv.style.left = Math.round((w - cv.width) / 2) + "px";
      //         break;
      //       default:
      //         cv.height = h;
      //         cv.width = w;
      //         cv.style.top = "0px";
      //         cv.style.left = "0px";
      //    }
      //  }
      //}
    }
  };

  const capturePicture = () => {
    let video: any = document.getElementById("videoPlayer");
    var canvas: any = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    console.log("video wxh", video.videoWidth, video.videoHeight);

    var contex: any = canvas.getContext("2d");

    if (props.facing === "user") {
      // flip the video source image if taking selfie
      contex.translate(canvas.width, 0);
      contex.scale(-1, 1);
    }

    contex.drawImage(video, 0, 0, canvas.width, canvas.height);

    video.srcObject.getVideoTracks().forEach((track: any) => {
      track.enabled = false;
    });

    video.srcObject.getVideoTracks().forEach((track: any) => {
      track.enabled = true;
    });

    if (docType === CNIC_FRONT || docType === CNIC_BACK)
      generateCroppedImage(canvas);
    else setImageData(canvas.toDataURL());

    stopVideo();
    setSnapTaken(true);
  };

  const generateCroppedImage = async (srcImage: any) => {
    var canvas: any = document.createElement("canvas");

    //var picFrame = document.getElementById("pictureFrame");

    var w = srcImage.width;
    var h = srcImage.height * 0.35; // overlay height vs frame height ratio is 0.34934

    var srcX = 0;
    var srcY = srcImage.height * 0.18; // overlay height vs frame top ratio is 0.17467

    console.log({ w }, { h }, { srcX }, { srcY });

    canvas.width = w;
    canvas.height = h;

    var contex: any = canvas.getContext("2d");
    contex.drawImage(
      srcImage,
      srcX,
      srcY,
      w,
      h,
      0,
      0,
      w, //canvas.width,
      h //canvas.height
    );

    let watermark: any = await getWatermarkImage();

    if (watermark) {
      // if snap canvas width is larger than watermark
      if (w > watermark.width)
        contex.drawImage(
          watermark,
          w / 2 - watermark.width / 2, // place the watermark in the center of the picture
          0,
          watermark.width,
          watermark.height
        );
      else contex.drawImage(watermark, 0, 0, w, h);
    }

    // if ((docType === CNIC_FRONT || docType === CNIC_BACK) && w > 550) {
    //   var croppedCanvas = document.createElement("canvas");
    //   croppedCanvas.width = 550;
    //   croppedCanvas.height = h;
    //   var croppedContext = croppedCanvas.getContext("2d");

    //   croppedContext.drawImage(
    //     canvas,
    //     w / 2 - 550 / 2,
    //     0,s
    //     550,
    //     canvas.height,
    //     0,
    //     0,
    //     w / 2 - 550 / 2, //canvas.width,
    //     canvas.height
    //   );

    //   setImageData(croppedCanvas.toDataURL());
    // } else

    setImageData(canvas.toDataURL());
  };

  const getWatermarkImage = async () => {
    let img = new Image();
    img.src = cnicWatermark;

    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  const confirmPicture = () => {
    stopVideo();
    handleClose(imageData);
    setSnapTaken(false);
  };

  return (
    <Dialog
      open={open && isCameraReady}
      onClose={() => handleClose(null)}
      keepMounted
      fullScreen
    >
      <DialogContent style={{ padding: 0 }}>
        <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
          <IconButton
            sx={{ alignSelf: "flex-start", backgroundColor: "#cdcdcd" }}
            onClick={() => handleClose(null)}
          >
            <BackIcon />
          </IconButton>
        </div>
        <div className={classes.app}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              width: "100vw",
              height: "100vh",
              backgroundColor: "black",
            }}
          >
            {snapTaken ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "100%",
                  height: "100vh",
                }}
              >
                <img
                  id="srcImage"
                  src={imageData ?? ""}
                  width="100%"
                  style={{ objectFit: "contain" }}
                  alt="Snap Taken"
                />
              </div>
            ) : (
              <>
                <div className={classes.app__container}>
                  <video
                    id="videoPlayer"
                    muted
                    autoPlay
                    className={props.facing === "user" ? "videoFlipStyle" : ""}
                    style={{
                      objectFit: "cover",
                      objectPosition: "top",
                      width: "100vw",
                      height: "100vh",
                      zoom: zoomScale,
                    }}
                    onPlay={resizeCanvas}
                  ></video>
                  {playing && showOverlay && (
                    <>
                      <div
                        id="overlay"
                        className={classes.docupload_overlay}
                      ></div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className={classes.app__input}>
            <div>
              {playing ? (
                <Button
                  style={{ color: "RED" }}
                  onClick={() => {
                    stopVideo();
                    handleClose(null);
                  }}
                >
                  Close
                </Button>
              ) : snapTaken ? (
                <Button style={{ color: "GREEN" }} onClick={confirmPicture}>
                  Confirm
                </Button>
              ) : null}
              {snapTaken ? (
                <Button
                  style={{ color: "RED" }}
                  onClick={() => {
                    setSnapTaken(false);
                    startVideo();
                  }}
                >
                  Retry
                </Button>
              ) : (
                <Button
                  style={{ color: "GREEN" }}
                  onClick={() => {
                    capturePicture();
                    setPlaying(false);
                  }}
                  disabled={!playing}
                >
                  Take Picture
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TakeSnap;
