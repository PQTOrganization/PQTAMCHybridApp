import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useErrorContext } from "../../context/errorcontext";
import { useAuthContext } from "../../context/authcontext";

import GridDX from "../../components/layout/griddx";
import useInvestementService from "../../shared/services/investmentservice";
import FundPositionCard from "../../components/customer/fundpositioncard";
import Skeleton from "react-loading-skeleton";

const RequestRedeem = () => {
  const navigate = useNavigate();
  const { setError } = useErrorContext();
  const { getUserDetails } = useAuthContext();
  const { getFundWisePosition } = useInvestementService();

  const [fundPositions, setFundPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserDetails().then((userDetails: any) => {
      getFundWisePosition(userDetails.currentFolioNumber)
        .then((positions) => {
          setFundPositions(positions);
        })
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    });
  }, []);

  const onRedeemClick = (fundId: number) => {
    navigate("/redeem-fund", { state: { fundId } });
  };

  return (
    <GridDX container sx={{ width: "100%" }} rowSpacing={2}>
      <GridDX item xs={12} sx={{ flexDirection: "column" }}>
        {isLoading ? (
          <Skeleton
            containerClassName="skeleton-container"
            count={4}
            style={{ height: 150, marginBottom: 8 }}
          />
        ) : (
          fundPositions &&
          fundPositions.map((f: any, i: number) => (
            <FundPositionCard
              key={"fp_card_" + i}
              data={f}
              buttonText="Redeem"
              onClick={() => onRedeemClick(f.fundId)}
            />
          ))
        )}
      </GridDX>
    </GridDX>
  );
};

export default RequestRedeem;
