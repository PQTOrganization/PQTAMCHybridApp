import { useEffect, useState } from "react";

import { useErrorContext } from "../../context/errorcontext";
import { useAuthContext } from "../../context/authcontext";

import { Typography } from "@mui/material";

import GridDX from "../../components/layout/griddx";
import TransactionGrid from "../../components/layout/transactiongriddx";
import useTransactionService from "../../shared/services/transactionservice";
import Skeleton from "react-loading-skeleton";

const TransactionsInProcess = () => {
  const { setError } = useErrorContext();
  const { getUserDetails } = useAuthContext();
  const { getPendingTransactionsForFolio } = useTransactionService();

  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<any>(null);

  useEffect(() => {
    getUserDetails().then((userDetails: any) => {
      getPendingTransactionsForFolio(userDetails.currentFolioNumber)
        .then((transactions: any) => setTransactions(transactions))
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    });
  }, []);

  return (
    <GridDX container sx={{ width: "100%" }} rowSpacing={2}>
      <GridDX
        item
        xs={12}
        justifyContent="center"
        sx={{ height: "max-content" }}
      >
        <Typography sx={{ fontWeight: 500, fontSize: 20 }}>
          There are {transactions?.length} Transactions In Process
        </Typography>
      </GridDX>
      <GridDX
        item
        xs={12}
        justifyContent="flex-start"
        sx={{ flexDirection: "column" }}
      >
        {isLoading ? (
          <Skeleton
            containerClassName="skeleton-container"
            count={4}
            style={{ height: 150, marginBottom: 8 }}
          />
        ) : (
          transactions &&
          transactions.map((t: any, i: number) => (
            <TransactionGrid key={`trans_data_${i}`} data={t} />
          ))
        )}
      </GridDX>
    </GridDX>
  );
};

export default TransactionsInProcess;
