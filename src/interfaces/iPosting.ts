import { TransactionType } from "@/types/posting";
import { IPaginationResponse } from ".";
import { IStatement } from "./iCustomer";
import { LoanReason, SubAccount } from "./iLoan";
import { SystemRoles } from "./iUserManagement";
import { Gender } from "@/types/customer";

export interface IEntryPosting {
  transactionDescription: string;
  valueDate: string;
  entryType: "GENERAL" | "BALANCE_CD";
  tellerUserId: number;
  reviewerId: number;
  debitEntry: IEntry;
  creditEntry: IEntry;
  customerEntry: {
    depositAccountNumber: string;
    transactionAmount: number;
    drCrFlag: "CR" | "DR";
  };
}

export interface IEntry {
  subAccountId: number;
  transactionAmount: number;
  drCrFlag: "CR" | "DR";
}

export interface IJournalPostingPayload {
  transactionId: string;
  description: string;
  valueDate: Date;
  entryType: "GENERAL";
  tellerUserId: number;
  reviewerUserId: number;
  entry: PostEntry[];
}

export interface PostEntry {
  subAccountId: number;
  subAccount?: string;
  transactionAmount: number;
  description: string;
  drCrFlag: "DR" | "CR";
}

export interface IQuery {
  startDate: Date;
  endDate: Date;
  recordsPerPage: number;
  page: number;
}

export interface IEntryQueryPayload extends IQuery {
  locationId: number;
}

export interface IJournalQueryPayload extends IQuery {
  accountNumber: string;
}

export interface ICategory {
  id: number;
  name: string;
  balanceType: "DR" | "CR";
}

export interface ISubCategory {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  balanceSheetType: "DR" | "CR";
}

export interface IAccount extends ICategory {
  subCategoryId: number;
  subCategoryName: string;
  balanceSheetType: "DR" | "CR";
}

export interface IChartPayload {
  name: string;
  parentId: number;
}

export interface ITransactionMapping {
  id: number;
  transactionType: string;
  subAccountId: number;
  subAccountName: string;
  bankSubAccountId: number;
  bankSubAccountName: string;
  drCrFlag: "DR" | "CR";
}

export interface IFixedAssetMapping {
  id: number;
  assetSubaccountId: number;
  assetSubaccount: string;
  depreciationExpenseSubaccountId: number;
  depreciationExpenseSubaccount: string;
  accumulatedDepreciationSubaccountId: number;
  accumulatedDepreciationSubaccount: string;
  bankSubaccountId: number;
  bankSubaccount: string;
}

export interface IFixedAssetMappingPayload {
  assetSubAccountId: number;
  depreciationExpenseSubAccountId: number;
  accumulatedDepreciationSubAccountId: number;
  // bankSubAccountId: number;
}

export type PeriodStatus = "OPEN" | "CLOSED" | "PENDING_CLOSURE";

export interface IAccountingPeriod {
  id: number;
  dateCreated: Date;
  dateClosed: Date;
  startDate: Date;
  endDate: Date;
  periodName: string;
  closedBy: string;
  createdBy: string;
  periodStatus: PeriodStatus;
  periodEndClosingSubaccount: number;
}

export interface IAccountingPeriodOpenPayload {
  startDate: Date | string;
  endDate: Date | string;
}

export interface IAccountingPeriodClosePayload {
  id: number;
  periodEndClosingSubaccount: number;
}

export interface IDepositProductPayload {
  id?: number;
  productName: string;
  depositType: string;
  subaccountId: number;
  intSubaccountId: number;
  intPayableSubaccountId: number;
  bankSubaccountId: number;
  currencyCode: string;
  monthlyChargesAmount: number;
  monthlyInterestRate: number;
  withdrawalChargeRate: number;
}

export interface IFixedDepositPayload {
  fundingAccountNumber: string;
  proceedsAccountNumber: string;
  principal: number;
  tenorDays: number;
  interestOnDeposit: number;
  depositProductId: number;
  bookingInstruction: string;
  tellerUserId: number;
}

export interface IAccountCreationPayload {
  customerId: number;
  depositProductId: number;
  initialDepositAmount: number;
}

export interface IFixedDeposit {
  id: number;
  depositAccountNumber: string;
  fundingAccountNumber: string;
  proceedsAccountNumber: string;
  customerId: number;
  principal: number;
  tenorDays: number;
  interestOnDeposit: number;
  effectiveDate: Date;
  bookingDate: Date;
  depositProductId: number;
  depositStatus: string;
  createDate: Date;
  terminationDate: Date;
  interestDueAtMaturity: number;
  dailyInterestAccrued: number;
  bookingInstruction: string;
}

export interface IGlStatement {
  openingBalance: number;
  closingBalance: number;
  totalDebit: number;
  totalCredit: number;
  transactions: IStatement[];
}

export interface ITrailBalance {
  glCode: string;
  account: string;
  balance: number;
  debit: number;
  credit: number;
  category: string;
  subAccountId: number;
  subAccount: string;
  subCategory: string;
}

export interface IFixedAssetPayload {
  name: string;
  description: string;
  acquisitionCost: number;
  acquisitionDate: Date;
  usefulLifeMonths: number;
  salvageValue: number;
  fixedAssetGlId: number;
  tellerUserId: number;
  fundingBankSubaccount: number;
}

export interface IFixedAsset extends IFixedAssetPayload {
  id: number;
  dateCreated: Date;
  fixedAssetGlId: number;
  assetSubaccount: string;
  bankSubaccount: string;
  bankSubaccountId: number;
  deprSubaccount: string;
  accumDeprSubaccountId: number;
  accumDeprSubaccount: string;
  deprSubaccountId: number;
  assetSubaccountId: number;
  usefulLifeYears: number;
  assetStatus: string;
}

export interface IFailedDeductionReport {
  transactionId: string;
  summary: string;
  uploadedBy: string;
  dateUploaded: Date;
  failedUploadCsv: string;
  successfulUploadCsv: string;
}

export interface ILoanTATReport {
  avgProcessingTimePerLoan: string;
  avgProcessingMinutesPerLoan: number;
  loansReceived: number;
  currentPendingLoans: number;
  processingOfficer: string;
  userRole: SystemRoles; //TODO role type
}

export interface IGlCallOverReport {
  transactionId: string;
  transactionAmount: number;
  drCrFlag: "DR" | "CR";
  description: string;
  transactionDate: Date;
  postingDate: Date;
  valueDate: Date;
  entryType: string;
  subAccountId: number;
  subAccountName: string;
  tellerUser: string;
  reviewerUser: string;
}

export interface IDepositCallOverReport {
  id: number;
  accountNumber: string;
  postingDate: Date;
  tellerUserId: number;
  transactionDate: Date;
  transactionDescription: string;
  transactionId: string;
  valueDate: Date;
  transactionAmount: number;
  drCrFlag: "CR" | "DR";
}

export interface ITransactionCallOverReport {
  transactionId: string;
  valueDate: Date;
  accountNumber: string;
  postingDate: Date;
  transactionDate: Date;
  entryType: string;
  transactionAmount: number;
  drCrFlag: "CR" | "DR";
  description: string;
}

export interface ILoanLiquidationReport {
  loanAccountNumber: string;
  originalLoanAmount: number;
  monthlyRate: number;
  tenorMonths: number;
  disbursementDate: Date;
  loanPurpose: LoanReason;
  customerId: number;
  loanProductId: number;
  repaymentAccountNumber: number;
  birthDate: Date;
  bvnNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nubanNumber: string;
  productName: string;
  accountOfficer: string;
  employmentNumber: string;
  employerName: string;
  gender: Gender;
  mobile: string;
  dateLiquidated: Date;
}

export interface IFixedDepositReport {
  address: string;
  mobile: string;
  gender: string;
  principal: number;
  bookingDate: Date;
  interestOnDeposit: number;
  fundingAccountNumber: string;
  proceedsAccountNumber: string;
  customerId: number;
  depositProductId: number;
  tenorDays: number;
  depositStatus: string;
  terminationDate: Date | null;
  bookingInstruction: string;
  customerName: string;
  fixedDepositAccountNumber: string;
  depositProductName: string;
}

export interface IDepositBalanceReport {
  transactionAmount: number;
  accountNumber: string;
  customerId: number;
  depositProductId: number;
  depositType: string;
  firstName: number;
  lastName: number;
  depositProductName: number;
}

export interface IDailyDisbursementReport {
  customerId: number;
  firstName: string;
  lastName: string;
  middleName: string;

  employer: string;
  employmentNumber: string;
  netMonthlyIncome: number;

  bvn: string;
  mobile: string;

  location: string;
  bankAccountName: string;
  bankName: string;
  bankAccount: string;

  previousLoanLiquidationBalance: number;
  netDisbursement: number;
  managementFee: number;
  dateCreated: Date;
  loanApplicationId: number;
  approvedLoanAmount: number;
  approvedTenorMonths: number;
  repaymentAccountNumber: string;
  loanAccountNumber: string;
  loanProduct: string;

  accountOfficerId: number;
  accountOfficer: string;
}

export interface IAmotizationSchedule {
  transactionDate: Date;
  transactionId: string;
  transactionAmount: number;
  valueDate: Date;
  entryType: "GENERAL" | "BALANCE_CD";
  subAccountId: number;
  drCrFlag: "DR" | "CR";
  description: string;
  postingDate: Date;
  isTreated: false;
  tellerUser: string;
  reviewerUser: string;
  subAccountName: string;
}

export interface IAccountOfficerPerformanceReport {
  location: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateCreated: Date;
  loanAccountNumber: string;
  repaymentAccountNumber: string;
  approvedLoanAmount: number;
  loanApplicationId: number;
  approvedTenorMonths: number;
  accountOfficer: string;
  managementFee: number;
  customerId: number;
  loanProduct: string;
  netMonthlyIncome: number;
  bankAccount: string;
  mobile: string;
  bvn: string;
  bankName: string;
  employmentNumber: string;
  employer: string;
  outstandingLoanAmount: number;
  bankAccountName: string;
}

export interface IBatchUploadReportResponse extends IPaginationResponse {
  content: IBatchUploadReport[];
}

export interface IDepositCallOverReportResponse extends IPaginationResponse {
  content: IDepositCallOverReport[];
}

export interface IBatchUploadFailureReportResponse {
  summary: string;
  data: {
    content: IEntryBatchFailureReport[] | IDepositBatchFailureReport[];
  } & IPaginationResponse;
}

export interface IBatchUploadReport {
  contentType: string;
  id: number;
  fileName: string;
  userId: number;
  transactionId: string;
  batchFileStatus: string;
  dateCreated: Date;
  batchFileType: string;
  uploadedBy: string;
  fileDescription: string;
}

export interface IEntryBatchFailureReport {
  id: number;
  transactionId: string;
  description: string;
  drCrFlag: TransactionType;
  transactionAmount: number;
  valueDate: Date;
  subaccountId: number;
  uploadedAt: Date;
  uploadedByUserId: number;
  uploadedByUser: string;
  passedValidation: boolean;
  validationMessage: string;
}

export interface IDepositBatchFailureReport {
  id: number;
  transactionId: string;
  depositAccountNumber: string;
  narration: string;
  debitCredit: TransactionType;
  amount: number;
  valueDate: Date;
  glCode: number;
  productSubaccountId: number;
  uploadedAt: Date;
  uploadedByUserId: number;
  uploadedByUser: string;
  passedValidation: boolean;
  validationMessage: string;
}

export interface IBranchPerformanceReport {
  branchName: string;
  totalLoanAmount: number;
  numberOfLoansBooked: number;
}

export interface IBranchProductPerformanceReport
  extends IBranchPerformanceReport {
  productName: string;
}

export interface ILoanPortfolioReport {
  fileDescription: string;
  filePath: string;
  timeCreated: Date;
  reportDate: Date;
}

export interface incomeExpenseGls {
  balance: number;
  subAccountId: number;
  subAccount: string;
  category: string;
  glCode: string;
  credit: number;
  debit: number;
  account: string;
  subCategory: string;
}

export interface IPostingState {
  processing: boolean;
  loading: boolean;
  journalPosting: IJournalPostingPayload;
  journalPostings: IJournalPostingPayload[];
  gls: SubAccount[];
  error: string | null;
  message: string | null;
  categories: ICategory[];
  subCategories: ISubCategory[];
  subAccounts: SubAccount[];
  accounts: IAccount[];
  transactions: ITransactionMapping[];
  fixedAssetMap: IFixedAssetMapping[];
  transactionMap: ITransactionMapping[];
  branchPerformance: IBranchPerformanceReport[];
  batchUploads: IBatchUploadReportResponse;
  batchUploadFailures: IBatchUploadFailureReportResponse;
  loanPortfolio: ILoanPortfolioReport[];
  branchProductPerformance: IBranchProductPerformanceReport[];
  profitsAndLosses: {
    incomeExpenseGls: incomeExpenseGls[];
    netProfitOrLoss: number;
  };

  gl: any;
  statement: IGlStatement;

  depositProducts: IDepositProductPayload[];
  depositProduct: IDepositProductPayload;

  fixedDeposit: IFixedDeposit;
  trialBalance: ITrailBalance[];

  fixedAssets: IFixedAsset[];

  depositBalancesReport: IDepositBalanceReport[];

  glCallOverReport: IGlCallOverReport[];
  depositCallOverReport: IDepositCallOverReportResponse;
  transactionCallOverReport: ITransactionCallOverReport[];

  loanTATReport: ILoanTATReport[];
  loanLiquidationReport: ILoanLiquidationReport[];

  fixedDepositReport: IFixedDepositReport[];
  accountOfficerPerformanceReport: IAccountOfficerPerformanceReport[];
  failedDeductionReport: IFailedDeductionReport[];

  dailyDisbursementReport: IDailyDisbursementReport[];
  amotizationSchedules: IAmotizationSchedule[];

  accountingPeriods: IAccountingPeriod[];
  accountingPeriod: IAccountingPeriod;
}
