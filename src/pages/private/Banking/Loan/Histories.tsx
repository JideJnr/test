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
import useStore from "@/store";
import dayjs from "dayjs";
import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import { IApprovedLoanHistory } from "@/interfaces/iLoan";
import StringFormat from "@/shared/utils/string";

const columnHelper = createColumnHelper<IApprovedLoanHistory>();
const columns: any = [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("dateApproved", {
    cell: (info) => dayjs(info.getValue()).format("DD-MMM-YYYY hh:mm A"),
    header: () => <span>Approval Date</span>,
  }),
  columnHelper.accessor("approvedLoanAmount", {
    header: () => "Amount",
    cell: (info) => StringFormat.formatNumber(info.renderValue()),
  }),
  columnHelper.accessor("approvedMonthlyRate", {
    header: () => "Rate",
    cell: (info) => info.renderValue() + "%",
  }),
  columnHelper.accessor("approvedTenor", {
    header: () => "Tenor",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("loanType", {
    header: () => "Type",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("loanProduct", {
    header: () => "Product",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("accountOfficer", {
    header: () => "DSE",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("approvedBy", {
    header: () => "Approved By",
    cell: (info) => info.renderValue(),
  }),
];

const LoanHistory: React.FC<{ setSelectedTab: (tab: number) => void }> = ({
  setSelectedTab,
}) => {
  const [search, setSearch] = useState<string>("");
  const {
    loanStore: { loan },
  } = useStore();
  const navigate = useNavigate();
  const searcher = useSearch(search);

  const table = useReactTable({
    data: loan.approvedLoanHistory || [],
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
          className="form-input w-full md:w-2/4 lg:w-1/3"
          placeholder="Search for previous loan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col min-h-[700px] mt-12">
        <DynamicTable
          table={table}
          fetchingAll={false}
          isNavigating={false}
          onClick={(data) => {
            navigate(`/account/banking/loans/${data.id}`);
            setSelectedTab(0);
          }}
          emptyStateMessage={"No previous loan"}
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

export default LoanHistory;
