import React, { useEffect } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import { Controller, useForm } from "react-hook-form";
import { Select, InputNumber, message } from "antd";
import Button from "@/components/common/Button";
import GLCodeFinder from "@/components/common/GLCodeFinder";
import { ILoanProductPayload } from "@/interfaces/iLoan";

const NewLoan: React.FC = () => {
  const {
    handleSubmit,
    control,
    register,
    reset,
    setValue,
    formState: { isValid },
  } = useForm<
    Partial<
      ILoanProductPayload & {
        asset: string;
        income: string;
        receivable: string;
        bank: string;
        fee: string;
      }
    >
  >({
    mode: "onChange",
  });

  const {
    loanStore: {
      message: msg,
      error,
      clearErrorAndMessage,
      processing,
      singleLoanProduct,
      createLoanProduct,
      updateLoanProduct,
    },
    postingStore: { getGLByCode },
  } = useStore();

  useEffect(() => {
    if (msg) {
      message.success(msg);
      reset();
    }

    if (error) {
      message.error(error);
    }

    return () => {
      clearErrorAndMessage();
    };
  }, [error, msg, clearErrorAndMessage]);

  useEffect(() => {
    if (singleLoanProduct) {
      setValue("name", singleLoanProduct.name, {
        shouldValidate: true,
      });
      setValue("repaymentCycle", singleLoanProduct.repaymentCycle, {
        shouldValidate: true,
      });
      setValue("defaultInterestRate", singleLoanProduct.defaultInterestRate, {
        shouldValidate: true,
      });
      setValue("dailyPenalRate", singleLoanProduct.dailyPenalRate, {
        shouldValidate: true,
      });
      setValue("asset", getGLByCode(singleLoanProduct.assetSubAccount.id), {
        shouldValidate: true,
      });
      setValue(
        "income",
        getGLByCode(singleLoanProduct.interestIncomeSubAccount.id),
        {
          shouldValidate: true,
        }
      );
      setValue(
        "receivable",
        getGLByCode(singleLoanProduct.interestReceivableSubAccount.id),
        {
          shouldValidate: true,
        }
      );
      setValue("bank", getGLByCode(singleLoanProduct.bankSubAccount.id), {
        shouldValidate: true,
      });
      setValue("fee", getGLByCode(singleLoanProduct.feeSubAccount.id), {
        shouldValidate: true,
      });
    } else {
      reset();
    }
  }, [singleLoanProduct]);

  const onSubmit = async (
    form: Partial<
      ILoanProductPayload & {
        asset: string;
        income: string;
        receivable: string;
        bank: string;
        fee: string;
      }
    >
  ) => {
    const customPayload = {
      assetSubAccountId: +form.asset.split("-")[0],
      interestIncomeSubAccountId: +form.income.split("-")[0],
      interestReceivableSubAccountId: +form.receivable.split("-")[0],
      bankSubAccountId: +form.bank.split("-")[0],
      feeSubAccountId: +form.fee.split("-")[0],
    };

    delete form.asset;
    delete form.income;
    delete form.receivable;
    delete form.bank;
    delete form.fee;

    const payload: Partial<ILoanProductPayload> = {
      ...form,
      ...customPayload,
    };

    if (singleLoanProduct && singleLoanProduct.id) {
      await updateLoanProduct(payload, singleLoanProduct.id);
    } else {
      await createLoanProduct(payload);
    }
  };

  return (
    <>
      <div className="border-b">
        <PageTitle
          title="Loan Product"
          subTitle={
            singleLoanProduct && singleLoanProduct.id
              ? "Update loan product"
              : "Create new loan product"
          }
          showAdd={false}
          showSearch={false}
          showBackButton
          backButtonRoute="/account/banking/products"
        />
      </div>

      <form
        className="mt-12 flex flex-col min-h-[700px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6  w-full">
          <div className="w-full col-span-4">
            <label htmlFor="name" className="block mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="form-input w-full"
              {...register("name", { required: true })}
              placeholder="Enter product name here"
            />
          </div>

          <div className="w-full col-start-1 col-span-2">
            <label htmlFor={`asset`} className="block mb-1">
              Asset Sub-Account
            </label>
            <div className="relative">
              <input
                type="text"
                id="asset"
                {...register("asset", { required: true })}
                readOnly
                className="form-input w-full"
                placeholder="Select Asset Sub-Account"
              />
              <GLCodeFinder
                onDone={(value) => {
                  setValue("asset", value, {
                    shouldValidate: true,
                  });
                }}
              />
            </div>
          </div>

          <div className="w-full col-span-2 ">
            <label htmlFor="income" className="block mb-1">
              Interest Income Sub-Account
            </label>
            <div className="relative">
              <input
                type="text"
                id="income"
                {...register("income", { required: true })}
                readOnly
                className="form-input w-full"
                placeholder="Select Interest Income Sub-Account"
              />
              <GLCodeFinder
                onDone={(value) => {
                  setValue("income", value, {
                    shouldValidate: true,
                  });
                }}
              />
            </div>
          </div>

          <div className="w-full col-start-1 col-span-2">
            <label htmlFor="receivable" className="block mb-1">
              Interest Receivable Sub-Account
            </label>
            <div className="relative">
              <input
                type="text"
                id="receivable"
                {...register("receivable", {
                  required: true,
                })}
                readOnly
                className="form-input w-full"
                placeholder="Select Interest Receivable Sub-Account"
              />
              <GLCodeFinder
                onDone={(value) => {
                  setValue("receivable", value, {
                    shouldValidate: true,
                  });
                }}
              />
            </div>
          </div>
          <div className="w-full col-span-2">
            <label htmlFor="bank" className="block mb-1">
              Bank Sub-Account
            </label>
            <div className="relative">
              <input
                type="text"
                id="bank"
                {...register("bank", {
                  required: true,
                })}
                readOnly
                className="form-input w-full"
                placeholder="Select Bank Sub-Account"
              />
              <GLCodeFinder
                onDone={(value) => {
                  setValue("bank", value, {
                    shouldValidate: true,
                  });
                }}
              />
            </div>
          </div>
          <div className="w-full col-start-1 col-span-2">
            <label htmlFor="fee" className="block mb-1">
              Fee Sub-Account
            </label>
            <div className="relative">
              <input
                type="text"
                id="fee"
                {...register("fee", {
                  required: true,
                })}
                readOnly
                className="form-input w-full"
                placeholder="Select Fee Sub-Account"
              />
              <GLCodeFinder
                onDone={(value) => {
                  setValue("fee", value, {
                    shouldValidate: true,
                  });
                }}
              />
            </div>
          </div>

          <div className="w-full col-span-2">
            <label htmlFor={`repaymentCycle`} className="block mb-1">
              Repayment Cycle
            </label>
            <div className="flex gap-4 ">
              <Controller
                name={`repaymentCycle`}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <Select
                    id={`repaymentCycle`}
                    size="large"
                    className="w-full flex-1"
                    placeholder="Select repayment cycle"
                    options={[
                      {
                        label: "Daily",
                        value: "DAILY",
                      },
                      {
                        label: "Weekly",
                        value: "WEEKLY",
                      },
                      {
                        label: "Monthly",
                        value: "MONTHLY",
                      },
                      {
                        label: "Quarterly",
                        value: "QUARTERLY",
                      },
                      {
                        label: "Semi Annually",
                        value: "SEMI_ANNUALLY",
                      },
                      {
                        label: "Annually",
                        value: "ANNUALLY",
                      },
                      {
                        label: "Bullet",
                        value: "BULLET",
                      },
                    ]}
                    {...field}
                  ></Select>
                )}
              />
            </div>
          </div>

          <div className="w-full col-span-2 col-start-1">
            <label htmlFor="defaultInterestRate" className="block mb-1">
              Default Interest Rate
            </label>
            <Controller
              name={`defaultInterestRate` as const}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <InputNumber
                  id={`defaultInterestRate`}
                  controls={false}
                  size="large"
                  placeholder="Enter default interest rate here"
                  className=" w-full"
                  precision={2}
                  min={0}
                  max={100}
                  defaultValue={0}
                  prefix="%"
                  {...field}
                />
              )}
            />
          </div>

          <div className="w-full col-span-2">
            <label htmlFor="dailyPenalRate" className="block mb-1">
              Default Penalty Rate
            </label>
            <Controller
              name={`dailyPenalRate` as const}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <InputNumber
                  id={`dailyPenalRate`}
                  controls={false}
                  size="large"
                  placeholder="Enter default penalty rate here"
                  className=" w-full"
                  precision={2}
                  min={0}
                  max={100}
                  defaultValue={0}
                  prefix="%"
                  {...field}
                />
              )}
            />
          </div>

          <div className="mt-12 text-end col-span-4">
            <Button
              title={
                singleLoanProduct && singleLoanProduct.id ? "Update" : "Create"
              }
              disabled={!isValid || processing}
              isLoading={processing}
              type="primary"
              forForm
              size="large"
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default NewLoan;
