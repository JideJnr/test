import { ILoan } from "@/interfaces/iLoan";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useStore from "@/store";
import { useEffect } from "react";
import { message, Modal, Select } from "antd";
import PageTitle from "@/components/common/PageTitle";
import Button from "@/components/common/Button";
import ModalClose from "../common/ModalClose";

export const LoanProductModal: React.FC<any> = ({
  show,
  onClose,
  setLoanProduct,
  formData,
}) => {
  const navigate = useNavigate();
  const {
    loanStore: { loanProduct },
  } = useStore();

  const {
    handleSubmit,
    setValue,
    control,
    formState: { isValid },
  } = useForm<Partial<ILoan>>({
    mode: "onChange",
  });

  useEffect(() => {
    if (formData && formData.loanProductId) {
      setValue("loanProductId", formData.loanProductId, {
        shouldValidate: true,
      });
    }
  }, [formData]);

  const onSubmit = (form: Partial<ILoan>) => {
    setLoanProduct(form);

    onClose();
  };

  return (
    <>
      <Modal
        closeIcon={<ModalClose />}
        open={show}
        onCancel={onClose}
        closable={false}
        maskClosable={false}
        footer={null}
        title={
          <PageTitle
            showAdd={false}
            showSearch={false}
            isModal
            title={"Loan Product"}
          />
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="">
            <label htmlFor="loanProductId" className="block mb-2">
              Loan Product
            </label>
            <Controller
              name="loanProductId"
              control={control}
              render={({ field }) => (
                <Select
                  id="loanProductId"
                  size="large"
                  className="w-full"
                  placeholder="Select Loan Product"
                  options={loanProduct.map((product) => ({
                    label: product.name,
                    value: product.id,
                  }))}
                  {...field}
                ></Select>
              )}
            />
          </div>

          <div className="mb-3 mt-24 flex gap-4 justify-end items-center">
            <a
              onClick={() => {
                if (!formData.loanProductId) {
                  navigate("/account/banking/loans/book");
                  message.error(
                    "You need to select a loan product to continue"
                  );
                }
                onClose();
              }}
              className="text-red-600 hover:text-red-700 w-24"
            >
              Close
            </a>
            <Button
              disabled={!isValid}
              title="Submit"
              forForm
              type="primary"
              size="medium"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};
