import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// export let API_URL_1 = "https://localhost:7015/api/";
// export let API_URL_1 = "https://amcapi.pakqatar.com.pk/api/";
//export let API_URL_1 = "https://pqapp.pakqatar.com.pk/amc-api/api/";
//export let API_URL_1 = "https://pqapp.pakqatar.com.pk/amc-api/api/";
export let API_URL_1: string; // = process.env.API_URL;

// console.log("API_URL_1", API_URL_1);
const ConfigContext = createContext<any | null>(null);
const useConfigContext = () => useContext(ConfigContext);

interface AuxProps {
  children: ReactNode;
}

const ConfigProvider = ({ children }: AuxProps) => {
  const [data, setData] = useState<any | null>([]);
  const [configLoaded, setConfigLoaded] = useState<boolean>(false);

  const [RESEND_TIMER, setResendTimer] = useState<Number>(120);
  const [IDLE_TIMEOUT, setIdleTimeout] = useState<Number>(1000 * 60 * 5); // 5 mins

  const [SELFIE, setSelfieDocId] = useState("01");
  const [CNIC_FRONT, setCNICFrontDocId] = useState("02");
  const [CNIC_BACK, setCNICBackDocId] = useState("03");
  const [MUSLIM_ZAKAT, setMuslimZakatDocId] = useState("04");
  const [ADDRESS_PROOF, setAddressProofId] = useState("05");

  const [DOC_SIZE, setDocSize] = useState<Number>(1);
  const [IMAGE_SIZE, setImageSize] = useState<Number>(2.75);
  const [API_URL, setAPIURL] = useState<string>("");
  const [DATE_FORMAT, setDateFormat] = useState<string>("DD-MMM-yyyy");
  const [BLINQ_URL, setBlinqURL] = useState<string>(
    "https://staging-ipg.blinq.pk/Home/PayInvoice"
  );

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    fetch("/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else return "{}";
      })
      .then((myJson: any) => {
        setData(myJson);
      });
  };

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      if (data.RESEND_TIMER) setResendTimer(data.RESEND_TIMER);
      if (data.IDLE_TIMEOUT) setIdleTimeout(data.IDLE_TIMEOUT);
      if (data.CNIC_FRONT) setCNICFrontDocId(data.CNIC_FRONT);
      if (data.CNIC_BACK) setCNICBackDocId(data.CNIC_BACK);
      if (data.MUSLIM_ZAKAT) setMuslimZakatDocId(data.MUSLIM_ZAKAT);
      if (data.ADDRESS_PROOF) setAddressProofId(data.ADDRESS_PROOF);
      if (data.DOC_SIZE) setDocSize(data.DOC_SIZE);
      if (data.IMAGE_SIZE) setImageSize(data.IMAGE_SIZE);
      if (data.API_URL) {
        setAPIURL(data.API_URL);
        API_URL_1 = data.API_URL;
      }
      if (data.DATE_FORMAT) setDateFormat(data.DATE_FORMAT);
      if (data.BLINQ_URL) setBlinqURL(data.BLINQ_URL);

      setConfigLoaded(true);
    }
  }, [data]);

  return (
    <ConfigContext.Provider
      value={{
        configLoaded,
        RESEND_TIMER,
        IDLE_TIMEOUT,
        SELFIE,
        CNIC_FRONT,
        CNIC_BACK,
        MUSLIM_ZAKAT,
        ADDRESS_PROOF,
        DOC_SIZE,
        IMAGE_SIZE,
        API_URL,
        DATE_FORMAT,
        BLINQ_URL,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export { ConfigProvider, useConfigContext };
