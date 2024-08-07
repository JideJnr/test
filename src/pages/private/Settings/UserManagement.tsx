import React, { useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import { useNavigate } from "react-router-dom";
import { UserUpsertModal } from "@/pages/private/Settings/UserUpsert";
import { IUser } from "@/interfaces/iUserManagement";
import useUserStore from "@/store/states/user";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import Pagination from "@/components/common/Pagination";
import DynamicTable from "@/components/common/Table";
import StringFormat from "@/shared/utils/string";
import { message } from "antd";
import { useSearch } from "@/hooks/useSearch";

const columnHelper = createColumnHelper<IUser>();
const columns: any = [
  columnHelper.accessor("firstName", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
    header: () => <span>First Name</span>,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: "lastName",
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
  }),
  columnHelper.accessor("username", {
    header: () => "Username",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("email", {
    header: () => "Email Address",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("phone", {
    header: () => "Phone Number",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("active", {
    header: () => "Status",
    cell: (info) => (
      <span
        className={`text-xs font-normal align-middle ml-3 py-0.5 px-2 rounded-md ${
          info.renderValue()
            ? "bg-green-50 text-green-600"
            : "bg-red-50 text-red-600"
        }`}
      >
        {info.renderValue() ? "Active" : "Inactive"}
      </span>
    ),
  }),
  columnHelper.accessor("role", {
    header: () => "Role",
    cell: (info) =>
      info.renderValue() ? StringFormat.toTitleCase(info.renderValue()) : "--",
  }),
];

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const {
    users: fectehedUsers,
    getUsers,
    fetchingAll,
    message: msg,
    error,
    clearErrorAndMessage,
  } = useUserStore();
  const [showUpsertModal, setShowUpsertModal] = useState<boolean>(false);
  const searcher = useSearch(search);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (fectehedUsers) {
      const filteredUsers = fectehedUsers.filter(
        (user) => user.role !== "SUPER_ADMINISTRATOR"
      );

      setUsers(filteredUsers);
    }
  }, [fectehedUsers]);

  useEffect(() => {
    if (msg) {
      message.success(msg);

      setShowUpsertModal(false);
      setTimeout(() => {
        clearErrorAndMessage();
      }, 500);
    }

    if (error) {
      message.error(error);

      setTimeout(() => {
        clearErrorAndMessage();
      }, 500);
    }

    return () => {
      clearErrorAndMessage();
    };
  }, [error, msg, clearErrorAndMessage]);

  const table = useReactTable({
    data: users,
    columns,
    ...searcher,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="border-b">
        <PageTitle
          title="User Management"
          subTitle="Search and view details of system users"
          showAdd
          onAddClick={() => {
            setShowUpsertModal(true);
          }}
          showSearch={false}
          buttonAddConfig={{
            title: "Add User",
            type: "default",
          }}
        />
      </div>

      <div className="mt-12 flex flex-col gap-y-6">
        <div className="flex items-center flex-col sm:flex-row gap-2 mt-8">
          <input
            type="search"
            name="search"
            autoComplete="off"
            autoFocus
            className="form-input w-full md:w-2/4 lg:w-1/3 h-12"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col min-h-[700px] mt-12">
          <DynamicTable
            table={table}
            fetchingAll={fetchingAll}
            isNavigating
            onClick={(data: IUser) => {
              navigate(`/account/settings/user-management/${data.id}`);
            }}
            emptyStateMessage={"No user found"}
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

      <UserUpsertModal
        show={showUpsertModal}
        onClose={() => setShowUpsertModal(false)}
      />
    </div>
  );
};

export default UserManagement;
