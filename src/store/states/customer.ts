import { ICustomer } from "@/interfaces/iCustomer";
import { CustomerState } from "@/types/customer.d";
import { ICustomerState } from "@/interfaces/iCustomer";
import { devtools } from "zustand/middleware";
import { create } from "zustand";
import ApiService from "@/services/api";

const initialState: ICustomerState = {
  processing: false,
  loading: false,
  fetching: false,
  error: null,
  message: null,
  customers: [],

  loanCustomers: [],
  officersCustomers: [],
  genericCustomers: [],
  customer: null,
  customer_contract: [],
  employers: [],

  statement: null,
};

const useCustomerStore = create<CustomerState>()(
  devtools((set, get) => ({
    ...initialState,

    getOfficersCustomers: async (userId) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetOfficerCustomers(userId);

        set({ officersCustomers: data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getCustomers: async (search, where) => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetCustomers(search);

        if (where === "LOAN") {
          set({ loanCustomers: data, loading: false });
        } else if (where === "GENERIC") {
          set({ genericCustomers: data, loading: false });
        } else {
          set({ customers: data, loading: false });
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
    getCustomer: async (id) => {
      set({ fetching: true, error: null, customer: null });

      try {
        if (!id) {
          return;
        }

        const apiService = new ApiService();
        const { data } = await apiService.GetCustomer(id);

        if (data.isSuccessful) {
          set({ customer: data.data, fetching: false });
        } else {
          set({ fetching: false, error: data.message });
        }
      } catch (error: any) {
        set({
          fetching: false,
          error:
            error?.response?.data?.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getCustomerContract: async (id) => {
      set({ error: null, loading: true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetLoanByCustomerId(id);

        if (data.isSuccessful) {
          set({ customer_contract: data.data, loading: false });
        } else {
          set({ loading: false, error: "Loan Contract: " + data.message });
        }
      } catch (error: any) {
        set({
          loading: false,
          error:
            "Loan Contract:  " + error?.response?.data?.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    createCustomer: async (payload) => {
      set({ processing: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.CreateCustomer(payload);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: "New customer created successfully",
          });
        } else {
          set({
            processing: false,
            error:
              data.message ||
              "Error occurred while creating new customer, please try again",
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
    updateCustomer: async (payload) => {
      set({ processing: true, error: null });

      try {
        if (payload) {
          const { getCustomer } = get();
          const apiService = new ApiService();
          const { data } = await apiService.UpdateCustomer(
            payload,
            payload.customerId
          );

          await getCustomer(payload.id!);
          set({
            customer: data,
            processing: false,
            message: data.message || " User updated succesfully",
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

    generateNubanForCustomer: async (id) => {
      set({ processing: true, error: null });

      try {
        const { getCustomer } = get();
        const apiService = new ApiService();
        const { data } = await apiService.GenerateNubanForCustomer(id);

        await getCustomer(id);
        set({
          processing: false,
          message: data.message || " NUBAN number generated successfully",
        });
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },

    getEmployers: async () => {
      set({ error: null, fetching: true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetEmployers();

        set({ employers: data, fetching: false });
      } catch (error: any) {
        set({
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
          fetching: false,
        });
      }
    },
    getAccountStatement: async (payload, accountNumber) => {
      set({ error: null, loading: true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetAccountStatement(
          payload[0].format("YYYY-MM-DD"),
          payload[1].format("YYYY-MM-DD"),
          accountNumber
        );

        set({ statement: data, loading: false });
      } catch (error: any) {
        set({
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
          loading: false,
        });
      }
    },
    getLoanAccountStatement: async (payload, accountNumber) => {
      set({ error: null, loading: true });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetLoanAccountStatement(
          payload[0].format("YYYY-MM-DD"),
          payload[1].format("YYYY-MM-DD"),
          accountNumber
        );

        set({ statement: data, loading: false });
      } catch (error: any) {
        set({
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
          loading: false,
        });
      }
    },
    createEmployer: async (payload) => {
      set({ processing: true, error: null });

      try {
        const { getEmployers } = get();
        const apiService = new ApiService();
        const { data } = await apiService.CreateEmployer(payload);

        if (data.isSuccessful) {
          await getEmployers();

          set({
            processing: false,
            message: "New employer created successfully",
          });
        } else {
          set({
            processing: false,
            message: "Unable to complete process, please try again",
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
    clearCustomer: () => {
      set({ customer: null });
    },
    clearField: (key) => {
      set({ [key]: null || [] || "" });
    },
  }))
);

export default useCustomerStore;
