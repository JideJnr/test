import { useEffect, useMemo, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, Dropdown, message } from "antd";
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
import DynamicTable from "@/components/common/Table";
import Pagination from "@/components/common/Pagination";
import { IAccountingPeriod } from "@/interfaces/iPosting";
import type { MenuProps } from "antd";
import { VscKebabVertical } from "react-icons/vsc";
import { RiCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import StringFormat from "@/shared/utils/string";

const columnHelper = createColumnHelper<IAccountingPeriod>();
const { RangePicker } = DatePicker;
type RangeValue = [Dayjs | null, Dayjs | null] | null;

const CreateAccountPeriod = () => {
  const {
    postingStore: {
      loading,
      processing,
      message: msg,
      error,
      getAccountingPeriods,
      openAccountingPeriod,
      deleteAccountingPeriod,
      accountingPeriods,
      clearErrorAndMessage,
    },
    miscStore: { setSpinner },
  } = useStore();
  const navigate = useNavigate();
  const [dates, setDates] = useState<RangeValue>(null);
  const [range, setRange] = useState<RangeValue>([
    dayjs().startOf("year"),
    dayjs(),
  ]);

  const disabledDate = (current) => {
    const firstDayOfYear = current && current.startOf("year");
    return current && !current.isSame(firstDayOfYear, "day");
  };

  useEffect(() => {
    getAccountingPeriods();
  }, []);

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

  const columns: ColumnDef<IAccountingPeriod>[] = [
    columnHelper.accessor("dateCreated", {
      header: () => "Date Created",
      cell: (info) =>
        info.renderValue()
          ? dayjs(info.renderValue()).format("YYYY-MM-DD")
          : "--",
    }),
    columnHelper.accessor("startDate", {
      header: () => "Start Date",
      cell: (info) =>
        info.renderValue()
          ? dayjs(info.renderValue()).format("YYYY-MM-DD")
          : "--",
    }),
    columnHelper.accessor("createdBy", {
      header: () => "Created By",
      cell: (info) => info.renderValue() ?? "--",
    }),
    columnHelper.accessor("periodName", {
      header: () => "Period Name",
      cell: (info) => info.renderValue() ?? "--",
    }),
    columnHelper.accessor("periodEndClosingSubaccount", {
      header: () => "Sub Account",
      cell: (info) => info.renderValue() ?? "--",
    }),
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs font-semibold leading-5 text-white rounded-full ${
            row.original.periodStatus === "OPEN"
              ? "bg-green-500"
              : row.original.periodStatus === "CLOSED"
              ? "bg-red-500"
              : "bg-yellow-700"
          }`}
        >
          {StringFormat.toTitleCase(row.original.periodStatus)}
        </span>
      ),
    },
    columnHelper.accessor("closedBy", {
      header: () => "Closed By",
      cell: (info) => info.renderValue() ?? "--",
    }),
    columnHelper.accessor("endDate", {
      header: () => "End Date",
      cell: (info) =>
        info.renderValue()
          ? dayjs(info.renderValue()).format("YYYY-MM-DD")
          : "--",
    }),
    columnHelper.accessor("dateClosed", {
      header: () => "Date Closed",
      cell: (info) =>
        info.renderValue()
          ? dayjs(info.renderValue()).format("YYYY-MM-DD")
          : "--",
    }),
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => {
        if (row.original.periodStatus === "OPEN") {
          return (
            <Dropdown
              menu={{ items: getDropdownItems(row.original) }}
              trigger={["click"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                <VscKebabVertical />
              </a>
            </Dropdown>
          );
        } else {
          return "--";
        }
      },
    },
  ];

  const getDropdownItems = (rowData: IAccountingPeriod): MenuProps["items"] => {
    const list = [];

    if (rowData.periodStatus === "OPEN") {
      list.push({
        label: (
          <a
            className="flex items-center gap-2"
            onClick={() => {
              navigate(`/account/gl/accounting-period/${rowData.id}`);
            }}
          >
            <RiCloseLine />
            Close
          </a>
        ),
        key: "0",
      });
    }

    // if (!rowData.isClosed) {
    //   list.push({
    //     label: (
    //       <a
    //         className="flex items-center gap-2"
    //         onClick={() => {
    //           Alert.confirm(
    //             "Confirm Delete",
    //             "Are you sure you want to delete this accounting period?",
    //             async (response) => {
    //               if (response.isConfirmed) {
    //                 await deleteAccountingPeriod(rowData.id);
    //               }
    //             }
    //           );
    //         }}
    //       >
    //         <RiDeleteBin5Line />
    //         Delete
    //       </a>
    //     ),
    //     key: "1",
    //   });
    // }

    return list;
  };

  const table = useReactTable({
    data: accountingPeriods || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rowData = table.getFilteredRowModel().rows.map((row) => {
    return {
      "Date Created": row.original.dateCreated
        ? dayjs(row.original.dateCreated).format("YYYY-MM-DD")
        : "",
      "Start Date": row.original.startDate
        ? dayjs(row.original.startDate).format("YYYY-MM-DD")
        : "",
      "Created By": row.original.createdBy,
      "Period Name": row.original.periodName,
      "Sub Account": row.original.periodEndClosingSubaccount,
      Status: StringFormat.toTitleCase(row.original.periodStatus),
      "Closed By": row.original.closedBy,
      "End Date": row.original.endDate
        ? dayjs(row.original.endDate).format("YYYY-MM-DD")
        : "",
      "Date Closed": row.original.dateClosed
        ? dayjs(row.original.dateClosed).format("YYYY-MM-DD")
        : "",
    };
  });

  return (
    <div>
      <div className="border-b">
        <PageTitle
          title="Accounting Period"
          subTitle="Manage accounting period"
          showAdd={false}
          showBackButton={false}
          showSearch={false}
        />
      </div>

      <div className="mt-12 flex flex-col gap-y-6">
        <div className="flex items-center flex-col sm:flex-row gap-2 mt-8">
          <RangePicker
            allowClear={false}
            value={dates || range}
            onCalendarChange={(val) => {
              setDates(val);
            }}
            onChange={(payload) => {
              setRange(payload);
            }}
            // disabledDate={disabledDate}
            className="md:min-w-[300px]"
          />
          <Button
            title="Open Period"
            size="large"
            onClick={async () => {
              await openAccountingPeriod({
                startDate: range[0].format("YYYY-MM-DD"),
                endDate: range[1].format("YYYY-MM-DD"),
              });
            }}
            className="text-sm"
            type="primary"
          />

          <CSVLink
            className="md:ml-auto"
            data={rowData}
            filename={`accounting-period.csv`}
          >
            <Button
              title={<BsFiletypeCsv className="text-2xl" />}
              onClick={() => {}}
              className="min-w-[50px]"
              size="large"
            />
          </CSVLink>
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

export default CreateAccountPeriod;
