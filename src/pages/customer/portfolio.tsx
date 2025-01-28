import { useEffect, useState } from "react";

import { Typography, CardContent } from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/lab";

import { VictoryAxis } from "victory";
import { VictoryChart } from "victory-chart/lib/victory-chart";
import { VictoryArea } from "victory-area/lib/victory-area";
import { VictoryClipContainer } from "victory-core/lib/victory-clip-container/victory-clip-container";
import { AreaDataType, PieDataType } from "../../@types/chartdatadxtype";

import { useAuthContext } from "../../context/authcontext";
import { useErrorContext } from "../../context/errorcontext";

import GridDX from "../../components/layout/griddx";
import CardDX from "../../components/layout/carddx";
import FundCards from "../../components/layout/fundcarddx";
import PieChart from "../../components/layout/piechartdx";
import useDashboardervice from "../../shared/services/dashboardservice";
import useInvestementService from "../../shared/services/investmentservice";
import { formattedNumber, sumArray } from "../../shared/global";

const Portfolio = () => {
  const { setError } = useErrorContext();
  const { getUserDetails } = useAuthContext();
  const { getCategoryWiseBreakup, getInvestmentSummary } = useDashboardervice();
  const { getFundWisePosition } = useInvestementService();

  const [fundButton, setFundButton] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  const [investmentSummary, setInvestmentSummary] = useState<any>(null);
  const [categoryWiseData, setCategoryWiseData] = useState<any>(null);
  const [fundWiseData, setFundWiseData] = useState<any>(null);
  const [fundPositions, setFundPositions] = useState([]);

  const changeChart = (event: any, newValue: boolean) => {
    console.log({ newValue });
    setFundButton(newValue);
  };

  const areaData: AreaDataType[] = [
    {
      month: "Jan",
      value: 5000,
    },
    {
      month: "Feb",
      value: 8000,
    },
    {
      month: "Mar",
      value: 14000,
    },
    {
      month: "Apr",
      value: 8000,
    },
    {
      month: "Jun",
      value: 6000,
    },
    {
      month: "Jul",
      value: 4000,
    },
    {
      month: "Aug",
      value: 5000,
    },
    {
      month: "Sep",
      value: 7500,
    },
    {
      month: "Oct",
      value: 8000,
    },
    {
      month: "Nov",
      value: 7000,
    },
    {
      month: "Dec",
      value: 6500,
    },
  ];

  const fundData: PieDataType[] = [
    {
      label: "Fund A",
      value: 5000,
    },
    {
      label: "Fund B",
      value: 8000,
    },
    {
      label: "Fund C",
      value: 14000,
    },
    {
      label: "Fund D",
      value: 8000,
    },
  ];

  useEffect(() => {
    getUserDetails().then((userDetails: any) => {
      return Promise.all([
        getInvestmentSummary(userDetails.currentFolioNumber).then(
          (summary: any) => setInvestmentSummary(summary)
        ),
        getCategoryWiseBreakup(userDetails.currentFolioNumber).then(
          (categoryWiseData: any) => setCategoryWiseData(categoryWiseData)
        ),
        getFundWisePosition(userDetails.currentFolioNumber).then(
          (positions) => {
            setFundPositions(positions);

            const fundWise = positions.map((f: any) => {
              return { label: f.fundName, value: f.currentValue };
            });
            setFundWiseData(fundWise);
          }
        ),
      ])
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    });
  }, []);

  return (
    <GridDX container sx={{ width: "100%" }} rowSpacing={2}>
      <GridDX item xs={12} justifyContent={"center"}>
        <Typography
          variant="h5"
          sx={{
            color: "rgba(0,0,0,0.5)",
            fontSize: "120%",
            fontWeight: 600,
            letterSpacing: "-2%",
          }}
        >
          Current Value
        </Typography>
      </GridDX>
      <GridDX item xs={12} justifyContent={"center"}>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(0,0,0,0.87)",
            fontWeight: "bold",
            fontSize: "190%",
            letterSpacing: "-2%",
          }}
        >
          Rs. {formattedNumber(investmentSummary?.currentValue)}
        </Typography>
      </GridDX>
      <GridDX item xs={12}>
        <GridDX container>
          <GridDX item xs={12} sx={{ fontWeight: 700, fontSize: "larger" }}>
            Investment Detail
          </GridDX>
          <GridDX item xs={12} sx={{ flexDirection: "column" }}>
            {fundPositions && fundPositions.map((f) => <FundCards data={f} />)}
          </GridDX>
        </GridDX>
      </GridDX>
      <GridDX item xs={12} sx={{ fontWeight: 700, fontSize: "larger" }}>
        Portfolio Allocation
      </GridDX>
      <GridDX item xs={12}>
        <CardDX
          sx={{
            width: "100%",
            mx: 2,
            my: 2,
            boxShadow: 10,
          }}
        >
          <CardContent>
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
            {fundButton
              ? fundWiseData &&
                PieChart(
                  fundWiseData,
                  sumArray(fundWiseData.map((f: any) => f.value)),
                  fundWiseData.map((f: any) => f.label),
                  fundWiseData.length > 1
                )
              : categoryWiseData &&
                PieChart(
                  categoryWiseData,
                  sumArray(categoryWiseData.map((c: any) => c.value)),
                  categoryWiseData.map((c: any) => c.label),
                  categoryWiseData.length > 1
                )}
          </CardContent>
        </CardDX>
      </GridDX>
    </GridDX>
  );
};

export default Portfolio;
