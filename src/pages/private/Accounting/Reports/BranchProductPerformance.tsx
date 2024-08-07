import { useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import dayjs, { Dayjs } from "dayjs";
import { useSearch } from "@/hooks/useSearch";
import { DatePicker, } from "antd";
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
import { IBranchProductPerformanceReport } from "@/interfaces/iPosting";

const columnHelper = createColumnHelper<IBranchProductPerformanceReport>();
const { RangePicker } = DatePicker;
const columns: ColumnDef<IBranchProductPerformanceReport>[] = [
  columnHelper.accessor("branchName", {
    header: () => "Branch Name",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("productName", {
    header: () => "Product Name",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("totalLoanAmount", {
    header: () => "Total Loan Amount",
    cell: (info) => StringFormat.formatNumber(info.renderValue()),
  }),
  columnHelper.accessor("numberOfLoansBooked", {
    header: () => "Number of Loan Booked",
    cell: (info) => info.renderValue(),
  }),
];

type RangeValue = [Dayjs | null, Dayjs | null] | null;

const BranchProductPerformanceReports = () => {
  const {
    postingStore: {
      loading,
      getBranchLoanProductPerformance,
      branchProductPerformance,
    },
  } = useStore();
  const [dates, setDates] = useState<RangeValue>(null);
  const [range, setRange] = useState<RangeValue>([
    dayjs().subtract(1, "week"),
    dayjs(),
  ]);
  const [search, setSearch] = useState<string>("");

  const searcher = useSearch(search);

  const table = useReactTable({
    data: branchProductPerformance || [],
    columns,
    state: {
      ...searcher.state,
    },
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

  const disabledDate = (current: Dayjs) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], "days") >= 7;
    const tooEarly = dates[1] && dates[1].diff(current, "days") >= 7;
    return !!tooEarly || !!tooLate;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
        <PageTitle
          title="Branch Loan Product Performance"
          subTitle="View all branch loan product performance reports"
          showAdd={false}
          showBackButton={false}
          showSearch={false}
        />
      </div>

      <div className="mt-12 flex flex-col gap-y-6">
        <div className="flex items-center flex-col sm:flex-row gap-2 mt-8">
          <div className="flex gap-2">
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
          </div>

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
              disabledDate={disabledDate}
              onCalendarChange={(val) => {
                setDates(val);
              }}
              onChange={(payload) => {
                setRange(payload);
              }}
              onOpenChange={onOpenChange}
              className="w-full md:min-w-[300px]"
            />

            <Button
              title="Fetch"
              size="large"
              onClick={async () => {
                await getBranchLoanProductPerformance(
                  range[0].format("YYYY-MM-DD"),
                  range[1].format("YYYY-MM-DD")
                );
              }}
              className="!w-fit md:w-auto text-sm"
              type="primary"
            />
            <CSVLink
              className="md:ml-auto"
              data={branchProductPerformance || []}
              filename={`${range[0].format("YYYY-MM-DD")}-${range[1].format(
                "YYYY-MM-DD"
              )}-branch-loan-product-performance.csv`}
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

export default BranchProductPerformanceReports;
