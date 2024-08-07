import React, { useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import { Controller, useForm } from "react-hook-form";
import { Select, InputNumber, message } from "antd";
import Button from "@/components/common/Button";
import CustomerAccountFinder from "@/components/common/CustomerAccountFinder";
import { IFixedDepositPayload } from "@/interfaces/iPosting";
import { IUser } from "@/interfaces/iUserManagement";

const NewFixedDposit: React.FC = () => {
  const {
    handleSubmit,
    control,
    register,
    reset,
    setValue,
    formState: { isValid },
  } = useForm<
    Partial<
      IFixedDepositPayload & {
        proceed: string;
        funding: string;
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
      bookFixedDeposit,
    },
    authStore: { user: originalUser, impersonated_user },
  } = useStore();

  const [user, setUser] = useState<IUser>(impersonated_user || originalUser);

  useEffect(() => {
    setUser(impersonated_user || originalUser);
  }, [impersonated_user, originalUser]);

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
      IFixedDepositPayload & {
        proceed: string;
        funding: string;
      }
    >
  ) => {
    const payload: Partial<IFixedDepositPayload> = {
      ...form,
      proceedsAccountNumber: form.proceed.split("-")[0].trim(),
      fundingAccountNumber: form.funding.split("-")[0].trim(),
      tellerUserId: user.id,
    };

    await bookFixedDeposit(payload);
  };

  return (
    <>
      <div className="border-b">
        <PageTitle
          title="Fixed Deposit"
          subTitle="Book Investment"
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
            <label htmlFor={`funding`} className="block mb-1">
              Funding Account
            </label>
            <div className="relative">
              <input
                type="text"
                id="funding"
                disabled
                {...register("funding", { required: true })}
                className="form-input w-full disabled:bg-gray-100"
                placeholder="Select Funding Account"
              />
              <CustomerAccountFinder
                type="DEPOSIT"
                disableButton
                onDone={(value) => {
                  setValue("funding", value.title, {
                    shouldValidate: true,
                  });
                }}
              />
            </div>
          </div>
          <div className="w-full col-span-2">
            <label htmlFor="proceed" className="block mb-1">
              Proceeds Account
            </label>
            <div className="relative">
              <input
                type="text"
                id="proceed"
                {...register("proceed", { required: true })}
                readOnly
                disabled
                className="form-input w-full disabled:bg-gray-100"
                placeholder="Select Proceeds Account"
              />
              <CustomerAccountFinder
                type="DEPOSIT"
                disableButton
                onDone={(value) => {
                  setValue("proceed", value.title, {
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
                      .filter((item) => item.depositType === "TERM_DEPOSIT")
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

          <div className="w-full col-span-2">
            <label htmlFor={`principal`} className="block mb-1">
              Principal
            </label>
            <Controller
              name={`principal` as const}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <InputNumber
                  id={`principal`}
                  controls={false}
                  size="large"
                  placeholder="Enter Prin"
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
          <div className="w-full col-start-1 col-span-2">
            <label htmlFor="tenorDays" className="block mb-1">
              Tenor (Days)
            </label>
            <Controller
              name={`tenorDays` as const}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <InputNumber
                  id={`tenorDays`}
                  controls={false}
                  size="large"
                  placeholder="Enter tenor here"
                  className=" w-full"
                  precision={0}
                  min={1}
                  defaultValue={0}
                  {...field}
                />
              )}
            />
          </div>

          <div className="w-full col-span-2">
            <label htmlFor="interestOnDeposit" className="block mb-1">
              Interest on Deposit (%)
            </label>
            <Controller
              name={`interestOnDeposit` as const}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <InputNumber
                  id={`interestOnDeposit`}
                  controls={false}
                  size="large"
                  placeholder="Enter interest on deposit here"
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
          {/* <div className="w-full col-start-1 col-span-2">
            <label htmlFor="effectiveDate" className="block mb-1">
              Effective Date
            </label>
            <Controller
              name="effectiveDate"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  id="effectiveDate"
                  size="large"
                  allowClear={false}
                  className="w-full"
                  placeholder="Select effective date"
                  value={dayjs(value)}
                  disabledDate={(current) => {
                    return current && current > dayjs().add(0, "day");
                  }}
                  onChange={(_, dateString) => {
                    onChange(dateString);
                  }}
                />
              )}
            />
          </div> */}
          <div className="w-full col-span-4 col-start-1">
            <label htmlFor="bookingInstruction" className="block mb-1">
              Booking Instruction
            </label>
            <input
              type="text"
              id="bookingInstruction"
              className="form-input w-full"
              {...register("bookingInstruction", { required: true })}
              placeholder="Enter booking instructions here"
            />
          </div>

          <div className="mt-12 text-end col-span-4">
            <Button
              title={"Book"}
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

export default NewFixedDposit;
