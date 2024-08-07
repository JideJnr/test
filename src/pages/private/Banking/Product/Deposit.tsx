import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import Pagination from "@/components/common/Pagination";
import DynamicTable from "@/components/common/Table";
import Button from "@/components/common/Button";
import { RiAddLine, RiEdit2Line } from "react-icons/ri";
import useStore from "@/store";
import { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { VscKebabVertical } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { IDepositProductPayload } from "@/interfaces/iPosting";
import StringFormat from "@/shared/utils/string";
import { useSearch } from "@/hooks/useSearch";

const columnHelper = createColumnHelper<IDepositProductPayload>();

const DepositProductComponent: React.FC<any> = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const searcher = useSearch(search);

  const {
    postingStore: {
      loading,
      getDepositProducts,
      depositProducts,
      setDepositProduct,
      getGLByCode,
    },
  } = useStore();

  useEffect(() => {
    getDepositProducts();
  }, []);

  const columns: any = [
    columnHelper.accessor("productName", {
      header: () => "Name",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("depositType", {
      header: () => "Deposit Type",
      cell: (info) => StringFormat.toTitleCase(info.renderValue()),
    }),
    columnHelper.accessor("monthlyChargesAmount", {
      header: () => "monthly Charges Amount",
      cell: (info) => StringFormat.formatNumber(info.renderValue()) || "--",
    }),
    columnHelper.accessor("monthlyInterestRate", {
      header: () => "monthly Interest Rate",
      cell: (info) => (info.renderValue() ? info.renderValue() + "%" : "--"),
    }),
    columnHelper.accessor("withdrawalChargeRate", {
      header: () => "withdrawal Charge Rate",
      cell: (info) => (info.renderValue() ? info.renderValue() + "%" : "--"),
    }),
    columnHelper.accessor("subaccountId", {
      header: () => "Sub-Account",
      cell: (info) =>
        StringFormat.toTitleCase(
          getGLByCode(info.renderValue())?.split("-")[1]
        ) || info.renderValue(),
    }),
    columnHelper.accessor("intSubaccountId", {
      header: () => "Interest Sub-Account",
      cell: (info) =>
        StringFormat.toTitleCase(
          getGLByCode(info.renderValue())?.split("-")[1]
        ) || info.renderValue(),
    }),
    columnHelper.accessor("intPayableSubaccountId", {
      header: () => "Interest Payable Sub-Account",
      cell: (info) =>
        StringFormat.toTitleCase(
          getGLByCode(info.renderValue())?.split("-")[1]
        ) || info.renderValue(),
    }),
    columnHelper.accessor("bankSubaccountId", {
      header: () => "Bank Sub-Account",
      cell: (info) =>
        StringFormat.toTitleCase(
          getGLByCode(info.renderValue())?.split("-")[1]
        ) || info.renderValue(),
    }),
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Dropdown
          menu={{ items: getDropdownItems(row.original) }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <VscKebabVertical />
          </a>
        </Dropdown>
      ),
    },
  ];

  const getDropdownItems = (
    rowData: IDepositProductPayload
  ): MenuProps["items"] => {
    return [
      {
        label: (
          <a
            className="flex items-center gap-2"
            onClick={() => {
              setDepositProduct(rowData);
              navigate(`/account/banking/products/deposit`);
            }}
          >
            <RiEdit2Line />
            Edit
          </a>
        ),
        key: "0",
      },
    ];
  };

  const table = useReactTable({
    data: depositProducts,
    columns,
    ...searcher,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="flex items-center flex-col sm:flex-row gap-2 mt-8">
        <input
          type="search"
          name="search"
          autoComplete="off"
          autoFocus
          className="form-input w-full md:w-2/4 lg:w-1/3 h-12"
          placeholder="Search for deposit products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          onClick={() => navigate("/account/banking/products/deposit")}
          className="w-1/2 md:w-fit h-12 md:ml-auto"
          title={
            <div className="flex items-center justify-center gap-x-2">
              <RiAddLine className="text-lg" />
              <span className="text-sm">Add Product</span>
            </div>
          }
          type={"default"}
          size={"large"}
        ></Button>
      </div>
      <div className="flex flex-col min-h-[500px] mt-12">
        <DynamicTable
          table={table}
          fetchingAll={loading}
          isNavigating={false}
          emptyStateMessage={"No record found"}
        />

        <Pagination
          onNext={() => table.nextPage()}
          onPrevious={() => table.previousPage()}
          canBack={table.getCanPreviousPage()}
          canNext={table.getCanNextPage()}
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
        />
      </div>
    </>
  );
};

export default DepositProductComponent;
