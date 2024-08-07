import { IEmployer } from "@interfaces/iCustomer";
import {
  ILoan,
  ILoanState,
  ILoanDecisionPayload,
  IApprovalTerms,
  ILoanBook,
  ILoanCollectionPayload,
  ILoanProductPayload,
  ILoanExtended,
} from "@/interfaces/iLoan";

export type LoanActions = {
  getCustomersLoanEligility: (search: string) => Promise<void>;
  getWorkflow: (userId: number) => Promise<void>;
  getWorkflowByStatus: (userId: string) => Promise<void>;

  createLoan: (paload: Partial<ILoan>) => Promise<void>;
  createLoanProduct: (paload: Partial<ILoanProductPayload>) => Promise<void>;
  updateLoanProduct: (
    paload: Partial<ILoanProductPayload>,
    id: number
  ) => Promise<void>;
  updateLoan: (paload: Partial<ILoan>, loanId: number) => Promise<void>;
  loanDecision: (id: Partial<ILoanDecisionPayload>) => Promise<void>;
  bookLoan: (
    payload: Partial<ILoanBook & ILoanDecisionPayload>
  ) => Promise<void>;
  setLoanInfo: (payload: ILoanExtended) => Promise<void>;

  getLoanProducts: () => Promise<void>;
  setLoanProduct: (payload: ILoanProduct) => Promise<void>;
  getLoanById: (loanId: string | number) => Promise<void>;
  getActiveCustomerLoans: (loanId: string | number) => Promise<void>;

  getLoanCollection: (loanAccount: string) => Promise<void>;
  loanCollection: (payload: ILoanCollectionPayload) => Promise<void>;
  loanLiquidate: (payload: ILoanCollectionPayload) => Promise<void>;

  clearErrorAndMessage: () => void;
  clearField: (key: keyof ILoanState) => void;
  saveApprovalTerms: (
    payload: Partial<IApprovalTerms & ILoanDecisionPayload>
  ) => Promise<void>;
};

export type LoanState = ILoanState & LoanActions;
