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
import { IFixedDepositReport } from "@/interfaces/iPosting";

const columnHelper = createColumnHelper<IFixedDepositReport>();

const columns: ColumnDef<IFixedDepositReport>[] = [
  columnHelper.accessor("bookingDate", {
    header: () => "Booking Date",
    cell: (info) => dayjs(info.renderValue()).format("YYYY-MM-DD"),
  }),
  columnHelper.accessor("tenorDays", {
    header: () => "tenor (Days)",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("fixedDepositAccountNumber", {
    header: () => "Account Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("fundingAccountNumber", {
    header: () => "funding Account Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("proceedsAccountNumber", {
    header: () => "proceeds Account Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("principal", {
    header: () => "principal",
    cell: (info) => StringFormat.formatNumber(info.renderValue()),
  }),
  columnHelper.accessor("customerId", {
    header: () => "customer ID",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("interestOnDeposit", {
    header: () => "interest On Deposit",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("terminationDate", {
    header: () => "Termination Date",
    cell: (info) =>
      info.renderValue()
        ? dayjs(info.renderValue()).format("YYYY-MM-DD")
        : "--",
  }),
  columnHelper.accessor("depositProductId", {
    header: () => "deposit Product Id",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("depositStatus", {
    header: () => "deposit Status",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("depositProductName", {
    header: () => <div className="min-w-[400px]">deposit Product Name</div>,
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("customerName", {
    header: () => "customer Name",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("gender", {
    header: () => "gender",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("mobile", {
    header: () => "mobile",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("address", {
    header: () => <div className="min-w-[400px]">"address"</div>,
    cell: (info) => info.renderValue(),
  }),
];

const FixedDepositReports = () => {
  const {
    postingStore: { loading, getFixedDepositReport, fixedDepositReport },
  } = useStore();
  const [range, setRange] = useState<dayjs.Dayjs>(dayjs());
  const [search, setSearch] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({
    bookingDate: true,
    fixedDepositAccountNumber: true,
    fundingAccountNumber: false,
    tenorDays: true,
    proceedsAccountNumber: false,
    principal: true,
    customerId: true,
    interestOnDeposit: true,
    terminationDate: true,
    depositProductId: false,
    depositStatus: false,
    interestDueAtMaturity: false,
    dailyInterestAccrued: false,
    depositProductName: false,
    customerName: true,
  });
  const searcher = useSearch(search);

  const table = useReactTable({
    data: fixedDepositReport || [],
    columns,
    state: {
      ...searcher.state,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
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
          title="Fixed Deposit"
          subTitle="View all fixed deposit reports"
          showAdd={false}
          showBackButton={false}
          showSearch={false}
        />
      </div>

      <div className="mt-12 flex flex-col gap-y-6">
        <div className="flex items-center flex-col sm:flex-row gap-2 mt-8">
          <div className="flex gap-2">
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Button
                title="Manage Table"
                size="large"
                onClick={() => {}}
                className="text-sm"
                type="primary"
              />
            </Dropdown>
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
                await getFixedDepositReport(range.format("YYYY-MM-DD"));
              }}
              className="!w-fit md:w-auto text-sm"
              type="primary"
            />
            <CSVLink
              className="md:ml-auto"
              data={fixedDepositReport}
              filename={`${range.format(
                "YYYY-MM-DD"
              )}-fixed-deposit-report.csv`}
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

export default FixedDepositReports;
