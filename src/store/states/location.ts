import { LocationState } from "@/types/location.d";
import { devtools } from "zustand/middleware";
import { create } from "zustand";
import ApiService from "@/services/api";
import { ILocation, ILocationState } from "@/interfaces/iLocation";
import useCustomerStore from "./customer";

const initialState: ILocationState = {
  processing: false,
  loading: false,
  loadingHistory: false,
  error: null,
  message: null,
  locations: [],
  officers: [],
  history: [],
};

const useLocationStore = create<LocationState>()(
  devtools((set, get) => ({
    ...initialState,

    getOfficers: async (id) => {
      set({ error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetLocationOfficers(id);
        const newResponse = data.map((resp: any) => ({
          ...resp.user,
          accountOfficerId: resp.accountOfficerId,
        }));

        set({ officers: newResponse });
      } catch (error: any) {
        set({
          error: "Unable to fetch location officers",
        });
      }
    },
    getLocations: async () => {
      set({ loading: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetLocations();

        set({ locations: data, loading: false });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getHistory: async (id) => {
      set({ loadingHistory: true, error: null, history: [] });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetLocationHistory(id);

        set({ history: data, loadingHistory: false });
      } catch (error: any) {
        set({
          loadingHistory: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    createLocation: async (payload) => {
      set({ processing: true, error: null });

      try {
        const { getLocations } = get();
        const apiService = new ApiService();
        await apiService.CreateLocation(payload as ILocation);

        await getLocations();
        set({
          processing: false,
          message: "New location created successfully",
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
    updateLocation: async (payload) => {
      set({ processing: true, error: null });

      try {
        const { getLocations } = get();
        const apiService = new ApiService();

        if (payload) {
          await apiService.UpdateLocation(payload as ILocation);

          await getLocations();
          set({
            processing: false,
            message: "Location updated succesfully",
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
    changeOfficer: async (payload) => {
      set({ processing: true, error: null });

      try {
        const apiService = new ApiService();

        if (payload) {
          const { data } = await apiService.ChangeAccountOfficer(payload);

          if (data.isSuccessful) {
            set({
              processing: false,
              message: data.message || "Account officer changed successfully",
            });
            // useCustomerStore.setState({ customer: data.data }, true);
          } else {
            set({
              processing: false,
              error: data.message,
            });
          }
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
      set({
        error: null,
        message: null,
      });
    },
  }))
);

export default useLocationStore;
