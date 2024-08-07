import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnDef,
  getSortedRowModel,
} from "@tanstack/react-table";
import Pagination from "@/components/common/Pagination";
import DynamicTable from "@/components/common/Table";
import { IStatement } from "@/interfaces/iCustomer";
import StringFormat from "@/shared/utils/string";
import dayjs from "dayjs";
import { forwardRef, useMemo } from "react";

const columnHelper = createColumnHelper<IStatement>();

const Statement = forwardRef<
  HTMLDivElement,
  {
    data: any[];
    fetching: boolean;
    showId?: boolean;
  }
>(({ data, fetching, showId }, ref) => {
  const columns = useMemo<ColumnDef<IStatement>[]>(() => {
    const baseColumns = [
      columnHelper.accessor("postingDate", {
        header: () => "Post Date",
        cell: (info) => dayjs(info.getValue()).format("DD-MMM-YYYY hh:mm A"),
      }),
      columnHelper.accessor("valueDate", {
        header: () => "Value Date",
        cell: (info) => dayjs(info.getValue()).format("DD-MMM-YYYY hh:mm A"),
      }),
      columnHelper.accessor("transactionId", {
        header: () => "Transaction ID",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("transactionDescription", {
        header: () => <div className="min-w-[300px] !w-[50%]">Narration</div>,
        cell: (info) => info.renderValue(),
      }),
      {
        id: "debit",
        header: "Debit",
        accessorFn: (row) => {
          if (row.drCrFlag === "DR") {
            return StringFormat.formatNumber(row.transactionAmount);
          } else {
            return "-";
          }
        },
      },
      {
        id: "credit",
        header: "Credit",
        accessorFn: (row) => {
          if (row.drCrFlag === "CR") {
            return StringFormat.formatNumber(row.transactionAmount);
          } else {
            return "-";
          }
        },
      },
      columnHelper.accessor("balance", {
        header: () => "Balance",
        cell: (info) => StringFormat.formatNumber(info.renderValue()) || "0.00",
      }),
    ];

    if (!showId) {
      const indexToRemove = 2;
      return baseColumns.filter((_, index) => index !== indexToRemove);
    }

    return baseColumns;
  }, [showId]);

  const table = useReactTable({
    data: data.sort((a: IStatement, b: IStatement) => {
      const dateA = new Date(a.valueDate);
      const dateB = new Date(b.valueDate);

      return dateA.getTime() - dateB.getTime();
    }),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col min-h-[600px] mt-20" ref={ref}>
      <DynamicTable
        table={table}
        fetchingAll={fetching}
        isNavigating={false}
        emptyStateMessage={"No Statement Record"}
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
  );
});

export default Statement;
