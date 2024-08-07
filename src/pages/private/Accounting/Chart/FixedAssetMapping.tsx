import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnDef,
  FilterFn,
  getSortedRowModel,
} from "@tanstack/react-table";
import Pagination from "@/components/common/Pagination";
import DynamicTable from "@/components/common/Table";
import Button from "@/components/common/Button";
import { RiAddLine, RiDeleteBin2Line } from "react-icons/ri";
import { VscKebabVertical } from "react-icons/vsc";
import { IFixedAssetMapping } from "@/interfaces/iPosting";
import useStore from "@/store";
import { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import Alert from "@/shared/utils/alert";
import { rankItem } from "@tanstack/match-sorter-utils";
import { CSVLink } from "react-csv";
import { BsFiletypeCsv } from "react-icons/bs";
import { FixedAssetMapModal } from "@/components/Chart/FixedAssetMapModal";

const columnHelper = createColumnHelper<IFixedAssetMapping>();

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

const FixedAssetMapping: React.FC<any> = () => {
  const [search, setSearch] = useState<string>("");
  const [showUpsert, setShowUpsert] = useState<boolean>(false);
  const {
    postingStore: {
      fixedAssetMap,
      getAllFixedAssetMappings,
      loading,
      processing,
      removeFixedAssetMap,
    },
    miscStore: { setSpinner },
  } = useStore();

  useEffect(() => {
    getAllFixedAssetMappings();
  }, []);

  const columns: ColumnDef<IFixedAssetMapping>[] = [
    columnHelper.accessor("id", {
      header: () => "ID",
      cell: (info) => info.renderValue(),
    }),
    {
      id: "assetSubaccountId",
      header: "Fixed Asset",
      cell: ({ row }) =>
        row.original.assetSubaccountId + " - " + row.original.assetSubaccount,
    },
    {
      id: "depreciationExpenseSubaccountId",
      header: "Depereciation Expenses",
      cell: ({ row }) =>
        row.original.depreciationExpenseSubaccountId +
        " - " +
        row.original.depreciationExpenseSubaccount,
    },
    {
      id: "accumulatedDepreciationSubaccountId",
      header: "Accumulated Depreciation",
      cell: ({ row }) =>
        row.original.accumulatedDepreciationSubaccountId +
        " - " +
        row.original.accumulatedDepreciationSubaccount,
    },
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

  const getDropdownItems = (
    rowData: IFixedAssetMapping
  ): MenuProps["items"] => {
    return [
      {
        label: (
          <a
            className="!text-red-600 flex items-center gap-2"
            onClick={() => {
              Alert.confirm(
                "Confirm",
                "Are you sure you want to delete this item?",
                async (response) => {
                  if (response.isConfirmed) {
                    await removeFixedAssetMap(rowData.id);
                  }
                }
              );
            }}
          >
            <RiDeleteBin2Line />
            Remove
          </a>
        ),
        key: "0",
      },
    ];
  };

  const table = useReactTable({
    data: fixedAssetMap || [],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter: search,
    },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    setSpinner(processing && !showUpsert);
  }, [processing, showUpsert]);

  return (
    <>
      <div className="flex items-center flex-col sm:flex-row gap-2 mt-8">
        <input
          type="search"
          name="search"
          autoComplete="off"
          autoFocus
          className="form-input w-full md:w-2/4 lg:w-1/3 h-12"
          placeholder="Search for transaction mappings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          onClick={(e) => setShowUpsert(true)}
          className="w-1/2 md:w-fit h-12 md:ml-auto"
          title={
            <div className="flex items-center justify-center gap-x-2">
              <RiAddLine className="text-lg" />
              <span className="text-sm">New Mapping</span>
            </div>
          }
          type={"default"}
          size={"large"}
        ></Button>

        <CSVLink
          data={fixedAssetMap || []}
          filename={`chart-fixed-asset-map.csv`}
        >
          <Button
            title={<BsFiletypeCsv className="text-2xl" />}
            onClick={() => {}}
            type="primary"
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

        <FixedAssetMapModal
          show={showUpsert}
          onClose={() => setShowUpsert(false)}
        />
      </div>
    </>
  );
};

export default FixedAssetMapping;
