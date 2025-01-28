import React, { useEffect, useState } from "react";
import { Typography, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarsIcon from "@mui/icons-material/StarRate";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import Navigation from "../../controls/navigation";
import DocuploadDialoge from "../../dialogs/docuploaddialog";
import Loading from "../../loading";
import AlertComponenet from "../../alerts/alert";
import ButtonDX from "../../controls/buttondx";
import GridDX from "../../layout/griddx";
import BoxDX from "../../layout/boxdx";

import { useAuthContext } from "../../../context/authcontext";
import { useConfigContext } from "../../../context/configcontext";
import { useErrorContext } from "../../../context/errorcontext";

import TakeMobileSnap from "../../camera/takemobilesnap";
import Api from "../../../shared/api/api";
import TakeSnap from "../../camera/takesnap";

import useUserApplicationDocumentService from "../../../shared/services/userapplicationdocumentservice";

const useStyles = makeStyles((theme: Theme) => ({
  docSection: {
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 10,
    borderColor: theme.palette.primary.main,
    marginTop: 8,
    marginBottom: 8,
    padding: 16,
  },
  pdfIcon: {
    color: theme.palette.primary.main,
    fontSize: 80,
  },
  docTitleSection: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
  },
  docAbsent: {
    color: "gray",
    fontSize: "16px",
    marginRight: 10,
  },
  docPresent: {
    color: "green",
    fontSize: "16px",
    marginRight: 10,
  },
  docTitle: {
    fontSize: 12,
    color: "gray",
  },
  textSize: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px",
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: "13px",
    },
  },
  requiredRed: {
    color: "white",
    backgroundColor: "red",
    fontSize: "12px",
    borderRadius: "100%",
    padding: "2px",
  },
  requiredGrey: {
    color: "white",
    backgroundColor: "grey",
    fontSize: "12px",
    borderRadius: "100%",
    padding: "2px",
  },
}));

const DocUpload = (props: any) => {
  const classes = useStyles();
  const { getToken, inDiscrepancyMode, isDiscrepantDoc } = useAuthContext();
  const { SELFIE, CNIC_BACK, CNIC_FRONT, DOC_SIZE, IMAGE_SIZE } =
    useConfigContext();
  const { setError } = useErrorContext();
  const { allforUser } = useUserApplicationDocumentService();

  const [open, setOpen] = useState(false);
  const [sampleData, setSampleData] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [localDocumentList, setLocalDocumentList] = useState<any>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState("");
  const [isNavLoading, setNavLoading] = useState(false);

  const [showMobileCamera, setShowMobileCamera] = useState(false);
  const [platform, setPlatform] = useState("");

  const [totalNominees, setTotalNominees] = useState(0);

  useEffect(() => {
    setIsLoading(true);

    const newPlatform = navigator?.userAgent ?? "";
    setPlatform(newPlatform);

    // Api(
    //   "UserApplicationDocument/AllForUser/" + props.data.userApplicationId,
    //   null,
    //   "GET",
    //   ""
    // )
    allforUser(props.data.userApplicationId)
      .then((docs) => {
        const newDocumentList: any = [];

        docs.forEach((doc: any) => {
          let docImage = "";

          if (doc.document && doc.docType)
            docImage =
              (doc.docType.includes("pdf")
                ? "data:application/pdf;base64,"
                : "data:image/png;base64,") + doc.document;

          newDocumentList.push({
            ...doc,
            title: doc.shortName,
            document: docImage,
            modified: false,
          });
        });

        setLocalDocumentList(newDocumentList);
      })
      .catch((ex) => setError(ex))
      .finally(() => setIsLoading(false));

    if (props.data.nominees) {
      setTotalNominees(props.data.nominees.length * 2);
    }
  }, []);

  useEffect(() => {
    if (uploadErrors.length > 0) {
      const docErrors = uploadErrors
        .map((x, index) => index + 1 + ". " + x)
        .join("\n");

      setErrorAlertMessage(
        "Error uploading following document(s). Please try uploading them again." +
          "\n" +
          docErrors
      );
      setShowErrorAlert(true);
    }
  }, [uploadErrors]);

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const hideUploadErrors = () => {
    setShowErrorAlert(false);
    setUploadErrors([]);
  };

  const getBase64OfImageFile = (imageFile: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onHandleImageChange = async (docId: number, newImage: any) => {
    const docIndex = localDocumentList.findIndex(
      (x: any) => x.documentId === docId
    );

    if (docIndex > -1) {
      if (newImage instanceof File) {
        try {
          const docObject: any = localDocumentList[docIndex];
          var docImage;

          console.log("File Mime Type: ", newImage);

          if (
            docObject.documentCode === SELFIE ||
            docObject.documentCode === CNIC_FRONT ||
            docObject.documentCode === CNIC_BACK
          ) {
            if (newImage.type.includes("image"))
              docImage = await getBase64OfImageFile(newImage);
            else {
              showAlertMessage("Only image files are allowed");
              return;
            }
          } else {
            if (
              newImage.type.includes("image") ||
              newImage.type.includes("pdf")
            )
              docImage = await getBase64OfImageFile(newImage);
            else {
              showAlertMessage("Only image and PDF files are allowed");
              return;
            }
          }
        } catch (err) {
          console.log("Error converting file to base64");
          return;
        }
      } else docImage = newImage;

      if (newImage.size / (1024 * 1024) > DOC_SIZE) {
        showAlertMessage(
          "The Uploaded file Size is more than " + DOC_SIZE + " MB"
        );
      } else {
        console.log("change: ", { docIndex }, { newImage });

        localDocumentList[docIndex].docType = newImage.type;
        localDocumentList[docIndex].document = docImage;
        localDocumentList[docIndex].modified = true;

        setLocalDocumentList(localDocumentList.slice());
      }
    }
  };

  const handleNext = async (resetNav: any) => {
    const token = getToken();
    let errors = uploadErrors.slice();

    setNavLoading(true);

    for (let index = 0; index < localDocumentList.length; index++) {
      const doc: any = localDocumentList[index];
      var response;

      if (doc.modified) {
        if (doc.document === "") {
          try {
            response = await Api(
              "UserApplicationDocument/" + doc.userApplicationDocumentId,
              null,
              "DELETE",
              token
            );
            console.log("Delete response: ", response);
          } catch (err) {
            console.log(err);
          }
        } else {
          let cleanedDocument = doc.document.split(",")[1];
          let docFileName = doc.title
            .replace(new RegExp(" ", "g"), "")
            .replace("/", "");

          if (doc.document.split(";")[0].split(":")[1] === "application/pdf")
            docFileName += ".pdf";
          else docFileName += ".jpg";

          let imageData = {
            userApplicationId: props.data.userApplicationId,
            documentId: doc.documentId,
            document: cleanedDocument,
            docType: doc.docType,
            fileName: docFileName,
          };

          try {
            response = await Api(
              "UserApplicationDocument",
              imageData,
              "POST",
              token
            );
            console.log("Upload response: ", response);
          } catch (err) {
            errors.push(doc.title);
            console.log(err);
          }
        }
      }
    }

    if (errors.length > 0) {
      setNavLoading(false);
      setUploadErrors(errors);
    } else {
      props.data.allDocsUploaded =
        localDocumentList.filter(
          (d: any) => d.document === "" && d.isMandatory === true
        ).length === 0;
      props.onNextAction(resetNav);
    }
  };

  const handleOpen = (sample: any) => {
    setSampleData(sample);
    setOpen(true);
  };

  let currentNominee = 1;

  const handleClose = () => setOpen(false);

  const renderDocumentSection = (docDetails: any, key: any) => {
    let urlObj = null;

    if (docDetails.document)
      if (docDetails.document instanceof File)
        urlObj = URL.createObjectURL(docDetails.document);
      else urlObj = docDetails.document;

    return (
      <GridDX
        key={"doc_grid_key_" + key}
        item
        xs={12}
        className={classes.docSection}
      >
        <GridDX
          container
          sx={props.readOnly ? { flex: 1, borderStyle: "none" } : { flex: 1 }}
        >
          <GridDX item xs={12}>
            <CheckCircleIcon
              className={
                docDetails.document === ""
                  ? classes.docAbsent
                  : classes.docPresent
              }
            />
            <Typography variant="h6" className={classes.docTitle}>
              {key +
                "." +
                (props.readOnly ? " " : "Please upload ") +
                docDetails.title}
            </Typography>
            {docDetails.isMandatory && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row-reverse",
                }}
              >
                <StarsIcon
                  className={
                    docDetails.document === ""
                      ? classes.requiredRed
                      : classes.requiredGrey
                  }
                />
              </div>
            )}
          </GridDX>
          <GridDX item xs={12}>
            <GridDX
              container
              spacing={2}
              alignItems="center"
              sx={{ mt: 1, flex: 1 }}
            >
              {props.readOnly ||
              (inDiscrepancyMode() &&
                !isDiscrepantDoc(docDetails.documentId)) ? null : (
                <GridDX
                  item
                  sm={8}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flex: "1 auto",
                  }}
                >
                  <ButtonDX
                    variant="outlined"
                    size="small"
                    className={classes.textSize}
                    sx={{ mr: 1 }}
                    onClick={() => handleOpen(docDetails.documentId)}
                  >
                    View Sample
                  </ButtonDX>
                  {platform?.toLowerCase().includes("iphone") ? (
                    <>
                      <input
                        id={docDetails.documentId}
                        name={docDetails.documentId.toString()}
                        accept="image/*"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e: any) => {
                          onHandleImageChange(
                            docDetails.documentId,
                            e.target.files[0]
                          );
                        }}
                      />
                      <label
                        htmlFor={docDetails.documentId}
                        style={{ display: "flex" }}
                      >
                        <ButtonDX size="small" component="span">
                          <CloudUploadIcon style={{ fontSize: 16 }} />
                        </ButtonDX>
                      </label>
                    </>
                  ) : (
                    <ButtonDX
                      size="small"
                      component="span"
                      sx={{ mr: 1 }}
                      onClick={() => {
                        setSelectedDocument(docDetails.documentCode);
                        showWebOrMobileCamera(
                          docDetails.documentCode === SELFIE ? "front" : "back"
                        );
                      }}
                    >
                      <PhotoCamera style={{ fontSize: 16 }} />
                    </ButtonDX>
                  )}
                  {docDetails.documentCode !== SELFIE && (
                    <>
                      <input
                        id={docDetails.documentId}
                        name={docDetails.documentId.toString()}
                        accept="image/*"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e: any) => {
                          onHandleImageChange(
                            docDetails.documentId,
                            e.target.files[0]
                          );
                        }}
                      />
                      <label
                        htmlFor={docDetails.documentId}
                        style={{ display: "flex" }}
                      >
                        <ButtonDX size="small" component="span">
                          <CloudUploadIcon style={{ fontSize: 16 }} />
                        </ButtonDX>
                      </label>
                    </>
                  )}
                </GridDX>
              )}
              <GridDX
                item
                sm={props.readOnly ? 12 : 4}
                style={{ justifyContent: "flex-end" }}
              >
                {docDetails.document ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: props.readOnly ? "center" : "flex-end",
                      alignItems: "center",
                      overflowWrap: "anywhere",
                      backgroundColor: props.readOnly ? "#efefef" : undefined,
                      padding: props.readOnly ? 5 : 0,
                    }}
                  >
                    {docDetails.document.split(";")[0].split(":")[1] !==
                    "application/pdf" ? (
                      <img
                        src={urlObj}
                        height={props.readOnly ? 75 : 50}
                        alt={docDetails.title}
                      />
                    ) : (
                      <PictureAsPdfIcon className={classes.pdfIcon} />
                    )}
                    {props.readOnly ||
                    (inDiscrepancyMode() &&
                      !isDiscrepantDoc(docDetails.documentId)) ? null : (
                      <DeleteIcon
                        color="error"
                        fontSize="small"
                        style={{ marginLeft: 5, cursor: "pointer" }}
                        onClick={() =>
                          onHandleImageChange(docDetails.documentId, "")
                        }
                      />
                    )}
                  </div>
                ) : null}
              </GridDX>
            </GridDX>
          </GridDX>
        </GridDX>
      </GridDX>
    );
  };

  const showWebOrMobileCamera = (cameraDirection: string) => {
    const isIOS = !(
      platform.toLowerCase().includes("windows") ||
      platform.toLowerCase().includes("android")
    );

    if (isIOS) {
      setShowCamera(true);
      return;
    }

    if ((window as any)?.ReactNativeWebView) {
      setShowMobileCamera(true);

      (window as any).ReactNativeWebView.postMessage(
        JSON.stringify({ messageType: "camera", data: cameraDirection })
      );
    } else setShowCamera(true);
  };

  const imageReceivedFromMobile = async (
    base64Image: string,
    docId: string
  ) => {
    setShowMobileCamera(false);

    if (base64Image) {
      const docIndex = localDocumentList.findIndex(
        (x: any) => x.documentCode === docId
      );

      console.log({ localDocumentList, docId, docIndex });

      if (docIndex > -1) {
        const docList = localDocumentList.slice();

        docList[docIndex].docType = "image/png";
        docList[docIndex].modified = true;

        const sizeInMB = getBase64ImageSizeInMB(base64Image);
        console.log({ sizeInMB });

        if (sizeInMB > IMAGE_SIZE) {
          console.log("The captured Image is more than " + IMAGE_SIZE + "MB");

          // const reducedImage = await reduceImageSizeToLimit(
          //   base64Image,
          //   sizeInMB
          // );

          const reducedImage = base64Image;

          docList[docIndex].document = "data:image/png;base64," + reducedImage;
        } else
          docList[docIndex].document = "data:image/png;base64," + base64Image;

        setLocalDocumentList(docList);
      }
    }
  };

  const closeCamera = async (capturedImage: any) => {
    if (capturedImage) {
      const docIndex = localDocumentList.findIndex(
        (x: any) => x.documentCode === selectedDocument
      );

      if (docIndex > -1) {
        const docList = localDocumentList.slice();
        const sizeInMB = getBase64ImageSizeInMB(capturedImage);

        console.log({ sizeInMB });

        if (sizeInMB > IMAGE_SIZE) {
          console.log("The captured Image is more than " + IMAGE_SIZE + "MB");

          const reducedImage = await reduceImageSizeToLimit(
            capturedImage,
            sizeInMB
          );

          docList[docIndex].document = reducedImage;
        } else docList[docIndex].document = capturedImage;

        docList[docIndex].docType = "image/png";
        docList[docIndex].modified = true;

        setLocalDocumentList(docList);
      }
    }

    setShowCamera(false);
  };

  const getBase64ImageSizeInMB = (image: any) => {
    const stringLength = image.length - "data:image/png;base64,".length;
    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    const sizeInMB = sizeInBytes / 1048576;
    return sizeInMB;
  };

  const calculatePercentIncrease = (sizeInMB: any) => {
    //const sizeInMB = sizeToCheck / (1024 * 1024);
    //console.log({ sizeInMB });

    const numerator = Math.abs(sizeInMB - IMAGE_SIZE);
    const denominator = (sizeInMB + IMAGE_SIZE) / 2;
    const percent = Math.round((numerator / denominator) * 100) / 100;

    return percent;
  };

  const reduceImageSizeToLimit = (originalImage: any, sizeInMB: any) => {
    return new Promise((resolve, reject) => {
      const percentInc = calculatePercentIncrease(sizeInMB);

      var image = new Image();
      image.src = originalImage;
      image.onload = () => {
        const oc = document.createElement("canvas");
        const octx = oc.getContext("2d");

        oc.width = image.width * (1 - percentInc);
        oc.height = image.height * (1 - percentInc);

        // step 2, resize to size
        octx?.drawImage(image, 0, 0, oc.width, oc.height);

        const newImage = oc.toDataURL();
        const newSizeInMB = getBase64ImageSizeInMB(newImage);
        console.log({ newSizeInMB });

        return resolve(newImage);
      };
      image.onerror = (error) => reject(error);
    });
  };

  return (
    <BoxDX>
      <AlertComponenet
        title="Document Size"
        open={showAlert}
        alert={alertMessage}
        closeLabel="Retry"
        handleClose={() => hideAlert()}
        handlePopupClose={() => setShowAlert(false)}
      />
      <AlertComponenet
        open={showErrorAlert}
        alert={errorAlertMessage}
        handleClose={() => hideUploadErrors()}
        handlePopupClose={() => setShowErrorAlert(false)}
      />

      {showMobileCamera && (
        <TakeMobileSnap
          open={showMobileCamera}
          docId={selectedDocument}
          facing={selectedDocument === SELFIE ? "user" : "environment"}
          handleClose={imageReceivedFromMobile}
        />
      )}

      <TakeSnap
        docType={selectedDocument}
        facing={selectedDocument === SELFIE ? "user" : "environment"}
        open={showCamera}
        handleClose={closeCamera}
      />

      <GridDX container alignContent="center" justifyContent="center">
        {isLoading && <Loading />}
        <GridDX item xs={12}>
          <GridDX
            container
            alignContent="center"
            justifyContent="center"
            rowSpacing={3}
          >
            {!isLoading &&
              localDocumentList.map((x: any, index: number) => {
                if (!x.shortName.toLowerCase().includes("nominee")) {
                  return renderDocumentSection(x, index + 1);
                } else {
                  if (totalNominees > 0 && currentNominee <= totalNominees) {
                    currentNominee = currentNominee + 1;
                    return renderDocumentSection(x, index + 1);
                  } else {
                    x.isMandatory = false;
                  }
                }
              })}
          </GridDX>
        </GridDX>

        {!props.readOnly && !isLoading && (
          <GridDX item xs={12}>
            <Navigation
              loadingIndicator={isNavLoading}
              onPrevAction={props.onPrevAction}
              onNextAction={handleNext}
            />
          </GridDX>
        )}
      </GridDX>

      <DocuploadDialoge
        open={open}
        handleClose={handleClose}
        data={sampleData}
      />
    </BoxDX>
  );
};

export default DocUpload;
