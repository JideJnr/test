import { useEffect, useMemo, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import dayjs from "dayjs";
import { useSearch } from "@/hooks/useSearch";
import { DatePicker, Dropdown, MenuProps, message } from "antd";
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
import { IDailyDisbursementReport } from "@/interfaces/iPosting";
import Alert from "@/shared/utils/alert";
import { IUser } from "@/interfaces/iUserManagement";

const columnHelper = createColumnHelper<IDailyDisbursementReport>();

const columns: ColumnDef<IDailyDisbursementReport>[] = [
  columnHelper.accessor("dateCreated", {
    header: () => <div className="min-w-[50px]">Date</div>,
    cell: (info) => dayjs(info.renderValue()).format("YYYY-MM-DD"),
  }),
  columnHelper.accessor("customerId", {
    header: () => <div className="min-w-[100px]">customer Id</div>,
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("firstName", {
    header: () => <div className="min-w-[100px]">first Name</div>,
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("middleName", {
    header: () => <div className="min-w-[100px]">middle Name</div>,
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("lastName", {
    header: () => <div className="min-w-[100px]">last Name</div>,
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("employer", {
    header: () => <div className="min-w-[200px]">employer</div>,
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("employmentNumber", {
    header: () => <div className="min-w-[130px]">employment Number</div>,
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("netMonthlyIncome", {
    header: () => <div className="min-w-[130px]">net Monthly Income</div>,
    cell: (info) => StringFormat.formatNumber(info.renderValue()) || "0.00",
  }),
  columnHelper.accessor("bvn", {
    header: () => "bvn",
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("mobile", {
    header: () => "mobile",
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("location", {
    header: () => "location",
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("loanApplicationId", {
    header: () => <div className="min-w-[100px]">Loan ID</div>,
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("previousLoanLiquidationBalance", {
    header: () => (
      <div className="min-w-[200px]">Previous Loan Liquidation Balance</div>
    ),
    cell: (info) => StringFormat.formatNumber(info.renderValue()) || "0.00",
  }),
  columnHelper.accessor("netDisbursement", {
    header: () => "Net Disbursement Amount",
    cell: (info) => StringFormat.formatNumber(info.renderValue()) || "0.00",
  }),
  columnHelper.accessor("approvedLoanAmount", {
    header: () => "Amount",
    cell: (info) => StringFormat.formatNumber(info.renderValue()) || "0.00",
  }),
  columnHelper.accessor("approvedTenorMonths", {
    header: () => "Tenor",
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("loanAccountNumber", {
    header: () => <div className="min-w-[130px]">Loan Account</div>,
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("repaymentAccountNumber", {
    header: () => <div className="min-w-[130px]">Repayment Account</div>,
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("loanProduct", {
    header: () => <div className="min-w-[200px]">Product</div>,
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("managementFee", {
    header: () => <div className="min-w-[130px]">management Fee</div>,
    cell: (info) => StringFormat.formatNumber(info.renderValue()) || "0.00",
  }),

  columnHelper.accessor("bankName", {
    header: () => <div className="min-w-[200px]">bank Name</div>,
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("bankAccount", {
    header: () => <div className="min-w-[130px]">bank Account</div>,
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("bankAccountName", {
    header: () => <div className="min-w-[200px]">bank Account Name</div>,
    cell: (info) => info.renderValue() || "--",
  }),

  columnHelper.accessor("accountOfficerId", {
    header: () => <div className="min-w-[100px]">Account Officer ID</div>,
    cell: (info) => info.renderValue() || "--",
  }),
  columnHelper.accessor("accountOfficer", {
    header: () => <div className="min-w-[200px]">Account Officer</div>,
    cell: (info) => info.renderValue() || "--",
  }),
];

const LoanDisbursementReport = () => {
  const {
    postingStore: {
      loading,
      processing,
      dailyDisbursementReport,
      message: msg,
      error,
      getDailyDisbursementReport,
      batchDisbursementPosting,
      clearErrorAndMessage,
    },
    authStore: { user: originalUser, impersonated_user },
    miscStore: { setSpinner },
  } = useStore();
  const [range, setRange] = useState<dayjs.Dayjs>(dayjs());
  const [search, setSearch] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({
    customerId: false,
    firstName: true,
    lastName: true,
    middleName: false,
    employer: false,
    employmentNumber: true,
    netMonthlyIncome: false,
    bvn: true,
    mobile: false,
    location: false,
    bankAccountName: false,
    bankName: false,
    bankAccount: false,
    netDisbursement: true,
    previousLoanLiquidationBalance: true,
    managementFee: true,
    dateCreated: false,
    loanApplicationId: true,
    approvedLoanAmount: true,
    approvedTenorMonths: true,
    repaymentAccountNumber: true,
    loanAccountNumber: false,
    loanProduct: true,
    accountOfficerId: false,
    accountOfficer: false,
  });
  const searcher = useSearch(search);
  const [user, setUser] = useState<IUser>(impersonated_user || originalUser);

  useEffect(() => {
    setUser(impersonated_user || originalUser);
  }, [impersonated_user, originalUser]);

  useEffect(() => {
    setSpinner(processing);
  }, [processing]);

  useEffect(() => {
    if (msg) {
      message.success(msg);
    }

    if (error) {
      message.error(error);
    }

    return () => {
      clearErrorAndMessage();
    };
  }, [error, msg, clearErrorAndMessage]);

  const table = useReactTable({
    data: dailyDisbursementReport || [],
    columns,
    ...searcher,
    state: {
      ...searcher.state,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rowData = table.getFilteredRowModel().rows.map((row) => {
    return {
      "Date Created": dayjs(row.original.dateCreated).format("YYYY-MM-DD"),
      "Customer ID": row.original.customerId,
      "First Name": row.original.firstName,
      "Middle Name": row.original.middleName,
      "Last Name": row.original.lastName,
      Employer: row.original.employer,
      "Employment Number": row.original.employmentNumber,
      "Net Monthly Income": row.original.netMonthlyIncome,
      BVN: row.original.bvn,
      Mobile: row.original.mobile,
      Location: row.original.location,
      "Loan Application ID": row.original.loanApplicationId,
      "Previous Loan Liquidation Balance":
        row.original.previousLoanLiquidationBalance,
      "Net Disbursement": row.original.netDisbursement,
      "Approved Loan Amount": row.original.approvedLoanAmount,
      "Approved Tenor Months": row.original.approvedTenorMonths,
      "Loan Account Number": row.original.loanAccountNumber,
      "Repayment Account Number": row.original.repaymentAccountNumber,
      "Loan Product": row.original.loanProduct,
      "Management Fee": row.original.managementFee,
      "Bank Name": row.original.bankName,
      "Bank Account": row.original.bankAccount,
      "Bank Account Name": row.original.bankAccountName,
      "Account Officer ID": row.original.accountOfficerId,
      "Account Officer": row.original.accountOfficer,
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

  const handleBatchWithdraw = () => {
    const currentDate = dayjs();
    const hoursDifference = currentDate.diff(range, "hour");

    if (hoursDifference > 24) {
      Alert.error(
        "Batch Withdrawal",
        "Please note that batch withdrawal for loans disbursed can only be done within 24hrs of booking. Outside this window, the batch entries can be done via upload",
        "OK"
      );
      return;
    }

    Alert.confirm(
      "Batch Withdrawal",
      <div className="flex flex-col gap-6 mb-4">
        <p className="text-red-500">
          Please note that batch withdrawal for loans disbursed can only be done
          within 24hrs of booking. Outside this window, the batch entries can be
          done via upload
        </p>

        <p className="text-gray-700">
          Batch Withdrwal for{" "}
          <span className="font-semibold">{range.format("YYYY-MM-DD")}</span>
        </p>
      </div>,
      async (response) => {
        if (response.isConfirmed) {
          await batchDisbursementPosting(range.format("YYYY-MM-DD"), user.id);
        }
      },
      "Proceed"
    );
  };

  return (
    <div>
      <div className="border-b">
        <PageTitle
          title="Disbursements"
          subTitle="View daily disbursements"
          showAdd={true}
          buttonAddConfig={{
            title: "Batch Withdrawal",
            type: "default",
          }}
          onAddClick={() => handleBatchWithdraw()}
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

          <div className="flex gap-x-4 md:ml-auto">
            <DatePicker
              allowClear={false}
              defaultValue={range}
              className="w-full md:min-w-[300px]"
              disabledDate={(current) => {
                return current && current > dayjs().add(0, "day");
              }}
              onChange={(payload) => {
                setRange(payload);
              }}
            />
            <Button
              title="Fetch"
              size="large"
              onClick={async () => {
                await getDailyDisbursementReport(range.format("YYYY-MM-DD"));
              }}
              className="text-sm"
              type="primary"
            />
            <CSVLink
              className="md:ml-auto"
              data={rowData}
              filename={`${range.format("YYYY-MM-DD")}-dibursement.csv`}
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

export default LoanDisbursementReport;
