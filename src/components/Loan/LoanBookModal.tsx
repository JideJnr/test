import { DatePicker, InputNumber, Modal } from "antd";
import Button from "@/components/common/Button";
import PageTitle from "@/components/common/PageTitle";
import { ILoanBook, ILoanDecisionPayload } from "@/interfaces/iLoan";
import { IModal } from "@/interfaces/iModal";
import { Controller, useForm } from "react-hook-form";
import useStore from "@/store";
import dayjs from "dayjs";
import ModalClose from "../common/ModalClose";
import { useEffect } from "react";

export const LoanBookModal: React.FC<
  IModal & {
    loanProductId: number;
    decision: Partial<ILoanDecisionPayload>;
    managementFee: number;
  }
> = ({ show, onClose, loanProductId, decision, managementFee }) => {
  const {
    loanStore: { processing, bookLoan },
  } = useStore();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
  } = useForm<ILoanBook>({
    mode: "onChange",
    defaultValues: {
      firstRepaymentDate: new Date(),
    },
  });

  useEffect(() => {
    setValue("managementFee", managementFee);
  }, [managementFee]);

  const onSubmit = async (data: ILoanBook) => {
    const payload: Partial<ILoanDecisionPayload & ILoanBook> = {
      ...data,
      ...decision,
      loanProductId,
      managementFee: data.managementFee,
      comment: "Loan Booked",
    };

    await bookLoan(payload);
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
          title={"Book Loan"}
          subTitle={`Book customer's loan`}
        />
      }
    >
      <form
        method="POST"
        className="flex flex-col md:min-h-[400px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full mb-6">
          <label htmlFor="firstRepaymentDate" className="block mb-1">
            First Repayment Date
          </label>
          <Controller
            name="firstRepaymentDate"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                id="birthDate"
                size="large"
                className="w-full"
                placeholder="Select Date"
                value={dayjs(value)}
                disabledDate={(current) => {
                  return current && current < dayjs().add(0, "day");
                }}
                onChange={(_, dateString) => {
                  onChange(dateString);
                }}
              />
            )}
          />
        </div>
        <div className="w-full">
          <label htmlFor="managementFee" className="block mb-1">
            Management Fee
          </label>
          <Controller
            name="managementFee"
            control={control}
            render={({ field }) => (
              <InputNumber
                id="managementFee"
                controls={false}
                size="large"
                placeholder="Enter management fee here"
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
        <div className="mb-3 mt-auto flex gap-4 justify-end items-center">
          <a
            onClick={() => onClose()}
            className="text-red-600 hover:text-red-700 w-24"
          >
            Close
          </a>
          <Button
            title="Book Loan"
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
