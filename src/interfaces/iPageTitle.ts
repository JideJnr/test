import { IButton } from "@/interfaces/iButton";

export interface IPageTitle {
  title: React.ReactNode;
  subTitle?: string;
  showAdd: boolean;
  showSearch: boolean;
  onAddClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSearch?: (value: string) => void;
  onBackClick?: () => void;
  searchPlaceholder?: string;
  buttonAddConfig?: IButton;
  isModal?: boolean;
  showBackButton?: boolean;
  backButtonRoute?: string;
  className?: string;
}
