import { ILocationState, ILocation } from "@/interfaces/iLocation";
import {
  ICustomer,
  ICustomerState,
  IChangeOfficer,
} from "@/interfaces/iCustomer";

export type LocationActions = {
  getLocations: () => Promise<void>;
  getOfficers: (locationId: string | number) => Promise<void>;
  getHistory: (id: number) => Promise<void>;
  createLocation: (payload: Partial<ILocation>) => Promise<void>;
  updateLocation: (payload: Partial<ILocation>) => Promise<void>;
  clearErrorAndMessage: () => void;
  changeOfficer: (payload: IChangeOfficer) => Promise<void>;
};

export type LocationState = ILocationState & LocationActions;
