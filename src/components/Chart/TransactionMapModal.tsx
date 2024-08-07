import { Modal, Select } from "antd";
import Button from "@/components/common/Button";
import PageTitle from "@/components/common/PageTitle";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import useStore from "@/store";
import ModalClose from "../common/ModalClose";
import { IModal } from "@/interfaces/iModal";
import { ITransactionMapping } from "@/interfaces/iPosting";
import GLCodeFinder from "../common/GLCodeFinder";

export const TransactionMapModal: React.FC<IModal> = ({ show, onClose }) => {
  const {
    postingStore: { createTransactionMap, processing, message },
  } = useStore();

  const {
    handleSubmit,
    control,
    register,
    setValue,
    reset,
    formState: { isValid },
  } = useForm<Partial<ITransactionMapping>>({
    mode: "onChange",
  });

  useEffect(() => {
    if (message) {
      onClose();
      reset();
    }
  }, [message]);

  const onSubmit = async (form: Partial<ITransactionMapping>) => {
    const payload: Partial<ITransactionMapping> = {
      transactionType: form.transactionType,
      drCrFlag: form.drCrFlag,
      subAccountId: +form.subAccountName.split("-")[0],
      bankSubAccountId: +form.bankSubAccountName.split("-")[0],
    };

    await createTransactionMap(payload);
  };

  return (
    <>
      <Modal
        closeIcon={<ModalClose />}
        open={show}
        onCancel={onClose}
        closable={!processing}
        maskClosable={!processing}
        footer={null}
        className="min-h-[1600px]"
        title={
          <PageTitle
            showAdd={false}
            showSearch={false}
            isModal
            title={"Chart of Account"}
          />
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mb-6">
            <label htmlFor={`transactionType`} className="block mb-1">
              Transaction Type
            </label>
            <div className="flex gap-4 ">
              <Controller
                name={`transactionType`}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <Select
                    id={`transactionType`}
                    size="large"
                    className="w-full flex-1"
                    placeholder="Select transaction type"
                    options={[
                      {
                        label: "Deposit",
                        value: "DEPOSIT",
                      },
                      {
                        label: "Withdrawal",
                        value: "WITHDRAWAL",
                      },
                      {
                        label: "Deduct Charges",
                        value: "DEDUCT_CHARGES",
                      },
                      {
                        label: "Refund Charges",
                        value: "REFUND_CHARGES",
                      },
                      // {
                      //   label: "Internal Transfer",
                      //   value: "INTERNAL_TRANSFER",
                      // },
                      // {
                      //   label: "Payment",
                      //   value: "PAYMENT",
                      // },
                      // {
                      //   label: "Receipt",
                      //   value: "RECEIPT",
                      // },
                    ]}
                    {...field}
                  ></Select>
                )}
              />
            </div>
          </div>

          {/* <div className="w-full mb-6">
            <label htmlFor={`drCrFlag`} className="block mb-1">
              Mode
            </label>
            <div className="flex gap-4 ">
              <Controller
                name={`drCrFlag`}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <Select
                    id={`drCrFlag`}
                    size="large"
                    className="w-full flex-1"
                    placeholder="Select Mode"
                    options={[
                      {
                        label: "Debit",
                        value: "DR",
                      },
                      {
                        label: "Credit",
                        value: "CR",
                      },
                    ]}
                    {...field}
                  ></Select>
                )}
              />
            </div>
          </div> */}

          <div className="w-full mb-6">
            <label htmlFor={`subAccountName` as const} className="block mb-1">
              Sub-Account
            </label>
            <div className="relative">
              <input
                type="text"
                id={`subAccountName`}
                className="form-input w-full pr-12"
                {...register(`subAccountName`, {
                  required: true,
                })}
                readOnly
                placeholder="Enter narration here"
              />
              <GLCodeFinder
                className="top-1.5"
                onDone={(resp) => {
                  setValue(`subAccountName`, resp, { shouldValidate: true });
                }}
              />
            </div>
          </div>

          <div className="w-full mb-6">
            <label
              htmlFor={`bankSubAccountName` as const}
              className="block mb-1"
            >
              Bank Sub-Account
            </label>
            <div className="relative">
              <input
                type="text"
                id={`bankSubAccountName`}
                className="form-input w-full pr-12"
                {...register(`bankSubAccountName`, {
                  required: true,
                })}
                readOnly
                placeholder="Enter narration here"
              />
              <GLCodeFinder
                className="top-1.5"
                onDone={(resp) => {
                  setValue(`bankSubAccountName`, resp, {
                    shouldValidate: true,
                  });
                }}
              />
            </div>
          </div>

          <div className="mb-3 mt-24 flex gap-4 justify-end items-center">
            <a
              onClick={() => {
                onClose();
              }}
              className="text-red-600 hover:text-red-700 w-24"
            >
              Cancel
            </a>
            <Button
              disabled={!isValid || processing}
              title={"Proceed"}
              forForm
              isLoading={processing}
              type="primary"
              size="medium"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};
