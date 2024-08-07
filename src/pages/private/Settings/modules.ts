export interface IModule {
  tabId?: number;
  id: string;
  checked: boolean;
  name: string;
  sub?: IModule[];
}

export const sysModules: IModule[] = [
  {
    tabId: 0,
    id: "sys",
    checked: true,
    name: "System Controller",
    sub: [
      {
        id: "sys-user",
        name: "User",
        checked: true,
      },
      {
        id: "sys-role",
        name: "System Role",
        checked: true,
      },
      {
        id: "sys-account-officer",
        name: "Account Officer",
        checked: true,
      },
      {
        id: "sys-location",
        name: "Location",
        checked: true,
      },
      {
        id: "sys-module",
        name: "Module",
        checked: true,
      },
      {
        id: "sys-module-access",
        name: "Module Access",
        checked: false,
      },
      {
        id: "sys-node-control",
        name: "Node Control",
        checked: true,
      },
      {
        id: "sys-user-view",
        name: "User View",
        checked: true,
      },
      {
        id: "sys-role-view",
        name: "System Role View",
        checked: true,
      },
      {
        id: "sys-location-view",
        name: "Location View",
        checked: false,
      },
      {
        id: "sys-module-view",
        name: "Module View",
        checked: true,
      },
      {
        id: "sys-maker-checker",
        name: "Maker checker",
        checked: true,
      },
      {
        id: "sys-exec-dashboard",
        name: "Exec Dashboard",
        checked: true,
      },
      {
        id: "sys-loan-sla-report",
        name: "Loan SLA Report",
        checked: true,
      },
    ],
  },
  {
    tabId: 1,
    id: "micro",
    checked: true,
    name: "Micro Banking",
    sub: [
      {
        id: "micro-customer-onboarding",
        name: "Customer Onboarding",
        checked: true,
      },
      {
        id: "micro-loan-view",
        name: "Loan View",
        checked: true,
      },
      {
        id: "micro-loan-collection",
        name: "Loan Collection",
        checked: true,
      },
      {
        id: "micro-view-account",
        name: "View Account",
        checked: true,
      },
      {
        id: "micro-repayment",
        name: "Repayment",
        checked: true,
      },
      {
        id: "micro-calculator",
        name: "Calculator",
        checked: true,
      },
      {
        id: "micro-loan-product",
        name: "Loan Product",
        checked: true,
      },
      {
        id: "micro-deposit-product",
        name: "Deposit Product",
        checked: true,
      },
      {
        id: "micro-non-tenored-deposit",
        name: "Non-tenored Deposit",
        checked: true,
      },
      {
        id: "micro-book-tenored-deposit",
        name: "Book Tenored Deposit",
        checked: true,
      },
      {
        id: "micro-post-deposit",
        name: "Post Deposit",
        checked: true,
      },
      {
        id: "micro-customer",
        name: "Customer",
        checked: true,
      },
      {
        id: "micro-tenored-deposit-view",
        name: "Tenored Deposit View",
        checked: true,
      },
      {
        id: "micro-loan-product-view",
        name: "Loan Product View",
        checked: true,
      },
      {
        id: "micro-deposit-product-view",
        name: "Deposit Product View",
        checked: true,
      },
      {
        id: "micro-deposit-view",
        name: "Deposit View",
        checked: true,
      },
      {
        id: "micro-posting-entry-view",
        name: "Posting Entry View",
        checked: true,
      },
      {
        id: "micro-create-loan-contract",
        name: "Create Loan Contract",
        checked: true,
      },
      {
        id: "micro-fixed-deposit",
        name: "Fixed Deposits",
        checked: true,
      },
      {
        id: "micro-batch-loan-collection",
        name: "Batch Loan Collection",
        checked: true,
      },
      {
        id: "micro-deposit-report",
        name: "Deposit Report",
        checked: true,
      },
      {
        id: "micro-customer-report",
        name: "Customer Report",
        checked: true,
      },
      {
        id: "micro-loan-account-print",
        name: "Loan Account Print",
        checked: true,
      },
      {
        id: "micro-loan-account-view",
        name: "Loan Account View",
        checked: true,
      },
      {
        id: "micro-deposit-account-print",
        name: "Deposit Account Print",
        checked: true,
      },
      {
        id: "micro-fixed-deposit-liquidate",
        name: "Fixed Deposit Liquidate",
        checked: true,
      },
      {
        id: "micro-loan-classification",
        name: "Loan Classification",
        checked: true,
      },
      {
        id: "micro-deposit-approval",
        name: "Deposit Approval",
        checked: true,
      },
    ],
  },
  {
    tabId: 2,
    id: "gl",
    checked: true,
    name: "GL Accounting",
    sub: [
      {
        id: "gl-category",
        name: "Category",
        checked: true,
      },
      {
        id: "gl-sub-category",
        name: "Sub Category",
        checked: true,
      },
      {
        id: "gl-account",
        name: "Account",
        checked: true,
      },
      {
        id: "gl-sub-account",
        name: "Sub Account",
        checked: true,
      },
      {
        id: "gl-currency",
        name: "Currency",
        checked: true,
      },
      {
        id: "gl-journal-entry",
        name: "Journal Entry",
        checked: true,
      },
      {
        id: "gl-trial-balance",
        name: "Trial Balance",
        checked: true,
      },
      {
        id: "gl-sub-account-view",
        name: "Sub Account View",
        checked: true,
      },
      {
        id: "gl-category-view",
        name: "Category View",
        checked: true,
      },
      {
        id: "gl-sub-category-view",
        name: "Sub Category View",
        checked: true,
      },
      {
        id: "gl-account-view",
        name: "Account View",
        checked: true,
      },
      {
        id: "gl-journal-entry-view",
        name: "Journal Entry View",
        checked: true,
      },
      {
        id: "gl-posting-review",
        name: "Posting Review",
        checked: true,
      },
      {
        id: "gl-currency-update",
        name: "Currency Update",
        checked: true,
      },
      {
        id: "gl-posting-approval",
        name: "Posting Approval",
        checked: true,
      },
      {
        id: "gl-transaction-entries",
        name: "Transaction Entries",
        checked: true,
      },
      {
        id: "gl-delete-transaction",
        name: "Delete Transaction",
        checked: true,
      },
      {
        id: "gl-daily-income-and-expenses",
        name: "Daily Income & Expenses",
        checked: true,
      },
    ],
  },
  {
    tabId: 3,
    id: "workflow",
    checked: true,
    name: "Workflow",
    sub: [
      {
        id: "workflow-underwrite-loan",
        name: "Underwrite Loan",
        checked: true,
      },
      {
        id: "workflow-book-loan",
        name: "Book Loan",
        checked: true,
      },
    ],
  },
];
