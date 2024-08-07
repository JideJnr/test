import { useEffect, useMemo, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import dayjs from "dayjs";
import { useSearch } from "@/hooks/useSearch";
import { DatePicker, Dropdown, MenuProps, Tooltip } from "antd";
import Button from "@/components/common/Button";
import { CSVLink } from "react-csv";
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
import { ILoanLiquidationReport } from "@/interfaces/iPosting";
import { BsFiletypeCsv } from "react-icons/bs";

const columnHelper = createColumnHelper<ILoanLiquidationReport>();
const columns: ColumnDef<ILoanLiquidationReport>[] = [
  columnHelper.accessor("customerId", {
    header: () => "Customer ID",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("dateLiquidated", {
    header: () => "Date Liquidated",
    cell: (info) => dayjs(info.renderValue()).format("DD-MMM-YYYY"),
  }),
  columnHelper.accessor("loanAccountNumber", {
    header: () => "Loan Account Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("originalLoanAmount", {
    header: () => "Amount",
    cell: (info) => StringFormat.formatNumber(info.renderValue()),
  }),
  columnHelper.accessor("monthlyRate", {
    header: () => "Monthly Rate",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("tenorMonths", {
    header: () => "Tenor (Months)",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("disbursementDate", {
    header: () => "Disbursement Date",
    cell: (info) => dayjs(info.renderValue()).format("DD-MMM-YYYY"),
  }),
  columnHelper.accessor("loanPurpose", {
    header: () => "Loan Purpose",
    cell: (info) => StringFormat.toTitleCase(info.renderValue()),
  }),
  columnHelper.accessor("loanProductId", {
    header: () => "Loan Product ID",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("productName", {
    header: () => "Loan Product",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("repaymentAccountNumber", {
    header: () => "Repayment Account Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("birthDate", {
    header: () => "Birth Date",
    cell: (info) => dayjs(info.renderValue()).format("DD-MMM-YYYY"),
  }),
  columnHelper.accessor("bvnNumber", {
    header: () => "BVN Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("firstName", {
    header: () => "First Name",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("middleName", {
    header: () => "Middle Name",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("lastName", {
    header: () => "Last Name",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("nubanNumber", {
    header: () => "Nuban Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("accountOfficer", {
    header: () => "Account Officer",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("employmentNumber", {
    header: () => "Employment Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("employerName", {
    header: () => "Employer Name",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("gender", {
    header: () => "Gender",
    cell: (info) => StringFormat.toTitleCase(info.renderValue()),
  }),
  columnHelper.accessor("mobile", {
    header: () => "Mobile",
    cell: (info) => info.renderValue(),
  }),
];

const LoanLiquidationReports = () => {
  const {
    postingStore: { loading, getLiquidatedLoanReport, loanLiquidationReport },
  } = useStore();
  const [search, setSearch] = useState<string>("");
  const [range, setRange] = useState<dayjs.Dayjs>(dayjs());
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({
    loanAccountNumber: true,
    originalLoanAmount: true,
    monthlyRate: true,
    tenorMonths: true,
    disbursementDate: false,
    loanPurpose: false,
    customerId: false,
    loanProductId: false,
    repaymentAccountNumber: true,
    birthDate: false,
    bvnNumber: true,
    firstName: true,
    middleName: false,
    lastName: true,
    nubanNumber: true,
    productName: false,
    accountOfficer: false,
    employmentNumber: false,
    employerName: false,
    gender: false,
    mobile: false,
    dateLiquidated: true,
  });
  const searcher = useSearch(search);

  const table = useReactTable({
    data: loanLiquidationReport || [],
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
          title="Liquidated Loan Reports"
          subTitle="View all liquidated loan reports"
          showAdd={false}
          showBackButton={false}
          showSearch={false}
        />
      </div>

      <div className="mt-12 flex flex-col gap-y-6">
        <div className="flex lg:items-center flex-col lg:flex-row gap-2 mt-8">
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
              className="form-input w-full lg:w-[300px] h-12"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 lg:gap-x-4 lg:ml-auto">
            <DatePicker
              allowClear={false}
              defaultValue={range}
              className="!w-full min-w-full md:min-w-[300px]"
              onChange={(payload) => {
                setRange(payload);
              }}
            />
            <Button
              title="Fetch"
              size="large"
              onClick={async () => {
                await getLiquidatedLoanReport(range.format("YYYY-MM-DD"));
              }}
              className="text-sm"
              type="primary"
            />
            <CSVLink
              className="md:ml-auto"
              data={loanLiquidationReport}
              filename={`${range.format(
                "YYYY-MM-DD"
              )}-loan-liquidation-report.csv`}
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

export default LoanLiquidationReports;
