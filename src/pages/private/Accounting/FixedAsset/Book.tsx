import React, { useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import { Controller, useForm } from "react-hook-form";
import { InputNumber, message, DatePicker, Select } from "antd";
import Button from "@/components/common/Button";
import dayjs from "dayjs";
import { IFixedAssetMapping, IFixedAssetPayload } from "@/interfaces/iPosting";

const NewFixedAsset: React.FC = () => {
  const {
    handleSubmit,
    control,
    register,
    watch,
    resetField,
    formState: { isValid },
  } = useForm<Partial<IFixedAssetPayload>>({
    mode: "onChange",
    defaultValues: {
      acquisitionDate: new Date(),
    },
  });
  const [selectedAsset, setSelectedAsset] = useState<IFixedAssetMapping>(null);
  const [depreciationRate, setDepreciationRate] = useState<number>(0);

  const {
    postingStore: {
      message: msg,
      error,
      fixedAssetMap,
      clearErrorAndMessage,
      processing,
      transactionMap,
      bookFixedAsset,
      getAllFixedAssetMappings,
      getTransactonMapping,
    },
    authStore: {
      user: { id: tellerUserId },
      impersonated_user,
    },
  } = useStore();

  const watchAssetMap = watch("fixedAssetGlId");
  const usefulLifeMonths = watch("usefulLifeMonths");

  useEffect(() => {
    getAllFixedAssetMappings();
    getTransactonMapping("WITHDRAWAL");
  }, []);

  useEffect(() => {
    if (usefulLifeMonths) {
      setDepreciationRate(1200 / usefulLifeMonths);
    } else {
      setDepreciationRate(0);
    }
  }, [usefulLifeMonths]);

  useEffect(() => {
    if (watchAssetMap) {
      const assetMap = fixedAssetMap.find(
        (map) => map.id === watchAssetMap
      ) as IFixedAssetMapping | null;

      setSelectedAsset(assetMap);
    } else {
      setSelectedAsset(null);
    }
  }, [watchAssetMap]);

  useEffect(() => {
    if (msg) {
      message.success(msg);
      clearForm();
    }

    if (error) {
      message.error(error);
    }

    return () => {
      clearErrorAndMessage();
    };
  }, [error, msg, clearErrorAndMessage]);

  const onSubmit = async (form: Partial<IFixedAssetPayload>) => {
    form.tellerUserId = impersonated_user?.id
      ? impersonated_user.id
      : tellerUserId;

    await bookFixedAsset(form);
  };

  const clearForm = () => {
    resetField("acquisitionDate");
    resetField("acquisitionDate");
    resetField("acquisitionCost");
    resetField("description");
    resetField("fixedAssetGlId");
    resetField("fundingBankSubaccount");
    resetField("name");
    resetField("salvageValue");
    resetField("usefulLifeMonths");
  };

  return (
    <>
      <div className="border-b">
        <PageTitle
          title="Fixed Asset"
          subTitle="Book Fixed Asset"
          showAdd={false}
          showSearch={false}
          showBackButton
          backButtonRoute="/account/gl/fixed-assets"
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
              placeholder="Enter Name"
            />
          </div>
          <div className="col-start-1 col-span-4 flex gap-4 flex-col lg:flex-row">
            <div className="w-full col-span-2">
              <label htmlFor={`acquisitionCost`} className="block mb-1">
                Acquisition Cost
              </label>
              <Controller
                name={`acquisitionCost` as const}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <InputNumber
                    id={`acquisitionCost`}
                    controls={false}
                    size="large"
                    placeholder="Enter Acquisition Cost"
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
            <div className="w-full col-span-2">
              <label htmlFor="usefulLifeMonths" className="block mb-1">
                Useful Life (months)
              </label>
              <Controller
                name={`usefulLifeMonths` as const}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <InputNumber
                    id={`usefulLifeMonths`}
                    controls={false}
                    size="large"
                    placeholder="Enter Useful Life Years"
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
              <label htmlFor="depreciationRate" className="block mb-1">
                Depreciation Rate (%)
              </label>
              <InputNumber
                id={`depreciationRate`}
                controls={false}
                readOnly
                size="large"
                value={depreciationRate}
                onChange={(value) => setDepreciationRate(value as number)}
                className="w-full"
                precision={2}
                min={1}
                defaultValue={0}
              />
            </div>
          </div>
          <div className="w-full col-span-2 col-start-1">
            <label htmlFor={`salvageValue`} className="block mb-1">
              Salvage Value
            </label>
            <Controller
              name={`salvageValue` as const}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <InputNumber
                  id={`salvageValue`}
                  controls={false}
                  size="large"
                  placeholder="Enter Salvage Value"
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
          <div className="w-full col-span-2">
            <label htmlFor="acquisitionDate" className="block mb-1">
              Acquisition Date
            </label>
            <Controller
              name="acquisitionDate"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  id="acquisitionDate"
                  size="large"
                  allowClear={false}
                  className="w-full"
                  placeholder="Select Acquisition Date"
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
          </div>
          <div className="w-full col-span-4 col-start-1">
            <label htmlFor="description" className="block mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              className="form-input w-full"
              {...register("description", { required: true })}
              placeholder="Enter Description"
            />
          </div>
          <div className="w-full col-span-2 col-start-1">
            <label htmlFor="fixedAssetGlId" className="block mb-1">
              Fixed Asset Mapping
            </label>
            <Controller
              name={`fixedAssetGlId`}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Select
                  id={`fixedAssetGlId`}
                  size="large"
                  className="w-full flex-1"
                  placeholder="Select account"
                  options={fixedAssetMap.map((account) => ({
                    label: account.assetSubaccount,
                    value: account.id,
                  }))}
                  {...field}
                ></Select>
              )}
            />
          </div>
          <div className="relative w-full col-span-2">
            {!transactionMap?.length && (
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-white bg-opacity-70 z-50 flex flex-col justify-center items-center">
                <p className="text-red-500 font-semibold text-lg">
                  Please refer to your Finance Adminstrator
                </p>
              </div>
            )}
            <label htmlFor="fundingBankSubaccount" className="block mb-1">
              Funded By
            </label>
            <Controller
              name={`fundingBankSubaccount`}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Select
                  id={`fundingBankSubaccount`}
                  size="large"
                  className="w-full flex-1"
                  placeholder="Select account"
                  options={transactionMap.map((tran) => ({
                    label: tran.subAccountName,
                    value: tran.subAccountId,
                  }))}
                  {...field}
                ></Select>
              )}
            />
          </div>
          <div className="w-full col-span-4 col-start-1">
            {watchAssetMap && selectedAsset && selectedAsset.id && (
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <p className="text-sm font-semibold text-blue-700 mb-2 col-span-2">
                    Depreciation Expense Sub-Account
                  </p>
                  <h3 className="text-sm text-medium col-span-2">
                    {selectedAsset.depreciationExpenseSubaccountId}-
                    {selectedAsset.depreciationExpenseSubaccount}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
                  <p className="text-sm font-semibold text-blue-700 mb-2 col-span-2">
                    Accumulated Depreciation Sub-Account
                  </p>
                  <h3 className="text-sm text-medium col-span-2">
                    {selectedAsset.accumulatedDepreciationSubaccountId}-
                    {selectedAsset.accumulatedDepreciationSubaccount}
                  </h3>
                </div>
              </div>
            )}
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

export default NewFixedAsset;
