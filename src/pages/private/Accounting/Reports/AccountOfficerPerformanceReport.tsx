import { useMemo, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import dayjs, { Dayjs } from "dayjs";
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
import { IAccountOfficerPerformanceReport } from "@/interfaces/iPosting";

type RangeValue = [Dayjs | null, Dayjs | null] | null;
const { RangePicker } = DatePicker;
const columnHelper = createColumnHelper<IAccountOfficerPerformanceReport>();
const columns: ColumnDef<IAccountOfficerPerformanceReport>[] = [
  columnHelper.accessor("dateCreated", {
    header: () => "Creation Date",
    cell: (info) => dayjs(info.renderValue()).format("YYYY-MM-DD HH:mm:ss"),
  }),
  columnHelper.accessor("location", {
    header: () => "location",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("customerId", {
    header: () => "Customer ID",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("firstName", {
    header: () => "First Name",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("lastName", {
    header: () => "last Name",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("middleName", {
    header: () => "middle Name",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("mobile", {
    header: () => "mobile",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("bvn", {
    header: () => "bvn",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("loanAccountNumber", {
    header: () => "Loan Account Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("repaymentAccountNumber", {
    header: () => "Repayment Account Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("approvedLoanAmount", {
    header: () => "Amount",
    cell: (info) => StringFormat.formatNumber(info.renderValue()),
  }),
  columnHelper.accessor("outstandingLoanAmount", {
    header: () => "outstanding Amount",
    cell: (info) => StringFormat.formatNumber(info.renderValue()),
  }),
  columnHelper.accessor("loanApplicationId", {
    header: () => "Loan ID",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("approvedTenorMonths", {
    header: () => "Tenor",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("netMonthlyIncome", {
    header: () => "Monthly Income",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("accountOfficer", {
    header: () => "account Officer",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("managementFee", {
    header: () => "management Fee",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("loanProduct", {
    header: () => "Product",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("bankName", {
    header: () => "Bank",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("bankAccount", {
    header: () => "Account Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("bankAccountName", {
    header: () => "Account Name",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("employer", {
    header: () => "employer",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("employmentNumber", {
    header: () => "employmentNumber",
    cell: (info) => info.renderValue(),
  }),
];

const AccountOfficerPerformaneReports = () => {
  const {
    postingStore: {
      loading,
      getAccountOfficerPerformanceReport,
      accountOfficerPerformanceReport,
    },
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
    dateCreated: false,
    accountOfficer: true,
    location: true,
    customerId: false,
    firstName: false,
    lastName: false,
    middleName: false,
    loanApplicationId: true,
    loanAccountNumber: false,
    repaymentAccountNumber: false,
    approvedLoanAmount: false,
    outstandingLoanAmount: false,
    approvedTenorMonths: false,
    managementFee: false,
    loanProduct: true,
    netMonthlyIncome: true,
    mobile: true,
    bvn: true,
    bankAccount: false,
    bankName: false,
    bankAccountName: false,
    employer: false,
    employmentNumber: false,
  });
  const searcher = useSearch(search);

  const table = useReactTable({
    data: accountOfficerPerformanceReport || [],
    columns,
    ...searcher,
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

  const rowData = table.getFilteredRowModel().rows.map((row) => {
    return {
      "Creation Date": dayjs(row.original.dateCreated).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      Location: row.original.location,
      "Customer ID": row.original.customerId,
      "First Name": row.original.firstName,
      "Last Name": row.original.lastName,
      "Middle Name": row.original.middleName,
      Mobile: row.original.mobile,
      BVN: row.original.bvn,
      "Loan Account Number": row.original.loanAccountNumber,
      "Repayment Account Number": row.original.repaymentAccountNumber,
      Amount: row.original.approvedLoanAmount,
      "Outstanding Amount": row.original.outstandingLoanAmount,
      "Loan Application ID": row.original.loanApplicationId,
      Tenor: row.original.approvedTenorMonths,
      "Monthly Income": row.original.netMonthlyIncome,
      "Account Officer": row.original.accountOfficer,
      "Management Fee": row.original.managementFee,
      Product: row.original.loanProduct,
      Bank: row.original.bankName,
      "Account Number": row.original.bankAccount,
      "Account Name": row.original.bankAccountName,
      Employer: row.original.employer,
      "Employment Number": row.original.employmentNumber,
    };
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
          title="Account Officer Performances"
          subTitle="View all account officer's perforance reports"
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
                await getAccountOfficerPerformanceReport(
                  range[0].format("YYYY-MM-DD"),
                  range[1].format("YYYY-MM-DD")
                );
              }}
              className="text-sm"
              type="primary"
            />
            <CSVLink
              className="md:ml-auto"
              data={rowData}
              filename={`account_officer_performance_report_${dayjs().format(
                "YYYY-MM-DD"
              )}.csv`}
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

export default AccountOfficerPerformaneReports;
