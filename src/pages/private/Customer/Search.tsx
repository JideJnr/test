import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import DynamicTable from "@/components/common/Table";
import { ICustomer } from "@/interfaces/iCustomer";
import Pagination from "@/components/common/Pagination";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AiOutlineSearch, AiOutlineUserAdd } from "react-icons/ai";
import Button from "@/components/common/Button";
import { IUser } from "@/interfaces/iUserManagement";

const columnHelper = createColumnHelper<ICustomer>();
const columns: any = [
  columnHelper.accessor("passportPhoto", {
    cell: (info) => {
      const passport = info.getValue();

      if (passport && passport.fileName) {
        return <Avatar src={`/file/${passport.fileName}`} />;
      }

      return <Avatar icon={<UserOutlined />} />;
    },
    header: () => "Image",
  }),
  columnHelper.accessor("customerId", {
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
];

const CustomerSearch: React.FC = () => {
  const {
    customerStore,
    authStore: { user: originalUser, impersonated_user },
  } = useStore();
  const { getCustomers, customers, loading } = customerStore;
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(impersonated_user || originalUser);

  useEffect(() => {
    setUser(impersonated_user || originalUser);
  }, [impersonated_user, originalUser]);

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="border-b">
        <PageTitle
          title="Customer Search"
          subTitle="Search for customer"
          showAdd={false}
          showSearch={false}
          onSearch={(e) => {
            if (e.length >= 3) {
              getCustomers(e);
            }
          }}
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
          placeholder="Search for customer"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && search.length >= 3) {
              e.preventDefault();

              getCustomers(search);
            }
          }}
        />
        <div className="w-full flex gap-2">
          <Button
            onClick={(e) => {
              if (search.length >= 3) {
                getCustomers(search);
              }
            }}
            className="w-1/2 md:w-fit h-12"
            title={
              <div className="flex items-center justify-center gap-x-2">
                <AiOutlineSearch className="text-lg" />
                <span className="text-sm">Search</span>
              </div>
            }
            type={"primary"}
            size={"large"}
          ></Button>
          {user && user.role === "ACCOUNT_OFFICER" && (
            <Button
              onClick={(e) => navigate(`/account/customer/add`)}
              className="w-1/2 md:w-fit h-12 md:ml-auto"
              title={
                <div className="flex items-center justify-center gap-x-2">
                  <AiOutlineUserAdd className="text-lg" />
                  <span className="text-sm">Add Customer</span>
                </div>
              }
              type={"default"}
              size={"large"}
            ></Button>
          )}
        </div>
      </div>

      <div className="flex flex-col min-h-[600px] mt-12">
        <DynamicTable
          table={table}
          fetchingAll={loading}
          isNavigating={!!(user.role !== "ACCOUNT_OFFICER")}
          onClick={(data: ICustomer) => {
            user.role !== "ACCOUNT_OFFICER" &&
              navigate(`/account/customer/${data.customerId}`);
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

export default CustomerSearch;
