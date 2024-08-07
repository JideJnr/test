import { message, Modal, Select } from "antd";
import Button from "@/components/common/Button";
import PageTitle from "@/components/common/PageTitle";
import { useForm, Controller } from "react-hook-form";
import useStore from "@/store";
import ModalClose from "../common/ModalClose";
import { useNavigate } from "react-router-dom";

export const LoanTypeModal: React.FC<any> = ({ show, onClose }) => {
  const navigate = useNavigate();
  const {
    loanStore: { activeLoans },
  } = useStore();
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<{
    currentLoanPlan: string;
  }>({
    mode: "onChange",
  });

  const onSubmit = (form: { currentLoanPlan: string }) => {
    const selecteLoan = activeLoans.find(
      (loan) => loan.accountNumber === form.currentLoanPlan
    );

    onClose(selecteLoan);
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
            title={"Active Loans"}
          />
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label htmlFor="currentLoanPlan" className="block mb-2">
              Active Loans
            </label>
            <Controller
              name="currentLoanPlan"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Select
                  id="currentLoanPlan"
                  size="large"
                  className="w-full"
                  placeholder="Select active loan"
                  options={activeLoans?.map((loan) => ({
                    label: `${loan.accountNumber} - ${loan.productName}`,
                    value: loan.accountNumber,
                  }))}
                  {...field}
                ></Select>
              )}
            />
          </div>

          <div className="mb-3 mt-24 flex gap-4 justify-end items-center">
            <a
              onClick={() => {
                if (!isValid) {
                  navigate("/account/banking/loans/book");
                  message.error(
                    "You need to select an active loan to continue"
                  );
                }
                onClose();
              }}
              className="text-red-600 hover:text-red-700 w-24"
            >
              Cancel
            </a>
            <Button
              disabled={!isValid}
              title="Proceed"
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
