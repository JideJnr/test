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
import { RiEdit2Line } from "react-icons/ri";
import { ICategory } from "@/interfaces/iPosting";
import useStore from "@/store";
import { useEffect, useState } from "react";
import { UpsertChartModal } from "@/components/Chart/AddChartModal";
import type { MenuProps } from "antd";
import { useSearch } from "@/hooks/useSearch";
import { BsFiletypeCsv } from "react-icons/bs";
import Button from "@/components/common/Button";
import StringFormat from "@/shared/utils/string";
import { CSVLink } from "react-csv";

const columnHelper = createColumnHelper<ICategory>();

const Category: React.FC<any> = () => {
  const [showUpsert, setShowUpsert] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<ICategory>(null);
  const {
    postingStore: { categories, getCategories, loading, message },
  } = useStore();
  const searcher = useSearch(search);

  useEffect(() => {
    if (message) {
      setShowUpsert(false);
      setSelectedCategory(null);
    }
  }, [message]);

  const columns: ColumnDef<ICategory>[] = [
    columnHelper.accessor("id", {
      header: () => "ID",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => StringFormat.toTitleCase(info.renderValue()),
    }),
    columnHelper.accessor("balanceType", {
      header: () => "Balance Sheet Type",
      cell: (info) => info.renderValue(),
    }),
  ];

  const getDropdownItems = (rowData: ICategory): MenuProps["items"] => {
    return [
      {
        label: (
          <a
            className="flex items-center gap-2"
            onClick={() => {
              setSelectedCategory(rowData);
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
    data: categories,
    columns,
    ...searcher,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    getCategories();
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
          placeholder="Search for category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* <Button
          onClick={(e) => setShowUpsert(true)}
          className="w-1/2 md:w-fit h-12 md:ml-auto"
          title={
            <div className="flex items-center justify-center gap-x-2">
              <RiAddLine className="text-lg" />
              <span className="text-sm">Add Category</span>
            </div>
          }
          type={"default"}
          size={"large"}
        ></Button> */}
        <CSVLink
          className="md:ml-auto"
          data={categories}
          filename={`chart-category.csv`}
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

      <UpsertChartModal
        show={showUpsert}
        onClose={() => {
          setShowUpsert(false);
        }}
        isCategory
        data={selectedCategory}
      />
    </>
  );
};

export default Category;
