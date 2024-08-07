import React, { useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import { message, Modal, Select } from "antd";
import Button from "@/components/common/Button";
import { IModal } from "@/interfaces/iModal";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import { IEmployer } from "@/interfaces/iCustomer";
import DynamicTable from "@/components/common/Table";
import { useNavigate } from "react-router-dom";
import useStore from "@/store";
import Pagination from "@/components/common/Pagination";
import * as nigerianStates from "nigerian-states-and-lgas";
import { Controller, useForm } from "react-hook-form";
import ModalClose from "@/components/common/ModalClose";
import { useSearch } from "@/hooks/useSearch";

const columnHelper = createColumnHelper<IEmployer>();
const columns: any = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
    header: () => <span>Company Name</span>,
  }),
  columnHelper.accessor((row) => row.address, {
    id: "address",
    cell: (info) => info.getValue(),
    header: () => <span>Address</span>,
  }),
];

const SystemEmployer: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const {
    customerStore: {
      fetching,
      employers,
      getEmployers,
      message: msg,
      error,
      clearErrorAndMessage,
    },
  } = useStore();
  const [showUpsertModal, setShowUpsertModal] = useState<boolean>(false);
  const searcher = useSearch(search);

  useEffect(() => {
    getEmployers();
  }, []);

  useEffect(() => {
    if (msg) {
      message.success(msg);
      setShowUpsertModal(false);
    }

    if (error) {
      message.error(error);
    }

    return () => {
      clearErrorAndMessage();
    };
  }, [error, msg, clearErrorAndMessage]);

  const table = useReactTable({
    data: employers,
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
          title="System Employer"
          subTitle="View Existing System Employers"
          showAdd
          onAddClick={() => {
            setShowUpsertModal(true);
          }}
          buttonAddConfig={{
            title: "Add Employer",
            type: "default",
          }}
          showSearch={false}
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
            placeholder="Search employers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col min-h-[700px] mt-12">
          <DynamicTable
            table={table}
            fetchingAll={fetching}
            isNavigating={false}
            emptyStateMessage={""}
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

      <RoleUpsert
        show={showUpsertModal}
        onClose={() => setShowUpsertModal(false)}
      />
    </div>
  );
};

export default SystemEmployer;

const RoleUpsert: React.FC<IModal> = ({ show, onClose }) => {
  const {
    customerStore: { processing, createEmployer },
  } = useStore();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState,
    formState: { isValid },
  } = useForm<
    IEmployer & {
      state: string;
      lga: string;
    }
  >({
    mode: "onChange",
  });
  const states = nigerianStates.states();
  const [localGovt, setLocalGovt] = useState<string[]>();

  useEffect(() => {
    const subscription = watch((e) => {
      if (e.state) {
        const lga = nigerianStates.lgas(e.state);
        setLocalGovt(lga);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, formState]);

  const onSubmit = async (
    formData: IEmployer & {
      state: string;
      lga: string;
    }
  ) => {
    const { lga, state, address, ...rest } = formData;
    const newAddress = `${address}, ${lga}, ${state}`;

    await createEmployer({
      ...rest,
      address: newAddress,
    });
  };

  return (
    <>
      <Modal
        closeIcon={<ModalClose />}
        open={show}
        onCancel={onClose}
        footer={null}
        title={
          <PageTitle
            showAdd={false}
            showSearch={false}
            isModal
            title={"Add Employer"}
            subTitle={"Create new system employer"}
          />
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mb-4">
            <label htmlFor="name" className="block mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: true })}
              className="form-input w-full"
              placeholder="Enter company name here"
            />
          </div>
          <div className="w-full mb-4">
            <label htmlFor="address" className="block mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              {...register("address", { required: true })}
              className="form-input w-full"
              placeholder="Enter address here"
            />
          </div>
          <div className="w-full mb-4">
            <label htmlFor="state" className="block mb-1">
              Address State
            </label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Select
                  id="state"
                  showSearch
                  size="large"
                  className="w-full formSingleSelect"
                  placeholder="Select State"
                  options={states.map((state) => {
                    return {
                      label: state,
                      value: state,
                    };
                  })}
                  {...field}
                ></Select>
              )}
            />
          </div>
          <div className="w-full mb-12">
            <label htmlFor="lga" className="block mb-1">
              Address LGA
            </label>
            <Controller
              name="lga"
              control={control}
              render={({ field }) => (
                <Select
                  id="lga"
                  size="large"
                  showSearch
                  className="w-full"
                  placeholder="Select Local Govt"
                  options={localGovt?.map((lga) => {
                    return {
                      label: lga,
                      value: lga,
                    };
                  })}
                  {...field}
                ></Select>
              )}
            />
          </div>
          <div className="mb-3 mt-auto flex gap-4 justify-end items-center">
            <a
              onClick={() => onClose()}
              className="text-red-600 hover:text-red-700 w-24"
            >
              Close
            </a>
            <Button
              title="Create"
              type="primary"
              size="large"
              disabled={!isValid || processing}
              forForm
              isLoading={processing}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};
