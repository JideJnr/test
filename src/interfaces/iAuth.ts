import { IUser } from "@/interfaces/iUserManagement";

export interface ILoginPayload {
  username: string;
  password: string;
}

export interface IForgetPasswordPayload {
  email: string;
}

export interface IChangePasswordPayload extends IForgetPasswordPayload {
  password: string;
  verificationCode: string;
}

export interface IAuthState {
  authLoading: boolean;
  email: string;
  password: string;
  verificationCode: string;
  error: string | null;
  message: string | null;
  isAuthenticated: boolean;
  user: IUser | null;
  impersonated_user: IUser | null;
}
