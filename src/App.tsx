import "./App.css";
import "react-loading-skeleton/dist/skeleton.css";

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AuthProvider, useAuthContext } from "./context/authcontext";
import { ErrorContextProvider } from "./context/errorcontext";
import { API_URL_1, useConfigContext } from "./context/configcontext";
import { ValidationProvider } from "./context/validationcontext";

import { initializeEssentialData } from "./shared/lookups";

import ProtectedRoute from "./components/route/proetectedroute";
import Loading from "./components/loading";
import AccountType from "./components/onboarding/steps/accounttype";
import RegisterInvestment from "./components/onboarding/registerinvestment";
import ConfirmRegisterInvestment from "./components/onboarding/confirmreginvestment";

import OnboardingTemplate from "./templates/onboardingtemplate";
import DashboardTemplate from "./templates/dashboardtemplate";
import AccountTemplate from "./templates/accounttemplate";
import SecondaryPageTemplate from "./templates/secondarypagetemplate";

import Account from "./pages/account";
import Dashboard from "./pages/customer/dashboard";
import EServices from "./pages/customer/eservices";
import Statement from "./pages/customer/statements";
import RedeemFund from "./pages/customer/redeemfund";
import RequestRedeem from "./pages/customer/requestredeem";
import MakeInvestment from "./pages/customer/investment/makeinvestment";
import Portfolio from "./pages/customer/portfolio";
import Profile from "./pages/customer/profile";
import BankAccounts from "./pages/customer/bankaccounts";
import FundToFundTransfer1 from "./pages/customer/fundtofundtransfer1";
import FundtoFundTransfer2 from "./pages/customer/fundtofundtransfer2";
import FundToFundTransfer3 from "./pages/customer/fundtofundtransfer3";
import TransactionsInProcess from "./pages/customer/transactionsinprocess";
import OnboardingPage from "./pages/onboarding/onboardingpage";
import Login from "./pages/login";
import Transactions from "./pages/customer/transactions";
import ExploreFunds from "./pages/customer/explorefunds";
import SIPCalculator from "./pages/customer/sipcalculator";
import BankAccountAdd from "./pages/customer/bankaccountadd";
import Payment from "./pages/payment";
import AccountSummary from "./pages/customer/accountsummary";
import ConfirmOnlinePayment from "./pages/customer/investment/confirmonlinepayment";
import PaymentConfirmation from "./pages/paymentconfirmation";
import FolioSelection from "./pages/customer/folioselection";
import ContactUs from "./pages/customer/contactus";

function App() {
  const { isLoggedIn } = useAuthContext();
  const { configLoaded, API_URL } = useConfigContext();

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading && configLoaded) loadInitialData();
  }, [isLoading, configLoaded, API_URL]);

  const loadInitialData = async () => {
    initializeEssentialData().then(() => setLoading(false));
  };

  if (isLoading) return <Loading />;
  else
    return (
      <ValidationProvider>
        <ErrorContextProvider>
          <Router>
            <Routes>
              <Route path="/payment" element={<Payment />} />
              <Route
                path="/finalizepayment"
                element={<PaymentConfirmation />}
              />

              <Route element={<AccountTemplate />}>
                <Route path="/" element={<Account />} />
                <Route path="/login" element={<Login />} />
              </Route>
              <Route
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <OnboardingTemplate />
                  </ProtectedRoute>
                }
              >
                <Route path="/accounttype" element={<AccountType />} />
                <Route path="/onboard" element={<OnboardingPage />} />
                <Route path="/invest" element={<RegisterInvestment />} />
                <Route
                  path="/confirm"
                  element={<ConfirmRegisterInvestment />}
                />
              </Route>
              <Route element={<DashboardTemplate />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/e-services" element={<EServices />} />
                <Route path="/statement" element={<Statement />} />
                <Route path="/portfolio" element={<Portfolio />} />
              </Route>
              <Route element={<SecondaryPageTemplate />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/make-investment" element={<MakeInvestment />} />
                <Route
                  path="/confirm-payment"
                  element={<ConfirmOnlinePayment />}
                />
                <Route path="/request-redeem" element={<RequestRedeem />} />
                <Route path="/redeem-fund" element={<RedeemFund />} />
                <Route
                  path="/fund-to-fund-transfer-1"
                  element={<FundToFundTransfer1 />}
                />
                <Route
                  path="/fund-to-fund-transfer-2"
                  element={<FundtoFundTransfer2 />}
                />
                <Route
                  path="/fund-to-fund-transfer-3"
                  element={<FundToFundTransfer3 />}
                />
                <Route
                  path="/transactions-in-process"
                  element={<TransactionsInProcess />}
                />
                <Route path="/explore-funds" element={<ExploreFunds />} />
                <Route path="/sip-calculator" element={<SIPCalculator />} />
                <Route path="/bankaccounts" element={<BankAccounts />} />
                <Route path="/add-bankacct" element={<BankAccountAdd />} />
                <Route path="/acctsummary" element={<AccountSummary />} />
                <Route path="/switchfolio" element={<FolioSelection />} />
                <Route path="/contactus" element={<ContactUs />} />
              </Route>
            </Routes>
          </Router>
        </ErrorContextProvider>
      </ValidationProvider>
    );
}

export default App;
