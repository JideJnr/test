import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import DynamicTable from "@/components/common/Table";
import { ILoan, ILoanCollection, IRepaymentSchedule } from "@/interfaces/iLoan";
import { IUser } from "@/interfaces/iUserManagement";
import Alert from "@/shared/utils/alert";
import StringFormat from "@/shared/utils/string";
import useStore from "@/store";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { HiOutlineCash } from "react-icons/hi";
import { RiCloseFill, RiFileExcel2Line } from "react-icons/ri";

const columnHelper = createColumnHelper<IRepaymentSchedule>();
const columns: any = [
  columnHelper.accessor("period", {
    header: () => "Period",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("interestRepayment", {
    header: () => "Interest Repayment",
    cell: (info) => StringFormat.formatNumber(info.renderValue()),
  }),
  columnHelper.accessor("principalRepayment", {
    header: () => "Principal Repayment",
    cell: (info) => StringFormat.formatNumber(info.renderValue()),
  }),
  columnHelper.accessor("cumulativePrincipal", {
    header: () => "Cumulative Principal",
    cell: (info) => StringFormat.formatNumber(info.renderValue()),
  }),
  columnHelper.accessor("outstandingBalance", {
    header: () => "Outstanding Balance",
    cell: (info) => StringFormat.formatNumber(info.renderValue()),
  }),
  columnHelper.accessor("monthlyRepayment", {
    header: () => "Monthly Repayment",
    cell: (info) => StringFormat.formatNumber(info.renderValue()),
  }),
  columnHelper.accessor("expectedPaymentDate", {
    cell: (info) => dayjs(info.getValue()).format("DD-MMM-YYYY"),
    header: () => <span>Due Date</span>,
  }),
  columnHelper.accessor("actualFullPaymentDate", {
    cell: (info) =>
      info.getValue() ? dayjs(info.getValue()).format("DD-MMM-YYYY") : "--",
    header: () => <span>Payment Date</span>,
  }),
  columnHelper.accessor("repaymentStatus", {
    header: () => "Status",
    cell: (info) => StringFormat.toTitleCase(info.renderValue()),
  }),
];

const CollectionDetail: React.FC<{
  collection: ILoanCollection;
  showAction?: boolean;
  loading: boolean;
  account: string;
}> = ({ collection, loading, account, showAction = false }) => {
  const {
    authStore: { user: originalUser, impersonated_user },
    loanStore: {
      loanCollection,
      loanLiquidate,
      clearErrorAndMessage,
      message: msg,
      error,
    },
  } = useStore();
  const [user, setUser] = useState<IUser>(impersonated_user || originalUser);

  useEffect(() => {
    setUser(impersonated_user || originalUser);
  }, [impersonated_user, originalUser]);

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
    data: collection?.repaymentSchedule,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleLoanCollection = (e) => {
    e.preventDefault();

    Alert.confirm(
      "Confirmation",
      "Are you sure you want to make due payment",
      async (response) => {
        if (response.isConfirmed) {
          await loanCollection({
            tellerId: user.id,
            loanAccountNumber: account,
          });
        }
      }
    );
  };

  const handleLoanLiquidate = async () => {
    Alert.confirm(
      "Confirmation",
      "Are you sure you want to liquidate loan",
      async (response) => {
        if (response.isConfirmed) {
          await loanLiquidate({
            tellerId: user.id,
            loanAccountNumber: account,
          });
        }
      }
    );
  };

  return (
    <>
      <div>
        <h3 className="text-xl font-semibold text-blue-700 mb-2">
          {collection.customerName} | {collection.loanAccountNumber}
        </h3>
        <div className="text-sm text-gray-700 flex flex-col gap-2">
          <p>
            <span className="!font-semibold mr-2 text-blue-700">
              Accrued Interest:
            </span>{" "}
            {StringFormat.formatNumber(collection.accruedInterest) || "0.00"}
          </p>
          <p>
            <span className="!font-semibold mr-2 text-blue-700">
              Liquidation Balance:
            </span>
            {StringFormat.formatNumber(collection.liquidationBalance) || "0.00"}
          </p>
          <p>
            <span className="!font-semibold mr-2 text-blue-700">
              Net Liquidation Balance:
            </span>
            {StringFormat.formatNumber(collection.netLiquidationBalance) ||
              "0.00"}
          </p>
          <p>
            <span className="!font-semibold mr-2 text-blue-700">
              Repayment Account:
            </span>
            {collection.repaymentAccountNumber}
          </p>
          <p>
            <span className="!font-semibold mr-2 text-blue-700">
              Repayment Account Balance:
            </span>
            {StringFormat.formatNumber(collection.repaymentAccountBalance) ||
              "0.00"}
          </p>
          <p>
            <span className="!font-semibold mr-2 text-blue-700">
              Loan Status:
            </span>
            {StringFormat.toTitleCase(collection.loanStatus)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:flex items-center justify-content-end gap-2">
        <Button
          className="min-w-[50px] w-full md:w-fit h-12 mr-auto"
          title={
            <div className="flex items-center justify-center gap-x-2 ">
              <RiFileExcel2Line className="text-xl" />
              <span className="text-sm">Export</span>
            </div>
          }
          type={"default"}
          size={"large"}
        ></Button>

        {showAction && collection.loanStatus === "RUNNING" && (
          <>
            <Button
              onClick={handleLoanCollection}
              className="min-w-[50px] w-full md:w-fit h-12"
              title={
                <div className="flex items-center justify-center gap-x-2">
                  <HiOutlineCash className="text-xl" />
                  <span className="text-sm">Pay Next Due</span>
                </div>
              }
              type={"primary"}
              size={"large"}
            ></Button>
            <Button
              onClick={handleLoanLiquidate}
              className="min-w-[50px] w-full md:w-fit h-12"
              title={
                <div className="flex items-center justify-center gap-x-2">
                  <RiCloseFill className="text-xl" />
                  <span className="text-sm">Liquidate</span>
                </div>
              }
              type={"warning"}
              size={"large"}
            ></Button>
          </>
        )}
      </div>

      <div className="flex flex-col min-h-[500px]">
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
          className={table.getPageCount() === 10 ? "mt-12" : "mt-12"}
        />
      </div>
    </>
  );
};

export default CollectionDetail;
