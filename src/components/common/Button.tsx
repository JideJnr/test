import React from "react";
import { IButton } from "@/interfaces/iButton";
import { CgSpinnerTwo } from "react-icons/cg";
import { ButtonShape, ButtonSize, ButtonType } from "@/types/button";

function getType(type?: ButtonType): string {
  switch (type) {
    case "primary":
      return "bg-blue-700 hover:bg-blue-600 text-white";

    case "success":
      return "bg-green-700 hover:bg-green-600 text-white";

    case "warning":
      return "bg-orange-700 hover:bg-orange-600 text-white";

    case "danger":
      return "bg-red-600 hover:bg-red-700 text-white";

    case "primary-outline":
      return "border border-blue-700 hover:bg-blue-700 text-blue-700 hover:text-white";

    case "success-outline":
      return "border border-green-700 hover:bg-green-700 text-green-700 hover:text-white";

    case "warning-outline":
      return "border border-orange-700 hover:bg-orange-700 text-orange-700 hover:text-white";

    case "danger-outline":
      return "border border-red-700 hover:bg-red-700 text-red-700 hover:text-white";

    case "outline":
      return "border border-gray-700 hover:bg-gray-700 text-gray-700 hover:text-white";

    default:
      return "bg-gray-700 hover:bg-gray-600 text-white";
  }
}

function getSize(size?: ButtonSize): string {
  switch (size) {
    case "large":
      return "py-3 px-5 text-sm min-w-[150px] w-fit h-14";

    case "medium":
      return "py-2 px-4 text-sm min-w-[100px] w-fit h-12";

    case "xsmall":
      return "py-0.5 px-1.5 text-xs w-fit h-6";

    default:
      return "px-3 py-1 text-sm min-w-[50px] w-fit h-10";
  }
}

function getIconSize(size?: ButtonSize): string {
  switch (size) {
    case "large":
      return "text-xl";

    case "medium":
      return "text-lg";

    default:
      return "text-base";
  }
}

function getShape(shape?: ButtonShape): string {
  switch (shape) {
    case "rounded":
      return "rounded-full";

    case "flat":
      return "rounded-0";

    default:
      return "rounded-md";
  }
}

const Button: React.FC<IButton> = ({
  title,
  forForm,
  className,
  type,
  size,
  shape,
  disabled,
  onClick,
  isLoading,
  block,
  spinnerClass,
}) => {
  return (
    <button
      className={`${getSize(size)} ${getShape(shape)} ${getType(type)} ${
        disabled && "bg-opacity-80 pointer-events-none"
      } transistion duration-200 ${className} ${block && "block w-full"}`}
      type={forForm ? "submit" : "button"}
      onClick={onClick}
    >
      {isLoading ? (
        <CgSpinnerTwo
          className={`animate-spin mx-auto ${spinnerClass} ${getIconSize(
            size
          )}`}
        />
      ) : (
        title
      )}
    </button>
  );
};

export default Button;
