import { SystemRole } from "@/shared/utils/constants";
import { IUserFormPayload, SystemRoles } from "@/interfaces/iUserManagement";
import { message } from "antd";
import { IUser, IUserManagementState } from "@/interfaces/iUserManagement";

interface extendedUser extends IUser {
  error: string;
  message: string;
}

export type UserManagementActions = {
  getUsers: () => Promise<void>;
  getUser: (id: string) => Promise<void>;
  upsertUser: (payload: IUserFormPayload) => Promise<void>;
  clearErrorAndMessage: () => void;
  assignRole: (roleType: SystemRoles, userId: string | number) => Promise<void>;
  assignLocation: (payload: any) => Promise<void>;
  getUsersByRole: (role: SystemRole) => Promise<void>;
  changeUserStatus: (user: number, status: boolean) => Promise<void>;
};

export type UserState = IUserManagementState & UserManagementActions;
