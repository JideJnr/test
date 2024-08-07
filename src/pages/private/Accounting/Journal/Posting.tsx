import React, { useMemo, useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import { IModal } from "@/interfaces/iModal";
import { Controller, useForm } from "react-hook-form";
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
import Pagination from "@/components/common/Pagination";
import { Select, DatePicker, InputNumber, Modal, message } from "antd";
import Button from "@/components/common/Button";
import { AiOutlineSearch } from "react-icons/ai";
import { RiAddLine } from "react-icons/ri";
import { IJournalQueryPayload, IQuery } from "@/interfaces/iPosting";
import dayjs from "dayjs";
import ModalClose from "@/components/common/ModalClose";

const columnHelper = createColumnHelper<any>();
const JournalPosting: React.FC = () => {
  const [viewPostingModal, setViewPostingModal] = useState<boolean>(false);
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [queries, setQueries] = useState<Partial<IQuery>>({
    page: 0,
    recordsPerPage: 10,
    startDate: new Date(),
    endDate: new Date(),
  });
  const {
    locationStore,
    postingStore,
    postingStore: { message: msg, error, clearErrorAndMessage },
  } = useStore();

  useEffect(() => {
    locationStore.getLocations();
  }, []);

  useEffect(() => {
    if (msg) {
      message.success(msg);
      setViewPostingModal(false);
    }

    if (error) {
      message.error(error);
    }

    return () => {
      clearErrorAndMessage();
    };
  }, [error, msg, clearErrorAndMessage]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      columnHelper.accessor("transactionId", {
        cell: (info) => info.getValue(),
        header: () => "Transaction ID",
      }),
      columnHelper.accessor("transactionDate", {
        cell: (info) => info.getValue(),
        header: () => Date,
      }),
      columnHelper.accessor("transactionAmount", {
        cell: (info) => info.getValue(),
        header: () => "Amount",
      }),
      columnHelper.accessor("drCrFlag", {
        cell: (info) => info.getValue(),
        header: () => "DR/CR",
      }),
      columnHelper.accessor("currencyCode", {
        header: () => "Currency",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("balance", {
        header: () => "Balance",
        cell: (info) => info.renderValue(),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: postingStore.journalPostings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleSearch = (e) => {
    e.preventDefault();

    if (accountNumber) {
      const payload: IJournalQueryPayload = {
        ...(queries as IQuery),
        accountNumber,
      };

      postingStore.getJournalPostingsByAccount(payload);
    } else {
      postingStore.getJournalPostings(queries);
    }
  };

  return (
    <div>
      <div className="border-b">
        <PageTitle
          title="Journal Entry"
          subTitle="View and Add Personal Journal Entries"
          showAdd={false}
          showSearch={false}
        />
      </div>
      <div className="flex items-center flex-col sm:flex-row gap-2 mt-24">
        <input
          type="search"
          name="search"
          autoComplete="off"
          autoFocus
          className="form-input w-full md:w-2/4 lg:w-1/3 h-12"
          value={accountNumber}
          placeholder="Search for customer by account number"
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <Button
          onClick={handleSearch}
          className="w-1/2 place-self-end md:w-fit h-12"
          title={
            <div className="flex items-center justify-center gap-x-2">
              <AiOutlineSearch className="text-lg" />
              <span className="text-sm">Search</span>
            </div>
          }
          type={"primary"}
          size={"large"}
        ></Button>

        <Button
          onClick={(e) => setViewPostingModal(true)}
          className="w-1/2 md:w-fit h-12 md:ml-auto"
          title={
            <div className="flex items-center justify-center gap-x-2">
              <RiAddLine className="text-lg" />
              <span className="text-sm">Post</span>
            </div>
          }
          type={"default"}
          size={"medium"}
        ></Button>
      </div>

      <div className="flex flex-col min-h-[600px] mt-12">
        <DynamicTable
          table={table}
          fetchingAll={postingStore.loading}
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

      <EntryPostingModal
        show={viewPostingModal}
        onClose={() => setViewPostingModal(false)}
      />
    </div>
  );
};

export default JournalPosting;

export const EntryPostingModal: React.FC<IModal> = ({ show, onClose }) => {
  const {
    postingStore: { processing, createEntryPosting },
  } = useStore();
  const {
    handleSubmit,
    control,
    register,
    formState: { isValid },
  } = useForm<any>({
    mode: "onChange",
  });

  const onSubmit = async (data: any) => {
    await createEntryPosting(data as any);
  };

  return (
    <Modal
      closeIcon={<ModalClose />}
      open={show}
      onCancel={onClose}
      closable={!processing}
      maskClosable={!processing}
      footer={null}
      title={
        <PageTitle
          showAdd={false}
          showSearch={false}
          isModal
          title={"New Entry"}
          subTitle={``}
        />
      }
    >
      <form
        method="POST"
        className="flex flex-col md:min-h-[400px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full mb-6">
          <label htmlFor="valueDate" className="block mb-1">
            Value Date
          </label>
          <Controller
            name="valueDate"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                id="valueDate"
                size="large"
                className="w-full"
                placeholder="Select Date"
                value={dayjs(value)}
                onChange={(_, dateString) => {
                  onChange(dateString);
                }}
              />
            )}
          />
        </div>

        <div className="w-full mb-6">
          <label htmlFor="glCode" className="block mb-1">
            GL Code
          </label>
          <Controller
            name="glCode"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <InputNumber
                id="glCode"
                controls={false}
                size="large"
                placeholder="Enter GL Code"
                className="w-full"
                precision={0}
                {...field}
              />
            )}
          />
        </div>

        <div className="w-full mb-6">
          <label htmlFor="drCrFlag" className="block mb-1">
            Transaction Type
          </label>
          <Controller
            name="drCrFlag"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Select
                id="drCrFlag"
                size="large"
                className="w-full"
                placeholder="Select Transaction Type"
                options={[
                  {
                    label: "Credit",
                    value: "CR",
                  },
                  {
                    label: "Debit",
                    value: "DR",
                  },
                ]}
                {...field}
              />
            )}
          />
        </div>
        <div className="w-full mb-6">
          <label htmlFor="transactionAmount" className="block mb-1">
            Amount
          </label>
          <Controller
            name="transactionAmount"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <InputNumber
                id="transactionAmount"
                controls={false}
                size="large"
                placeholder="Enter Amount"
                className="w-full"
                precision={2}
                defaultValue={0}
                formatter={(value) =>
                  `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\₦\s?|(,*)/g, "")}
                {...field}
              />
            )}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="transactionDescription" className="block mb-2">
            Description
          </label>
          <textarea
            name="transactionDescription"
            {...register("transactionDescription", { required: true })}
            className="form-input w-full resize-none"
            id="comment"
            placeholder="Enter Description here"
            rows={5}
          ></textarea>
        </div>
        <div className="mb-3 mt-12 flex gap-4 justify-end items-center">
          <a
            onClick={() => onClose()}
            className="text-red-600 hover:text-red-700 w-24"
          >
            Close
          </a>
          <Button
            title="Post"
            type="primary"
            size="medium"
            disabled={!isValid || processing}
            forForm
            isLoading={processing}
          />
        </div>
      </form>
    </Modal>
  );
};
