import { ButtonType, ButtonSize, ButtonShape } from "@/types/button";

export interface IButton {
  title: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: (prop: React.MouseEvent<HTMLButtonElement>) => void;
  forForm?: boolean;
  className?: string;
  type?: ButtonType;
  size?: ButtonSize;
  shape?: ButtonShape;
  block?: boolean;
  spinnerClass?: string;
}
