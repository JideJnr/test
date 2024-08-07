import { ICustomer } from "@/interfaces/iCustomer";

type Who = "NOK" | "Director";

export interface StepPropType {
  who: Who;
  next: () => void;
  previous: () => void;
  setFormData: (data: ILoan) => void;
  data?: Partial<ICustomer>;
  isEdit?: boolean;
}
