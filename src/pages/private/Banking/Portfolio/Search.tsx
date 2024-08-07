import React, { useMemo, useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnDef,
  getSortedRowModel,
} from "@tanstack/react-table";
import DynamicTable from "@/components/common/Table";
import { ICustomer } from "@/interfaces/iCustomer";
import Pagination from "@/components/common/Pagination";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useSearch } from "@/hooks/useSearch";
import { useNavigate } from "react-router-dom";
import { IUser } from "@/interfaces/iUserManagement";

const columnHelper = createColumnHelper<ICustomer>();
const PortfolioCustomerSearch: React.FC = () => {
  const navigate = useNavigate();
  const {
    customerStore: { getOfficersCustomers, officersCustomers, loading },
    authStore: { user: originalUser, impersonated_user },
  } = useStore();
  const [search, setSearch] = useState<string>("");
  const searcher = useSearch(search);
  const [user, setUser] = useState<IUser>(impersonated_user || originalUser);

  useEffect(() => {
    setUser(impersonated_user || originalUser);
  }, [impersonated_user, originalUser]);

  useEffect(() => {
    getOfficersCustomers(user.id);
  }, []);

  const columns = useMemo<ColumnDef<ICustomer>[]>(
    () => [
      columnHelper.accessor("passportPhoto", {
        cell: (info) => {
          const passport = info.getValue();

          if (passport) {
            return <Avatar src={`/file/${passport}`} />;
          }

          return <Avatar icon={<UserOutlined />} />;
        },
        header: () => "Image",
      }),
      columnHelper.accessor("id", {
        cell: (info) => info.getValue(),
        header: () => "ID",
      }),
      columnHelper.accessor("lastName", {
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
      }),
      columnHelper.accessor("firstName", {
        cell: (info) => info.getValue() ?? "--",
        header: () => <span>First Name</span>,
      }),
      columnHelper.accessor("email", {
        header: () => "Email Address",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("mobile", {
        header: () => "Phone Number",
        cell: (info) => info.renderValue(),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: officersCustomers,
    columns,
    ...searcher,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="border-b">
        <PageTitle
          title="My Customers"
          subTitle="List of customers you onboarded"
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
          placeholder="Search for customer..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col min-h-[600px] mt-12">
        <DynamicTable
          table={table}
          fetchingAll={loading}
          isNavigating={true}
          onClick={(data: ICustomer) => {
            navigate(`/account/customer/${data.id}`);
          }}
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

export default PortfolioCustomerSearch;
