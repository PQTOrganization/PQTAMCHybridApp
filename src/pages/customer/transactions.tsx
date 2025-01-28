import { useEffect, useState } from "react";

import { useErrorContext } from "../../context/errorcontext";

import GridDX from "../../components/layout/griddx";
import TransactionCard from "../../components/customer/transactioncard";

import useTransactionService from "../../shared/services/transactionservice";
import Skeleton from "react-loading-skeleton";
import { useAuthContext } from "../../context/authcontext";

const Transactions = () => {
  const { setError } = useErrorContext();
  const { getUserDetails } = useAuthContext();
  const { getTransactionsForFolio } = useTransactionService();

  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<any>(null);

  useEffect(() => {
    getUserDetails().then((userDetails: any) => {
      getTransactionsForFolio(userDetails.currentFolioNumber)
        .then((transactions: any) => setTransactions(transactions))
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    });
  }, []);

  return (
    <GridDX container sx={{ width: "100%" }} rowSpacing={1}>
      <GridDX item xs={12} sx={{ flexDirection: "column" }}>
        {isLoading ? (
          <Skeleton
            containerClassName="skeleton-container"
            count={4}
            style={{ height: 150, marginBottom: 8 }}
          />
        ) : (
          transactions &&
          transactions.map((t: any, index: number) => (
            <TransactionCard keyValue={"tc_" + index} data={t} />
          ))
        )}
      </GridDX>
    </GridDX>
  );
};

export default Transactions;
