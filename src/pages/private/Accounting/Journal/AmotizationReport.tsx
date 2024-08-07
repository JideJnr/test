import { useMemo, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import dayjs, { Dayjs } from "dayjs";
import { useSearch } from "@/hooks/useSearch";
import { DatePicker, MenuProps, Dropdown } from "antd";
import Button from "@/components/common/Button";
import { BsFiletypeCsv } from "react-icons/bs";
import { CSVLink } from "react-csv";
import {
  ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import StringFormat from "@/shared/utils/string";
import DynamicTable from "@/components/common/Table";
import Pagination from "@/components/common/Pagination";
import { IAmotizationSchedule } from "@/interfaces/iPosting";

const { RangePicker } = DatePicker;
const columnHelper = createColumnHelper<IAmotizationSchedule>();
const columns: ColumnDef<IAmotizationSchedule>[] = [
  columnHelper.accessor("valueDate", {
    header: () => "Value Date",
    cell: (info) => dayjs(info.renderValue()).format("YYYY-MM-DD") || "0.00",
  }),
  columnHelper.accessor("transactionDate", {
    header: () => "Transaction Date",
    cell: (info) => dayjs(info.renderValue()).format("YYYY-MM-DD") || "0.00",
  }),
  columnHelper.accessor("postingDate", {
    header: () => "Posting Date",
    cell: (info) => dayjs(info.renderValue()).format("YYYY-MM-DD") || "0.00",
  }),
  columnHelper.accessor("transactionAmount", {
    header: () => "Transaction Amount",
    cell: (info) => StringFormat.formatNumber(info.renderValue()) || "0.00",
  }),
  columnHelper.accessor("drCrFlag", {
    header: () => "Transaction Type",
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("transactionId", {
    header: () => "Transaction ID",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("entryType", {
    header: () => "Entry Type",
    cell: (info) => StringFormat.toTitleCase(info.renderValue()) || "--",
  }),
  {
    id: "subAccount",
    header: "Sub-Account",

    cell: ({ row }) =>
      `${row.original.subAccountId} - ${row.original.subAccountName}`,
  },
  columnHelper.accessor("tellerUser", {
    header: () => "teller User",
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("reviewerUser", {
    header: () => "reviewer User",
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("isTreated", {
    header: () => "Treated",
    cell: (info) => (info.renderValue() ? "Yes" : "No"),
  }),
  columnHelper.accessor("description", {
    header: () => "description",
    cell: (info) => info.renderValue() || "--",
  }),
];

type RangeValue = [Dayjs | null, Dayjs | null] | null;

const AmotizationReport = () => {
  const {
    postingStore: { loading, getAmotizationReport, amotizationSchedules },
  } = useStore();

  const [dates, setDates] = useState<RangeValue>(null);
  const [range, setRange] = useState<RangeValue>([
    dayjs().subtract(1, "week"),
    dayjs(),
  ]);
  const [search, setSearch] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({
    transactionDate: true,
    transactionId: true,
    transactionAmount: true,
    valueDate: true,
    entryType: false,
    drCrFlag: false,
    description: false,
    postingDate: false,
    isTreated: true,
    tellerUser: false,
    reviewerUser: false,
  });
  const searcher = useSearch(search);

  const table = useReactTable({
    data: amotizationSchedules || [],
    columns,
    ...searcher,
    state: {
      ...searcher.state,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
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
          title="Amortization"
          subTitle="Manage GL amortization"
          showAdd={false}
          showBackButton={false}
          showSearch={false}
        />
      </div>

      <div className="mt-12 flex flex-col gap-y-6">
        <div className="flex items-center flex-col sm:flex-row gap-2 mt-8">
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
            className="form-input w-full md:w-2/4 lg:w-1/3 h-12"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-4 flex-col md:flex-row md:ml-auto">
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
                {
                  label: "Last Year",
                  value: [dayjs().subtract(1, "year"), dayjs()],
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

            <div className="flex items-center gap-2">
              <Button
                title="Fetch"
                size="large"
                onClick={async () => {
                  await getAmotizationReport(
                    range[0].format("YYYY-MM-DD"),
                    range[1].format("YYYY-MM-DD")
                  );
                }}
                className="text-sm"
                type="primary"
              />
              <CSVLink
                className="md:ml-auto"
                data={amotizationSchedules}
                filename={`${range[0].format("YYYY-MM-DD")}-${range[1].format(
                  "YYYY-MM-DD"
                )}-amotization-schedules.csv`}
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

export default AmotizationReport;
