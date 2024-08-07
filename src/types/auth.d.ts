import { IAuthState } from "@/interfaces/iAuth";

export type AuthActions = {
  login: () => Promise<void>;
  logout: () => void;
  forgetPassword: () => Promise<void>;
  changePassword: () => Promise<void>;
  impersonateUser: (userId: number | string) => Promise<void>;
  stopImpersonation: () => void;
  setAuthValue: <T extends keyof IAuthState>(
    key: T,
    value: IAuthState[T]
  ) => void;
};
