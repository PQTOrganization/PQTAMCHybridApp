import React, { useEffect, useState } from "react";
import {
  Typography,
  Modal,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GoBackIcon from "@mui/icons-material/ArrowBack";

import SelectListDX from "../../components/controls/selectlistdx";
import ButtonDX from "../../components/controls/buttondx";
import TextFieldDX from "../../components/controls/textfielddx";
import GridDX from "../../components/layout/griddx";
import BoxDX from "../../components/layout/boxdx";
import GridRowDividerDX from "../../components/layout/gridrowdividerdx";
import LoadingButtonDX from "../../components/controls/loadingbuttondx";

import useFundsService from "../../shared/services/fundservice";
import { formattedNumber, HighRiskFunds, toBase64 } from "../../shared/global";
import useInvestementService from "../../shared/services/investmentservice";
import { bankList, getBanks } from "../../shared/lookups";

import { useConfigContext } from "../../context/configcontext";
import { useErrorContext } from "../../context/errorcontext";
import { useAuthContext } from "../../context/authcontext";
import AlertComponenet from "../../components/alerts/alert";
import Api from "../../shared/api/api";

const RegisterInvestment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setError } = useErrorContext();
  const { DOC_SIZE } = useConfigContext();
  const { getUserDetails, signOut } = useAuthContext();
  const { getFundsByAcctCategory, getFundsWithBanks } = useFundsService();
  const { createInitialInvestmentRequest } = useInvestementService();

  const [isLoading, setIsLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [funds, setFunds] = useState<any>([]);
  const [fundsList, setFundsList] = useState<any>([]);
  const [banks, setBanks] = useState<any>([]);
  const [proof, setProof] = useState<any>(null);
  const [userData, setUserData] = useState<any>();
  const [selectedFund, setSelectedFund] = useState<any>(null);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [showDoc, setShowDoc] = useState(false);
  const [showHighRiskAlert, setShowHighRiskAlert] = useState(false);
  const [riskAccepted, setRiskAccepted] = useState(false);

  const [data, setData] = useState<any>({
    fund: "",
    modeOfPayment: "",
    investmentAmount: null,
    bank: "",
  });

  const modesOfPayment = [
    { id: 2, value: "Cheque" },
    { id: 4, value: "Online Transfer/IBFT" },
  ];

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    if (location.state?.data) {
      const { data } = location.state;
      if (data) setData(data);
    }

    if (bankList.length == 0) {
      getBanks().catch((err) => setError(err));
    }

    getUserDetails().then((userDetails: any) => {
      setUserData(userDetails);
      let token = "";
      Api(
        "UserApplication/" + userDetails.userApplicationId,
        null,
        "GET",
        token
      ).then(async (applicationData) => {
        return Promise.all([
          getFundsByAcctCategory(applicationData?.accountCategoryId).then(
            (funds) => {
              setFunds(funds);

              const newFundsList = funds.map((f: any) => {
                return { id: f.fundId, value: f.fundName };
              });

              setFundsList(newFundsList);
            }
          ),
          getFundsWithBanks().then((banks) => {
            setBanks(banks);
          }),
        ])
          .catch((err) => setError(err))
          .finally(() => setIsLoading(false));
      });
    });
  }, []);

  useEffect(() => {
    if (data?.fund) {
      setSelectedFund(funds.find((f: any) => f.fundId == data.fund.id));

      setSelectedBank(banks.find((b: any) => b.fundId === data.fund.id));
    }
  }, [data.fund]);
  useEffect(() => {
    if (riskAccepted) {
      // if (data.modeOfPayment.id === 6)
      //   navigate("/confirm", {
      //     state: {
      //       data,
      //     },
      //   });
      // else
      createInvestment();
    }
  }, [riskAccepted]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    delete newErrors[name];

    setErrors(newErrors);
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSelectChange = (value: any, name: string) => {
    const newErrors = { ...errors };
    delete newErrors[name];
    setErrors(newErrors);

    setData({ ...data, [name]: value });
  };

  const onHandleDocumentUpload = async (newDocument: any) => {
    if (newDocument instanceof File) {
      try {
        if (
          newDocument.type.includes("image") ||
          newDocument.type.includes("pdf")
        ) {
          if (newDocument.size / (1024 * 1024) > DOC_SIZE) {
            setError("The Uploaded file Size is more than " + DOC_SIZE + " MB");
            return;
          }

          const docBase64 = (await toBase64(newDocument)) as string;
          const proof = {
            documentName: newDocument.name,
            document: docBase64,
          };

          setProof(proof);
          delete errors["proof"];
        } else {
          setError("Only image and PDF files are allowed");
          return;
        }
      } catch (err) {
        setError("Error converting file to base64", err);
        return;
      }
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (parseInt(data.fund.id) in HighRiskFunds) {
        setShowHighRiskAlert(true);
      } else {
        // if (data.modeOfPayment.id === 4)
        //   navigate("/confirm", {
        //     state: {
        //       data,
        //     },
        //   });
        // else
        createInvestment();
      }
    }
  };

  const validateInvestmentAmount = () => {
    const newErrors: any = {};

    if (!data.investmentAmount || data.investmentAmount === 0)
      newErrors["investmentAmount"] = "Investment amount is required";
    else if (
      selectedFund &&
      data.investmentAmount < selectedFund.minInvestmentLimit
    ) {
      newErrors[
        "investmentAmount"
      ] = `Minimum Investment amount is ${formattedNumber(
        selectedFund.minInvestmentLimit,
        0
      )}`;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (data.fund === "") newErrors["fund"] = "Fund is required";

    if (data.modeOfPayment === "")
      newErrors["modeOfPayment"] = "Mode of payment is required";

    if (!data.investmentAmount || data.investmentAmount === 0)
      newErrors["investmentAmount"] = "Investment amount is required";
    else if (
      selectedFund &&
      data.investmentAmount < selectedFund.minInvestmentLimit
    ) {
      newErrors[
        "investmentAmount"
      ] = `Minimum Investment amount is ${formattedNumber(
        selectedFund.minInvestmentLimit,
        0
      )}`;
    }

    if (data.modeOfPayment !== "" && data.modeOfPayment.id !== 6 && !proof)
      newErrors["proof"] = "Proof of payment is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const createInvestment = async () => {
    setSendingRequest(true);

    createInitialInvestmentRequest(
      userData.userId,
      userData.userApplicationId,
      data.fund.id,
      data.investmentAmount,
      data.modeOfPayment.id,
      selectedFund.frontEndLoadPercentage,
      selectedFund.lastNav,
      proof?.document,
      data.bank?.id
    )
      .then(() => {
        setOpen(true);
      })
      .catch((err: any) => setError(err))
      .finally(() => setSendingRequest(false));
  };

  const renderDocument = () => {
    const documentToView = proof.document as string;

    if (documentToView?.split(";")[0].split(":")[1] === "application/pdf")
      return (
        <Document file={`${documentToView}`}>
          <Page pageNumber={1} renderTextLayer={false} />
        </Document>
      );
    else return <img src={documentToView} style={{ width: "100%" }} />;
  };

  return (
    <GridDX
      container
      sx={{ width: "100%" }}
      rowSpacing={2}
      alignContent="flex-start"
    >
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <BoxDX
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            backgroundColor: "white",
            boxShadow: 24,
            borderRadius: 1,
            textAlign: "center",
            p: 4,
          }}
        >
          <CheckCircleIcon sx={{ color: "#219653", fontSize: 120, mb: 2 }} />

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
            New Investment Request Generated
          </Typography>

          <Typography
            id="modal-modal-description"
            align="center"
            sx={{ my: 3, fontSize: 18 }}
          >
            Thank you. Your request for New Investment has been created. And it
            will be processed within 24 Working Hours.
          </Typography>

          <ButtonDX
            onClick={() => {
              setOpen(false);
              signOut();
              navigate("/");
            }}
          >
            OK
          </ButtonDX>
        </BoxDX>
      </Modal>

      <AlertComponenet
        title="Notice"
        open={showHighRiskAlert}
        alert={
          <Typography>
            Risk / Investment Warning: Investing in mutual funds involves market
            risks, and the value of the units may fluctuate based on market
            conditions. Before investing, it is crucial to carefully review the
            investment policies, risk factors, taxation policies, and warnings
            mentioned in the offering documents to make an informed decision.
            You confirm that you understand and acknowledge the potential risks
            and associated dangers of erosion of your principal amount. Pak
            Qatar Asset Management Company Limited (PQAMCL) is not liable for
            any losses incurred as a result of your investment decision.
            <br /> <br />
            Furthermore, PQAMCL has recommended a specific fund category based
            on your risk profile. However, you have the right to invest in any
            other fund or category. By clicking on "Yes" you confirm that you
            have read and understood the Trust Deeds, offering documents, and
            any supplemental Trust Deeds and Offering Documents governing these
            funds and their respective investment or transfer or conversion,
            which are available at https://pqamcl.com/constitutive-documents/
            You agree to the risks mentioned in this warning and provide your
            consent to PQAMCL. Or press cancel to select another fund category
          </Typography>
        }
        closeLabel={"Cancel"}
        handleClose={() => setShowHighRiskAlert(false)}
        okLabel={"Yes"}
        handleCloseOk={() => {
          setRiskAccepted(true);
          setShowHighRiskAlert(false);
        }}
        handlePopupClose={() => setShowHighRiskAlert(false)}
      />

      <Dialog fullScreen open={showDoc} onClose={() => setShowDoc(false)}>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <GridDX container sx={{ height: "100%" }} alignItems="flex-start">
            <GridDX item xs={12}>
              <IconButton size="large" onClick={() => setShowDoc(false)}>
                <GoBackIcon />
              </IconButton>
            </GridDX>
            <GridDX
              item
              xs={12}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {showDoc && proof && renderDocument()}
            </GridDX>
          </GridDX>
        </DialogContent>
      </Dialog>
      <GridDX item xs={12}>
        <SelectListDX
          id="fund"
          name="fund"
          label="Choose Fund"
          list={fundsList}
          value={data["fund"]}
          onChange={(e: any, v: any) => handleSelectChange(v, "fund")}
          error={errors["fund"] ? true : undefined}
          helperText={errors["fund"]}
          loading={isLoading}
          required
        />
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldDX
          id="investmentAmount"
          name="investmentAmount"
          label="Investment Amount"
          value={data.investmentAmount}
          required
          type="number"
          onInput={(e: any) => {
            e.target.value = Math.max(0, parseInt(e.target.value))
              .toString()
              .slice(0, 9);
          }}
          onChange={handleInputChange}
          onBlur={() => validateInvestmentAmount()}
          error={errors["investmentAmount"] ? true : undefined}
          helperText={errors["investmentAmount"]}
          loading={isLoading}
        />
      </GridDX>
      <GridDX item xs={12}>
        <SelectListDX
          id="modeOfPayment"
          name="modeOfPayment"
          placeholder="Choose Mode of Payment"
          label="Mode of Payment"
          list={modesOfPayment}
          value={data["modeOfPayment"]}
          onChange={(e: any, v: any) => handleSelectChange(v, "modeOfPayment")}
          error={errors["modeOfPayment"] ? true : undefined}
          helperText={errors["modeOfPayment"]}
          loading={isLoading}
          required
        />
      </GridDX>
      <GridDX item xs={12}>
        <GridDX container rowSpacing={3} sx={{ width: "100%" }}>
          <GridDX item xs={6}>
            Last NAV:
          </GridDX>
          <GridDX item xs={6} justifyContent="flex-end">
            Rs. {selectedFund?.offerNav}
          </GridDX>
          <GridRowDividerDX />
          <GridDX item xs={6}>
            Estimated Units:
          </GridDX>
          <GridDX item xs={6} justifyContent="flex-end">
            {formattedNumber(data?.investmentAmount / selectedFund?.offerNav)}
          </GridDX>
          <GridRowDividerDX />
        </GridDX>
      </GridDX>
      {data.modeOfPayment !== "" && data.modeOfPayment.id !== 6 ? (
        <>
          <GridDX item xs={12}>
            <GridDX container sx={{ maxWidth: "100%" }} rowSpacing={1}>
              <GridDX item xs={12} justifyContent="center">
                <Typography sx={{ fontWeight: "bold", my: 2 }}>
                  Please deposit your investment as follows:
                </Typography>
              </GridDX>
              <GridDX item xs={4} sx={{ fontWeight: "bold" }}>
                Account #:
              </GridDX>
              <GridDX item xs={8}>
                {selectedBank?.accountNo}
              </GridDX>
              <GridDX item xs={4} sx={{ fontWeight: "bold" }}>
                IBAN #:
              </GridDX>
              <GridDX item xs={8}>
                {selectedBank?.ibanNumber}
              </GridDX>
              <GridDX item xs={4} sx={{ fontWeight: "bold" }}>
                Account Title:
              </GridDX>
              <GridDX item xs={8}>
                {selectedBank?.accountTitle}
              </GridDX>
              <GridDX item xs={4} sx={{ fontWeight: "bold" }}>
                Bank:
              </GridDX>
              <GridDX item xs={8}>
                {selectedBank?.bankName}
              </GridDX>
              <GridDX item xs={4} sx={{ fontWeight: "bold" }}>
                Branch:
              </GridDX>
              <GridDX item xs={8}>
                {selectedBank?.branchName} , {selectedBank?.location}
              </GridDX>
            </GridDX>
          </GridDX>

          <GridDX item xs={12} sx={{ mt: 1, flexDirection: "column" }}>
            <Typography color="primary">Proof of Payment</Typography>
            {errors["proof"] && (
              <Typography color="error" sx={{ my: 1 }}>
                {errors["proof"]}
              </Typography>
            )}
          </GridDX>

          {proof ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
                maxWidth: "100%", // IMPORTANT
              }}
            >
              <GridDX item xs={8}>
                <Typography
                  sx={{
                    fontSize: 14,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {proof.documentName}
                </Typography>
              </GridDX>
              <GridDX item xs={2}>
                <ButtonDX
                  variant="text"
                  size="small"
                  onClick={() => setShowDoc(true)}
                >
                  View
                </ButtonDX>
              </GridDX>
              <GridDX item xs={2}>
                <ButtonDX
                  variant="text"
                  size="small"
                  onClick={() => setProof(null)}
                >
                  Delete
                </ButtonDX>
              </GridDX>
            </div>
          ) : (
            <GridDX item xs={12} justifyContent="flex-end">
              <input
                id={"proof"}
                name={"proof"}
                accept="image/*,.pdf"
                type="file"
                style={{ display: "none" }}
                onChange={(e: any) => {
                  onHandleDocumentUpload(e.target.files[0]);
                }}
              />
              <label htmlFor={"proof"}>
                <ButtonDX component="span">Attach</ButtonDX>
              </label>
            </GridDX>
          )}
        </>
      ) : (
        <></>
      )}
      <GridDX item xs={12} justifyContent="center" sx={{ my: 1 }}>
        <LoadingButtonDX
          fullWidth
          loading={isLoading || sendingRequest}
          onClick={handleSubmit}
        >
          Proceed
        </LoadingButtonDX>
      </GridDX>
    </GridDX>
  );
};

export default RegisterInvestment;
