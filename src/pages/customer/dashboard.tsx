import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Typography,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";

import { useErrorContext } from "../../context/errorcontext";
import { useAuthContext } from "../../context/authcontext";

import GridDX from "../../components/layout/griddx";
import { ListItemDXProps } from "../../@types/listitemdxtype";
import CardDX from "../../components/layout/carddx";
import ButtonDX from "../../components/controls/buttondx";
import PieChart from "../../components/layout/piechartdx";
import useDashboardervice from "../../shared/services/dashboardservice";
import { formattedNumber, sumArray } from "../../shared/global";
import FlashingLoader from "../../components/loader/flashingloader";

const Dashboard = () => {
  const { getDashboardSummary } = useDashboardervice();

  const listItems: ListItemDXProps[] = [
    {
      title: "Transaction in Progress",
      label: "Transaction",
      icon: <FolderIcon color="primary" />,
      linkString: "/transactions-in-process",
    },
    {
      title: "View Transactions",
      label: "View",
      icon: <FolderIcon />,
    },
    {
      title: "Best Fund For Investment",
      label: "Fund",
      icon: <FolderIcon />,
    },
    {
      title: "Make an Investment",
      label: "Invest",
      icon: <FolderIcon color="primary" />,
      linkString: "/make-investment",
    },
    {
      title: "Apply For Redemption",
      label: "Redeem",
      icon: <FolderIcon color="primary" />,
      linkString: "/request-redeem",
    },
  ];

  const navigate = useNavigate();
  const { setError } = useErrorContext();
  const { getUserDetails } = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);

  const [userName, setUserName] = useState<string>("");
  const [investmentSummary, setInvestmentSummary] = useState<any>(null);
  const [categoryWiseData, setCategoryWiseData] = useState<any>(null);
  const [riskWiseData, setRiskWiseData] = useState<any>(null);
  const [fundWiseSummaryData, setFundWiseSummaryData] = useState<any>(null);

  const [fundButton, setFundButton] = useState<boolean>(true);
  const changeChart = (event: any, newValue: boolean) => {
    console.log({ newValue });
    setFundButton(newValue);
  };

  useEffect(() => {
    getUserDetails().then((userDetails: any) => {
      setUserName(userDetails.currentFolioName ?? userDetails.firstName);

      getDashboardSummary(userDetails.currentFolioNumber)
        .then((response: any) => {
          setInvestmentSummary(response.investmentSummary);
          setCategoryWiseData(response.categoryWiseBreakup);
          setRiskWiseData(response.riskWiseBreakup);
          setFundWiseSummaryData(response.fundWiseSummary);
        })
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    });
  }, []);

  return (
    <GridDX
      container
      sx={{ width: "100%", alignContent: "flex-start" }}
      rowSpacing={2}
    >
      <GridDX item xs={12}>
        <CardDX>
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                color: "#007a48",
                fontWeight: "bold",
              }}
            >
              As-Salam O Alaikum,
            </Typography>
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                color: "#007a48",
                fontWeight: "bold",
              }}
            >
              {userName}
            </Typography>
            <br />
            <Typography sx={{ fontSize: 18, textAlign: "center" }}>
              Your Current Portfolio Value is
            </Typography>
            {isLoading ? (
              <FlashingLoader />
            ) : (
              <Typography
                variant="body1"
                color="primary"
                sx={{ textAlign: "center", fontSize: 30, fontWeight: 700 }}
              >
                Rs. {formattedNumber(investmentSummary?.currentValue, 2)}
              </Typography>
            )}
          </CardContent>
        </CardDX>
      </GridDX>
      <GridDX item xs={12}>
        <CardDX>
          <CardContent>
            <GridDX container sx={{ width: "100%" }}>
              <GridDX item xs={6} sx={{ flexDirection: "column" }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    textAlign: "center",
                    color: "#007a48",
                  }}
                >
                  Invested Amount
                </Typography>
                {isLoading ? (
                  <FlashingLoader />
                ) : (
                  <Typography
                    color="primary"
                    sx={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
                  >
                    Rs. {formattedNumber(investmentSummary?.investedAmount, 2)}
                  </Typography>
                )}
              </GridDX>
              <GridDX item xs={6} sx={{ flexDirection: "column" }}>
                <Typography sx={{ fontWeight: 700, textAlign: "center" }}>
                  Gain/Loss
                </Typography>
                {isLoading ? (
                  <FlashingLoader />
                ) : (
                  <Typography
                    color="primary"
                    sx={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
                  >
                    Rs. {formattedNumber(investmentSummary?.gainLoss, 2)}
                  </Typography>
                )}
              </GridDX>
            </GridDX>
          </CardContent>
        </CardDX>
      </GridDX>
      <GridDX item xs={12}>
        <CardDX>
          <CardContent sx={{ px: 0 }}>
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 18,
                color: "#007a48",
                mb: 2,
              }}
            >
              Portfolio Investment Analysis
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              color="primary"
              value={fundButton}
              onChange={changeChart}
            >
              <ToggleButton value={true}>Fund Wise</ToggleButton>
              <ToggleButton value={false}>Portfolio Wise</ToggleButton>
            </ToggleButtonGroup>
            {fundButton ? (
              <GridDX container sx={{ width: "100%" }}>
                <GridDX
                  item
                  xs={12}
                  justifyContent="center"
                  sx={{ flexDirection: "column" }}
                >
                  <GridDX container spacing={2} sx={{ mt: 1, ml: 1, mr: 1 }}>
                    <GridDX item xs={6} justifyContent="center">
                      <Typography
                        color="primary"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          fontWeight: 600,
                        }}
                      >
                        Fund
                      </Typography>
                    </GridDX>
                    <GridDX item xs={6} justifyContent="center">
                      <Typography
                        color="primary"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          fontWeight: 600,
                        }}
                      >
                        Value (Rs.)
                      </Typography>
                    </GridDX>
                    {fundWiseSummaryData?.map((item: any) => {
                      return (
                        <>
                          <GridDX item xs={6} justifyContent="left">
                            {item.label}
                          </GridDX>
                          <GridDX item xs={6} justifyContent="right">
                            {formattedNumber(item.value)}
                          </GridDX>
                        </>
                      );
                    })}
                  </GridDX>
                </GridDX>
              </GridDX>
            ) : (
              <GridDX container sx={{ width: "100%" }}>
                <GridDX
                  item
                  xs={6}
                  justifyContent="center"
                  sx={{ flexDirection: "column" }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Category Wise
                  </Typography>
                  {categoryWiseData &&
                    PieChart(
                      categoryWiseData,
                      sumArray(categoryWiseData.map((c: any) => c.value)),
                      categoryWiseData.map((c: any) => c.label),
                      false
                    )}
                </GridDX>
                <GridDX
                  item
                  xs={6}
                  justifyContent="center"
                  sx={{ flexDirection: "column" }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Risk Wise
                  </Typography>
                  {riskWiseData &&
                    PieChart(
                      riskWiseData,
                      sumArray(riskWiseData.map((c: any) => c.value)),
                      riskWiseData.map((c: any) => c.label),
                      false
                    )}
                </GridDX>
              </GridDX>
            )}
          </CardContent>
        </CardDX>
      </GridDX>
      <GridDX item xs={12} justifyContent="center">
        <GridDX container columnSpacing={3}>
          <GridDX item xs={6}>
            <ButtonDX fullWidth onClick={() => navigate("/make-investment")}>
              Invest More
            </ButtonDX>
          </GridDX>
          <GridDX item xs={6}>
            <ButtonDX
              fullWidth
              onClick={() => navigate("/fund-to-fund-transfer-1")}
            >
              Conversions
            </ButtonDX>
          </GridDX>
          <GridDX item xs={6}>
            <ButtonDX fullWidth onClick={() => navigate("/request-redeem")}>
              Redemption
            </ButtonDX>
          </GridDX>
          <GridDX item xs={6}>
            <ButtonDX fullWidth onClick={() => navigate("/contactus")}>
              Contact Us
            </ButtonDX>
          </GridDX>
        </GridDX>
      </GridDX>
    </GridDX>
  );
};

export default Dashboard;
