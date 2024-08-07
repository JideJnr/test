import { useEffect, useMemo, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import dayjs from "dayjs";
import { useSearch } from "@/hooks/useSearch";
import { DatePicker, Dropdown, MenuProps, Tooltip } from "antd";
import Button from "@/components/common/Button";
import { DownloadOutlined } from "@ant-design/icons";
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
import { ILoanPortfolioReport } from "@/interfaces/iPosting";

const columnHelper = createColumnHelper<ILoanPortfolioReport>();
const columns: ColumnDef<ILoanPortfolioReport>[] = [
  columnHelper.accessor("fileDescription", {
    header: () => "Report Title",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("reportDate", {
    header: () => "Report Date",
    cell: (info) => dayjs(info.renderValue()).format("DD-MMM-YYYY"),
  }),
  columnHelper.accessor("filePath", {
    header: () => "",
    cell: (info) =>         
      <Tooltip
        placement="bottomRight"
        color="#4096ff"
        title="Download Loan Porfolio Report"
      >
        <a
          className="text-lg text-gray-800 text-center hover:text-gray-600 p-0 rounded-lg"
          href={info.renderValue()}
        >
          <DownloadOutlined />
        </a>
      </Tooltip>,
  }),
];


const LoanPortfolioReports = () => {
  const {
    postingStore: { loading, getLoanPortfolio, loanPortfolio },
  } = useStore();
  const [search, setSearch] = useState<string>("");
  const [range, setRange] = useState<dayjs.Dayjs>(dayjs());
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({
    fileDescription: true,
    dateCreated: true,
    filePath: true,
  });
  const searcher = useSearch(search);

  const table = useReactTable({
    data: loanPortfolio || [],
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
          title="Loan Portfolio"
          subTitle="View all loan portfolio reports"
          showAdd={false}
          showBackButton={false}
          showSearch={false}
        />
      </div>

      <div className="mt-12 flex flex-col gap-y-6">
        <div className="flex items-center flex-col sm:flex-row gap-2 mt-8">
          <div className="flex gap-2">
          </div>

          <div className="flex gap-2 md:gap-x-4 md:ml-auto">
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
                await getLoanPortfolio(range.format("YYYY-MM-DD"));
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

export default LoanPortfolioReports;
