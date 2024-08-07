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
import useStore from "@/store";
import { NUBANS } from "@/interfaces/iCustomer";
import dayjs from "dayjs";
import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";

const columnHelper = createColumnHelper<NUBANS>();
const columns: any = [
  columnHelper.accessor("dateCreated", {
    cell: (info) => dayjs(info.getValue()).format("DD-MMM-YYYY hh:mm A"),
    header: () => <span>Date</span>,
  }),
  columnHelper.accessor("accountNumber", {
    header: () => "Account Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("depositType", {
    header: () => "Deposit Type",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("productName", {
    header: () => "product Name",
    cell: (info) => info.renderValue(),
  }),
];

const Deposit: React.FC<any> = () => {
  const [search, setSearch] = useState<string>("");
  const {
    customerStore: {
      customer: { depositAccounts },
    },
  } = useStore();
  const navigate = useNavigate();
  const searcher = useSearch(search);

  const table = useReactTable({
    data: depositAccounts || [],
    columns,
    ...searcher,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
          className="form-input w-full md:w-2/4 lg:w-1/3"
          placeholder="Search for deposit account..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col min-h-[700px] mt-12">
        <DynamicTable
          table={table}
          fetchingAll={loading}
          isNavigating
          onClick={(data) =>
            navigate(
              `/account/customer/statement/${data.accountNumber}/${data.productName}`
            )
          }
          emptyStateMessage={"No Deposit Account"}
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

export default Deposit;
