import { useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import Button from "@/components/common/Button";
import {
  ColumnDef,
  PaginationState,
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
import { IDepositCallOverReport } from "@/interfaces/iPosting";
import { IPaginationRequest } from "@/interfaces";

const columnHelper = createColumnHelper<IDepositCallOverReport>();

const columns: ColumnDef<IDepositCallOverReport>[] = [
  columnHelper.accessor("id", {
    header: () => "id",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("transactionDate", {
    header: () => "transaction Date",
    cell: (info) => dayjs(info.renderValue()).format("YYYY-MM-DD HH:mm:ss"),
  }),
  columnHelper.accessor("transactionId", {
    header: () => "transaction Id",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("transactionAmount", {
    header: () => "transaction Amount",
    cell: (info) => StringFormat.formatNumber(info.renderValue()),
  }),
  columnHelper.accessor("accountNumber", {
    header: () => "account Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("drCrFlag", {
    header: () => "Transaction Type",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("transactionDescription", {
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
  columnHelper.accessor("tellerUserId", {
    header: () => "Teller User Id",
    cell: (info) => info.renderValue(),
  }),
];

const DepositCallOverReports = () => {
  const {
    postingStore: { loading, getDepositCallOverReport, depositCallOverReport },
  } = useStore();
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });
  const [range, setRange] = useState<dayjs.Dayjs>(dayjs());
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const requestPagination: IPaginationRequest = {
      pageNumber: pagination.pageIndex,
      recordsPerPage: pagination.pageSize,
    };

    getDepositCallOverReport(range.format("YYYY-MM-DD"), requestPagination);
  }, [pagination]);

  const table = useReactTable({
    data: depositCallOverReport?.content || [],
    columns,
    state: {
      columnVisibility,
      pagination,
    },
    manualPagination: true,
    pageCount: depositCallOverReport?.totalPages || 0,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
        <PageTitle
          title="Deposit Entries"
          subTitle="View all deposit call over reports"
          showAdd={false}
          showBackButton={false}
          showSearch={false}
        />
      </div>

      <div className="mt-12 flex flex-col gap-y-6">
        <div className="flex items-center flex-col sm:flex-row gap-2 mt-8">
          <DatePicker
            allowClear={false}
            defaultValue={range}
            className="w-full md:w-[300px]"
            onChange={(payload) => {
              setRange(payload);
            }}
          />
          <Button
            title="Fetch"
            size="large"
            onClick={async () => {
              await getDepositCallOverReport(range.format("YYYY-MM-DD"), {
                pageNumber: pagination.pageIndex,
                recordsPerPage: pagination.pageSize,
              });
            }}
            className="text-sm"
            type="primary"
          />
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

export default DepositCallOverReports;
