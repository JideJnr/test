import { useMemo, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import dayjs from "dayjs";
import { useSearch } from "@/hooks/useSearch";
import { DatePicker, Dropdown, MenuProps } from "antd";
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
import { IGlCallOverReport } from "@/interfaces/iPosting";

const columnHelper = createColumnHelper<IGlCallOverReport>();

const columns: ColumnDef<IGlCallOverReport>[] = [
  columnHelper.accessor("transactionDate", {
    header: () => "transaction Date",
    cell: (info) => dayjs(info.renderValue()).format("YYYY-MM-DD HH:mm:ss"),
  }),
  columnHelper.accessor("transactionId", {
    header: () => "transactionId",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("transactionAmount", {
    header: () => "transaction Amount",
    cell: (info) => StringFormat.formatNumber(info.renderValue()),
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
  columnHelper.accessor("subAccountName", {
    header: () => "Sub-Account",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("tellerUser", {
    header: () => "teller User",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("reviewerUser", {
    header: () => "reviewer User",
    cell: (info) => info.renderValue(),
  }),
];

const GlCallOverReports = () => {
  const {
    postingStore: { loading, getGlCallOverReport, glCallOverReport },
  } = useStore();
  const [range, setRange] = useState<dayjs.Dayjs>(dayjs());
  const [search, setSearch] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const searcher = useSearch(search);

  const table = useReactTable({
    data: glCallOverReport || [],
    columns,
    ...searcher,
    state: {
      // globalFilter: searcher.state,
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
          title="General Ledger Entries"
          subTitle="View all general ledger call over reports"
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
            className="form-input min-[300px] w-full md:w-2/4 lg:w-1/3 h-12"
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
                await getGlCallOverReport(range.format("YYYY-MM-DD"));
              }}
              className="text-sm"
              type="primary"
            />
            <CSVLink
              className="md:ml-auto"
              data={glCallOverReport}
              filename={`${range.format("YYYY-MM-DD")}-call-over-report.csv`}
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

export default GlCallOverReports;
