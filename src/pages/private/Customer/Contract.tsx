import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import Pagination from "@/components/common/Pagination";
import { useNavigate, useParams } from "react-router-dom";
import StringFormat from "@/shared/utils/string";
import DynamicTable from "@/components/common/Table";
import { useEffect, useState } from "react";
import useStore from "@/store";
import { ICustomerContract } from "@/interfaces/iCustomer";
import dayjs from "dayjs";
import { useSearch } from "@/hooks/useSearch";

const columnHelper = createColumnHelper<ICustomerContract>();
const columns: any = [
  columnHelper.accessor("dateCreated", {
    cell: (info) => dayjs(info.getValue()).format("DD-MMM-YYYY hh:mm A"),
    header: () => <span>Application Date</span>,
  }),
  columnHelper.accessor("id", {
    header: () => "Loan ID",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("loanAmount", {
    header: () => "Loan Amount",
    cell: (info) => StringFormat.Currency(+info.renderValue()),
  }),
  columnHelper.accessor("loanTenorMths", {
    header: () => "Tenor",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("isTopup", {
    header: () => "Loan Type",
    cell: (info) => (info.renderValue() ? "Topup" : "Fresh"),
  }),
  columnHelper.accessor("customer", {
    header: () => "Customer",
    cell: (info) => info.renderValue().fullName,
  }),
  columnHelper.accessor("loanProduct", {
    header: () => "Loan Product",
    cell: (info) => info.renderValue().name,
  }),
];

const Contract: React.FC<any> = () => {
  const [search, setSearch] = useState<string>("");
  const {
    customerStore: { getCustomerContract, customer_contract, loading },
  } = useStore();

  const navigate = useNavigate();
  const searcher = useSearch(search);

  const param = useParams();

  useEffect(() => {
    if (param && param.id) {
      getCustomerContract(+param.id);
    }
  }, [param]);

  const table = useReactTable({
    data: customer_contract,
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
          placeholder="Search for loan contract..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col min-h-[700px] mt-12">
        <DynamicTable
          table={table}
          fetchingAll={loading}
          isNavigating
          onClick={(data) => navigate(`/account/banking/loans/${data.id}`)}
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

export default Contract;
