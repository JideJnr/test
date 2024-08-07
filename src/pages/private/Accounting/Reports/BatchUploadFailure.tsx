import { useEffect, useMemo, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import dayjs from "dayjs";
import {
  ColumnDef,
  PaginationState,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import DynamicTable from "@/components/common/Table";
import Pagination from "@/components/common/Pagination";
import {
  IDepositBatchFailureReport,
  IEntryBatchFailureReport,
} from "@/interfaces/iPosting";
import { IPaginationRequest } from "@/interfaces";
import StringFormat from "@/shared/utils/string";
import { useParams } from "react-router-dom";
import { Alert } from "antd";

const BatchUploadReports = () => {
  const params = useParams();
  const {
    postingStore: {
      loading,
      batchUploadFailures,
      getBatchUploadsFailureReport,
    },
  } = useStore();
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });

  useEffect(() => {
    const requestPagination: IPaginationRequest = {
      pageNumber: pagination.pageIndex,
      recordsPerPage: pagination.pageSize,
    };

    if (params.id && params.type) {
      getBatchUploadsFailureReport(params.id, requestPagination, params.type);
    }
  }, [pagination, params]);

  const columnHelper = createColumnHelper<
    IEntryBatchFailureReport | IDepositBatchFailureReport
  >();

  const columns = useMemo(() => {
    let definition: ColumnDef<
      IEntryBatchFailureReport | IDepositBatchFailureReport
    >[] = [
      columnHelper.accessor("transactionId", {
        header: () => "Transaction ID",
        cell: (info) => info.renderValue() ?? "-",
      }),
      columnHelper.accessor("description", {
        header: () => "Description",
        cell: (info) => info.renderValue() ?? "-",
      }),
      columnHelper.accessor("drCrFlag", {
        header: () => "Dr/Cr",
        cell: (info) => info.renderValue() ?? "-",
      }),
      columnHelper.accessor("transactionAmount", {
        header: () => "Amount",
        cell: (info) => StringFormat.Currency(String(info.renderValue() ?? 0)),
      }),
      columnHelper.accessor("valueDate", {
        header: () => "Value Date",
        cell: (info) => dayjs(info.renderValue()).format("MMM DD, YYYY HH:mm"),
      }),
      columnHelper.accessor("subaccountId", {
        header: () => "Subaccount ID",
        cell: (info) => info.renderValue() ?? "-",
      }),
      columnHelper.accessor("uploadedAt", {
        header: () => "Uploaded At",
        cell: (info) => dayjs(info.renderValue()).format("MMM DD, YYYY HH:mm"),
      }),
      columnHelper.accessor("uploadedByUser", {
        header: () => "Uploaded By",
        cell: (info) => info.renderValue() ?? "-",
      }),
      columnHelper.accessor("passedValidation", {
        header: () => "Validation Status",
        cell: (info) => (info.renderValue() ? "Passed" : "Failed"),
      }),
      columnHelper.accessor("validationMessage", {
        header: () => "Validation Message",
        cell: (info) => info.renderValue() ?? "-",
      }),
    ];

    if (params.type === "DEPOSIT") {
      definition = [
        // ...definition,
        columnHelper.accessor("transactionId", {
          header: () => "Transaction ID",
          cell: (info) => info.renderValue() ?? "-",
        }),
        columnHelper.accessor("depositAccountNumber", {
          header: () => "Deposit Account",
          cell: (info) => info.renderValue() ?? "-",
        }),
        columnHelper.accessor("narration", {
          header: () => "Narration",
          cell: (info) => info.renderValue() ?? "-",
        }),
        columnHelper.accessor("debitCredit", {
          header: () => "Debit/Credit",
          cell: (info) => info.renderValue() ?? "-",
        }),
        columnHelper.accessor("amount", {
          header: () => "Amount",
          cell: (info) =>
            StringFormat.Currency(String(info.renderValue() ?? 0)),
        }),
        columnHelper.accessor("valueDate", {
          header: () => "Value Date",
          cell: (info) =>
            dayjs(info.renderValue()).format("MMM DD, YYYY HH:mm"),
        }),
        columnHelper.accessor("glCode", {
          header: () => "GL Code",
          cell: (info) => info.renderValue() ?? "-",
        }),
        columnHelper.accessor("productSubaccountId", {
          header: () => "Product Subaccount ID",
          cell: (info) => info.renderValue() ?? "-",
        }),
        columnHelper.accessor("uploadedAt", {
          header: () => "Uploaded At",
          cell: (info) =>
            dayjs(info.renderValue()).format("MMM DD, YYYY HH:mm"),
        }),
        columnHelper.accessor("uploadedByUser", {
          header: () => "Uploaded By",
          cell: (info) => info.renderValue() ?? "-",
        }),
        columnHelper.accessor("passedValidation", {
          header: () => "Validation Status",
          cell: (info) => (info.renderValue() ? "Passed" : "Failed"),
        }),
        columnHelper.accessor("validationMessage", {
          header: () => "Validation Message",
          cell: (info) => info.renderValue() ?? "-",
        }),
      ];
    }
    return definition;
  }, [params]);

  const table = useReactTable({
    data: batchUploadFailures?.data.content || [],
    columns,
    manualPagination: true,
    state: {
      pagination,
    },
    pageCount: batchUploadFailures?.data.totalPages || 0,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
        <PageTitle
          title={`Batch Entry Status Report - ${params.id}`}
          subTitle="View batch entry status"
          showAdd={false}
          showBackButton
          showSearch={false}
          backButtonRoute="/account/gl/reports/batch-upload"
        />
      </div>

      {batchUploadFailures?.summary && (
        <Alert
          type="info"
          message="Summary"
          description={batchUploadFailures.summary}
          showIcon
        />
      )}
      <div className="flex flex-col gap-y-6">
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

export default BatchUploadReports;
