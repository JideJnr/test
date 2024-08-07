import { Modal } from "antd";
import Button from "@/components/common/Button";
import PageTitle from "@/components/common/PageTitle";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useStore from "@/store";
import ModalClose from "../common/ModalClose";
import { IModal } from "@/interfaces/iModal";
import { IFixedAssetMappingPayload } from "@/interfaces/iPosting";
import GLCodeFinder from "../common/GLCodeFinder";

export const FixedAssetMapModal: React.FC<IModal> = ({ show, onClose }) => {
  const {
    postingStore: { createFixedAssetMap, processing, message },
  } = useStore();

  const {
    handleSubmit,
    control,
    register,
    setValue,
    reset,
    formState: { isValid },
  } = useForm<{
    asset: string;
    depreciationExpense: string;
    accumulatedDepreciation: string;
  }>({
    mode: "onChange",
  });

  useEffect(() => {
    if (message) {
      onClose();
      reset();
    }
  }, [message]);

  const onSubmit = async (form: {
    asset: string;
    depreciationExpense: string;
    accumulatedDepreciation: string;
  }) => {
    const payload: Partial<IFixedAssetMappingPayload> = {
      assetSubAccountId: +form.asset.split("-")[0],
      depreciationExpenseSubAccountId: +form.depreciationExpense.split("-")[0],
      accumulatedDepreciationSubAccountId:
        +form.accumulatedDepreciation.split("-")[0],
    };

    await createFixedAssetMap(payload);
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
            <label htmlFor={`subAccountName` as const} className="block mb-1">
              Fixed Asset Sub-Account
            </label>
            <div className="relative">
              <input
                type="text"
                id={`subAccountName`}
                className="form-input w-full pr-12"
                {...register(`asset`, {
                  required: true,
                })}
                readOnly
                placeholder="Select Fixed Asset Sub-Account"
              />
              <GLCodeFinder
                className="top-1.5"
                onDone={(resp) => {
                  setValue(`asset`, resp, { shouldValidate: true });
                }}
              />
            </div>
          </div>

          <div className="w-full mb-6">
            <label
              htmlFor={`depreciationExpense` as const}
              className="block mb-1"
            >
              Depreciation Expenses Sub-Account
            </label>
            <div className="relative">
              <input
                type="text"
                id={`depreciationExpense`}
                className="form-input w-full pr-12"
                {...register(`depreciationExpense`, {
                  required: true,
                })}
                readOnly
                placeholder="Select Depreciation Expenses Sub-Account"
              />
              <GLCodeFinder
                className="top-1.5"
                onDone={(resp) => {
                  setValue(`depreciationExpense`, resp, {
                    shouldValidate: true,
                  });
                }}
              />
            </div>
          </div>

          <div className="w-full mb-6">
            <label
              htmlFor={`accumulatedDepreciation` as const}
              className="block mb-1"
            >
              Accumulated Depreciation Sub-Account
            </label>
            <div className="relative">
              <input
                type="text"
                id={`accumulatedDepreciation`}
                className="form-input w-full pr-12"
                {...register(`accumulatedDepreciation`, {
                  required: true,
                })}
                readOnly
                placeholder="Select Accumulated Depreciation Sub-Account"
              />
              <GLCodeFinder
                className="top-1.5"
                onDone={(resp) => {
                  setValue(`accumulatedDepreciation`, resp, {
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
