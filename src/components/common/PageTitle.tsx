import { useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import { IPageTitle } from "@/interfaces/iPageTitle";
import Button from "@/components/common/Button";

const PageTitle: React.FC<IPageTitle> = ({
  title,
  subTitle,
  showAdd,
  showSearch,
  onSearch,
  onAddClick,
  onBackClick,
  searchPlaceholder,
  buttonAddConfig,
  isModal,
  showBackButton,
  backButtonRoute,
  className,
}) => {
  const [search, setSearch] = useState<string>("");

  return (
    <>
      <div
        className={`flex flex-col md:flex-row gap-6 md:justify-between md:items-center transition-all duration-300 ease-in-out ${
          !isModal ? "mb-6 md:mb-8" : "mb-6"
        } ${className}`}
      >
        <div className="flex gap-x-3 items-star">
          {showBackButton && (
            <Link
              to={backButtonRoute || ""}
              onClick={(e) => {
                if (!backButtonRoute) {
                  e.preventDefault();

                  onBackClick();
                }
              }}
            >
              <MdOutlineKeyboardBackspace className="text-2xl text-gray-600 hover:text-gray-900" />
            </Link>
          )}
          <div>
            <h1 className="text-xl font-semibold text-blue-700">{title}</h1>
            {subTitle && (
              <p className="text-sm font-medium text-gray-700">{subTitle}</p>
            )}
          </div>
        </div>

        <div className="flex gap-x-2">
          {showSearch && (
            <input
              placeholder={searchPlaceholder || "Search..."}
              type="search"
              value={search}
              className="form-input"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  onSearch?.(search);
                }
              }}
            />
          )}
          {showAdd && (
            <Button
              onClick={(e) => onAddClick?.(e)}
              title={buttonAddConfig?.title || "Add New"}
              type={buttonAddConfig?.type || "primary"}
              size={buttonAddConfig?.size || "large"}
            ></Button>
          )}
        </div>
      </div>
    </>
  );
};

export default PageTitle;
