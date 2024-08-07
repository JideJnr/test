import type { RouteObject } from "react-router-dom";

import AppLayout from "@/components/layouts/private/AppLayout";
import AccountGuard from "@/shared/guards/Account";

import CustomerOnboarding from "@/pages/private/Customer/Onboarding";
import CustomerSearch from "@/pages/private/Customer/Search";
import UserManagement from "@/pages/private/Settings/UserManagement";
import SystemEmployer from "@/pages/private/Settings/SystemEmployer";
import LocationManagement from "@/pages/private/Settings/LocationManagement";
import SystemModule from "@/pages/private/Settings/SystemModule";
import ApprovalLevelControl from "@/pages/private/Settings/ApprovalLevelControl";
import MakerChecker from "@/pages/private/Settings/MakerChecker";
import UserUpsert from "@/pages/private/Settings/UserUpsert";
import Loans from "@/pages/private/Banking/Loan/Loans";
import BookLoan from "@/pages/private/Banking/Loan/Book";
import ViewLoan from "@/pages/private/Banking/Loan/View";
import LoanCustomerSearch from "@/pages/private/Banking/Loan/Search";
import ViewCustomer from "@/pages/private/Customer/View";
import PortfolioCustomerSearch from "@/pages/private/Banking/Portfolio/Search";
import EntryPosting from "@/pages/private/Banking/Entry/Posting";
import NewJournalPosting from "@/pages/private/Accounting/Journal/Book";
import AccountView from "@/pages/private/Customer/AccountView";
import AccountChart from "@/pages/private/Accounting/Chart/Chart";
import FixedDeposit from "@/pages/private/Banking/FixedDeposit/Manage";
import NewFixedDposit from "@/pages/private/Banking/FixedDeposit/Book";
import Collections from "@/pages/private/Banking/Collection/Collection";
import ViewJournalEntries from "@/pages/private/Banking/Entry/View";
import Products from "@/pages/private/Banking/Product/Product";
import NewDeposit from "@/pages/private/Banking/Product/NewDeposit";
import NewLoan from "@/pages/private/Banking/Product/NewLoan";
import AccountOpening from "@/pages/private/Banking/Account/Create";
import TrialBalance from "@/pages/private/Accounting/TrialBalance/TrialBalance";
import FixedAsset from "@/pages/private/Accounting/FixedAsset/FixedAsset";
import NewFixedAsset from "@/pages/private/Accounting/FixedAsset/Book";
import DepositBalancesReport from "@/pages/private/Accounting/Reports/DepositBalances";
import GlCallOverReports from "@/pages/private/Accounting/Reports/CallOver/GlEntries";
import DepositCallOverReports from "@/pages/private/Accounting/Reports/CallOver/DepositEntries";
import TransactionCallOverReports from "@/pages/private/Accounting/Reports/CallOver/Transactions";
import LoanDisbursementReport from "@/pages/private/Banking/Loan/Disbursement";
import AmotizationReport from "@/pages/private/Accounting/Journal/AmotizationReport";
import RoleGuard from "@/shared/guards/Role";
import FailedDeductionReport from "@/pages/private/Accounting/Reports/FailedDeduction";
import FixedDepositReports from "@/pages/private/Accounting/Reports/FixedDeposits";
import AccountOfficerPerformaneReports from "@/pages/private/Accounting/Reports/AccountOfficerPerformanceReport";
import BranchProductPerformanceReports from "@/pages/private/Accounting/Reports/BranchProductPerformance";
import BranchPerformanceReports from "@/pages/private/Accounting/Reports/BranchPerformance";
import BatchUploadReports from "@/pages/private/Accounting/Reports/BatchUpload";
import BatchUploadFailureReports from "@/pages/private/Accounting/Reports/BatchUploadFailure";
import LoanPortfolioReports from "@/pages/private/Accounting/Reports/LoanPortfolio";
import LoanTATReports from "@/pages/private/Accounting/Reports/LoanTAT";
import LoanLiquidationReports from "@/pages/private/Accounting/Reports/LoanLiquidation";
import ProfitAndLossReport from "@/pages/private/Accounting/ProfitAndLoss/ProfitAndLoss";
import CreateAccountPeriod from "@/pages/private/Accounting/Period/Create";
import CloseAccountPeriod from "@/pages/private/Accounting/Period/Close";

const routes: RouteObject[] = [
  {
    element: (
      <AccountGuard>
        <AppLayout />
      </AccountGuard>
    ),
    children: [
      {
        path: "customer",
        children: [
          {
            index: true,
            element: (
              <RoleGuard requiredRole={[]}>
                <CustomerSearch />
              </RoleGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <RoleGuard requiredRole={[]}>
                <ViewCustomer />
              </RoleGuard>
            ),
          },
          {
            path: "add",
            element: (
              <RoleGuard requiredRole={["ACCOUNT_OFFICER"]}>
                <CustomerOnboarding />
              </RoleGuard>
            ),
          },
          {
            path: "edit/:id/:type",
            element: (
              <RoleGuard requiredRole={["ACCOUNT_OFFICER"]}>
                <CustomerOnboarding />
              </RoleGuard>
            ),
          },
          {
            path: "statement/:account/:product",
            children: [
              {
                index: true,
                element: (
                  <RoleGuard requiredRole={[]}>
                    <AccountView />
                  </RoleGuard>
                ),
              },
              {
                path: ":type/:rate",
                element: (
                  <RoleGuard requiredRole={[]}>
                    <AccountView />
                  </RoleGuard>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "banking",
        children: [
          {
            path: "loans",
            children: [
              {
                index: true,
                element: (
                  <RoleGuard
                    requiredRole={[
                      "ACCOUNT_OFFICER",
                      "FIRST_REVIEWER",
                      "SECOND_REVIEWER",
                      "ACCEPTANCE_OPERATIONS",
                      "BOOKING_OPERATIONS",
                      "DISBURSEMENT_OPERATIONS",
                    ]}
                  >
                    <Loans />
                  </RoleGuard>
                ),
              },
              {
                path: "book",
                children: [
                  {
                    index: true,
                    element: (
                      <RoleGuard requiredRole={["ACCOUNT_OFFICER"]}>
                        <LoanCustomerSearch />
                      </RoleGuard>
                    ),
                  },
                  {
                    path: ":id/:loanType",
                    element: (
                      <RoleGuard requiredRole={["ACCOUNT_OFFICER"]}>
                        <BookLoan />
                      </RoleGuard>
                    ),
                  },
                  {
                    path: ":id/:loanType/:currentLoanId",
                    element: (
                      <RoleGuard requiredRole={["ACCOUNT_OFFICER"]}>
                        <BookLoan />
                      </RoleGuard>
                    ),
                  },
                ],
              },
              {
                path: ":id",
                element: <ViewLoan />,
              },
              {
                path: "edit/:loanId/:id",
                element: (
                  <RoleGuard requiredRole={["ACCOUNT_OFFICER"]}>
                    <BookLoan />
                  </RoleGuard>
                ),
              },
            ],
          },
          {
            path: "disbursements",
            element: (
              <RoleGuard
                requiredRole={[
                  "FINANCE_OPERATIONS",
                  "ACCEPTANCE_OPERATIONS",
                  "BOOKING_OPERATIONS",
                ]}
              >
                <LoanDisbursementReport />
              </RoleGuard>
            ),
          },
          {
            path: "fixed-deposit",
            children: [
              {
                path: "manage",
                element: (
                  <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                    <FixedDeposit />
                  </RoleGuard>
                ),
              },
              {
                path: "book",
                element: (
                  <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                    <NewFixedDposit />
                  </RoleGuard>
                ),
              },
            ],
          },
          {
            path: "portfolio",
            element: (
              <RoleGuard requiredRole={["ACCOUNT_OFFICER"]}>
                <PortfolioCustomerSearch />
              </RoleGuard>
            ),
          },
          {
            path: "entry",
            children: [
              {
                path: "posting",
                element: (
                  <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                    <EntryPosting />
                  </RoleGuard>
                ),
              },
            ],
          },
          {
            path: "collection",
            element: (
              <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                <Collections />
              </RoleGuard>
            ),
          },
          {
            path: "account-opening",
            element: (
              <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                <AccountOpening />
              </RoleGuard>
            ),
          },
          {
            path: "products",
            children: [
              {
                index: true,
                element: (
                  <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                    <Products />
                  </RoleGuard>
                ),
              },
              {
                path: "loan",
                element: (
                  <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                    <NewLoan />
                  </RoleGuard>
                ),
              },
              {
                path: "deposit",
                children: [
                  {
                    index: true,
                    element: (
                      <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                        <NewDeposit />
                      </RoleGuard>
                    ),
                  },
                  {
                    path: ":id",
                    element: (
                      <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                        <NewDeposit />
                      </RoleGuard>
                    ),
                  },
                ],
              },
            ],
          },
          // {
          //   path: "collection",
          //   element: <RoleGuard requiredRole={[""]}></RoleGuard><Collections />,
          // },
        ],
      },
      {
        path: "gl",
        children: [
          {
            path: "journal",
            children: [
              {
                path: "posting",
                element: (
                  <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                    <NewJournalPosting />
                  </RoleGuard>
                ),
              },
              {
                path: "entries",
                element: (
                  <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                    <ViewJournalEntries />
                  </RoleGuard>
                ),
              },
              {
                path: "amortization",
                element: (
                  <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                    <AmotizationReport />
                  </RoleGuard>
                ),
              },
            ],
          },
          {
            path: "chart",
            element: (
              <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                <AccountChart />
              </RoleGuard>
            ),
          },
          {
            path: "accounting-period",
            children: [
              {
                index: true,
                element: (
                  <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                    <CreateAccountPeriod />
                  </RoleGuard>
                ),
              },
              {
                path: ":id",
                element: (
                  <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                    <CloseAccountPeriod />
                  </RoleGuard>
                ),
              },
            ],
          },
          {
            path: "reports",
            children: [
              {
                path: "call-over",
                children: [
                  {
                    path: "gl-entries",
                    element: (
                      <RoleGuard
                        requiredRole={[
                          "FINANCE_OPERATIONS",
                          "ADMINISTRATOR",
                          "INTERNAL_CONTROL",
                        ]}
                      >
                        <GlCallOverReports />
                      </RoleGuard>
                    ),
                  },
                  {
                    path: "deposit",
                    element: (
                      <RoleGuard
                        requiredRole={[
                          "FINANCE_OPERATIONS",
                          "ADMINISTRATOR",
                          "INTERNAL_CONTROL",
                        ]}
                      >
                        <DepositCallOverReports />
                      </RoleGuard>
                    ),
                  },
                  {
                    path: "transactions",
                    element: (
                      <RoleGuard
                        requiredRole={[
                          "FINANCE_OPERATIONS",
                          "ADMINISTRATOR",
                          "INTERNAL_CONTROL",
                        ]}
                      >
                        <TransactionCallOverReports />
                      </RoleGuard>
                    ),
                  },
                ],
              },
              {
                path: "failed-upload",
                element: (
                  <RoleGuard
                    requiredRole={[
                      "FINANCE_OPERATIONS",
                      "ADMINISTRATOR",
                      "INTERNAL_CONTROL",
                    ]}
                  >
                    <FailedDeductionReport />
                  </RoleGuard>
                ),
              },
              {
                path: "deposit-balances",
                element: (
                  <RoleGuard
                    requiredRole={[
                      "FINANCE_OPERATIONS",
                      "ADMINISTRATOR",
                      "INTERNAL_CONTROL",
                    ]}
                  >
                    <DepositBalancesReport />
                  </RoleGuard>
                ),
              },
              {
                path: "fixed-deposits",
                element: (
                  <RoleGuard
                    requiredRole={[
                      "FINANCE_OPERATIONS",
                      "ADMINISTRATOR",
                      "INTERNAL_CONTROL",
                    ]}
                  >
                    <FixedDepositReports />
                  </RoleGuard>
                ),
              },
              {
                path: "account-officer-performances",
                element: (
                  <RoleGuard
                    requiredRole={[
                      "FINANCE_OPERATIONS",
                      "ADMINISTRATOR",
                      "INTERNAL_CONTROL",
                    ]}
                  >
                    <AccountOfficerPerformaneReports />
                  </RoleGuard>
                ),
              },
              {
                path: "loan-portfolio",
                element: (
                  <RoleGuard
                    requiredRole={[
                      "FINANCE_OPERATIONS",
                      "ADMINISTRATOR",
                      "INTERNAL_CONTROL",
                    ]}
                  >
                    <LoanPortfolioReports />
                  </RoleGuard>
                ),
              },
              {
                path: "loan-tat",
                element: (
                  <RoleGuard
                    requiredRole={[
                      "FINANCE_OPERATIONS",
                      "ADMINISTRATOR",
                      "INTERNAL_CONTROL",
                    ]}
                  >
                    <LoanTATReports />
                  </RoleGuard>
                ),
              },
              {
                path: "loan-liquidation",
                element: (
                  <RoleGuard
                    requiredRole={[
                      "FINANCE_OPERATIONS",
                      "ADMINISTRATOR",
                      "INTERNAL_CONTROL",
                    ]}
                  >
                    <LoanLiquidationReports />
                  </RoleGuard>
                ),
              },
              {
                path: "branch-performance",
                element: (
                  <RoleGuard
                    requiredRole={[
                      "FINANCE_OPERATIONS",
                      "ADMINISTRATOR",
                      "INTERNAL_CONTROL",
                    ]}
                  >
                    <BranchPerformanceReports />
                  </RoleGuard>
                ),
              },
              {
                path: "batch-upload",
                children: [
                  {
                    index: true,
                    element: (
                      <RoleGuard
                        requiredRole={[
                          "FINANCE_OPERATIONS",
                          "ADMINISTRATOR",
                          "INTERNAL_CONTROL",
                        ]}
                      >
                        <BatchUploadReports />
                      </RoleGuard>
                    ),
                  },
                  {
                    path: "failed/:id/:type",
                    element: (
                      <RoleGuard
                        requiredRole={[
                          "FINANCE_OPERATIONS",
                          "ADMINISTRATOR",
                          "INTERNAL_CONTROL",
                        ]}
                      >
                        <BatchUploadFailureReports />
                      </RoleGuard>
                    ),
                  },
                ],
              },
              {
                path: "branch-product-performance",
                element: (
                  <RoleGuard
                    requiredRole={[
                      "FINANCE_OPERATIONS",
                      "ADMINISTRATOR",
                      "INTERNAL_CONTROL",
                    ]}
                  >
                    <BranchProductPerformanceReports />
                  </RoleGuard>
                ),
              },
            ],
          },
          {
            path: "trial-balance",
            element: (
              <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                <TrialBalance />
              </RoleGuard>
            ),
          },
          {
            path: "profit-and-loss",
            element: (
              <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                <ProfitAndLossReport />
              </RoleGuard>
            ),
          },
          {
            path: "fixed-assets",
            children: [
              {
                index: true,
                element: (
                  <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                    <FixedAsset />
                  </RoleGuard>
                ),
              },
              {
                path: "book",
                element: (
                  <RoleGuard requiredRole={["FINANCE_OPERATIONS"]}>
                    <NewFixedAsset />
                  </RoleGuard>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "settings",
        children: [
          {
            path: "user-management",
            children: [
              {
                index: true,
                element: (
                  <RoleGuard
                    requiredRole={["ADMINISTRATOR", "SUPER_ADMINISTRATOR"]}
                  >
                    <UserManagement />
                  </RoleGuard>
                ),
              },
              {
                path: ":id",
                element: (
                  <RoleGuard
                    requiredRole={["ADMINISTRATOR", "SUPER_ADMINISTRATOR"]}
                  >
                    <UserUpsert />
                  </RoleGuard>
                ),
              },
            ],
          },
          {
            path: "employer-management",
            element: (
              <RoleGuard
                requiredRole={["ADMINISTRATOR", "SUPER_ADMINISTRATOR"]}
              >
                <SystemEmployer />
              </RoleGuard>
            ),
          },
          {
            path: "location-management",
            element: (
              <RoleGuard
                requiredRole={["ADMINISTRATOR", "SUPER_ADMINISTRATOR"]}
              >
                <LocationManagement />
              </RoleGuard>
            ),
          },
          {
            path: "system-module",
            element: (
              <RoleGuard
                requiredRole={["ADMINISTRATOR", "SUPER_ADMINISTRATOR"]}
              >
                <SystemModule />
              </RoleGuard>
            ),
          },
          {
            path: "approval-level-control",
            element: (
              <RoleGuard
                requiredRole={["ADMINISTRATOR", "SUPER_ADMINISTRATOR"]}
              >
                <ApprovalLevelControl />
              </RoleGuard>
            ),
          },
          {
            path: "maker-checker",
            element: (
              <RoleGuard
                requiredRole={["ADMINISTRATOR", "SUPER_ADMINISTRATOR"]}
              >
                <MakerChecker />
              </RoleGuard>
            ),
          },
        ],
      },
    ],
  },
];

export default routes;
