import React, { useState, useMemo } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnDef,
  getSortedRowModel,
} from "@tanstack/react-table";
import DynamicTable from "@/components/common/Table";
import Pagination from "@/components/common/Pagination";
import { Avatar, Dropdown, MenuProps } from "antd";
import Button from "@/components/common/Button";
import { UserOutlined } from "@ant-design/icons";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { ILoanEligility } from "@/interfaces/iLoan";

const columnHelper = createColumnHelper<ILoanEligility>();

const LoanCustomerSearch: React.FC = () => {
  const navigate = useNavigate();
  const {
    loanStore: { getCustomersLoanEligility, loanCustomers, loading },
  } = useStore();
  const [search, setSearch] = useState<string>("");

  const columns = useMemo<ColumnDef<ILoanEligility>[]>(
    () => [
      columnHelper.accessor("passportPhoto", {
        cell: (info) => {
          const passport = info.getValue();

          if (passport && passport.fileName) {
            return <Avatar src={`/file/${passport.fileName}`} />;
          }

          return <Avatar icon={<UserOutlined />} />;
        },
        header: () => "Image",
      }),
      columnHelper.accessor("customerId", {
        cell: (info) => (
          <span className="bg-gray-100 text-xs py-0.5 text-gray-800 px-2 rounded-md ">
            {info.getValue()}
          </span>
        ),
        header: () => "ID",
      }),
      columnHelper.accessor("fullName", {
        cell: (info) => info.getValue(),
        header: () => <span>Customer Name</span>,
      }),
      columnHelper.accessor("email", {
        header: () => "Email Address",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("mobile", {
        header: () => "Phone Number",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("accountOfficer", {
        header: () => "DSE",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("location", {
        header: () => "Location",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("loanApplicationInProgress", {
        header: () => "Loan Application In Progress",
        cell: (info) => (info.renderValue() ? "Yes" : "No"),
      }),
      {
        id: "action",
        header: "",
        cell: ({ row }) => (
          <Dropdown
            menu={{ items: getDropdownItems(row.original) }}
            trigger={!row.original.loanApplicationInProgress ? ["click"] : []}
          >
            <Button
              title="Apply"
              disabled={row.original.loanApplicationInProgress}
              onClick={() => {}}
            />
          </Dropdown>
        ),
      },
    ],
    []
  );

  const getDropdownItems = (rowData: ILoanEligility): MenuProps["items"] => {
    return [
      {
        label: (
          <a
            className="flex items-center gap-2"
            onClick={() => {
              navigate(`/account/banking/loans/book/${rowData.customerId}/0`);
            }}
          >
            Fresh Loan
          </a>
        ),
        key: "0",
      },
      {
        label: (
          <a
            className="flex items-center gap-2"
            onClick={() => {
              navigate(`/account/banking/loans/book/${rowData.customerId}/1`);
            }}
          >
            Topup Loan
          </a>
        ),
        key: "1",
      },
    ];
  };

  const table = useReactTable({
    data: loanCustomers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <PageTitle
        title="Loan Application"
        subTitle="Search for the customer"
        showAdd={false}
        showSearch={false}
        showBackButton={true}
        backButtonRoute="/account/banking/loans"
      />

      <div className="flex items-center flex-col sm:flex-row gap-2 mt-20">
        <input
          type="search"
          name="search"
          autoComplete="off"
          autoFocus
          className="form-input w-full md:w-2/4 lg:w-1/3 h-12"
          value={search}
          placeholder="Search for customer"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && search.length > 1) {
              e.preventDefault();
              getCustomersLoanEligility(search.trim());
            }
          }}
        />
        <Button
          onClick={(e) => {
            if (search.length > 1) {
              getCustomersLoanEligility(search.trim());
            }
          }}
          className="w-1/2 place-self-end md:w-fit h-12"
          title={
            <div className="flex items-center justify-center gap-x-2">
              <AiOutlineSearch className="text-lg" />
              <span className="text-sm">Search</span>
            </div>
          }
          type={"primary"}
          size={"large"}
        ></Button>
      </div>

      <div className="flex flex-col min-h-[600px] mt-12">
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
    </div>
  );
};

export default LoanCustomerSearch;
