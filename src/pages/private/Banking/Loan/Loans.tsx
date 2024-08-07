import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import { useNavigate } from "react-router-dom";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnFiltersState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { ILoanWorkflow, WorkflowStatus } from "@/interfaces/iLoan";
import { useEffect, useMemo, useState } from "react";
import DynamicTable from "@/components/common/Table";
import Pagination from "@/components/common/Pagination";
import { RiAddLine } from "react-icons/ri";
import Button from "@/components/common/Button";
import StringFormat from "@/shared/utils/string";
import dayjs from "dayjs";
import { useSearch } from "@/hooks/useSearch";
import { Select } from "antd";

const columnHelper = createColumnHelper<ILoanWorkflow>();
const columns: any = [
  columnHelper.accessor("dateCreated", {
    cell: (info) => dayjs(info.getValue()).format("DD-MMM-YYYY hh:mm A"),
    header: () => <span>Application Date</span>,
  }),
  columnHelper.accessor("loanAmount", {
    header: () => "Loan Amount",
    cell: (info) => StringFormat.Currency(+info.renderValue()),
  }),
  columnHelper.accessor("loanTenorMths", {
    header: () => "Tenor",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("isTopup", {
    header: () => "Loan type",
    cell: (info) => (info.renderValue() ? "Top up" : "Fresh"),
  }),
  columnHelper.accessor("customerFullName", {
    header: () => "Customer",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("loanProduct", {
    header: () => "Loan Product",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("locationId", {
    header: () => "Location ID",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("locationName", {
    header: () => "Location",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("workflowStatus", {
    header: () => "Status",
    cell: (info) => StringFormat.toTitleCase(info.renderValue()),
  }),
];

const countByStatus = (data: ILoanWorkflow[], status: string) => {
  const filteredData = data.filter((item) => item.workflowStatus === status);
  return filteredData.length || 0;
};

const Loans = () => {
  const {
    loanStore: { loading, workflow, getWorkflow },
    locationStore: { locations, getLocations },
    authStore: { user: originalUser, impersonated_user },
  } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [statusCount, setStatusCount] = useState<{
    new: number;
    pending: number;
  }>({
    new: 0,
    pending: 0,
  });
  const [user, setUser] = useState(impersonated_user || originalUser);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const searcher = useSearch(search);

  const STATUS_OPTIONS: {
    label: string;
    value: WorkflowStatus;
  }[] = useMemo(
    () => [
      {
        label: `New - ${statusCount.new}`,
        value: "NEW_ITEMS",
      },
      {
        label: `Pending - ${statusCount.pending}`,
        value: "PENDING_ITEMS",
      },
    ],
    [statusCount]
  );

  useEffect(() => {
    setUser(impersonated_user || originalUser);
  }, [impersonated_user, originalUser]);

  useEffect(() => {
    getWorkflow(user.id);
  }, []);

  useEffect(() => {
    if (locations.length === 0) {
      getLocations();
    }
  }, [locations]);

  useEffect(() => {
    setStatusCount({
      new: countByStatus(workflow, "NEW_ITEMS"),
      pending: countByStatus(workflow, "PENDING_ITEMS"),
    });
  }, [workflow]);

  const table = useReactTable({
    data: workflow,
    columns,
    ...searcher,
    state: {
      ...searcher.state,
      columnFilters,
      columnVisibility: {
        locationId: false,
      },
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const onLocationChange = (value: string) => {
    table.getColumn("locationName").setFilterValue(value);
  };

  const onStatusChange = (value: WorkflowStatus) => {
    table.getColumn("workflowStatus").setFilterValue(value);
  };

  return (
    <div>
      <div className="border-b">
        <PageTitle
          title="Loans"
          subTitle="View loans on your workflow"
          showAdd={false}
          onAddClick={() => navigate(`/account/banking/loans/book`)}
          buttonAddConfig={{
            title: (
              <div className="flex items-center justify-center gap-x-2">
                <RiAddLine className="text-lg" />
                <span className="text-sm">Loan Application</span>
              </div>
            ),
            size: "large",
            type: "default",
          }}
          showSearch={false}
        />
      </div>

      <div className="flex flex-col min-h-[700px] mt-20">
        <div className="flex flex-col md:flex-row md:items-center mb-12 gap-6">
          <div className="flex flex-col md:flex-row gap-1">
            <input
              type="search"
              name="search"
              autoComplete="off"
              autoFocus
              className="form-input w-full md:w-64 lg:w-64 h-12"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-1">
              <Select
                id="location"
                size="large"
                className="w-full md:w-32"
                placeholder="Status"
                options={STATUS_OPTIONS}
                onChange={(value) => {
                  onStatusChange(value);
                }}
                allowClear
              ></Select>
              <Select
                id="location"
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.label?.toLowerCase().includes(input?.toLowerCase())
                }
                className="w-full md:w-36"
                placeholder="Location"
                options={locations.map((location) => ({
                  label: location.name,
                  value: location.name,
                }))}
                onChange={(value) => {
                  onLocationChange(value);
                }}
                allowClear
              ></Select>
            </div>
          </div>

          <div className="flex gap-2 md:ml-auto">
            {user.role === "ACCOUNT_OFFICER" && (
              <Button
                onClick={(e) => navigate(`/account/banking/loans/book`)}
                className="w-1/2 md:w-fit h-12 md:ml-auto"
                title={
                  <div className="flex items-center justify-center gap-x-2">
                    <RiAddLine className="text-lg" />
                    <span className="text-sm">Loan Application</span>
                  </div>
                }
                type={"default"}
                size={"large"}
              ></Button>
            )}
          </div>
        </div>

        <DynamicTable
          table={table}
          fetchingAll={loading}
          isNavigating
          onClick={(data) =>
            navigate(`/account/banking/loans/${data.loanApplicationId}`)
          }
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
  );
};

export default Loans;
