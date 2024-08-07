import { ILoanExtended } from "@/interfaces/iLoan";
import { Gender, MaritalStatus } from "@/types/customer.d";
import { Dayjs } from "dayjs";

export interface ICustomer {
  id: number;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  educationLevel: string;
  birthDate: Date | Dayjs;
  mobile: string;
  email: string;
  fullName: string;

  homeAddress: string;
  homeAddressLGA: string;
  homeAddressState: string;

  bvnNumber: string;
  nubanNumber: string;
  identificationMeans: string;
  identificationNumber: string;
  identificationIssuedDate: Date;
  identificationExpiryDate: Date;

  nextOfKinName: string;
  nextOfKinRelationship: string;
  nextOfKinAddress: string;
  nextOfKinMobile: string;
  nextOfKinEmail: string;

  occupation?: string;
  employments?: IEmployment[];
  employerId?: string;
  employmentNumber?: string;
  dateEmployed?: Date;
  dateRetiring?: Date;
  reference?: string;
  customerId: string;
  secondaryCustomerId: string;

  files: IFiles[];
  passportPhoto: IFiles;
  active?: boolean;
  dateCreated?: Date;
  dateUpdated?: Date;
  accountOfficerId?: number;
  accountOfficer?: string;
  location?: string;
  locationId?: number;
  depositAccounts: NUBANS[];
  loanAccounts: LoanNUBANS[];
}

export interface IBasicCustomer {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  bvnNumber: string;
  dateCreated?: Date;
  passportPhoto: string;
}

export interface IChangeOfficer {
  customerId: string;
  officerId: number;
}

export interface NUBANS {
  accountNumber: string;
  depositType: string;
  dateCreated: Date;
  productName: string;
}

export interface LoanNUBANS {
  accountNumber: string;
  principal: number;
  rate: number;
  tenor: number;
  dateBooked: Date;
  productName: string;
}

export interface IFiles {
  id?: number;
  fileName: string;
  fileDescription: string;
  contentType: string;
  fileUrl?: string;
}

export interface IEmployment {
  employerId: number | string;
  employerName: string;
  employmentNumber: string;
  dateEmployed: Date;
  dateRetiring: Date;
  reference: string;
  dateCreated?: Date;
}

export interface ICustomerState {
  processing: boolean;
  loading: boolean;
  fetching: boolean;
  error: string | null;
  message: string | null;
  customers: ICustomer[];
  officersCustomers: IBasicCustomer[];
  loanCustomers: ICustomer[];
  genericCustomers: ICustomer[];
  statement: ITransactionStatement;
  customer: ICustomer | null;
  employers: IEmployer[];
  customer_contract: ICustomerContract[];
}

export interface IStatement {
  transactionAmount: number;
  transactionId?: number;
  currencyCode: string;
  drCrFlag: "DR" | "CR";
  transactionDescription: string;
  valueDate: Date;
  postingDate: Date;
  balance: number;
}

export interface ITransactionStatement {
  openingBalance: number;
  closingBalance: number;
  totalDebit: number;
  totalCredit: number;
  transactions: IStatement[];
}

export type StatementType = "DEPOSIT" | "LOAN";

export interface StatementInfo {
  name: string;
  type: StatementType;
  account: string;
  startDate: string;
  endDate: string;
}

export interface ICustomerContract extends ILoanExtended {
  [key: string]: any;
}

export interface IEmployer {
  id: number;
  name: string;
  address: string;
}
