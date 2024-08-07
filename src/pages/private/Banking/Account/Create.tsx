import React, { useEffect } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import { Controller, useForm } from "react-hook-form";
import { Select, message } from "antd";
import Button from "@/components/common/Button";
import CustomerFinder from "@/components/common/CustomerFinder";
import { IAccountCreationPayload } from "@/interfaces/iPosting";

const AccountOpening: React.FC = () => {
  const {
    handleSubmit,
    control,
    register,
    reset,
    setValue,
    formState: { isValid },
  } = useForm<
    Partial<
      IAccountCreationPayload & {
        account: string;
      }
    >
  >({
    mode: "onChange",
  });

  const {
    postingStore: {
      message: msg,
      error,
      clearErrorAndMessage,
      processing,
      depositProducts,
      getDepositProducts,
      createAccount,
    },
  } = useStore();

  useEffect(() => {
    getDepositProducts();
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

  const onSubmit = async (
    form: Partial<
      IAccountCreationPayload & {
        account: string;
      }
    >
  ) => {
    const payload: Partial<IAccountCreationPayload> = {
      ...form,
      customerId: +form.account.split("-")[0].trim(),
      initialDepositAmount: 0,
    };

    await createAccount(payload);
  };

  return (
    <>
      <div className="border-b">
        <PageTitle
          title="Account Opening "
          subTitle="Create New Account"
          showAdd={false}
          showSearch={false}
        />
      </div>

      <form
        className="mt-12 flex flex-col min-h-[700px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6  w-full">
          <div className="w-full col-span-2">
            <label htmlFor={`account`} className="block mb-1">
              Customer
            </label>
            <div className="relative">
              <input
                type="text"
                id="account"
                {...register("account", { required: true })}
                readOnly
                disabled
                className="form-input w-full disabled:bg-gray-100"
                placeholder="Select Customer"
              />
              <CustomerFinder
                onDone={(value) => {
                  setValue("account", value.title, {
                    shouldValidate: true,
                  });
                }}
              />
            </div>
          </div>

          <div className="w-full col-span-2 col-start-1">
            <label htmlFor={`depositProductId`} className="block mb-1">
              Product
            </label>
            <div className="flex gap-4 ">
              <Controller
                name={`depositProductId`}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <Select
                    id={`depositProductId`}
                    size="large"
                    className="w-full flex-1"
                    placeholder="Select product"
                    options={depositProducts
                      .filter((item) => item.depositType !== "TERM_DEPOSIT")
                      .map((product) => ({
                        label: product.productName,
                        value: product.id,
                      }))}
                    {...field}
                  ></Select>
                )}
              />
            </div>
          </div>

          <div className="mt-12 text-end col-span-2 col-start-1">
            <Button
              title={"Create"}
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

export default AccountOpening;
