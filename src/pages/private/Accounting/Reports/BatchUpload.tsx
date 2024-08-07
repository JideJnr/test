import { useEffect, useState } from "react";
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
import { IBatchUploadReport } from "@/interfaces/iPosting";
import { IPaginationRequest } from "@/interfaces";
import Button from "@/components/common/Button";
import StringFormat from "@/shared/utils/string";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { HiOutlineRefresh } from "react-icons/hi";

const BatchUploadReports = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    postingStore: {
      loading,
      processing,
      batchUploads,
      getBatchUploadsReport,
      commitBatchUpload,
      message: msg,
      error,
      clearErrorAndMessage,
    },
    miscStore: { setSpinner },
  } = useStore();
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });
  const [backPath, setBackPath] = useState<boolean>(false);

  useEffect(() => {
    const previousLocationPathname: string | undefined =
      location?.state?.previousPath;
    const allowedPreviousPaths = [
      "/account/banking/entry/posting",
      "/account/gl/journal/posting",
    ];

    if (allowedPreviousPaths.includes(previousLocationPathname)) {
      setBackPath(true);
    }
  }, [location]);

  useEffect(() => {
    const requestPagination: IPaginationRequest = {
      pageNumber: pagination.pageIndex,
      recordsPerPage: pagination.pageSize,
    };

    getBatchUploadsReport(requestPagination);
  }, [pagination]);

  useEffect(() => {
    setSpinner(processing);
  }, [processing]);

  useEffect(() => {
    if (msg) {
      message.success(msg);
      setPagination({ ...pagination, pageIndex: 0 });
    }

    if (error) {
      message.error(error);
    }

    return () => {
      clearErrorAndMessage();
    };
  }, [error, msg, clearErrorAndMessage]);

  const processor = async (
    id: string,
    status: string,
    type: string
  ): Promise<void> => {
    switch (status) {
      case "VALIDATION FAILED":
      case "PROCESSING COMPLETED":
        return navigate(
          `/account/gl/reports/batch-upload/failed/${id}/${type}`
        );
      case "VALIDATION PASSED":
        return await commitBatchUpload(id, type);
      default:
        return;
    }
  };

  const processorLabel = (status: string): string => {
    switch (status) {
      case "VALIDATION FAILED":
      case "PROCESSING COMPLETED":
        return "View";
      case "VALIDATION PASSED":
        return "Commit";
      default:
        return "";
    }
  };

  const columnHelper = createColumnHelper<IBatchUploadReport>();
  const columns: ColumnDef<IBatchUploadReport>[] = [
    columnHelper.accessor("transactionId", {
      header: () => "Transaction ID",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("batchFileType", {
      header: () => "Batch File Type",
      cell: (info) => StringFormat.toTitleCase2(info?.renderValue() ?? "-"),
    }),
    columnHelper.accessor("batchFileStatus", {
      header: () => "Batch File Status",
      cell: (info) => StringFormat.toTitleCase2(info?.renderValue() ?? "-"),
    }),
    columnHelper.accessor("dateCreated", {
      header: () => "Date Uploaded",
      cell: (info) => dayjs(info.renderValue()).format("MMM DD, YYYY HH:mm"),
    }),
    {
      id: "user",
      header: () => "Uploaded By",
      cell: (info) => `${info.row.original.uploadedBy}`,
    },
    {
      id: "action",
      header: () => "Action",
      enableSorting: false,
      cell: (info) => {
        if (
          info.row.original.batchFileStatus &&
          !["VALIDATION IN PROGRESS"].includes(
            info.row.original.batchFileStatus
          )
        ) {
          return (
            <Button
              className="min-w-[60px]"
              size="xsmall"
              title={processorLabel(info.row.original.batchFileStatus)}
              onClick={() =>
                processor(
                  info.row.original.transactionId,
                  info.row.original.batchFileStatus,
                  info.row.original.batchFileType
                )
              }
            />
          );
        } else {
          return "--";
        }
      },
    },
  ];

  const table = useReactTable({
    data: batchUploads?.content || [],
    columns,
    manualPagination: true,
    state: {
      pagination,
    },
    pageCount: batchUploads?.totalPages || 0,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
        <PageTitle
          title="Batch Uploads Report"
          subTitle="View all batch uploads, commit and check validation status"
          showAdd={false}
          showBackButton={!!backPath}
          backButtonRoute={
            !!backPath && location.state ? location.state?.previousPath : "/"
          }
          showSearch={false}
        />
      </div>

      <div className="mt-4 flex flex-col gap-y-6">
        <div className="flex items-center gap-1 mt-4">
          <Button
            title={
              <>
                <HiOutlineRefresh className="text-lg" />
                <span className="text-lg">Refresh</span>
              </>
            }
            className="flex items-center gap-2 bg-transparent hover:bg-transparent !text-gray-700 hover:text-gray-900 border-0"
            onClick={() => setPagination({ ...pagination, pageIndex: 0 })}
            size="small"
          />
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
          />
        </div>
      </div>
    </div>
  );
};

export default BatchUploadReports;
