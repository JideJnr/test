import {
  IModule,
  IModuleFormPayload,
  IModuleManagementState,
} from "@/interfaces/iModules";
import { create } from "zustand";
import ApiService from "@/services/api";
import { ModuleManagementActions } from "@/types/module";
import { devtools } from "zustand/middleware";

const initialState: IModuleManagementState = {
  modules: [],
  module: <IModule>{},
  message: "",
  error: "",
  fetchingAllModules: false,
  fetchingModule: false,
  processing: false,
};

type ModuleState = IModuleManagementState & ModuleManagementActions;

const useModuleStore = create<ModuleState>()(
  devtools((set, get) => ({
    ...initialState,

    getModule: async (id) => {
      set({ fetchingModule: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetModule(id);

        set({ module: data, fetchingModule: false });
      } catch (error: any) {
        set({
          fetchingModule: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getModules: async () => {
      set({ fetchingAllModules: true, error: null, message: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetModules();

        set({ modules: data, fetchingAllModules: false });
      } catch (error: any) {
        set({
          fetchingAllModules: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    upsertModule: async () => {
      set({ processing: true, error: null });

      try {
        const { module } = get();
        const apiService = new ApiService();

        if (module) {
          if (module?.id) {
            const { data } = await apiService.UpdateModule(module);

            set({
              module: data.module,
              processing: false,
              message: data.message || " module updated succesfully",
            });
          } else {
            const payload: IModuleFormPayload = {
              name: module.name,
              isActive: true,
            };
            const { data } = await apiService.CreateModule(payload);

            set({
              module: data,
              processing: false,
              message: "System module created successfully",
            });
          }
        } else {
          set({
            processing: false,
            error: "Please fill the required fields",
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
    setModuleValue: (key, value) => {
      const { module } = get();

      set({
        module: {
          ...module,
          [key]: value,
        },
      });
    },
  }))
);

export default useModuleStore;
