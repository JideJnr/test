import { useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import dayjs from "dayjs";
import { useSearch } from "@/hooks/useSearch";
import { DatePicker } from "antd";
import Button from "@/components/common/Button";
import { BsFiletypeCsv } from "react-icons/bs";
import { CSVLink } from "react-csv";
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
import { IDepositBalanceReport } from "@/interfaces/iPosting";

const columnHelper = createColumnHelper<IDepositBalanceReport>();

const columns: ColumnDef<IDepositBalanceReport>[] = [
  columnHelper.accessor("transactionAmount", {
    header: () => "transaction Amount",
    cell: (info) => StringFormat.formatNumber(info.renderValue()) || "0.00",
  }),
  columnHelper.accessor("accountNumber", {
    header: () => "account Number",
    cell: (info) => info.renderValue() || "--",
  }),
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) =>
      `${row.original.customerId} - ${row.original.lastName} ${row.original.firstName}`,
  },
  {
    id: "product",
    header: "Product",
    cell: ({ row }) =>
      `${row.original.depositProductId} - ${row.original.depositProductName}`,
  },
  columnHelper.accessor("depositType", {
    header: () => "deposit Type",
    cell: (info) => StringFormat.toTitleCase(info.renderValue()) || "--",
  }),
];

const DepositBalancesReport = () => {
  const {
    postingStore: { loading, getDepositBalancesReport, depositBalancesReport },
  } = useStore();
  const [range, setRange] = useState<dayjs.Dayjs>(dayjs());
  const [search, setSearch] = useState<string>("");
  const searcher = useSearch(search);

  const table = useReactTable({
    data: depositBalancesReport || [],
    columns,
    ...searcher,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
        <PageTitle
          title="Deposit Balance"
          subTitle="View all deposit balance reports"
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
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-x-4 md:ml-auto">
            <DatePicker
              allowClear={false}
              defaultValue={range}
              className="w-full md:min-w-[300px]"
              onChange={(payload) => {
                setRange(payload);
              }}
            />
            <Button
              title="Fetch"
              size="large"
              onClick={async () => {
                await getDepositBalancesReport(range.format("YYYY-MM-DD"));
              }}
              className="text-sm"
              type="primary"
            />
            <CSVLink
              className="md:ml-auto"
              data={depositBalancesReport}
              filename={`${range.format(
                "YYYY-MM-DD"
              )}-deposit-balance-report.csv`}
            >
              <Button
                title={<BsFiletypeCsv className="text-2xl" />}
                onClick={() => {}}
                className="min-w-[50px]"
                size="large"
              />
            </CSVLink>
          </div>
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

export default DepositBalancesReport;
