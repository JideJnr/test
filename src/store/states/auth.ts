import { message } from "antd";
import { devtools } from "zustand/middleware";
import { create } from "zustand";
import { IAuthState } from "@/interfaces/iAuth";
import ApiService from "@/services/api";
import MemoryService from "@/shared/utils/memory";
import { AuthActions } from "@/types/auth";

const initialState: IAuthState = {
  password: "",
  email: "",
  verificationCode: "",
  message: "",
  authLoading: false,
  error: null,
  isAuthenticated: !!MemoryService.decryptAndGet("user_token"),
  user: MemoryService.decryptAndGet("authenticated_user"),
  impersonated_user: MemoryService.decryptAndGet(
    "authenticated_impersonated_user"
  ),
};

type AuthState = IAuthState & AuthActions;

const useAuthStore = create<AuthState>()(
  devtools((set, get) => ({
    ...initialState,

    login: async () => {
      set({ authLoading: true, error: null });

      try {
        const { email, password } = get();
        const apiService = new ApiService();
        const response = await apiService.Login({
          username: email,
          password,
        });

        const { jwt, user } = response.data;

        if (user.active) {
          MemoryService.encryptAndSave(jwt, "user_token");
          MemoryService.encryptAndSave(user, "authenticated_user");

          set({
            user: user,
            error: null,
            authLoading: false,
            isAuthenticated: true,
            email: "",
            password: "",
          });
        } else {
          set({
            error: "Account deactivated contact administration for support",
            authLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error: any) {
        set({
          error: "Login failed: please check your credentials and try again",
          authLoading: false,
          isAuthenticated: false,
        });
      }
    },
    logout: () => {
      MemoryService.clear();
      set({ ...initialState, isAuthenticated: false });
    },
    stopImpersonation: () => {
      set({
        impersonated_user: null,
      });
      MemoryService.remove("authenticated_impersonated_user", true);
      MemoryService.remove("impersonated_user_token", true);
    },
    setAuthValue: (key, value) => {
      set((state) => ({ ...state, [key]: value }));
    },
    changePassword: async () => {
      set({ authLoading: true, error: null });

      try {
        const { email, password, verificationCode } = get();
        const apiService = new ApiService();
        const { data } = await apiService.ChangePassword({
          email,
          password,
          verificationCode,
        });

        if (data.isSuccessful) {
          set({
            authLoading: false,
            message: data.status || "Password changed successfully",
            email: "",
            password: "",
            verificationCode: "",
          });
        } else {
          set({
            authLoading: false,
            error:
              data.status || "Unable to change password, please try again!",
          });
        }
      } catch (error: any) {
        set({
          authLoading: false,
          error:
            error.response.data.error ||
            "Unable to complete request, please try again",
        });
      }
    },
    forgetPassword: async () => {
      set({ authLoading: true, error: null, message: null });

      try {
        const { email } = get();
        const apiService = new ApiService();
        const { data } = await apiService.ForgetPassword({ email });

        if (data.isSuccessful) {
          set({
            authLoading: false,
            message: data.status,
          });
        } else {
          set({
            authLoading: false,
            error: data.status,
          });
        }
      } catch (error: any) {
        set({
          authLoading: false,
          error:
            error.response.data.error ||
            "Unable to complete request, please try again",
        });
      }
    },
    impersonateUser: async (userId) => {
      set({ authLoading: true, error: null, message: null });

      try {
        const apiService = new ApiService();
        const { data } = await apiService.Impersonate(userId);

        if (data.isSuccessful) {
          set({
            authLoading: false,
            impersonated_user: data.data.user,
          });

          MemoryService.encryptAndSave(
            data.data.jwt,
            "impersonated_user_token"
          );
          MemoryService.encryptAndSave(
            data.data.user,
            "authenticated_impersonated_user"
          );

          message.success(data.message);
        } else {
          set({
            authLoading: false,
          });
          message.error(data.message || "Unable to impersonate user");
        }
      } catch (error: any) {
        set({
          authLoading: false,
        });
        message.error(
          error.response.data.error ||
            "Unable to complete request, please try again"
        );
      }
    },
  }))
);

export default useAuthStore;
