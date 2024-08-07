import { useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import dayjs from "dayjs";
import Button from "@/components/common/Button";
import {
  ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import StringFormat from "@/shared/utils/string";
import DynamicTable from "@/components/common/Table";
import Pagination from "@/components/common/Pagination";
import { ITransactionCallOverReport } from "@/interfaces/iPosting";

const columnHelper = createColumnHelper<ITransactionCallOverReport>();

const columns: ColumnDef<ITransactionCallOverReport>[] = [
  columnHelper.accessor("transactionDate", {
    header: () => "transaction Date",
    cell: (info) => dayjs(info.renderValue()).format("YYYY-MM-DD HH:mm:ss"),
  }),
  columnHelper.accessor("transactionId", {
    header: () => "transaction Id",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("transactionAmount", {
    header: () => "transaction Amount",
    cell: (info) => StringFormat.formatNumber(info.renderValue()),
  }),
  columnHelper.accessor("accountNumber", {
    header: () => "Account Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("drCrFlag", {
    header: () => "Transaction Type",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("description", {
    header: () => "description",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("postingDate", {
    header: () => "posting Date",
    cell: (info) => dayjs(info.renderValue()).format("YYYY-MM-DD HH:mm:ss"),
  }),
  columnHelper.accessor("valueDate", {
    header: () => "value Date",
    cell: (info) => dayjs(info.renderValue()).format("YYYY-MM-DD HH:mm:ss"),
  }),
  columnHelper.accessor("entryType", {
    header: () => "entry Type",
    cell: (info) => info.renderValue(),
  }),
];

const TransactionCallOverReports = () => {
  const {
    postingStore: {
      loading,
      getTransactionCallOverReport,
      transactionCallOverReport,
    },
  } = useStore();
  const [search, setSearch] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});

  const table = useReactTable({
    data: transactionCallOverReport || [],
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const list = table.getAllLeafColumns().map((column, i) => {
    return {
      key: column.id,
      label: (
        <label className="flex gap-2 items-center cursor-pointer">
          <input
            {...{
              type: "checkbox",
              checked: column.getIsVisible(),
              onChange: column.getToggleVisibilityHandler(),
            }}
          />
          {StringFormat.convertToTitleCase2(column.id)}
        </label>
      ),
    };
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
        <PageTitle
          title="Transactions"
          subTitle="View all transactions call over report"
          showAdd={false}
          showBackButton={false}
          showSearch={false}
        />
      </div>

      <div className="mt-12 flex flex-col gap-y-6">
        <div className="flex items-center flex-col sm:flex-row gap-2 mt-8">
          <input
            type="search"
            name="search"
            autoComplete="off"
            autoFocus
            className="form-input w-full md:w-2/4 lg:w-1/3 h-12"
            placeholder="Transacton ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            title="Fetch"
            size="large"
            onClick={async () => {
              await getTransactionCallOverReport(search);
            }}
            className="text-sm"
            type="primary"
          />
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
      </div>
    </div>
  );
};

export default TransactionCallOverReports;
