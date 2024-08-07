import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  FilterFn,
  getSortedRowModel,
} from "@tanstack/react-table";
import Pagination from "@/components/common/Pagination";
import DynamicTable from "@/components/common/Table";
import Button from "@/components/common/Button";
import { RiAddLine, RiEdit2Line } from "react-icons/ri";
import { ILoanProduct } from "@/interfaces/iLoan";
import useStore from "@/store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { rankItem } from "@tanstack/match-sorter-utils";
import StringFormat from "@/shared/utils/string";
import { Dropdown, MenuProps } from "antd";
import { VscKebabVertical } from "react-icons/vsc";

const columnHelper = createColumnHelper<ILoanProduct>();

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

const LoanProductComponent: React.FC<any> = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const {
    loanStore: { loading, getLoanProducts, loanProduct, setLoanProduct },
  } = useStore();

  useEffect(() => {
    getLoanProducts();
  }, []);

  const columns: any = [
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("repaymentCycle", {
      header: () => "repayment Cycle",
      cell: (info) => StringFormat.toTitleCase(info.renderValue()),
    }),
    columnHelper.accessor("defaultInterestRate", {
      header: () => "Interest Rate",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("dailyPenalRate", {
      header: () => "Penalty Rate",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("assetSubAccount", {
      header: () => "asset Sub-Account",
      cell: (info) => info.renderValue().accountName,
    }),
    columnHelper.accessor("interestIncomeSubAccount", {
      header: () => "interest Income Sub-Account",
      cell: (info) => info.renderValue().accountName,
    }),
    columnHelper.accessor("interestReceivableSubAccount", {
      header: () => "interest Receivable Sub-Account",
      cell: (info) => info.renderValue().accountName,
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

  const getDropdownItems = (rowData: ILoanProduct): MenuProps["items"] => {
    return [
      {
        label: (
          <a
            className="flex items-center gap-2"
            onClick={() => {
              setLoanProduct(rowData);
              navigate(`/account/banking/products/loan`);
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
    data: loanProduct,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter: search,
    },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
          placeholder="Search for loan products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          onClick={() => navigate("/account/banking/products/loan")}
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

export default LoanProductComponent;
