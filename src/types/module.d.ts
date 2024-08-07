import { IModule } from "@/interfaces/iModules";
import { message } from "antd";

interface extendedIModule extends IModule {
  error: string;
  message: string;
}

export type ModuleManagementActions = {
  getModules: () => Promise<void>;
  getModule: (id: string) => Promise<void>;
  upsertModule: () => Promise<void>;
  setModuleValue: <T extends keyof extendedIModule>(
    key: T,
    value: extendedIModule[T]
  ) => void;
};
