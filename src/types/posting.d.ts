import { IFixedAssetPayload } from "./../interfaces/iPosting";
import {
  IEntryPosting,
  IEntryQueryPayload,
  IJournalQueryPayload,
  IPostingState,
  IQuery,
  IChartPayload,
  ICategory,
  ITransactionMapping,
  IDepositProductPayload,
  IAccountCreationPayload,
  IAccountingPeriodOpenPayload,
  IAccountingPeriodClosePayload,
} from "@/interfaces/iPosting";

export type TransactionType = "DR" | "CR";

export type PostingActions = {
  getGlStatement: (gl: number, start: string, end: string) => Promise<void>;
  getTransactonMapping: (transactionType: string) => Promise<void>;
  getAllTransactonMappings: () => Promise<void>;
  getAllFixedAssetMappings: () => Promise<void>;
  createEntryPosting: (paload: Partial<IEntryPosting>) => Promise<void>;

  getJournalPostings: (payload: Partial<IQuery>) => Promise<void>;
  getGLs: () => Promise<void>;
  getGLByCode: (code: number) => string;
  getJournalPostingsByAccount: (
    payload: Partial<IJournalQueryPayload>
  ) => Promise<void>;
  createJournalPosting: (
    paload: Partial<IJournalPostingPayload>
  ) => Promise<void>;
  createAmotizationPosting: (
    paload: Partial<IJournalPostingPayload>,
    noOfAmotizations: number
  ) => Promise<void>;
  batchJournalPosting: (paload: FormData) => Promise<void>;
  batchTellerPosting: (paload: FormData) => Promise<void>;

  getCategories: () => Promise<void>;
  getSubCategories: () => Promise<void>;
  getAccounts: () => Promise<void>;
  getSubAccounts: () => Promise<void>;

  createTransactionMap: (
    payload: Partial<ITransactionMapping>
  ) => Promise<void>;
  createFixedAssetMap: (payload: IFixedAssetMappingPayload) => Promise<void>;
  removeTransactionMap: (mappingId: number) => Promise<void>;
  removeFixedAssetMap: (mappingId: number) => Promise<void>;

  upsertChart: (
    who: "CAT" | "SCAT" | "ACC" | "SACC",
    payload: Partial<IChartPayload> | Partial<ICategory>,
    id?: number
  ) => Promise<void>;

  getDepositProducts: () => Promise<void>;
  createDepositProduct: (
    payload: Partial<IDepositProductPayload>
  ) => Promise<void>;
  updateDepositProduct: (
    payload: Partial<IDepositProductPayload>
  ) => Promise<void>;

  runEom: (dateValue: string) => Promise<void>;
  generateTrialBalance: (dateValue: string) => Promise<void>;
  getDepositBalancesReport: (dateValue: string) => Promise<void>;
  getAmotizationReport: (startDate: string, endDate: string) => Promise<void>;
  getProfitAndLossReport: (startDate: string, endDate: string) => Promise<void>;
  getGlCallOverReport: (dateValue: string) => Promise<void>;
  getDepositCallOverReport: (
    dateValue: string,
    pagination: IPaginationRequest
  ) => Promise<void>;
  getTransactionCallOverReport: (transactionId: string) => Promise<void>;
  getLoanTATReport: (startDate: string, endDate: string) => Promise<void>;
  getLiquidatedLoanReport: (dateValue: string) => Promise<void>;
  getFixedDepositReport: (dateValue: string) => Promise<void>;
  getAccountOfficerPerformanceReport: (
    start: string,
    end: string
  ) => Promise<void>;
  getLoanPortfolio: (date: string | Date) => Promise<void>;
  getBranchLoanProductPerformance: (
    start: string,
    end: string
  ) => Promise<void>;
  getBranchLoanPerformance: (start: string, end: string) => Promise<void>;
  getFailedDeductionReport: (dateValue: string) => Promise<void>;

  getDailyDisbursementReport: (dateValue: string) => Promise<void>;
  batchDisbursementPosting: (
    dateValue: string,
    tellerId: number
  ) => Promise<void>;

  getBatchUploadsReport: (pagination: IPaginationRequest) => Promise<void>;
  getBatchUploadsFailureReport: (
    transactionId: string,
    pagination: IPaginationRequest,
    type: string
  ) => Promise<void>;
  commitBatchUpload: (id: string, type: string) => Promise<void>;

  getFixedDepositByAccountNumber: (accountNumber: string) => Promise<void>;
  terminateFixedDeposit: (
    accountNumber: string,
    teller: number
  ) => Promise<void>;
  bookFixedDeposit: (payload: Partial<IFixedDepositPayload>) => Promise<void>;
  createAccount: (payload: Partial<IAccountCreationPayload>) => Promise<void>;

  bookFixedAsset: (payload: Partial<IFixedAssetPayload>) => Promise<void>;
  getFixedAssets: () => Promise<void>;
  terminateFixedAsset: (id: string | number) => Promise<void>;

  setDepositProduct: (payload: IDepositProductPayload | null) => void;

  clearErrorAndMessage: () => void;
  clearField: (key: keyof IPostingState) => void;

  openAccountingPeriod: (
    payload: IAccountingPeriodOpenPayload
  ) => Promise<void>;
  closeAccountingPeriod: (
    payload: IAccountingPeriodClosePayload
  ) => Promise<void>;
  getAccountingPeriods: () => Promise<void>;
  getAccountingPeriod: (id: number) => Promise<void>;
  deleteAccountingPeriod: (id: number) => Promise<void>;
};

export type PostingState = IPostingState & PostingActions;
