import { useEffect, useState } from "react";
import ButtonDX from "../../components/controls/buttondx";
import GridDX from "../../components/layout/griddx";
import { useAuthContext } from "../../context/authcontext";
import { useErrorContext } from "../../context/errorcontext";
import useBankAccountService from "../../shared/services/bankaccountservice";
import { useNavigate } from "react-router-dom";
import BankAccountCard from "../../components/customer/bankaccountcard";
import { bankList, getBanks } from "../../shared/lookups";
import Skeleton from "react-loading-skeleton";

const BankAccounts = () => {
  const navigate = useNavigate();

  const { setError, setInfo } = useErrorContext();
  const { getUserDetails } = useAuthContext();
  const [bankaccounts, setBankAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  const { getAllBanksforUser } = useBankAccountService();

  useEffect(() => {
    setIsLoading(true);
    if (bankList.length == 0) {
      getBanks().catch((err) => console.log("error", err));
    }

    getUserDetails().then((userDetails: any) => {
      setUserDetails(userDetails);
      getAllBanksforUser(userDetails?.userId)
        .then((response: any) => {
          setBankAccounts(response);
        })
        .catch((err: any) => setError(err))
        .finally(() => setIsLoading(false));
    });
  }, []);

  return (
    <GridDX container sx={{ width: "100%" }}>
      {isLoading ? (
        <Skeleton
          containerClassName="skeleton-container"
          count={2}
          style={{ height: 150, marginBottom: 8 }}
        />
      ) : (
        <>
          <GridDX item xs={12} justifyContent="flex-end">
            <ButtonDX
              style={{ width: 125, height: 36.5 }}
              onClick={() => navigate("/add-bankacct")}
            >
              Add
            </ButtonDX>
          </GridDX>

          {/* {!isLoading && */}
          {bankaccounts.map((item: any, index: number) => {
            return (
              <BankAccountCard
                data={item}
                key={"acct_" + index}
                bank={bankList.find((bank: any) => {
                  if (bank.id === item.bankId) return bank;
                })}
              />
            );
          })}
        </>
      )}
    </GridDX>
  );
};

export default BankAccounts;
