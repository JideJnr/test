import { ILocation } from "@/interfaces/iLocation";

export interface IUserFormPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  id?: number;
}

export interface IUser extends IUserFormPayload {
  username?: string;
  staffNumber?: string;
  key?: React.Key;
  userRoles?: IUserRole[];
  role?: SystemRoles;
  location?: ILocation;
  features?: string[];
  level?: string;
  active?: boolean;
}

export type SystemRoles =
  | "ACCOUNT_OFFICER"
  | "FIRST_REVIEWER"
  | "SECOND_REVIEWER"
  | "ADMINISTRATOR"
  | "SUPER_ADMINISTRATOR"
  | "ACCEPTANCE_OPERATIONS"
  | "BOOKING_OPERATIONS"
  | "INTERNAL_CONTROL"
  | "FINANCE_OPERATIONS"
  | "USER_SUPPORT";

interface IRole {
  id: number;
  name: string;
}

interface IUserRole {
  id: number;
  role: IRole;
  user: IUser;
  dateAssigned: Date;
}

export interface IUserManagementState {
  processing: boolean;
  fetchingAll: boolean;
  fetchingOne: boolean;
  error: string | null;
  message: string | null;
  users: IUser[];
  user: IUser | null;

  levelUsers: IUser[];
}
