import dayjs from "dayjs";
import { IEmployer } from "@/interfaces/iCustomer";
import { ICustomer, ICustomerState } from "@/interfaces/iCustomer";

export type CustomerActions = {
  getCustomers: (search?: string, where?: Where) => Promise<void>;
  getOfficersCustomers: (userId: number) => Promise<void>;
  getCustomer: (id: number) => Promise<void>;
  getCustomerContract: (id: number) => Promise<void>;
  createCustomer: (data: Partial<ICustomer>) => Promise<void>;
  updateCustomer: (data: Partial<ICustomer>) => Promise<void>;
  generateNubanForCustomer: (id: number) => Promise<void>;
  getEmployers: () => Promise<void>;
  getAccountStatement: (
    payload: [dayjs.Dayjs, dayjs.Dayjs],
    accountNumber: string
  ) => Promise<void>;
  getLoanAccountStatement: (
    payload: [dayjs.Dayjs, dayjs.Dayjs],
    accountNumber: string
  ) => Promise<void>;
  clearErrorAndMessage: () => void;
  clearCustomer: () => void;
  createEmployer: (payload: Partial<IEmployer>) => Promise<void>;
  clearField: (key: keyof ICustomerState) => void;
};

type Where = "NORMAL" | "LOAN" | "GENERIC";

export type Gender = "MALE" | "FEMALE" | "CORPORATE";

export type MaritalStatus =
  | "SINGLE"
  | "MARRIED"
  | "DIVORCED"
  | "WIDOWED"
  | "SOLE_PROPRIETORSHIP"
  | "PARTNERSHIP"
  | "LIMITED_LIABILITY_COMPANY";

export type CustomerState = ICustomerState & CustomerActions;
