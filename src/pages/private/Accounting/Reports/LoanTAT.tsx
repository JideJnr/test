import { useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import dayjs, { Dayjs } from "dayjs";
import { useSearch } from "@/hooks/useSearch";
import { DatePicker } from "antd";
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
import { ILoanTATReport } from "@/interfaces/iPosting";

type RangeValue = [Dayjs | null, Dayjs | null] | null;
const { RangePicker } = DatePicker;
const columnHelper = createColumnHelper<ILoanTATReport>();
const columns: ColumnDef<ILoanTATReport>[] = [
  columnHelper.accessor("processingOfficer", {
    header: () => "Officer",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("loansReceived", {
    header: () => "Loans Received",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("currentPendingLoans", {
    header: () => "Current Pending Loans",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("userRole", {
    header: () => "Role",
    cell: (info) => StringFormat.toTitleCase(info.renderValue()),
  }),
  columnHelper.accessor("avgProcessingTimePerLoan", {
    header: () => "Average Processing Time Per Loan",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("avgProcessingMinutesPerLoan", {
    header: () => "Average Processing Minutes Per Loan",
    cell: (info) => info.renderValue(),
  }),
];

const LoanTATReports = () => {
  const {
    postingStore: { loading, getLoanTATReport, loanTATReport },
  } = useStore();
  const [search, setSearch] = useState<string>("");
  const [dates, setDates] = useState<RangeValue>(null);
  const [range, setRange] = useState<RangeValue>([
    dayjs().subtract(1, "week"),
    dayjs(),
  ]);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({
    fileDescription: true,
    dateCreated: true,
    filePath: true,
  });
  const searcher = useSearch(search);

  const table = useReactTable({
    data: loanTATReport || [],
    columns,
    state: {
      ...searcher.state,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const onOpenChange = (open: boolean) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
        <PageTitle
          title="Loan TAT Reports"
          subTitle="View all loan TAT reports"
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
            className="form-input w-full md:w-[300px] lg:w-[300px] h-12"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2 md:gap-x-4 md:ml-auto">
            <RangePicker
              allowClear={false}
              value={dates || range}
              presets={[
                {
                  label: "This Week",
                  value: [dayjs(), dayjs()],
                },
                {
                  label: "Last Week",
                  value: [
                    dayjs().subtract(1, "week"),
                    dayjs().subtract(1, "week").endOf("week"),
                  ],
                },
              ]}
              className="w-full md:min-w-[300px]"
              onCalendarChange={(val) => {
                setDates(val);
              }}
              onChange={(payload) => {
                setRange(payload);
              }}
              onOpenChange={onOpenChange}
            />
            <Button
              title="Fetch"
              size="large"
              onClick={async () => {
                await getLoanTATReport(
                  range[0].format("YYYY-MM-DD"),
                  range[1].format("YYYY-MM-DD")
                );
              }}
              className="text-sm"
              type="primary"
            />
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

export default LoanTATReports;
