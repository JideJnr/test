import { message } from "antd";
import {
  IAccountingPeriodClosePayload,
  IAccountingPeriodOpenPayload,
  IFixedAssetMappingPayload,
  IFixedAssetPayload,
} from "./../interfaces/iPosting";
import {
  IAccountCreationPayload,
  ICategory,
  IChartPayload,
  IDepositProductPayload,
  IEntryPosting,
  IFixedDepositPayload,
  IJournalPostingPayload,
  IJournalQueryPayload,
  IQuery,
  ITransactionMapping,
} from "@/interfaces/iPosting";
import {
  IApprovalTerms,
  ILoanBook,
  ILoanDecisionPayload,
  ILoan,
  ILoanCollectionPayload,
  ILoanProductPayload,
} from "@/interfaces/iLoan";
import { ILocation } from "@/interfaces/iLocation";
import { IChangeOfficer, ICustomer, IEmployer } from "@/interfaces/iCustomer";
import { IModuleFormPayload } from "@/interfaces/iModules";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosProgressEvent,
  AxiosResponse,
} from "axios";
import {
  IChangePasswordPayload,
  IForgetPasswordPayload,
  ILoginPayload,
} from "@/interfaces/iAuth";
import { IUserFormPayload } from "@/interfaces/iUserManagement";
import MemoryService from "@/shared/utils/memory";
import AuthStore from "@/store/states/auth";
import { handleHttpError } from "@/shared/utils/role";
import { IPaginationRequest } from "@/interfaces";

const API_URL = "/api";

export default class ApiService {
  private axiosInstance: AxiosInstance;
  token: string =
    MemoryService.decryptAndGet("impersonated_user_token") ||
    MemoryService.decryptAndGet("user_token");

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (!this.token) {
          this.token =
            MemoryService.decryptAndGet("impersonated_user_token") ||
            MemoryService.decryptAndGet("user_token");

          config.headers.Authorization = `Bearer ${this.token}`;
          config.timeout = 1000000;
          config.timeoutErrorMessage = "Request timed out";
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const { message: msg, status } = handleHttpError(error);

        if (status === 401 || status === 504) {
          if (status === 504) {
            message.error("Session expired, please login again");
          } else {
            message.error("Unauthorized, please login again");
          }

          AuthStore.getState().logout();
        }

        const newAxiosError: AxiosError = {
          ...error,
          message: msg,
          response: {
            ...error.response,
            data: {
              ...error.response?.data,
              message: msg,
              error: msg,
            },
          },
        };

        return Promise.reject(newAxiosError);
      }
    );
  }

  Login(payload: ILoginPayload): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/auth/login`, payload);
  }

  ForgetPassword(payload: IForgetPasswordPayload): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/auth/reset-password/request`, payload);
  }

  ChangePassword(payload: IChangePasswordPayload): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/auth/reset-password`, payload);
  }

  GetUsers(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/user-management/users`);
  }

  GetUsersByRole(roleType: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/user-management/users/role/${roleType}`);
  }

  GetUser(id: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/user-management/users/${id}`);
  }

  CreateUser(payload: IUserFormPayload): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/user-management/user`, payload);
  }

  ChangeUserStatus(user: number, status: boolean): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/user-management/user/active-status`, {
      userId: user,
      isActive: status,
    });
  }

  AssignUserModule(payload: any): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/user-management/users/assign-module`,
      payload
    );
  }

  Impersonate(targetUserId: number | string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/assume-user-management/assume-user/${targetUserId}`
    );
  }

  RemoveUserModule(payload: any): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/user-management/users/remove-module`,
      payload
    );
  }

  AssignUserRole(payload: any): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/user-management/users/assign-role`,
      payload
    );
  }

  RemoveUserRole(payload: any): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/user-management/users/remove-role`,
      payload
    );
  }

  AssignUserLocation(payload: any): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/account-officer-management/account-officer`,
      payload
    );
  }

  RemoveUserLocation(payload: any): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/user-management/users/remove-location`,
      payload
    );
  }

  GetAccountStatement(
    startDate: Date | string,
    endDate: Date | string,
    accountNumber: string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/deposit-transaction-management/transactions/date-range/${accountNumber}`,
      {
        endDate,
        startDate,
      }
    );
  }

  GetLoanAccountStatement(
    startDate: Date | string,
    endDate: Date | string,
    accountNumber: string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/loan-transaction-management/transactions/date-range/${accountNumber}`,
      {
        endDate,
        startDate,
      }
    );
  }

  GetGLAccountStatement(
    startDate: Date | string,
    endDate: Date | string,
    glCode: number
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/gl-management/statement/${glCode}`, {
      endDate,
      startDate,
    });
  }

  GetDepositBalanceReport(
    dateValue: Date | string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/report-management/deposit-balances`, {
      dateValue,
    });
  }

  GetBatchUploadsReport(
    pagination: IPaginationRequest = {
      pageNumber: 0,
      recordsPerPage: 10,
    }
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/report-management/batch/upload-history?recordsPerPage=${pagination.recordsPerPage}&pageNumber=${pagination.pageNumber}`
    );
  }

  GetBatchFailureUploadsReport(
    id: string,
    type: string,
    pagination: IPaginationRequest = {
      pageNumber: 0,
      recordsPerPage: 10,
    }
  ): Promise<AxiosResponse<any>> {
    let url: string = `/report-management/batch/failed-deposit-entries/${id}?recordsPerPage=${pagination.recordsPerPage}&pageNumber=${pagination.pageNumber}`;

    if (type === "JOURNAL") {
      url = `/report-management/batch/failed-journal-entries/${id}?recordsPerPage=${pagination.recordsPerPage}&pageNumber=${pagination.pageNumber}`;
    }

    return this.axiosInstance.get(url);
  }

  CommitBatchUpload(id: string, type: string): Promise<AxiosResponse<any>> {
    if (type === "JOURNAL") {
      return this.axiosInstance.get(
        `/gl-management/double-entry/batch-commit/${id}`
      );
    }

    return this.axiosInstance.get(
      `/gl-management/deposit-entry/batch-commit/${id}`
    );
  }

  GetProfitAndLossReport(
    start: Date | string,
    end: Date | string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/gl-management/profit-and-loss`, {
      startDate: start,
      endDate: end,
    });
  }

  GetAmotizationReport(
    start: Date | string,
    end: Date | string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/gl-management/amortization-schedule`, {
      startDate: start,
      endDate: end,
    });
  }

  GetGlCallOverReport(dateValue: Date | string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/report-management/call-over`, {
      dateValue,
    });
  }

  GetDepositCallOverReport(
    dateValue: Date | string,
    pagination: IPaginationRequest = {
      pageNumber: 0,
      recordsPerPage: 10,
    }
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/report-management/call-over-deposit?recordsPerPage=${pagination.recordsPerPage}&pageNumber=${pagination.pageNumber}`,
      {
        dateValue,
      }
    );
  }

  GetTransactionCallOverReport(
    transactionId: string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/report-management/call-over/${transactionId}`
    );
  }

  GetLoanTATReport(
    startDate: Date | string,
    endDate: Date | string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/report-management/loan-tat`, {
      startDate,
      endDate,
    });
  }

  GetLoanLiquidationReport(
    dateValue: Date | string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/report-management/liquidated-loans`, {
      dateValue,
    });
  }

  GetFixedDepositReport(dateValue: Date | string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/report-management/tenored-deposits`, {
      dateValue,
    });
  }

  GetAccountOfficerPerformanceReport(
    payload: Record<string, Date | string>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/report-management/account-officer-performance`,
      payload
    );
  }

  OpenAccountingPeriod(
    payload: IAccountingPeriodOpenPayload
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/subaccount-management/accounting-period/open`,
      payload
    );
  }

  CloseAccountingPeriod(
    payload: IAccountingPeriodClosePayload
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/subaccount-management/accounting-period/close`,
      payload
    );
  }

  GetAccountingPeriods(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/subaccount-management/accounting-periods`);
  }

  GetAccountingPeriod(id: number): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/subaccount-management/accounting-period/${id}`
    );
  }

  DeleteAccountingPeriod(id: number): Promise<AxiosResponse<any>> {
    return this.axiosInstance.delete(
      `/subaccount-management/accounting-period/${id}`
    );
  }

  GetLoanPortfolio(
    payload?: Record<string, Date | string>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/report-management/loan-classification`,
      payload
    );
  }

  GetBranchLoanProductPerformance(
    payload: Record<string, Date | string>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/report-management/branch-loan-product-performance`,
      payload
    );
  }

  GetBranchLoanPerformance(
    payload: Record<string, Date | string>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/report-management/branch-loan-performance`,
      payload
    );
  }

  GetFailedDeductionReport(
    dateValue: Date | string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/report-management/batch-upload-report`, {
      dateValue,
    });
  }

  GetDailyDisbursementReport(
    dateValue: Date | string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/report-management/daily-disbursement`, {
      dateValue,
    });
  }

  GenerateTrialBalance(dateValue: Date | string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/gl-management/trial-balance`,
      {
        dateValue,
      },
      {
        timeout: 1000000,
        timeoutErrorMessage: "Request timed out",
      }
    );
  }

  RunEOM(dateValue: Date | string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/gl-management/eom`, {
      dateValue,
    });
  }

  LoanCollection(payload: ILoanCollectionPayload): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/loan-transaction-management/transactions/loan-collection`,
      payload
    );
  }

  LoanLiquidation(
    payload: ILoanCollectionPayload
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/loan-transaction-management/transactions/loan-liquidation`,
      payload
    );
  }

  GetLoanCollectionSchedule(
    loanAccountNumber: string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/loan-transaction-management/transactions/repayment-schedule/${loanAccountNumber}`
    );
  }

  UpdateUser(payload: IUserFormPayload): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(`/user-management/user`, payload);
  }

  GetModules(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/module-management/modules`);
  }

  GetModule(id: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/module-management/modules/${id}`);
  }

  CreateModule(payload: IModuleFormPayload): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`module-management/modules`, payload);
  }

  UpdateModule(payload: IModuleFormPayload): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(`module-management/modules`, payload);
  }

  GetCustomers(search?: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/customer-management/customers`, {
      searchString: search,
    });
  }

  GetOfficerCustomers(userId: number): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/customer-management/customers/account-officer/${userId}`
    );
  }

  GetCustomersLoanEligibility(search?: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/customer-management/customers/loan-eligibility`,
      {
        searchString: search,
      }
    );
  }

  GetCustomer(id: number): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/customer-management/customer/${id}`);
  }

  CreateCustomer(payload: Partial<ICustomer>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/customer-management/customer`, payload);
  }

  UpdateCustomer(
    payload: Partial<ICustomer>,
    customerId: number | string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(
      `/customer-management/customer/${customerId}`,
      payload
    );
  }

  GenerateNubanForCustomer(id: number): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/customer-management/customer/instant-nuban/${id}`
    );
  }

  GetLocations(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/location-management/locations`);
  }

  GetLocationOfficers(
    locationId: string | number
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/account-officer-management/account-officers/get/${locationId}`
    );
  }

  CreateLocation(payload: ILocation): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/location-management/location`, payload);
  }

  UpdateLocation(payload: ILocation): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(`/location-management/location`, payload);
  }

  ChangeAccountOfficer(payload: IChangeOfficer): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(
      `/customer-management/customer/${payload.customerId}/new-account-officer-id/${payload.officerId}`,
      {}
    );
  }

  GetLocationHistory(locationId: number): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/location-supervisor-history/${locationId}`);
  }

  GetEmployers(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/employer-management/employers`);
  }

  CreateEmployer(payload: Partial<IEmployer>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/employer-management/employer`, payload);
  }

  GetWorkflow(userId: number): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/workflow-management/workflows/user/${userId}`
    );
  }

  GetWorkflowByStatus(applicationStatus: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/workflow-management/workflows/status/${applicationStatus}`
    );
  }

  GetLoanProducts(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/loan-product-management/loan-products`);
  }

  CreateLoanProduct(
    payload: Partial<ILoanProductPayload>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/loan-product-management/loan-product`,
      payload
    );
  }

  GetFixedDepositByAccountNumber(
    accountNumber: string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/tenored-deposits-management/deposit/${accountNumber}`
    );
  }

  GetFixedAssets(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/fixed-asset-management/getall`);
  }

  TerminateFixedAsset(assetId: string | number): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/fixed-asset-management/terminate/${assetId}`
    );
  }

  TerminateFixedDeposit(
    accountNumber: string,
    teller: number
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/tenored-deposits-management/deposits/terminate/${accountNumber}/${teller}`
    );
  }

  BookFixedDeposit(
    payload: Partial<IFixedDepositPayload>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/tenored-deposits-management/deposit`,
      payload
    );
  }

  BookFixedAsset(
    payload: Partial<IFixedAssetPayload>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/fixed-asset-management/create`, payload);
  }

  CreateDepositAccount(
    payload: Partial<IAccountCreationPayload>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/non-tenored-deposits-management/deposit`,
      payload
    );
  }

  GetDepositProducts(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/deposit-product-management/products`);
  }

  CreateDepositProduct(
    payload: Partial<IDepositProductPayload>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/deposit-product-management/product`,
      payload
    );
  }

  UpdateDepositProduct(
    payload: Partial<IDepositProductPayload>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(
      `/deposit-product-management/product`,
      payload
    );
  }

  UpdateLoanProduct(
    payload: Partial<ILoanProductPayload>,
    loanProductId: number
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(
      `/loan-product-management/loan-product/${loanProductId}`,
      payload
    );
  }

  LoanDecision(
    payload: Partial<ILoanDecisionPayload>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/workflow-management/workflow`, payload);
  }

  LoanApprovalTerms(
    payload: Partial<ILoanDecisionPayload & IApprovalTerms>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/loan-application-management/loan-application/approval-workflow`,
      payload
    );
  }

  LoanBooking(
    payload: Partial<ILoanDecisionPayload & ILoanBook>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/loan-application-management/loan-application/booking-workflow`,
      payload
    );
  }

  CreateLoan(payload: Partial<ILoan>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/loan-application-management/loan-application`,
      payload
    );
  }

  UpdateLoan(
    payload: Partial<ILoan>,
    loanId: number
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(
      `/loan-application-management/loan-application/${loanId}`,
      payload
    );
  }

  GetLoan(loanId: number | string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/loan-application-management/loan-application/${loanId}`
    );
  }

  GetLoanByCustomerId(
    customerId: number | string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/loan-application-management/loan-application/customer/${customerId}`
    );
  }

  GetCustomerActiveLoans(
    customerId: number | string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/loan-transaction-management/transactions/active-loans/${customerId}`
    );
  }

  GetLoanPaymentSchedule(
    loanAccountNumber: string
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `loan-application-management/repayment-schedule/${loanAccountNumber}`
    );
  }

  CreateEntryPosting(
    payload: Partial<IEntryPosting>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/deposit-transaction-management/transaction`,
      payload
    );
  }

  GetAllTransactonMappings(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/subaccount-management/subaccount/mapping/get-all`
    );
  }

  GetAllFixedAssetMappings(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/fixed-asset-management/map`);
  }

  GetTransactonMapping(transactionType: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/subaccount-management/subaccount/mapping/transaction-type/${transactionType}`
    );
  }

  GetJournalPostings(payload: Partial<IQuery>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/gl-transaction-management/transactions`, {
      params: payload,
    });
  }

  GetGLs(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/gl-management/chart-of-accounts`);
  }

  GetCategories(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/category-management/categories`);
  }

  GetSubCategories(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/subcategory-management/get`);
  }

  GetAccounts(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/account-management/get`);
  }

  GetSubAccounts(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/subaccount-management/get`);
  }

  GetJournalPostingByAccount(
    payload: Partial<IJournalQueryPayload>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/gl-transaction-management/transactions/${payload.accountNumber}`,
      {
        params: payload,
      }
    );
  }

  CreateJournalPosting(
    payload: Partial<IJournalPostingPayload>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/gl-management/double-entry`, payload);
  }

  CreateAmotizationPosting(
    payload: Partial<IJournalPostingPayload>,
    numberOfAmortizationInMonths: number
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/gl-management/amortization/${numberOfAmortizationInMonths}`,
      payload
    );
  }

  BatchDisbursementPosting(
    payload: string,
    tellerId: number
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/deposit-transaction-management/transactions/batch-disbursement-withdrawal/${tellerId}`,
      {
        dateValue: payload,
      }
    );
  }

  CreateTransactionMapping(
    payload: Partial<ITransactionMapping>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/subaccount-management/subaccount/mapping/add`,
      payload
    );
  }

  CreateFixedAssetMapping(
    payload: IFixedAssetMappingPayload
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/fixed-asset-management/map`, payload);
  }

  RemoveTransactionMapping(id: number): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(
      `/subaccount-management/subaccount/mapping/remove/${id}`
    );
  }

  RemoveFixedAssetMapping(id: number): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/fixed-asset-management/map/${id}`);
  }

  CreateCategory(payload: Partial<ICategory>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(
      `/category-management/category/${payload.name}/${payload.balanceType}`,
      {}
    );
  }

  CreateSubCategory(
    payload: Partial<IChartPayload>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/subcategory-management/create`, payload);
  }

  CreateAccount(payload: Partial<IChartPayload>): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/account-management/create`, payload);
  }

  CreateSubAccount(
    payload: Partial<IChartPayload>
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/subaccount-management/create`, payload);
  }

  UpdateCategory(
    payload: Partial<ICategory>,
    id: number
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(
      `/category-management/category/${id}`,
      payload
    );
  }

  UpdateSubCategory(
    payload: Partial<IChartPayload>,
    id: number
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(
      `/subcategory-management/update/${id}`,
      payload
    );
  }

  UpdateAccount(
    payload: Partial<IChartPayload>,
    id: number
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(`/account-management/update/${id}`, payload);
  }

  UpdateSubAccount(
    payload: Partial<IChartPayload>,
    id: number
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.put(
      `/subaccount-management/update/${id}`,
      payload
    );
  }

  FileUpload(
    formData: FormData,
    onUploadProgress?: (event: AxiosProgressEvent) => void
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post(`/file-management/files`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onDownloadProgress: onUploadProgress,
    });
  }

  GetHeaders(): { [key: string]: string } {
    const token = MemoryService.decryptAndGet("user_token");

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  BatchTellerPosting(formData: FormData): Promise<any> {
    const token = MemoryService.decryptAndGet("user_token");

    return fetch(`${API_URL}/gl-management/deposit-entry/batch-upload`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  BatchJournalPosting(formData: FormData): Promise<any> {
    const token = MemoryService.decryptAndGet("user_token");

    return fetch(`${API_URL}/gl-management/double-entry/batch-upload`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  FileUploadUniRest(formData: FormData): Promise<any> {
    const token = MemoryService.decryptAndGet("user_token");

    return fetch(`${API_URL}/file-management/files`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  AddFileToLoan(formData: FormData): Promise<any> {
    const token = MemoryService.decryptAndGet("user_token");

    return fetch(
      `${API_URL}/loan-application-management/loan-application/add-file`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  RemoveFile(file: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.delete(`/file-management/files/${file}`);
  }

  GetFileUrl(file: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/file-management/files/${file}`);
  }
}
