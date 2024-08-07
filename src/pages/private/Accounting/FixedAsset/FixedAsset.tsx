import Button from "@/components/common/Button";
import PageTitle from "@/components/common/PageTitle";
import Pagination from "@/components/common/Pagination";
import DynamicTable from "@/components/common/Table";
import { useSearch } from "@/hooks/useSearch";
import { IFixedAsset } from "@/interfaces/iPosting";
import Alert from "@/shared/utils/alert";
import StringFormat from "@/shared/utils/string";
import useStore from "@/store";
import { Dropdown, type MenuProps } from "antd";
import { CSVLink } from "react-csv";
import dayjs, { Dayjs } from "dayjs";
import { BsFiletypeCsv } from "react-icons/bs";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin2Line } from "react-icons/ri";
import { VscKebabVertical } from "react-icons/vsc";

const columnHelper = createColumnHelper<IFixedAsset>();

const FixedAsset = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const {
    postingStore: { loading, fixedAssets, getFixedAssets, terminateFixedAsset },
  } = useStore();
  const searcher = useSearch(search);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    getFixedAssets();
  }, []);

  const columns: any = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: () => <span>ID</span>,
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: () => <span>Name</span>,
    }),
    columnHelper.accessor("assetStatus", {
      header: () => "Status",
      cell: (info) => info.renderValue().replace(/_/g, " ") || "--",
    }),
    columnHelper.accessor("acquisitionCost", {
      header: () => "acquisition Cost",
      cell: (info) => StringFormat.formatNumber(info.renderValue()),
    }),
    columnHelper.accessor("acquisitionDate", {
      header: () => "acquisition Date",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("usefulLifeMonths", {
      header: () => "Useful Life Months",
      cell: (info) => info.renderValue() || "--",
    }),
    columnHelper.accessor("salvageValue", {
      header: () => "salvage Value",
      cell: (info) => StringFormat.formatNumber(info.renderValue()),
    }),
    columnHelper.accessor("description", {
      header: () => "description",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("assetSubaccount", {
      header: () => "Asset Sub-Account",
      cell: (info) => info.renderValue() || "N/A",
    }),
    columnHelper.accessor("bankSubaccount", {
      header: () => "Bank Sub-Account",
      cell: (info) => info.renderValue() || "N/A",
    }),
    columnHelper.accessor("deprSubaccount", {
      header: () => "Depreciation Expenses Sub-Account",
      cell: (info) => info.renderValue() || "N/A",
    }),
    columnHelper.accessor("accumDeprSubaccount", {
      header: () => "Accumulated Depreciation Sub-Account",
      cell: (info) => info.renderValue() || "N/A",
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

  const getDropdownItems = (rowData: IFixedAsset): MenuProps["items"] => {
    return [
      {
        label: (
          <a
            className="!text-red-600 flex items-center gap-2"
            onClick={() => {
              Alert.confirm(
                "Confirm",
                "Are you sure you want to dispose fixed asset?",
                async (response) => {
                  if (response.isConfirmed) {
                    await terminateFixedAsset(rowData.id);
                  }
                }
              );
            }}
          >
            <RiDeleteBin2Line />
            Dispose
          </a>
        ),
        key: "0",
      },
    ];
  };

  const table = useReactTable({
    data: fixedAssets,
    columns,
    ...searcher,
    state: {
      ...searcher.state,
      sorting: sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });



  return (
    <div>
      <div className="border-b">
        <PageTitle
          title="Fixed Assets"
          subTitle="View all fixed assets"
          showAdd={false}
          showSearch={false}
        />
      </div>

      <div className="flex items-center flex-col sm:flex-row gap-2 mt-20">
        <input
          type="search"
          name="search"
          autoComplete="off"
          autoFocus
          className="form-input w-full md:w-2/4 lg:w-1/3 h-12"
          value={search}
          placeholder="Search for assets..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          onClick={(e) => navigate(`/account/gl/fixed-assets/book`)}
          className="w-1/2 md:w-fit h-12 md:ml-auto"
          title={
            <div className="flex items-center justify-center gap-x-2">
              <AiOutlinePlus className="text-lg" />
              <span className="text-sm">Book</span>
            </div>
            }
            type={"default"}
            size={"large"}>
              
          </Button>
          <CSVLink
              className="md:ml-2"
              data={fixedAssets}
              filename={`fixed_asset_${dayjs().format(
                "YYYY-MM-DD"
              )}.csv`}
            >
              <Button
                title={<BsFiletypeCsv className="text-2xl" />}
                onClick={() => {}}
                className="min-w-[50px]"
                size="large"
              />
          </CSVLink>
      </div>

      <div className="flex flex-col min-h-[600px] mt-12">
        <DynamicTable
          table={table}
          fetchingAll={loading}
          isNavigating={false}
          emptyStateMessage={"No record found"}
          canSort
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
  );
};

export default FixedAsset;
