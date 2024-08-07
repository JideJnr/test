import { Modal, Select } from "antd";
import Button from "@/components/common/Button";
import PageTitle from "@/components/common/PageTitle";
import {
  Decision,
  IApprovalTerms,
  ILoanDecisionPayload,
  ILoanExtended,
} from "@/interfaces/iLoan";
import { IModal } from "@/interfaces/iModal";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import StringFormat from "@/shared/utils/string";
import useStore from "@/store";
import ModalClose from "../common/ModalClose";
import { IUser } from "@/interfaces/iUserManagement";

export const LoanProgressModal: React.FC<
  IModal & {
    loan: ILoanExtended | null;
    status: Decision;
    terms?: IApprovalTerms;
  }
> = ({ show, onClose, loan, status, terms }) => {
  const {
    loanStore: { processing, loanDecision, saveApprovalTerms },
    userStore: { getUsersByRole, levelUsers },
    authStore: { user: originalUser, impersonated_user },
  } = useStore();
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<ILoanDecisionPayload>({
    mode: "onChange",
  });
  const [user, setUser] = useState<IUser>(impersonated_user || originalUser);

  useEffect(() => {
    getUsersByRole("SECOND_REVIEWER");
  }, []);

  useEffect(() => {
    setUser(impersonated_user || originalUser);
  }, [impersonated_user, originalUser]);

  const onSubmit = async (data: ILoanDecisionPayload) => {
    const payload = {
      ...data,
      decisionFlag: status,
      currentProcessorUid: user.id,
      loanApplicationId: +loan.id,
    };

    if (
      (user.role === "FIRST_REVIEWER" || user.role === "SECOND_REVIEWER") &&
      status === "APPROVED" &&
      terms
    ) {
      const termsPayload: Partial<ILoanDecisionPayload & IApprovalTerms> = {
        ...payload,
        ...terms,
        approvedMthlyRate: terms.approvedMthlyRate,
        approvedDsrRate: terms.approvedDsrRate,
      };

      await saveApprovalTerms(termsPayload);
    } else {
      await loanDecision(payload);
    }
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
          title={"Loan Decision"}
          subTitle={`Make your loan decision and route to the next process`}
        />
      }
    >
      <form
        method="POST"
        className="flex flex-col md:min-h-[400px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        {loan &&
          user.role === "FIRST_REVIEWER" &&
          loan?.applicationStatus === "PENDING_FIRST_REVIEW" &&
          status === "APPROVED" && (
            <div className="mb-6">
              <label htmlFor="nextProcessorUid" className="block mb-2">
                Next Reviewer
              </label>
              <Controller
                name="nextProcessorUid"
                control={control}
                render={({ field }) => (
                  <Select
                    id="nextProcessorUid"
                    size="large"
                    className="w-full"
                    placeholder="Select Reviewer"
                    options={levelUsers.map((user) => ({
                      label: `${user.firstName} ${user.lastName}`,
                      value: user.id,
                    }))}
                    {...field}
                  ></Select>
                )}
              />
            </div>
          )}

        <div className="mb-6">
          <label htmlFor="comment" className="block mb-2">
            Comment
          </label>
          <textarea
            name="comment"
            {...register("comment", { required: true })}
            className="form-input w-full resize-none"
            id="comment"
            placeholder="Enter your comment here"
            rows={5}
          ></textarea>
        </div>

        <div className="mb-3 mt-auto flex gap-4 justify-end items-center">
          <a
            onClick={() => onClose()}
            className="text-red-600 hover:text-red-700 w-24"
          >
            Close
          </a>
          <Button
            title={
              status
                ? StringFormat.toTitleCase(
                    status.replace(/ED$/, "") +
                      (status.endsWith("ED")
                        ? status === "DECLINED"
                          ? "e"
                          : status === "RETURNED"
                          ? ""
                          : "E"
                        : "")
                  )
                : "Process"
            }
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
