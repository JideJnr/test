import React, { useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import { message, Modal, Select } from "antd";
import { IModal } from "@/interfaces/iModal";
import Button from "@/components/common/Button";
import { ILocation } from "@/interfaces/iLocation";
import useStore from "@/store";
import { useForm, Controller } from "react-hook-form";

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
import ModalClose from "@/components/common/ModalClose";
import { useSearch } from "@/hooks/useSearch";

const columnHelper = createColumnHelper<ILocation>();
const columns: any = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
    header: () => <span>ID</span>,
  }),
  columnHelper.accessor((row) => row.name, {
    id: "name",
    cell: (info) => info.getValue(),
    header: () => <span>Name</span>,
  }),
];

const LocationManagement: React.FC = () => {
  const {
    locationStore,
    userStore: { getUsers },
  } = useStore();
  const [search, setSearch] = useState<string>("");
  const { locations, loading, getLocations } = locationStore;
  const [showUpsertModal, setShowUpsertModal] = useState<boolean>(false);
  const searcher = useSearch(search);

  useEffect(() => {
    getLocations();
    getUsers();
  }, []);

  const table = useReactTable({
    data: locations,
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
          title="Location"
          subTitle="View Existing locations"
          showAdd
          onAddClick={() => {
            setShowUpsertModal(true);
          }}
          buttonAddConfig={{
            title: "Add Location",
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
            placeholder="Search locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col min-h-[700px] mt-12">
          <DynamicTable
            table={table}
            fetchingAll={loading}
            isNavigating={false}
            emptyStateMessage={"No location found"}
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

      <LocationUpsert
        show={showUpsertModal}
        onClose={() => setShowUpsertModal(false)}
      />
    </div>
  );
};

export default LocationManagement;

const LocationUpsert: React.FC<IModal & { data?: ILocation | null }> = ({
  show,
  onClose,
  data,
}) => {
  const { users } = useStore().userStore;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
    reset,
    control,
  } = useForm<ILocation>({
    mode: "onChange",
  });
  const {
    createLocation,
    processing,
    updateLocation,
    error,
    message: msg,
    clearErrorAndMessage,
  } = useStore().locationStore;

  const onSubmit = (formData: ILocation) => {
    if (data?.id) {
      updateLocation({
        ...data,
        ...formData,
      });
    } else {
      createLocation(formData);
    }
  };

  useEffect(() => {
    if (data) {
      setValue("name", data?.name, { shouldValidate: true });
      setValue("supervisor_user_id", data?.supervisor_user_id, {
        shouldValidate: true,
      });
    }

    return () => {
      reset();
    };
  }, [data]);

  useEffect(() => {
    if (msg) {
      message.success(msg);
      onClose();
    }

    if (error) {
      message.error(error);
    }

    return () => {
      clearErrorAndMessage();
    };
  }, [error, msg, clearErrorAndMessage]);

  return (
    <>
      <Modal
        closeIcon={<ModalClose />}
        closable={!processing}
        maskClosable={!processing}
        open={show}
        onCancel={onClose}
        footer={null}
        title={
          <PageTitle
            showAdd={false}
            showSearch={false}
            isModal
            title={data?.id ? "Update Location" : "Add Location"}
            subTitle={`${data?.id ? "Update" : "Create new"} system location`}
          />
        }
      >
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label htmlFor="locationName" className="block mb-2">
              Location
            </label>
            <input
              type="text"
              id="locationName"
              {...register("name")}
              className={`form-input w-full`}
              placeholder="Ex. Lagos"
            />
            {/* {errors.name?.message && <p> {errors.name?.message}</p>} */}
          </div>
          <div className="mb-8">
            <label htmlFor="locationSupervisor" className="block mb-2">
              Supervisor
            </label>
            <Controller
              name="supervisor_user_id"
              control={control}
              render={({ field }) => (
                <Select
                  id="locationSupervisor"
                  size="large"
                  className="w-full"
                  placeholder="Supervisor"
                  options={users
                    .map((user) => {
                      if (user?.active === true && user?.role) {
                        return {
                          label: `${user.firstName} ${user.lastName}`,
                          value: user.id,
                        };
                      }

                      return null;
                    })
                    .filter(Boolean)
                    .sort((a, b) => {
                      if (a && b) {
                        return a.label.localeCompare(b.label);
                      }

                      return 0;
                    })}
                  {...field}
                ></Select>
              )}
            />
          </div>
          <div className="mb-3 mt-12 flex justify-end items-center gap-4">
            <a
              onClick={() => onClose()}
              className="text-red-600 hover:text-red-700 w-24"
            >
              Close
            </a>
            <Button
              title="Create Location"
              forForm
              isLoading={processing}
              disabled={!isDirty || !isValid || processing}
              type="primary"
              size="large"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};
