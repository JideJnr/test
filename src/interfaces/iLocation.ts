import { IUser } from "@/interfaces/iUserManagement";
export interface ILocation {
  id: number;
  name: string;
  supervisor_user_id: number;

  createDate?: Date;
  lastUpdateDate?: Date;
  activeStatus?: string;
}

export interface ILocationState {
  processing: boolean;
  loading: boolean;
  loadingHistory: boolean;
  error: string | null;
  message: string | null;
  locations: ILocation[];
  officers: AccountOfficer[];
  history: ISupervisorHistory[];
}

export type AccountOfficer = IUser & {
  accountOfficerId: number;
};

export interface ISupervisorHistory {
  id: number;
  location: ILocation;
  supervisor_user_id: number;
  createDate: Date;
}
