import { useMemo, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import dayjs from "dayjs";
import { useSearch } from "@/hooks/useSearch";
import { DatePicker, MenuProps, Tooltip } from "antd";
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
import { IFailedDeductionReport } from "@/interfaces/iPosting";
import { HiDownload } from "react-icons/hi";

const getDocLink = (url) => {
  const str = url.substring(url.indexOf(";") + 1);
  return `data:text/csv;base64,${str}`;
};

const columnHelper = createColumnHelper<IFailedDeductionReport>();

const columns: ColumnDef<IFailedDeductionReport>[] = [
  columnHelper.accessor("dateUploaded", {
    header: () => "date Uploaded",
    cell: (info) => dayjs(info.renderValue()).format("YYYY-MM-DD"),
  }),
  columnHelper.accessor("transactionId", {
    header: () => "transaction Id",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("summary", {
    header: () => "Summary",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("uploadedBy", {
    header: () => "uploaded By",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("failedUploadCsv", {
    header: () => "Failed Upload Csv",
    cell: (info) =>
      info.renderValue() ? (
        <Tooltip
          placement="bottomRight"
          color="#4096ff"
          title="Download failed upload CSV"
        >
          <a
            className="text-lg text-gray-800 text-center hover:text-gray-600 p-0 rounded-lg"
            href={getDocLink(info.renderValue())}
            download={`${info.row.original.dateUploaded}-failed-upload.csv`}
          >
            <HiDownload />
          </a>
        </Tooltip>
      ) : (
        "No failed upload"
      ),
  }),
  columnHelper.accessor("successfulUploadCsv", {
    header: () => "Successful Upload Csv",
    cell: (info) =>
      info.renderValue() ? (
        <Tooltip
          placement="bottomRight"
          color="#4096ff"
          title="Download successful upload CSV"
        >
          <a
            className="text-lg text-gray-800 text-center hover:text-gray-600 p-0 rounded-lg"
            href={getDocLink(info.renderValue())}
            download={`${info.row.original.dateUploaded}-successful-upload.csv`}
          >
            <HiDownload />
          </a>
        </Tooltip>
      ) : (
        "No successful upload"
      ),
  }),
];

const FailedDeductionReport = () => {
  const {
    postingStore: { loading, getFailedDeductionReport, failedDeductionReport },
  } = useStore();
  const [range, setRange] = useState<dayjs.Dayjs>(dayjs());
  const [search, setSearch] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const searcher = useSearch(search);

  const table = useReactTable({
    data: failedDeductionReport || [],
    columns,
    ...searcher,
    state: {
      // globalFilter: searcher.state,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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

  const items = useMemo<MenuProps["items"]>(
    () => [
      {
        label: (
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              {...{
                type: "checkbox",
                checked: table.getIsAllColumnsVisible(),
                onChange: table.getToggleAllColumnsVisibilityHandler(),
              }}
            />{" "}
            Toggle All
          </label>
        ),
        key: "0",
      },
      {
        type: "divider",
      },
      ...list,
    ],
    [list]
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
        <PageTitle
          title="Failed Deductions"
          subTitle="View all failed batch deductions"
          showAdd={false}
          showBackButton={false}
          showSearch={false}
        />
      </div>

      <div className="mt-12 flex flex-col gap-y-6">
        <div className="flex items-center flex-col sm:flex-row gap-2 mt-8">
          {/* <Dropdown menu={{ items }} trigger={["click"]}>
            <Button
              title="Manage Table"
              size="large"
              onClick={() => {}}
              className="text-sm"
              type="primary"
            />
          </Dropdown> */}
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
                await getFailedDeductionReport(range.format("YYYY-MM-DD"));
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

export default FailedDeductionReport;
