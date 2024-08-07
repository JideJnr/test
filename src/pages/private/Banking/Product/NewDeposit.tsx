import React, { useEffect } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import { Controller, useForm } from "react-hook-form";
import { Select, InputNumber, message } from "antd";
import Button from "@/components/common/Button";
import GLCodeFinder from "@/components/common/GLCodeFinder";
import { IDepositProductPayload } from "@/interfaces/iPosting";
import { pick } from "@/shared/utils/misc";

const NewDeposit: React.FC = () => {
  const {
    handleSubmit,
    control,
    register,
    reset,
    setValue,
    formState: { isValid },
  } = useForm<
    Partial<
      IDepositProductPayload & {
        asset: string;
        income: string;
        receivable: string;
        bank: string;
      }
    >
  >({
    mode: "onChange",
    defaultValues: {
      monthlyChargesAmount: 0,
      monthlyInterestRate: 0,
      withdrawalChargeRate: 0,
    },
  });
  const {
    postingStore: {
      message: msg,
      error,
      clearErrorAndMessage,
      processing,
      depositProduct,
      createDepositProduct,
      updateDepositProduct,
      setDepositProduct,
      getGLByCode,
    },
  } = useStore();

  useEffect(() => {
    return () => {
      setDepositProduct(null);
    };
  }, []);

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
    if (depositProduct) {
      setValue("productName", depositProduct.productName, {
        shouldValidate: true,
      });
      setValue("depositType", depositProduct.depositType, {
        shouldValidate: true,
      });
      setValue("monthlyChargesAmount", depositProduct.monthlyChargesAmount, {
        shouldValidate: true,
      });
      setValue("monthlyInterestRate", depositProduct.monthlyInterestRate, {
        shouldValidate: true,
      });
      setValue("withdrawalChargeRate", depositProduct.withdrawalChargeRate, {
        shouldValidate: true,
      });
      setValue("asset", getGLByCode(depositProduct.subaccountId), {
        shouldValidate: true,
      });
      setValue("income", getGLByCode(depositProduct.intSubaccountId), {
        shouldValidate: true,
      });
      setValue(
        "receivable",
        getGLByCode(depositProduct.intPayableSubaccountId),
        {
          shouldValidate: true,
        }
      );
      setValue("bank", getGLByCode(depositProduct.bankSubaccountId), {
        shouldValidate: true,
      });
    } else {
      reset();
    }
  }, [depositProduct]);

  const onSubmit = async (
    form: Partial<
      IDepositProductPayload & {
        asset: string;
        income: string;
        receivable: string;
        bank: string;
      }
    >
  ) => {
    const subaccountId = +form.asset.split("-")[0];
    const intSubaccountId = +form.income.split("-")[0];
    const intPayableSubaccountId = +form.receivable.split("-")[0];
    const bankSubaccountId = +form.bank.split("-")[0];

    delete form.asset;
    delete form.income;
    delete form.receivable;
    delete form.bank;

    const payload = {
      ...form,
      currencyCode: "NGN",
      subaccountId,
      intSubaccountId,
      intPayableSubaccountId,
      bankSubaccountId,
      monthlyChargesAmount: form.monthlyChargesAmount || 0,
      monthlyInterestRate: form.monthlyInterestRate || 0,
      withdrawalChargeRate: form.withdrawalChargeRate || 0,
    };

    if (depositProduct && depositProduct.id) {
      payload.id = depositProduct.id;

      await updateDepositProduct(payload);
    } else {
      await createDepositProduct(payload);
    }
  };

  return (
    <>
      <div className="border-b">
        <PageTitle
          title="Deposit Product"
          subTitle={
            depositProduct && depositProduct.id
              ? "Update deposit product"
              : "Create new deposit product"
          }
          showAdd={false}
          showSearch={false}
          showBackButton
          backButtonRoute="/account/banking/products"
        />
      </div>

      <form
        autoComplete={"off"}
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
              {...register("productName", { required: true })}
              placeholder="Enter product name here"
            />
          </div>

          <div className="w-full col-span-2 col-start-1">
            <label htmlFor={`depositType`} className="block mb-1">
              Deposit Type
            </label>
            <div className="flex gap-4 ">
              <Controller
                name={`depositType`}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <Select
                    id={`depositType`}
                    size="large"
                    className="w-full flex-1"
                    placeholder="Select deposit type"
                    options={[
                      {
                        label: "Current",
                        value: "CURRENT",
                      },
                      {
                        label: "Savings",
                        value: "SAVINGS",
                      },
                      {
                        label: "Term Deposit",
                        value: "TERM_DEPOSIT",
                      },
                    ]}
                    {...field}
                  ></Select>
                )}
              />
            </div>
          </div>

          <div className="w-full col-span-2">
            <label htmlFor={`asset`} className="block mb-1">
              Sub-Account
            </label>
            <div className="relative">
              <input
                type="text"
                id="asset"
                {...register("asset", { required: true })}
                readOnly
                className="form-input w-full"
                placeholder="Select Sub-Account"
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
          <div className="w-full col-span-2 col-start-1">
            <label htmlFor="income" className="block mb-1">
              Interest Sub-Account
            </label>
            <div className="relative">
              <input
                type="text"
                id="income"
                {...register("income", { required: true })}
                readOnly
                className="form-input w-full"
                placeholder="Select Interest Sub-Account"
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

          <div className="w-full col-span-2">
            <label htmlFor="receivable" className="block mb-1">
              Interest Payable Sub-Account
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
                placeholder="Select Interest Payable Sub-Account"
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

          <div className="w-full col-span-2 col-start-1">
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

          <div className="w-full col-span-2">
            <label htmlFor="monthlyChargesAmount" className="block mb-1">
              Monthly Charges Amount
            </label>
            <Controller
              name={`monthlyChargesAmount` as const}
              control={control}
              render={({ field }) => (
                <InputNumber
                  id="monthlyChargesAmount"
                  controls={false}
                  size="large"
                  placeholder="Enter Monthly Charges Amount here"
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

          <div className="w-full col-span-2 col-start-1">
            <label htmlFor="monthlyInterestRate" className="block mb-1">
              Monthly Interest Rate
            </label>
            <Controller
              name={`monthlyInterestRate` as const}
              control={control}
              render={({ field }) => (
                <InputNumber
                  id={`monthlyInterestRate`}
                  controls={false}
                  size="large"
                  placeholder="Enter Monthly Interest Rate here"
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
            <label htmlFor="withdrawalChargeRate" className="block mb-1">
              Withdrawal Charge Rate
            </label>
            <Controller
              name={`withdrawalChargeRate` as const}
              control={control}
              render={({ field }) => (
                <InputNumber
                  id={`withdrawalChargeRate`}
                  controls={false}
                  size="large"
                  placeholder="Enter Withdrawal Charge Rate here"
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
              title={depositProduct && depositProduct.id ? "Update" : "Create"}
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

export default NewDeposit;
