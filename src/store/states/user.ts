import { devtools } from "zustand/middleware";
import { create } from "zustand";
import {
  IUserFormPayload,
  IUserManagementState,
} from "@/interfaces/iUserManagement";
import ApiService from "@/services/api";
import { UserState } from "@/types/user";

const initialState: IUserManagementState = {
  processing: false,
  fetchingAll: false,
  fetchingOne: false,
  error: null,
  message: null,
  users: [],
  levelUsers: [],
  user: null,
};

const useUserStore = create<UserState>()(
  devtools((set, get) => ({
    ...initialState,

    getUsers: async () => {
      set({ fetchingAll: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetUsers();

        set({ users: data || [], fetchingAll: false });
      } catch (error: any) {
        set({
          fetchingAll: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    getUser: async (id) => {
      set({ fetchingOne: true, error: null, user: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetUser(id);

        set({ user: data, fetchingOne: false });
      } catch (error: any) {
        set({
          fetchingOne: false,
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    upsertUser: async (payload) => {
      set({ processing: true, error: null });

      try {
        const { getUsers } = get();
        const apiService = new ApiService();

        if (payload) {
          if (payload.id) {
            const { data } = await apiService.UpdateUser(payload);

            set({
              user: data,
              processing: false,
              message: data.message || " User updated succesfully",
            });
          } else {
            const newPayload: IUserFormPayload = {
              email: payload.email,
              firstName: payload.firstName,
              lastName: payload.lastName,
              phone: payload.phone,
            };

            await apiService.CreateUser(newPayload);
            await getUsers();
            set({
              user: null,
              processing: false,
              message: "New system user created successfully",
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
    assignRole: async (roleType, userId) => {
      set({ processing: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.AssignUserRole({
          roleType,
          userId,
        });

        if (data.isSuccessful) {
          set({
            processing: false,
            message: `Role assigned to the user successfully.`,
          });
        } else {
          set({
            processing: false,
            error: data.message || `Unable to assign role to the user`,
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
    assignLocation: async (payload) => {
      set({ processing: true, error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.AssignUserLocation(payload);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: "User location updated successfully",
          });
        } else {
          set({
            processing: false,
            error: data.message || "Unable to update user location",
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
    getUsersByRole: async (role) => {
      set({ error: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.GetUsersByRole(role);

        set({ levelUsers: data || [] });
      } catch (error: any) {
        set({
          error:
            error.response.data.error ||
            "Unable to complete process, please try again",
        });
      }
    },
    changeUserStatus: async (user, status) => {
      set({ processing: true, error: null, message: null });

      try {
        const { getUser } = get();
        const apiService = new ApiService();
        const { data } = await apiService.ChangeUserStatus(user, status);

        if (data.isSuccessful) {
          set({
            processing: false,
            message: data.status,
          });

          await getUser(user.toString());
        } else {
          set({
            processing: false,
            error: data.status,
          });
        }
      } catch (error: any) {
        set({
          processing: false,
          error:
            error.response.data.error ||
            "Unable to complete request, please try again",
        });
      }
    },
    clearErrorAndMessage: () => {
      set({ error: null, message: null, processing: false });
    },
  }))
);

export default useUserStore;
