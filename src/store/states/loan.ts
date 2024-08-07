import { ILoanState } from "@/interfaces/iLoan";
import { LoanState } from "@/types/loan.d";
import { devtools } from "zustand/middleware";
import { create } from "zustand";
import ApiService from "@/services/api";

const initialState: ILoanState = {
  processing: false,
  loading: false,
  fetching: false,
  error: null,
  message: null,
  workflow: [],
  loan: null,
  loanProduct: [],
  singleLoanProduct: null,
  collection: null,
  activeLoans: [],
  loanCustomers: [],
};

const useLoanStore = create<LoanState>()(
  devtools((set, get) => ({
    ...initialState,
    getCustomersLoanEligility: async (search) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetCustomersLoanEligibility(search);

        set({ loanCustomers: data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    setLoanProduct: async (payload) => {
      set({ singleLoanProduct: payload });
    },
    getWorkflow: async (userId) => {
      set({ loading: true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetWorkflow(userId);

        set({ workflow: data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
        });
      }
    },
    getWorkflowByStatus: async (applicationStatus) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetWorkflowByStatus(
          applicationStatus
        );

        set({ workflow: data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    createLoan: async (payload) => {
      set({ processing: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.CreateLoan(payload);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: "New loan created successfully",
          });
        } else {
          set({
            processing: false,
            error:
              data.message ||
              "Error occurred while creating new loan, please try again",
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
    updateLoanProduct: async (payload, id) => {
      set({ processing: true, error: null });
      const { getLoanProducts } = get();

      try {
        const apiService = new ApiService();
        const { data } = await apiService.UpdateLoanProduct(payload, id);

        if (data) {
          set({
            processing: false,
            message: data.message,
          });
          getLoanProducts();
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
    createLoanProduct: async (payload) => {
      set({ processing: true, error: null });
      const { getLoanProducts } = get();

      try {
        const apiService = new ApiService();
        const { data } = await apiService.CreateLoanProduct(payload);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: "New loan created successfully",
          });
          await getLoanProducts();
        } else {
          set({
            processing: false,
            error:
              data.message ||
              "Error occurred while creating new loan, please try again",
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
    updateLoan: async (payload, loanId) => {
      set({ processing: true, error: null });

      try {
        if (payload) {
          const apiService = new ApiService();
          const { data } = await apiService.UpdateLoan(payload, loanId);

          if (data.isSuccessful) {
            set({
              processing: false,
              message: data.message || "Loan updated succesfully",
            });
          } else {
            set({
              processing: false,
              error: data.message || "Unable to update loan application",
            });
          }
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
    loanDecision: async (payload) => {
      set({ processing: true, error: null });

      try {
        if (payload) {
          const apiService = new ApiService();
          const { data } = await apiService.LoanDecision(payload);

          if (data.isSuccessful) {
            set({
              processing: false,
              message:
                data.message || "Loan routed to the next workflow successfully",
            });
          } else {
            set({
              processing: false,
              error:
                data.message ||
                "Unable to route loan application to the next workflow",
            });
          }
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
    bookLoan: async (payload) => {
      set({ processing: true, error: null });

      try {
        if (payload) {
          const apiService = new ApiService();
          const { data } = await apiService.LoanBooking(payload);

          if (data.isSuccessful) {
            set({
              processing: false,
              message: data.message || "Loan booked",
            });
          } else {
            set({
              processing: false,
              error:
                data.message || "Unable to complete process, please try again",
            });
          }
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
    saveApprovalTerms: async (payload) => {
      set({ processing: true, error: null });

      try {
        if (payload) {
          const apiService = new ApiService();
          const { data } = await apiService.LoanApprovalTerms(payload);

          if (!data.isSuccessful) {
            set({
              processing: false,
              error:
                data.message || "Unable to complete process, please try again",
            });
          } else {
            set({
              processing: false,
              message: data.message || "Processed",
            });
          }
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
    getLoanById: async (loanId) => {
      set({ error: null, fetching: true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetLoan(loanId);

        if (data.isSuccessful) {
          set({ loan: data.data, fetching: false });
        } else {
          set({ fetching: false, error: data.message });
        }
      } catch (error: any) {
        set({
          fetching: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getActiveCustomerLoans: async (customerId) => {
      set({ error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetCustomerActiveLoans(customerId);

        set({ activeLoans: data || [] });
      } catch (error: any) {
        set({
          fetching: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    setLoanInfo: async (payload) => {
      set({ loan: payload });
    },
    getLoanProducts: async () => {
      const { loanProduct } = get();
      set({ error: null, loading: loanProduct?.length > 0 ? false : true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetLoanProducts();

        set({ loanProduct: data, loading: false });
      } catch (error: any) {
        set({ loanProduct: [], loading: false });
      }
    },
    getLoanCollection: async (loanAccountNumber) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetLoanCollectionSchedule(
          loanAccountNumber
        );

        if (data.isSuccessful) {
          set({ collection: data.data, loading: false });
        } else {
          set({
            collection: null,
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
    loanCollection: async (payload) => {
      set({ processing: true, error: null });
      const { getLoanCollection } = get();

      try {
        if (payload) {
          const apiService = new ApiService();
          const { data } = await apiService.LoanCollection(payload);

          if (data.isSuccessful) {
            set({
              processing: false,
              message: data.message || "Loan collection was successfully",
            });

            await getLoanCollection(payload.loanAccountNumber);
          } else {
            set({
              processing: false,
              error:
                data.message || "Unable to complete process, please try again",
            });
          }
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
    loanLiquidate: async (payload) => {
      set({ processing: true, error: null });
      const { getLoanCollection } = get();

      try {
        if (payload) {
          const apiService = new ApiService();
          const { data } = await apiService.LoanLiquidation(payload);

          if (data.isSuccessful) {
            set({
              processing: false,
              message: data.message || "Loan liquidate was successfully",
            });

            await getLoanCollection(payload.loanAccountNumber);
          } else {
            set({
              processing: false,
              error:
                data.message || "Unable to complete process, please try again",
            });
          }
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
    clearField: (key) => {
      set({ [key]: null });
    },
  }))
);

export default useLoanStore;
