import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import Pagination from "@/components/common/Pagination";
import { useNavigate } from "react-router-dom";
import DynamicTable from "@/components/common/Table";
import Button from "@/components/common/Button";
import { AiOutlineSearch } from "react-icons/ai";
import { LoanNUBANS } from "@/interfaces/iCustomer";
import useStore from "@/store";
import StringFormat from "@/shared/utils/string";
import dayjs from "dayjs";
import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";

const columnHelper = createColumnHelper<LoanNUBANS>();
const columns: any = [
  columnHelper.accessor("dateBooked", {
    cell: (info) => dayjs(info.getValue()).format("DD-MMM-YYYY hh:mm A"),
    header: () => <span>Date</span>,
  }),
  columnHelper.accessor("accountNumber", {
    header: () => "Account Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("principal", {
    header: () => "Principal",
    cell: (info) => StringFormat.Currency(info.renderValue()),
  }),
  columnHelper.accessor("rate", {
    header: () => "Rate",
    cell: (info) => info.renderValue() + "%",
  }),
  columnHelper.accessor("tenor", {
    header: () => "Tenor",
    cell: (info) => info.renderValue() + " month(s)",
  }),
  columnHelper.accessor("productName", {
    header: () => "Product Name",
    cell: (info) => info.renderValue(),
  }),
];

const Loan: React.FC<any> = () => {
  const [search, setSearch] = useState<string>("");
  const {
    customerStore: {
      customer: { loanAccounts },
    },
  } = useStore();
  const navigate = useNavigate();
  const searcher = useSearch(search);

  const table = useReactTable({
    data: loanAccounts || [],
    columns,
    ...searcher,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  const loading = false;

  return (
    <>
      <div className="flex items-center flex-col sm:flex-row gap-2 mt-8">
        <input
          type="search"
          name="search"
          autoComplete="off"
          autoFocus
          className="form-input w-full md:w-2/4 lg:w-1/3 h-12"
          placeholder="Search for loan accounts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col min-h-[700px] mt-12">
        <DynamicTable
          table={table}
          fetchingAll={loading}
          isNavigating
          onClick={(data) => {
            const encodedProductName = encodeURIComponent(data.productName);

            navigate(
              `/account/customer/statement/${data.accountNumber}/${encodedProductName}/loan/${data.rate}`
            );
          }}
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

export default Loan;
