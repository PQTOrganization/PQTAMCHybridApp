import { useEffect, useState } from "react";
import ButtonDX from "../../components/controls/buttondx";
import GridDX from "../../components/layout/griddx";
import { useAuthContext } from "../../context/authcontext";
import { useErrorContext } from "../../context/errorcontext";
import useReportService from "../../shared/services/reportservices";
import { Document, Page, pdfjs } from "react-pdf";
import { useConfigContext } from "../../context/configcontext";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import {
  SelectChangeEvent,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DatePickerDX from "../../components/controls/datepickerdx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import SelectListDX from "../../components/controls/selectlistdx";
import LoadingButtonDX from "../../components/controls/loadingbuttondx";
import { API_DATE_FORMAT } from "../../shared/global";
import { useLocation } from "react-router-dom";

const AccountSummary = () => {
  const menuItem: string | undefined = useLocation().state.menuItem;

  const { setError } = useErrorContext();
  const { getUserDetails } = useAuthContext();
  const { getAccountStatementReport } = useReportService();

  const [folioNumber, setFolioNumber] = useState("");
  const [reportData, setReportData] = useState("");
  const [showDoc, setShowDoc] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStatementType, setSelectedStatementType] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [statementTypeList, setStatementTypeList] = useState<any>([]);

  const { DATE_FORMAT } = useConfigContext();

  const theme = useTheme();
  const useMobileView = useMediaQuery(theme.breakpoints.down("sm"));
  const useMediumView = useMediaQuery(theme.breakpoints.down("md"));
  const useLargeView = useMediaQuery(theme.breakpoints.down("lg"));
  const useExtraLargeView = useMediaQuery(theme.breakpoints.down("xl"));

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    setLoading(true);
    getUserDetails()
      .then((userDetails: any) => {
        setFolioNumber(userDetails.currentFolioNumber);
        setLoading(false);
      })
      .catch((err: any) => setError(err));
  }, []);

  useEffect(() => {
    if (menuItem === "Account Summary") {
      // setStatementTypeList([{ id: 1, value: "Transaction Summary" }]);
      setSelectedStatementType({ id: 1, value: "Transaction Summary" });
    } else if (menuItem === "Transaction Statement") {
      // setStatementTypeList([{ id: 2, value: "Transaction Detail" }]);
      setSelectedStatementType({ id: 2, value: "Transaction Detail" });
    }
  }, [menuItem]);

  const fetchStatement = async () => {
    let request = {
      folioNumber: folioNumber,
      statementType: selectedStatementType?.id === 1 ? "B" : "T",
      asOnDate:
        selectedStatementType?.id === 1
          ? moment(fromDate).format(API_DATE_FORMAT)
          : null,
      fromDate:
        selectedStatementType?.id === 2
          ? moment(fromDate).format(API_DATE_FORMAT)
          : null,
      toDate:
        selectedStatementType?.id === 2
          ? moment(toDate).format(API_DATE_FORMAT)
          : null,
    };

    return getAccountStatementReport(request);
  };

  const base64toBlob = (data: string) => {
    const bytes = atob(data);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
      out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: "application/pdf" });
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (selectedStatementType === null) {
      newErrors["statementType"] = "Statement Type is required";
    } else {
      if (selectedStatementType.id === 1 && fromDate === "") {
        newErrors["fromDate"] = "Date is required";
      } else if (selectedStatementType.id === 2) {
        if (fromDate === "") {
          newErrors["fromDate"] = "From Date is required";
        }
        if (toDate === "") {
          newErrors["toDate"] = "To Date is required";
        }
      }
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const onSave = async () => {
    if (validateForm()) {
      setLoadingReport(true);
      fetchStatement()
        .then((response) => {
          setReportData(response.reportData);
          setShowDoc(true);
        })
        .catch((error) => setError(error))
        .finally(() => setLoadingReport(false));
    }
  };

  const onDownload = () => {
    // `base64String` is the given base 64 data
    const win: any = window;
    const filename =
      "Account Statement" + moment(Date()).format(DATE_FORMAT) + ".pdf";

    if (win?.ReactNativeWebView)
      win.ReactNativeWebView.postMessage(
        JSON.stringify({
          messageType: "downloadblob",
          data: { fileData: reportData, filename: filename },
        })
      );
    else {
      const blob = base64toBlob(reportData);
      const url = URL.createObjectURL(blob);
      let alink = document.createElement("a");
      alink.href = url;
      alink.download = filename;
      alink.click();
    }
  };

  const renderDocument = () => {
    const documentToView = "data:application/pdf;base64," + reportData;
    return (
      <Document file={`${documentToView}`}>
        <Page pageNumber={1} renderTextLayer={false} />
      </Document>
    );
  };

  const onHandleDateChange = (fieldName: string, dateValue: any) => {
    const newErrors = { ...errors };

    if (fieldName === "fromDate") {
      setFromDate(dateValue);
      delete newErrors[fieldName];
    } else if (fieldName === "toDate") {
      setToDate(dateValue);
      delete newErrors[fieldName];
    }

    setErrors(newErrors);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <GridDX
        container
        sx={{ width: "100%" }}
        rowSpacing={2}
        alignContent="flex-start"
      >
        {loading ? (
          <Skeleton
            containerClassName="skeleton-container"
            style={{ height: 350, marginBottom: 8, marginTop: 8 }}
          />
        ) : (
          <>
            {/* <GridDX item xs={12}>
              <SelectListDX
                id="statementType"
                name="statementType"
                placeholder="Statement Type"
                label="Statement Type"
                list={statementTypeList}
                value={selectedStatementType}
                onChange={(e: any, v: any) => {
                  console.log("v", v);
                  setSelectedStatementType(v);
                }}
                error={errors["statementType"] ? true : undefined}
                helperText={errors["statementType"]}
                required
              />
            </GridDX> */}
            {selectedStatementType != null && (
              <GridDX
                item
                xs={12}
                sx={{
                  alignItems: "flex-start",
                  mt: showDoc ? 2 : 0,
                }}
              >
                <GridDX item xs={selectedStatementType?.id === 1 ? 12 : 6}>
                  <DatePickerDX
                    format={DATE_FORMAT}
                    label={
                      selectedStatementType?.id === 1 ? "Date" : "From Date"
                    }
                    fullWidth
                    disableFuture
                    value={fromDate}
                    onChange={(dateValue: any) =>
                      onHandleDateChange("fromDate", dateValue)
                    }
                    error={errors["fromDate"] ? true : undefined}
                    helperText={errors["fromDate"]}
                  />
                </GridDX>
                {selectedStatementType?.id != 1 && (
                  <GridDX item xs={6} style={{ marginLeft: "8px" }}>
                    <DatePickerDX
                      format={DATE_FORMAT}
                      label="To Date"
                      fullWidth
                      disableFuture
                      value={toDate}
                      onChange={(dateValue: any) =>
                        onHandleDateChange("toDate", dateValue)
                      }
                      error={errors["toDate"] ? true : undefined}
                      helperText={errors["toDate"]}
                    />
                  </GridDX>
                )}
              </GridDX>
            )}
            <GridDX item xs={12} sx={{ justifyContent: "flex-end" }}>
              <GridDX item>
                <LoadingButtonDX
                  style={{ width: 125, height: 36.5 }}
                  onClick={onSave}
                  loading={loadingReport}
                >
                  Show
                </LoadingButtonDX>
              </GridDX>
              {showDoc && (
                <GridDX item sx={{ ml: 1 }}>
                  <ButtonDX
                    style={{ width: 125, height: 36.5 }}
                    onClick={onDownload}
                  >
                    Download
                  </ButtonDX>
                </GridDX>
              )}
            </GridDX>
            <GridDX
              item
              xs={12}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                mr: 4,
                ml: useMobileView
                  ? "615px"
                  : useMediumView
                  ? "410px"
                  : useLargeView
                  ? 32
                  : 4,
                mt: 4,
                mb: 4,
              }}
            >
              {showDoc && reportData && renderDocument()}
            </GridDX>
          </>
        )}
      </GridDX>
    </LocalizationProvider>
  );
};

export default AccountSummary;
