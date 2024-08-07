import { message } from "antd";
import { IPostingState } from "@/interfaces/iPosting";
import { PostingState } from "@/types/posting";
import { create } from "zustand";
import ApiService from "@/services/api";
import { devtools } from "zustand/middleware";
import { IPaginationResponse } from "@/interfaces";

const initialState: IPostingState = {
  processing: false,
  loading: false,
  journalPosting: null,
  journalPostings: [],
  gls: [],
  error: null,
  message: null,
  categories: [],
  subCategories: [],
  subAccounts: [],
  transactions: [],
  transactionMap: [],
  fixedAssetMap: [],
  accounts: [],
  branchPerformance: [],
  batchUploads: null,
  batchUploadFailures: null,
  loanPortfolio: [],
  branchProductPerformance: [],
  profitsAndLosses: {
    incomeExpenseGls: [],
    netProfitOrLoss: 0,
  },

  gl: null,
  statement: null,
  depositProducts: [],
  depositProduct: null,
  fixedDeposit: null,
  trialBalance: [],

  fixedAssets: [],
  depositBalancesReport: [],
  glCallOverReport: [],
  transactionCallOverReport: [],
  depositCallOverReport: null,
  loanTATReport: [],
  loanLiquidationReport: [],
  fixedDepositReport: [],
  accountOfficerPerformanceReport: [],

  dailyDisbursementReport: [],
  amotizationSchedules: [],
  failedDeductionReport: [],

  accountingPeriods: [],
  accountingPeriod: null,
};

const usePostingStore = create<PostingState>()(
  devtools((set, get) => ({
    ...initialState,

    getDailyDisbursementReport: async (dateValue) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetDailyDisbursementReport(dateValue);

        if (data.isSuccessful) {
          set({
            dailyDisbursementReport: data.data || [],
            loading: false,
            message: data.message,
          });
        } else {
          set({
            dailyDisbursementReport: [],
            loading: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getAmotizationReport: async (start, end) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetAmotizationReport(start, end);

        if (data.isSuccessful) {
          set({
            amotizationSchedules: data.data || [],
            loading: false,
            message: data.message,
          });
        } else {
          set({
            amotizationSchedules: [],
            loading: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getProfitAndLossReport: async (start, end) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetProfitAndLossReport(start, end);

        set({
          loading: false,
          message: data,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getDepositBalancesReport: async (dateValue) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetDepositBalanceReport(dateValue);

        if (data.isSuccessful) {
          set({
            depositBalancesReport: data.data || [],
            loading: false,
            message: data.message,
          });
        } else {
          set({
            depositBalancesReport: [],
            loading: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getGlCallOverReport: async (dateValue) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetGlCallOverReport(dateValue);

        if (data.isSuccessful) {
          set({
            glCallOverReport: data.data || [],
            loading: false,
            message: data.message,
          });
        } else {
          set({
            glCallOverReport: [],
            loading: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getDepositCallOverReport: async (dateValue, pagination) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetDepositCallOverReport(
          dateValue,
          pagination
        );

        set({
          depositCallOverReport: data || null,
          loading: false,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getTransactionCallOverReport: async (tansactionId) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetTransactionCallOverReport(
          tansactionId
        );

        set({
          transactionCallOverReport: data || [],
          loading: false,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getLoanTATReport: async (startDate, endDate) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetLoanTATReport(startDate, endDate);

        set({
          loanTATReport: data || [],
          loading: false,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getLiquidatedLoanReport: async (dateValue) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetLoanLiquidationReport(dateValue);

        set({
          loanLiquidationReport: data || [],
          loading: false,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getFixedDepositReport: async (dateValue) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetFixedDepositReport(dateValue);

        set({
          fixedDepositReport: data || [],
          loading: false,
          message: data.message,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getAccountOfficerPerformanceReport: async (startDate, endDate) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetAccountOfficerPerformanceReport({
          startDate,
          endDate,
        });

        set({
          accountOfficerPerformanceReport: data || [],
          loading: false,
          message: data.message,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getLoanPortfolio: async (date) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetLoanPortfolio({ dateValue: date });

        set({
          loanPortfolio: data || [],
          loading: false,
          message: data.message,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getBatchUploadsReport: async (pagination) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetBatchUploadsReport(pagination);

        set({
          batchUploads: data,
          loading: false,
        });
      } catch (error: any) {
        set({
          batchUploads: null,
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getBatchUploadsFailureReport: async (id, pagination, type) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetBatchFailureUploadsReport(
          id,
          type,
          pagination
        );

        set({
          batchUploadFailures: data,
          loading: false,
        });
      } catch (error: any) {
        set({
          batchUploadFailures: null,
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getBranchLoanProductPerformance: async (startDate, endDate) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetBranchLoanProductPerformance({
          startDate,
          endDate,
        });

        set({
          branchProductPerformance: data || [],
          loading: false,
          message: data.message,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getBranchLoanPerformance: async (startDate, endDate) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetBranchLoanPerformance({
          startDate,
          endDate,
        });

        set({
          branchPerformance: data || [],
          loading: false,
          message: data.message,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getFailedDeductionReport: async (dateValue) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetFailedDeductionReport(dateValue);

        if (data.isSuccessful) {
          set({
            failedDeductionReport: data.data || [],
            loading: false,
            message: data.message,
          });
        } else {
          set({
            failedDeductionReport: [],
            loading: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    runEom: async (dateValue) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.RunEOM(dateValue);

        if (data.isSuccessful) {
          set({
            loading: false,
            message: data.message,
            trialBalance: data.data || [],
          });
        } else {
          set({
            trialBalance: [],
            loading: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    generateTrialBalance: async (dateValue) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GenerateTrialBalance(dateValue);

        set({
          loading: false,
          message: data,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    openAccountingPeriod: async (payload) => {
      set({ processing: true, error: null });
      const { getAccountingPeriods } = get();

      try {
        const apiService = new ApiService();
        const { data } = await apiService.OpenAccountingPeriod(payload);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: data.message,
          });
        } else {
          set({
            processing: false,
            error: data.message,
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error: error.response.data.error,
        });
      } finally {
        getAccountingPeriods();
      }
    },
    closeAccountingPeriod: async (payload) => {
      set({ processing: true, error: null });
      const { getAccountingPeriods } = get();

      try {
        const apiService = new ApiService();
        const { data } = await apiService.CloseAccountingPeriod(payload);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: data.message,
          });
        } else {
          set({
            processing: false,
            error: data.message,
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error: error.response.data.error,
        });
      } finally {
        getAccountingPeriods();
      }
    },
    getAccountingPeriods: async () => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetAccountingPeriods();

        set({
          accountingPeriods: data || [],
          loading: false,
        });
      } catch (error: any) {
        set({
          loading: false,
          error: error.response.data.error,
        });
      }
    },
    getAccountingPeriod: async (id) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetAccountingPeriod(id);

        if (data.isSuccessful) {
          set({
            accountingPeriod: data.data,
            loading: false,
          });
        } else {
          set({
            accountingPeriod: null,
            loading: false,
            error: data.message,
          });
        }
      } catch (error: any) {
        set({
          loading: false,
          error: error.response.data.error,
        });
      }
    },
    deleteAccountingPeriod: async (id) => {
      const { getAccountingPeriods } = get();
      set({ processing: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.DeleteAccountingPeriod(id);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: data.message,
          });
        } else {
          set({
            processing: false,
            error: data.message,
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error: error.response.data.error,
        });
      } finally {
        getAccountingPeriods();
      }
    },
    getGlStatement: async (gl, start, end) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetGLAccountStatement(start, end, gl);

        set({ statement: data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getGLByCode: (code) => {
      const { gls } = get();
      const gl = gls.find((item) => item.id === code);

      if (gl) {
        return `${gl.id}-${gl.name}`;
      } else {
        return null;
      }
    },
    getAllTransactonMappings: async () => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetAllTransactonMappings();

        set({ transactions: data.data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getAllFixedAssetMappings: async () => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetAllFixedAssetMappings();

        set({ fixedAssetMap: data || [], loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getTransactonMapping: async (transactionType) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetTransactonMapping(transactionType);

        set({ transactionMap: data.data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    createEntryPosting: async (payload) => {
      set({ processing: true, error: null });

      try {
        const apiService = new ApiService();

        const { data } = await apiService.CreateEntryPosting(payload);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: data.message || "Operation completed successfully",
          });
        } else {
          set({
            processing: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getJournalPostings: async (payload) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetJournalPostings(payload);

        set({ journalPostings: data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getGLs: async () => {
      set({ error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetGLs();

        set({ gls: data });
      } catch (error: any) {
        set({
          error:
            error.response.data.error || "Unable to get gls, please try again",
        });
      }
    },
    getJournalPostingsByAccount: async (payload) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetJournalPostingByAccount(payload);

        set({ journalPostings: data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    createJournalPosting: async (payload) => {
      set({ processing: true, error: null });

      try {
        const apiService = new ApiService();

        const { data } = await apiService.CreateJournalPosting(payload);

        if (data.isSuccessful) {
          set({
            journalPosting: data.data,
            processing: false,
            message: data.message,
          });
        } else {
          set({
            processing: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    createAmotizationPosting: async (payload, noOfAmotization) => {
      set({ processing: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.CreateAmotizationPosting(
          payload,
          noOfAmotization
        );

        if (data.isSuccessful) {
          set({
            journalPosting: data.data,
            processing: false,
            message: data.message,
          });
        } else {
          set({
            processing: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    batchJournalPosting: async (payload) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.BatchJournalPosting(payload);

        if (data.isSuccessful) {
          set({
            loading: false,
            message: data.message,
          });
        } else {
          set({
            loading: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    commitBatchUpload: async (id, type) => {
      set({ processing: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.CommitBatchUpload(id, type);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: data.message,
          });
        } else {
          set({
            processing: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    batchTellerPosting: async (payload) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.BatchTellerPosting(payload);

        if (data.isSuccessful) {
          set({
            loading: false,
            message: data.message,
          });
        } else {
          set({
            loading: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    batchDisbursementPosting: async (payload, teller) => {
      set({ processing: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.BatchDisbursementPosting(
          payload,
          teller
        );

        if (data.isSuccessful) {
          set({
            processing: false,
            message: data.message,
          });
        } else {
          set({
            processing: false,
            error: "Batch upload failed",
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getCategories: async () => {
      set({ error: null, loading: true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetCategories();

        set({ categories: data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to fetch categories, please try again",
        });
      }
    },
    getSubCategories: async () => {
      set({ error: null, loading: true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetSubCategories();

        set({ subCategories: data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to fetch sub-categories, please try again",
        });
      }
    },
    getAccounts: async () => {
      set({ error: null, loading: true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetAccounts();

        set({ accounts: data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to fetch accounts, please try again",
        });
      }
    },
    getSubAccounts: async () => {
      set({ error: null, loading: true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetSubAccounts();

        set({ subAccounts: data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to fetch sub-accounts, please try again",
        });
      }
    },
    getDepositProducts: async () => {
      const { depositProducts } = get();
      set({ error: null, loading: depositProducts?.length > 0 ? false : true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetDepositProducts();

        set({ depositProducts: data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to fetch deposit products, please try again",
        });
      }
    },
    getFixedAssets: async () => {
      set({ error: null, loading: true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetFixedAssets();

        set({ fixedAssets: data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    terminateFixedAsset: async (id) => {
      set({ processing: true });
      const { getFixedAssets } = get();

      try {
        const apiService = new ApiService();
        const { data } = await apiService.TerminateFixedAsset(id);

        if (data.isSuccessful) {
          message.success(data.message);
          await getFixedAssets();
        } else {
          message.success(
            data.message || "Unable to terminate fixed asset, try again!"
          );
        }
        set({
          processing: false,
        });
      } catch (error: any) {
        set({
          processing: false,
        });
      }
    },
    getFixedDepositByAccountNumber: async (accountNumber) => {
      set({ error: null, loading: true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetFixedDepositByAccountNumber(
          accountNumber
        );

        if (data.isSuccessful) {
          set({ fixedDeposit: data.data, loading: false });
        } else {
          set({ fixedDeposit: null, loading: false, error: data.message });
        }
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    createAccount: async (payload) => {
      set({ processing: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.CreateDepositAccount(payload);

        if (data && data.id) {
          set({
            processing: false,
            message: "New deposit account created successfully",
          });
        } else {
          set({
            processing: false,
            error: "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    bookFixedDeposit: async (payload) => {
      set({ processing: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.BookFixedDeposit(payload);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: data.message,
          });
        } else {
          set({
            processing: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    bookFixedAsset: async (payload) => {
      set({ processing: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.BookFixedAsset(payload);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: data.message,
          });
        } else {
          set({
            processing: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    terminateFixedDeposit: async (accountNumber, teller) => {
      set({ processing: true, error: null });
      const { getFixedDepositByAccountNumber } = get();

      try {
        const apiService = new ApiService();
        const { data } = await apiService.TerminateFixedDeposit(
          accountNumber,
          teller
        );

        if (data.isSuccessful) {
          set({
            processing: false,
            message: data.message,
          });

          await getFixedDepositByAccountNumber(accountNumber);
        } else {
          set({
            processing: false,
            error: data.error,
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    createDepositProduct: async (payload) => {
      set({ processing: true, error: null });
      const { getDepositProducts } = get();

      try {
        const apiService = new ApiService();
        const { data } = await apiService.CreateDepositProduct(payload);

        if (data) {
          set({
            processing: false,
            message: "Deposit product created successfully",
          });
          getDepositProducts();
        } else {
          set({
            processing: false,
            error: "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    updateDepositProduct: async (payload) => {
      set({ processing: true, error: null });
      const { getDepositProducts } = get();

      try {
        const apiService = new ApiService();
        const { data } = await apiService.UpdateDepositProduct(payload);

        if (data) {
          set({
            processing: false,
            message: data.message,
          });
          getDepositProducts();
        } else {
          set({
            processing: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    upsertChart: async (who, payload, id) => {
      set({ processing: true, error: null });
      let isSuccess: boolean = false;
      const {
        getGLs,
        getAccounts,
        getCategories,
        getSubAccounts,
        getSubCategories,
      } = get();

      const apiService = new ApiService();
      let response;

      try {
        if (id) {
          switch (who) {
            case "CAT":
              response = await apiService.UpdateCategory(payload, id);
              break;
            case "SCAT":
              response = await apiService.UpdateSubCategory(payload, id);
              break;
            case "ACC":
              response = await apiService.UpdateAccount(payload, id);
              break;
            default:
              response = await apiService.UpdateSubAccount(payload, id);
          }
        } else {
          switch (who) {
            case "CAT":
              response = await apiService.CreateCategory(payload);
              break;
            case "SCAT":
              response = await apiService.CreateSubCategory(payload);
              break;
            case "ACC":
              response = await apiService.CreateAccount(payload);
              break;
            default:
              response = await apiService.CreateSubAccount(payload);
          }
        }

        if (response.data.isSuccessful) {
          set({
            processing: false,
            message: response.data.message,
          });
          isSuccess = true;
        } else {
          set({
            processing: false,
            error:
              response.data.error ||
              "Unable to complete process, please try again",
          });
        }
      } catch (error) {
        set({
          processing: false,
          error:
            error.response?.data?.error ||
            "Unable to complete process, please try again",
        });
      } finally {
        if (isSuccess) {
          await Promise.all([
            getGLs(),
            getAccounts(),
            getCategories(),
            getSubAccounts(),
            getSubCategories(),
          ]);
        }
        set({ error: null, message: null }); // Clear error and message
      }
    },
    createTransactionMap: async (payload) => {
      set({ processing: true, error: null });
      const { getAllTransactonMappings } = get();

      try {
        const apiService = new ApiService();
        const { data } = await apiService.CreateTransactionMapping(payload);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: data.message,
          });
          getAllTransactonMappings();
        } else {
          set({
            processing: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    removeTransactionMap: async (mappingId) => {
      set({ processing: true, error: null });
      const { getAllTransactonMappings } = get();

      try {
        const apiService = new ApiService();
        const { data } = await apiService.RemoveTransactionMapping(mappingId);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: data.message,
          });
          getAllTransactonMappings();
        } else {
          set({
            processing: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    createFixedAssetMap: async (payload) => {
      set({ processing: true, error: null });
      const { getAllFixedAssetMappings } = get();

      try {
        const apiService = new ApiService();
        const { data } = await apiService.CreateFixedAssetMapping(payload);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: data.message,
          });
          getAllFixedAssetMappings();
        } else {
          set({
            processing: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    removeFixedAssetMap: async (mappingId) => {
      set({ processing: true, error: null });
      const { getAllFixedAssetMappings } = get();

      try {
        const apiService = new ApiService();
        const { data } = await apiService.RemoveFixedAssetMapping(mappingId);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: data.message,
          });
          getAllFixedAssetMappings();
        } else {
          set({
            processing: false,
            error:
              data.message || "Unable to complete process, please try again",
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    clearErrorAndMessage: () => {
      set({ error: null, message: null, processing: false });
    },
    setDepositProduct: (payload) => {
      set({ depositProduct: payload });
    },
    clearField: (key) => {
      set({ [key]: null });
    },
  }))
);

export default usePostingStore;
