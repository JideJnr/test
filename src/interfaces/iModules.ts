import { IUser } from "@/interfaces/iUserManagement";
export interface IModuleFormPayload {
  id?: number;
  name?: string;
  isActive?: boolean;
}

export interface IModule extends IModuleFormPayload {
  url?: string;
  dateCreated?: Date;
  moduleUsers?: Array<{
    id: number;
    user: IUser;
    dateAssigned: Date;
  }>;
}

export interface IModuleManagementState {
  processing: boolean;
  fetchingAllModules: boolean;
  fetchingModule: boolean;
  error: string | null;
  message: string | null;
  modules: IModule[];
  module: IModule | null;
}
