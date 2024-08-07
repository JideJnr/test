import { FiHome, FiSettings } from "react-icons/fi";
import {
  TbCalculator,
  TbBuildingBank,
  TbUsers,
  TbFileReport,
} from "react-icons/tb";

export interface IMenuList {
  path?: string;
  id?: string;
  name: string;
  icon?: React.FC<any>;
  subMenu?: Partial<IMenuList[]>;
  permissions?: string[];
}

export interface ISubMenu {
  isSideNavOpen: boolean;
  setIsSideNavOpen: (value: boolean) => void;
  route: IMenuList;
  isFirstLevel: boolean;
  pathname: string;
  closeOtherMenus: () => void;
}

export interface ISidebarLinkGroup {
  children: (handleClick: () => void, open: boolean) => React.ReactNode;
  activeCondition: boolean;
}

const MenuList: IMenuList[] = [
  {
    name: "Customer Management",
    id: "customerManagement",
    icon: TbUsers,
    path: "/account/customer",
    permissions: [],
  },
  {
    name: "Micro Banking",
    icon: TbBuildingBank,
    id: "microBank",
    permissions: [
      "ACCOUNT_OFFICER",
      "SECOND_REVIEWER",
      "FIRST_REVIEWER",
      "FINANCE_OPERATIONS",
      "DISBURSEMENT_OPERATIONS",
      "ACCEPTANCE_OPERATIONS",
      "BOOKING_OPERATIONS",
    ],
    subMenu: [
      {
        id: "microBank-loans",
        name: "Loans",
        path: "/account/banking/loans",
        permissions: [
          "ACCOUNT_OFFICER",
          "SECOND_REVIEWER",
          "FIRST_REVIEWER",
          "DISBURSEMENT_OPERATIONS",
          "ACCEPTANCE_OPERATIONS",
          "BOOKING_OPERATIONS",
        ],
      },
      {
        id: "microBank-disbursements",
        name: "Disbursements",
        path: "/account/banking/disbursements",
        permissions: [
          "FINANCE_OPERATIONS",
          "ACCEPTANCE_OPERATIONS",
          "BOOKING_OPERATIONS",
        ],
      },
      {
        id: "microBank-portfolio",
        name: "Portfolio",
        path: "/account/banking/portfolio",
        permissions: ["ACCOUNT_OFFICER"],
      },
      {
        id: "microBank-teller",
        name: "Teller",
        path: "/account/banking/entry/posting",
        permissions: ["FINANCE_OPERATIONS"],
      },
      {
        id: "microBank-fixedDeposit",
        name: "Fixed Deposit",
        permissions: ["FINANCE_OPERATIONS"],
        subMenu: [
          {
            id: "microBank-fixedDeposit-manage",
            name: "Manage",
            path: "/account/banking/fixed-deposit/manage",
            permissions: ["FINANCE_OPERATIONS"],
          },
          {
            id: "microBank-fixedDeposit-booking",
            name: "Booking",
            path: "/account/banking/fixed-deposit/book",
            permissions: ["FINANCE_OPERATIONS"],
          },
        ],
      },
      {
        id: "microBank-accounOpening",
        name: "Account Opening",
        path: "/account/banking/account-opening",
        permissions: ["FINANCE_OPERATIONS"],
      },
      {
        id: "microBank-collection",
        name: "Collection",
        path: "/account/banking/collection",
        permissions: ["FINANCE_OPERATIONS"],
      },
      {
        id: "microBank-product",
        name: "Product",
        path: "/account/banking/products",
        permissions: ["FINANCE_OPERATIONS"],
      },
    ],
  },
  {
    name: "GL Accounting",
    icon: TbCalculator,
    id: "gl-account",
    permissions: ["FINANCE_OPERATIONS"],
    subMenu: [
      {
        id: "gl-account-chart",
        name: "Chart",
        path: "/account/gl/chart",
        permissions: ["FINANCE_OPERATIONS"],
      },
      {
        id: "gl-accounting-period",
        name: "Accounting Period",
        path: "/account/gl/accounting-period",
        permissions: ["FINANCE_OPERATIONS"],
      },
      {
        id: "gl-account-journal",
        name: "Journal",
        permissions: ["FINANCE_OPERATIONS"],
        subMenu: [
          {
            id: "gl-account-journal-posting",
            name: "New",
            path: "/account/gl/journal/posting",
            permissions: ["FINANCE_OPERATIONS"],
          },
          {
            id: "gl-account-journal-entries",
            name: "History",
            path: "/account/gl/journal/entries",
            permissions: ["FINANCE_OPERATIONS"],
          },
          {
            id: "gl-account-journal-amortization",
            name: "Amortization",
            path: "/account/gl/journal/amortization",
            permissions: ["FINANCE_OPERATIONS"],
          },
        ],
      },
      {
        id: "gl-account-trialBalance",
        name: "Trial Balance",
        path: "/account/gl/trial-balance",
        permissions: ["FINANCE_OPERATIONS"],
      },
      {
        id: "gl-account-profitAndLoss",
        name: "Profit and Loss",
        path: "/account/gl/profit-and-loss",
        permissions: ["FINANCE_OPERATIONS"],
      },
      {
        id: "gl-account-fixed-assets",
        name: "Fixed Assets",
        path: "/account/gl/fixed-assets",
        permissions: ["FINANCE_OPERATIONS"],
      },
    ],
  },
  {
    id: "gl-account-reports",
    name: "Reports",
    icon: TbFileReport,
    permissions: ["FINANCE_OPERATIONS", "ADMINISTRATOR", "INTERNAL_CONTROL"],
    subMenu: [
      {
        id: "gl-account-reports-callOver",
        name: "Call Over",
        permissions: [
          "FINANCE_OPERATIONS",
          "ADMINISTRATOR",
          "INTERNAL_CONTROL",
        ],
        subMenu: [
          {
            id: "gl-account-reports-callOver-glEntries",
            name: "Gl Entries",
            path: "/account/gl/reports/call-over/gl-entries",
            permissions: [
              "FINANCE_OPERATIONS",
              "ADMINISTRATOR",
              "INTERNAL_CONTROL",
            ],
          },
          {
            id: "gl-account-reports-callOver-deposit",
            name: "Deposit Entries",
            path: "/account/gl/reports/call-over/deposit",
            permissions: [
              "FINANCE_OPERATIONS",
              "ADMINISTRATOR",
              "INTERNAL_CONTROL",
            ],
          },
          {
            id: "gl-account-reports-callOver-transaction",
            name: "Transactions",
            path: "/account/gl/reports/call-over/transactions",
            permissions: [
              "FINANCE_OPERATIONS",
              "ADMINISTRATOR",
              "INTERNAL_CONTROL",
            ],
          },
        ],
      },
      {
        id: "gl-account-reports-batchUpload",
        name: "Batch Uploads",
        path: "/account/gl/reports/batch-upload",
        permissions: [
          "FINANCE_OPERATIONS",
          "ADMINISTRATOR",
          "INTERNAL_CONTROL",
        ],
      },
      // {
      //   id: "gl-account-reports-failed-upload",
      //   name: "Failed Batch Upload",
      //   path: "/account/gl/reports/failed-upload",
      //   permissions: [
      //     "FINANCE_OPERATIONS",
      //     "ADMINISTRATOR",
      //     "INTERNAL_CONTROL",
      //   ],
      // },
      {
        id: "gl-account-reports-depositBalance",
        name: "Deposit Balances",
        path: "/account/gl/reports/deposit-balances",
        permissions: [
          "FINANCE_OPERATIONS",
          "ADMINISTRATOR",
          "INTERNAL_CONTROL",
        ],
      },
      {
        id: "gl-account-reports-fixedDeposits",
        name: "Fixed Deposit",
        path: "/account/gl/reports/fixed-deposits",
        permissions: [
          "FINANCE_OPERATIONS",
          "ADMINISTRATOR",
          "INTERNAL_CONTROL",
        ],
      },
      {
        id: "gl-account-reports-accountOfficerPerformances",
        name: "Account Officers",
        path: "/account/gl/reports/account-officer-performances",
        permissions: [
          "FINANCE_OPERATIONS",
          "ADMINISTRATOR",
          "INTERNAL_CONTROL",
        ],
      },
      {
        id: "gl-account-reports-loanTAT",
        name: "Loan TAT",
        path: "/account/gl/reports/loan-tat",
        permissions: [
          "FINANCE_OPERATIONS",
          "ADMINISTRATOR",
          "INTERNAL_CONTROL",
        ],
      },
      {
        id: "gl-account-reports-loanLiquidation",
        name: "Loan Liquidation",
        path: "/account/gl/reports/loan-liquidation",
        permissions: [
          "FINANCE_OPERATIONS",
          "ADMINISTRATOR",
          "INTERNAL_CONTROL",
        ],
      },
      {
        id: "gl-account-reports-loanPortfolio",
        name: "Loan Portfolio",
        path: "/account/gl/reports/loan-portfolio",
        permissions: [
          "FINANCE_OPERATIONS",
          "ADMINISTRATOR",
          "INTERNAL_CONTROL",
        ],
      },
      {
        id: "gl-account-reports-branchPerformance",
        name: "Branch Performance",
        path: "/account/gl/reports/branch-performance",
        permissions: [
          "FINANCE_OPERATIONS",
          "ADMINISTRATOR",
          "INTERNAL_CONTROL",
        ],
      },
      {
        id: "gl-account-reports-branchProductPerformance",
        name: "Branch Product Performance",
        path: "/account/gl/reports/branch-product-performance",
        permissions: [
          "FINANCE_OPERATIONS",
          "ADMINISTRATOR",
          "INTERNAL_CONTROL",
        ],
      },
    ],
  },
  {
    name: "Settings",
    icon: FiSettings,
    id: "settings",
    permissions: ["ADMINISTRATOR", "SUPER_ADMINISTRATOR"],
    subMenu: [
      {
        id: "settings-users",
        name: "User Management",
        path: "/account/settings/user-management",
        permissions: ["ADMINISTRATOR", "SUPER_ADMINISTRATOR"],
      },
      {
        id: "settings-employers",
        name: "Employer Management",
        path: "/account/settings/employer-management",
        permissions: ["ADMINISTRATOR", "SUPER_ADMINISTRATOR"],
      },
      {
        id: "settings-location",
        name: "Location Management",
        path: "/account/settings/location-management",
        permissions: ["ADMINISTRATOR", "SUPER_ADMINISTRATOR"],
      },
    ],
  },
];

export default MenuList;
