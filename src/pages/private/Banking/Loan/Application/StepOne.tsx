import { ILoan } from "@/interfaces/iLoan";
import { Controller, useForm } from "react-hook-form";
import { Select, InputNumber } from "antd";
import {
  LoanPurposeOptions,
  LoanRepaymentMethodOptions,
} from "@/shared/utils/constants";
import Button from "@/components/common/Button";
import { useEffect, useState } from "react";
import useStore from "@/store";

const StepOne: React.FC<{
  next: () => void;
  data: Partial<ILoan>;
  setFormData: (fields: Partial<ILoan>) => void;
}> = ({ next, data, setFormData }) => {
  const [topupPrefill, setTopupPrefill] = useState<ILoan>(null);
  const {
    customerStore: { customer },
    loanStore: { activeLoans },
  } = useStore();
  const {
    handleSubmit,
    setValue,
    control,
    formState: { isValid },
    watch,
    formState,
  } = useForm<ILoan>({
    mode: "onChange",
  });

  useEffect(() => {
    const prefillData = topupPrefill || data;

    setValue(
      "previousActiveLoanAccount",
      prefillData.previousActiveLoanAccount,
      {
        shouldValidate: true,
      }
    );
    setValue("loanAmount", prefillData.loanAmount || 0, {
      shouldValidate: true,
    });
    setValue("loanPurpose", prefillData.loanPurpose, { shouldValidate: true });
    setValue("loanTenorMths", prefillData.loanTenorMths, {
      shouldValidate: true,
    });
    setValue("netMthlyIncome", prefillData.netMthlyIncome || 0, {
      shouldValidate: true,
    });
    setValue("currentlyIndebted", prefillData.currentlyIndebted, {
      shouldValidate: true,
    });
    setValue("outstandingLoanAmount", prefillData.outstandingLoanAmount || 0, {
      shouldValidate: true,
    });
    setValue("outstandingMthlyRentals", prefillData.outstandingMthlyRentals, {
      shouldValidate: true,
    });
    setValue("repaymentAccountNumber", prefillData.repaymentAccountNumber, {
      shouldValidate: true,
    });
    setValue("repaymentMethod", prefillData.repaymentMethod, {
      shouldValidate: true,
    });
  }, [data, topupPrefill]);

  useEffect(() => {
    const subscription = watch((value, info) => {
      if (info.name === "previousActiveLoanAccount") {
        const selectedLoan = activeLoans.find(
          (loan) => loan.accountNumber === value.previousActiveLoanAccount
        );

        if (selectedLoan) {
          const {
            approvedLoanAmount,
            loanPurpose,
            approvedTenorMths,
            netMthlyIncome,
            repaymentAccountNumber,
            approvedMthlyRepayment,
            repaymentMethod,
            bankAccountName,
            bankAccountNumber,
            workExperienceYrs,
            pensionRsaNumber,
            bankName,
            files,
          } = selectedLoan.loanFile;

          setTopupPrefill({
            loanAmount: approvedLoanAmount,
            loanPurpose: loanPurpose,
            loanProductId: selectedLoan.productId,
            loanTenorMths: approvedTenorMths,
            netMthlyIncome: netMthlyIncome,
            currentlyIndebted: true,
            outstandingLoanAmount: selectedLoan.currentBalance,
            outstandingMthlyRentals: approvedMthlyRepayment,
            repaymentMethod: repaymentMethod,
            isTopup: true,
            bankAccountName: bankAccountName,
            bankAccountNumber: bankAccountNumber,
            bankName: bankName,
            workExperienceYrs: workExperienceYrs,
            pensionRsaNumber: pensionRsaNumber,
            files: files,
            customerId: customer.customerId,
            repaymentAccountNumber: repaymentAccountNumber,
            previousActiveLoanAccount: selectedLoan.accountNumber,
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, formState]);

  const onSubmit = (form: Partial<ILoan>) => {
    let payload = {
      ...data,
      ...form,
    };

    if (topupPrefill) {
      payload = {
        ...topupPrefill,
        ...payload,
      };
    }

    setFormData(payload);
    next();
  };

  return (
    <form
      autoComplete={"off"}
      className="flex flex-col min-h-[600px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
        {data.isTopup && (
          <div className="w-full">
            <label htmlFor="previousActiveLoanAccount" className="block mb-1">
              Previous Active Loans
            </label>
            <Controller
              name="previousActiveLoanAccount"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Select
                  id="previousActiveLoanAccount"
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
        )}
        <div className="w-full">
          <label htmlFor="loanAmount" className="block mb-1">
            Loan Amount
          </label>
          <Controller
            name="loanAmount"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <InputNumber
                id="loanAmount"
                controls={false}
                size="large"
                placeholder="Enter Loan Amount here"
                className=" w-full"
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

        <div className="w-full">
          <label htmlFor="loanPurpose" className="block mb-1">
            Loan Purpose
          </label>
          <Controller
            name="loanPurpose"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Select
                id="loanPurpose"
                size="large"
                className="w-full"
                placeholder="Select Loan Purpose"
                options={LoanPurposeOptions}
                {...field}
              ></Select>
            )}
          />
        </div>

        <div className="w-full">
          <label htmlFor="loanTenorMths" className="block mb-1">
            Loan Tenor (Months)
          </label>
          <Controller
            name="loanTenorMths"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <InputNumber
                id="loanTenorMths"
                controls={false}
                precision={0}
                size="large"
                placeholder="Enter Loan Tenor here"
                className=" w-full"
                {...field}
              />
            )}
          />
        </div>

        <div className="w-full">
          <label htmlFor="repaymentMethod" className="block mb-1">
            Repayment Method
          </label>
          <Controller
            name="repaymentMethod"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Select
                id="repaymentMethod"
                size="large"
                className="w-full"
                placeholder="Select Method"
                options={LoanRepaymentMethodOptions}
                {...field}
              ></Select>
            )}
          />
        </div>

        <div className="w-full">
          <label htmlFor="repaymentAccountNumber" className="block mb-1">
            Repayment Account
          </label>
          <Controller
            name="repaymentAccountNumber"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Select
                id="repaymentAccountNumber"
                size="large"
                // disabled={data.isTopup}
                className="w-full"
                placeholder="Select Loan Account"
                options={customer?.depositAccounts
                  ?.filter((acc) => acc.depositType !== "TERM_DEPOSIT")
                  .map((acc) => ({
                    label: acc.accountNumber,
                    value: acc.accountNumber,
                  }))}
                {...field}
              ></Select>
            )}
          />
        </div>

        <div className="w-full">
          <label htmlFor="netMthlyIncome" className="block mb-1">
            Monthly Income (Net)
          </label>
          <Controller
            name="netMthlyIncome"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <InputNumber
                id="netMthlyIncome"
                controls={false}
                precision={2}
                size="large"
                placeholder="Enter Monthly Income here"
                className=" w-full"
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

        {!data.isTopup && (
          <div className="w-full">
            <label htmlFor="currentlyIndebted" className="block mb-1">
              Currently Indebted?
            </label>
            <Controller
              name="currentlyIndebted"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Select
                  id="currentlyIndebted"
                  size="large"
                  className="w-full"
                  disabled={data.isTopup}
                  placeholder="Select Debt Status"
                  options={[
                    {
                      label: "Yes",
                      value: "true",
                    },
                    {
                      label: "No",
                      value: "false",
                    },
                  ]}
                  {...field}
                ></Select>
              )}
            />
          </div>
        )}

        <div className="w-full">
          <label htmlFor="outstandingLoanAmount" className="block mb-1">
            Outstanding Loan Amount
          </label>
          <Controller
            name="outstandingLoanAmount"
            control={control}
            render={({ field }) => (
              <InputNumber
                id="outstandingLoanAmount"
                controls={false}
                precision={2}
                readOnly={data.isTopup}
                size="large"
                disabled={!!(data?.previousActiveLoanAccount && data?.isTopup)}
                placeholder="Enter Outstanding Loan here"
                className=" w-full"
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

        <div className="w-full">
          <label htmlFor="outstandingMthlyRentals" className="block mb-1">
            Outstanding Monthly Rentals
          </label>
          <Controller
            name="outstandingMthlyRentals"
            control={control}
            render={({ field }) => (
              <InputNumber
                id="outstandingMthlyRentals"
                controls={false}
                precision={2}
                readOnly={data.isTopup}
                size="large"
                placeholder="Enter Outstanding Monthly Rentals here"
                className=" w-full"
                {...field}
              />
            )}
          />
        </div>
      </div>

      <div className="mt-12 md:mt-auto text-end">
        <Button
          title={"Next"}
          type="primary"
          disabled={!isValid}
          forForm
          size="large"
        />
      </div>
    </form>
  );
};

export default StepOne;
