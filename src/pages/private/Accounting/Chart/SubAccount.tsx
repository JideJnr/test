import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  FilterFn,
  getSortedRowModel,
} from "@tanstack/react-table";
import Pagination from "@/components/common/Pagination";
import DynamicTable from "@/components/common/Table";
import Button from "@/components/common/Button";
import { AiOutlineSearch } from "react-icons/ai";
import { RiAddLine, RiEdit2Line } from "react-icons/ri";
import { SubAccount } from "@/interfaces/iLoan";
import useStore from "@/store";
import { useEffect, useState } from "react";
import { UpsertChartModal } from "@/components/Chart/AddChartModal";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { VscKebabVertical } from "react-icons/vsc";
import { rankItem } from "@tanstack/match-sorter-utils";
import { CSVLink } from "react-csv";
import { BsFiletypeCsv } from "react-icons/bs";

const columnHelper = createColumnHelper<SubAccount>();

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

const SubAccountComponent: React.FC<any> = () => {
  const [showUpsert, setShowUpsert] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<SubAccount>(null);

  const {
    postingStore: { subAccounts, getSubAccounts, loading, message },
  } = useStore();

  useEffect(() => {
    if (message) {
      setShowUpsert(false);
      setSelected(null);
    }
  }, [message]);

  const columns: any = [
    columnHelper.accessor("id", {
      header: () => "ID",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("categoryName", {
      header: () => "Category",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("subCategoryName", {
      header: () => "Sub-Category",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("accountName", {
      header: () => "Account",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("balanceSheetType", {
      header: () => "Balance Sheet Type",
      cell: (info) => info.renderValue(),
    }),
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Dropdown
          menu={{ items: getDropdownItems(row.original) }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <VscKebabVertical />
          </a>
        </Dropdown>
      ),
    },
  ];

  const getDropdownItems = (rowData: SubAccount): MenuProps["items"] => {
    return [
      {
        label: (
          <a
            className="flex items-center gap-2"
            onClick={() => {
              setSelected(rowData);
              setShowUpsert(true);
            }}
          >
            <RiEdit2Line />
            Edit
          </a>
        ),
        key: "0",
      },
    ];
  };

  const table = useReactTable({
    data: subAccounts,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter: search,
    },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    getSubAccounts();
  }, []);

  return (
    <>
      <div className="flex items-center flex-col sm:flex-row gap-2 mt-8">
        <input
          type="search"
          name="search"
          autoComplete="off"
          autoFocus
          className="form-input w-full md:w-2/4 lg:w-1/3 h-12"
          placeholder="Search for sub-accounts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          onClick={(e) => setShowUpsert(true)}
          className="w-1/2 md:w-fit h-12 md:ml-auto"
          title={
            <div className="flex items-center justify-center gap-x-2">
              <RiAddLine className="text-lg" />
              <span className="text-sm">Add Sub-Account</span>
            </div>
          }
          type={"default"}
          size={"large"}
        ></Button>
        <CSVLink data={subAccounts} filename={`chart-subaccount.csv`}>
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

      <UpsertChartModal
        show={showUpsert}
        onClose={() => {
          setShowUpsert(false);
        }}
        data={selected}
      />
    </>
  );
};

export default SubAccountComponent;
