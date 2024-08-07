import { ICustomer, IEmployment } from "@/interfaces/iCustomer";
import { IFiles } from "@/interfaces/iCustomer";

export interface ILoan {
  loanAmount: number;
  loanPurpose: LoanReason;
  loanProductId: number;
  loanTenorMths: number;
  netMthlyIncome: number;
  currentlyIndebted: boolean | string;
  outstandingLoanAmount: number;
  outstandingMthlyRentals: number;
  repaymentMethod: RepaymentMethod;
  isTopup: boolean;

  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  workExperienceYrs: number;

  pensionRsaNumber: string;
  files: IFiles[];
  customerId: number | string;
  repaymentAccountNumber: string;
  previousActiveLoanAccount: string;
}

export interface ILoanExtended extends ILoan {
  id: number;
  dateCreated: Date;
  approvedLoanAmount: number;
  approvedMthlyRate: number;
  approvedMthlyRepayment: number;
  approvedTenorMths: number;
  approvedDsrRate: number;
  managementFee: number;
  firstRepaymentDate: Date;
  disbursementDate: Date;
  offerDate: Date;
  bookingDate: Date;
  acceptanceDate: Date;
  applicationStatus: ApplicationStatus;
  dateCompleted: Date;
  decisionFlag: any;
  files: IFiles[];
  customer: ICustomer;
  loanProduct: ILoanProduct;
  approvalTrail: IApprovalTrail[];
  isResubmitted: boolean;
  hasSecondReviewerChecked: boolean;
  approvedLoanHistory: IApprovedLoanHistory[];
  bvnValidation: IBVN | null;
  employmentValidation: IEmploymentValidation | null;
}

export interface IBVN {
  stutus: true;
  details: string;
  response_code: string;
  data?: {
    bvn: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    nin: string;
    phoneNumber1: string;
    watchListed: string;
    base64Image: string;
  } | null;
}

export interface IEmploymentValidation {
  id: number;
  employmentNumber: string;
  dateOfBirth: string;
  gender: string;
  mda: string;
  grade: string;
  fullName: string;
  employmentDate: string;
  salaryAccountNumber: string;
  salaryAccountBank: string;
}

export interface IApprovedLoanHistory {
  id: number;
  approvedLoanAmount: number;
  approvedMonthlyRate: number;
  approvedTenor: number;
  isTopup: boolean;
  loanType: string;
  loanProductId: 1;
  loanProduct: string;
  dateApproved: Date;
  approvedBy: string;
  accountOfficer: string;
}

export interface ILoanEligility {
  customerId: string | number;
  fullName: string;
  birthDate: Date;
  mobile: string;
  email: string;
  bvnNumber: string;
  dateCreated: Date;
  dateUpdated: Date;
  accountOfficerId: number;
  accountOfficer: string;
  location: string;
  occupation: string;
  passportPhoto: IFiles;
  employments: IEmployment[];
  loanApplicationInProgress: boolean;
}

export interface ILoanWorkflow {
  id: string | number;
  dateCreated: Date;
  loanAmount: number;
  loanTenorMths: number;
  isTopup: boolean;
  customerFullName: string;
  loanProduct: string;
  workflowStatus: WorkflowStatus;
  locationId: number;
  locationName: string;
}

export interface ILoanDecisionPayload {
  decisionFlag: Decision;
  comment: string;
  currentProcessorUid: number;
  nextProcessorUid: number;
  loanApplicationId: number;
}

export interface ILoanState {
  processing: boolean;
  loading: boolean;
  fetching: boolean;
  error: string | null;
  message: string | null;
  workflow: ILoanWorkflow[];
  loan: ILoanExtended;
  loanProduct: ILoanProduct[];
  singleLoanProduct: ILoanProduct;
  collection: ILoanCollection;
  activeLoans: IActiveLoan[];
  loanCustomers: ILoanEligility[];
}

export interface ILoanProduct {
  id: number;
  name: string;
  repaymentCycle: RepaymentCycle;
  defaultInterestRate: number;
  dailyPenalRate: number;
  assetSubAccount: SubAccount;
  interestIncomeSubAccount: SubAccount;
  interestReceivableSubAccount: SubAccount;
  bankSubAccount: SubAccount;
  feeSubAccount: SubAccount;
  dateCreated: Date;
  defaultManagementFeeRate: number;
}

export interface ILoanProductPayload {
  name: string;
  repaymentCycle: RepaymentCycle;
  defaultInterestRate: number;
  dailyPenalRate: number;
  assetSubAccountId: number;
  interestIncomeSubAccountId: number;
  interestReceivableSubAccountId: number;
  bankSubAccountId: number;
  feeSubAccountId: number;
}

export interface IApprovalTerms {
  approvedLoanAmount: number;
  approvedMthlyRate: number;
  approvedMthlyRepayment: number;
  approvedTenorMths: number;
  approvedDsrRate: number;
  loanProductId: number;
}

export interface IApprovalTrail {
  applicationStatus: ApplicationStatus;
  comment: string;
  decisionFlag: Decision;
  dateAssigned: Date;
  dateCompleted: Date;
  processedBy: string;
}

export interface ILoanBook {
  loanProductId: number;
  managementFee: number;
  firstRepaymentDate: Date;
}

export interface SubAccount {
  id: number;
  name: string;
  accountId: number;
  accountName: string;
  subCategoryId: number;
  subCategoryName: string;
  categoryId: number;
  categoryName: string;
  balanceSheetType: string;
}

export interface ILoanCollectionPayload {
  loanAccountNumber: string;
  tellerId: number;
}

export interface IRepaymentSchedule {
  id: number;
  period: number;
  periodStartDate: Date;
  expectedPaymentDate: Date;
  monthlyRepayment: number;
  principalRepayment: number;
  interestRepayment: number;
  cumulativePrincipal: number;
  outstandingBalance: number;
  actualFullPaymentDate: Date;
  repaymentStatus: RepaymentStatus;
}

export interface ILoanCollection {
  loanAccountNumber: string;
  customerName: string;
  repaymentSchedule: IRepaymentSchedule[];
  repaymentAccountNumber: string;
  repaymentAccountBalance: number;
  accruedInterest: number;
  outstandingPrincipal: number;
  liquidationBalance: number;
  topUpBalance: number;
  loanStatus: LoanStatus;
  netLiquidationBalance: number;
}

export interface IActiveLoan {
  accountNumber: string;
  principal: string;
  rate: string;
  tenor: string;
  dateBooked: Date;
  productName: string;
  productId: number;
  currentBalance: number;
  loanFile: ILoanExtended;
}

export type LoanStatus = "RUNNING" | "MATURED" | "LIQUIDATED";

export type RepaymentStatus = "PENDING" | "PART_PAID" | "PAID" | "LIQUIDATED";

export type RepaymentCycle =
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMI_ANNUALLY"
  | "ANNUALLY"
  | "BULLET";

export type Decision = "APPROVED" | "DECLINED" | "RETURNED";

export type WorkflowStatus = "NEW_ITEMS" | "PENDING_ITEMS";

export type LoanReason =
  | "PERSONAL"
  | "BUSINESS"
  | "SCHOOL_FEES"
  | "RENT"
  | "PORTABLE_GOODS"
  | "FASHION"
  | "MEDICAL"
  | "TRAVEL_HOLIDAY"
  | "WEDDING_EVENTS"
  | "HOUSEHOLD_MAINTENANCE"
  | "TO_BRIDGE_FINANCIAL_GAP"
  | "OTHER_EXPENSES";

export type RepaymentMethod =
  | "SALARY_DEDUCTION"
  | "DIRECT_DEBIT"
  | "BANK_TRANSFER"
  | "CHEQUES";

export type ApplicationStatus =
  | "PENDING_SUBMISSION"
  | "PENDING_FIRST_REVIEW"
  | "PENDING_SECOND_REVIEW"
  | "PENDING_ACCEPTANCE"
  | "PENDING_BOOKING"
  | "COMPLETED";
