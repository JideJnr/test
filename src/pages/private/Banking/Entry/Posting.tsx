import React, { useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import { Controller, useForm } from "react-hook-form";
import { Select, DatePicker, InputNumber, message, Spin, Tooltip } from "antd";
import { IEntryPosting } from "@/interfaces/iPosting";
import dayjs from "dayjs";
import Button from "@/components/common/Button";
import CustomerAccountFinder from "@/components/common/CustomerAccountFinder";
import BatchUpload from "@/components/common/BatchUploader";
import { BsInfoLg } from "react-icons/bs";
import { IUser } from "@/interfaces/iUserManagement";
import ApiService from "@/services/api";
import { useNavigate, useLocation } from "react-router-dom";

type FormPayload = {
  type: string;
  glCode: number;
  depositAccountNumber: string;
  transactionAmount: number;
} & IEntryPosting;

const NewJournalPosting: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [drCr, setDrCr] = useState<string>("");
  const {
    handleSubmit,
    control,
    register,
    reset,
    setValue,
    resetField,
    watch,
    formState: { isValid },
  } = useForm<Partial<FormPayload>>({
    mode: "onChange",
    defaultValues: {
      valueDate: dayjs(new Date()).toString(),
    },
  });

  const typeWatcher = watch("type");

  const {
    postingStore: {
      message: msg,
      error,
      clearErrorAndMessage,
      transactionMap,
      processing,
      loading,
      getTransactonMapping,
      createEntryPosting,
    },
    authStore: { user: oringnalUser, impersonated_user },
    miscStore: { setSpinner },
  } = useStore();
  const [user, setUser] = useState<IUser>(impersonated_user || oringnalUser);

  useEffect(() => {
    setUser(impersonated_user || oringnalUser);
  }, [impersonated_user, oringnalUser]);

  useEffect(() => {
    if (msg) {
      message.success(msg);
      reset();
      setDrCr("");
    }

    if (error) {
      message.error(error);
    }

    return () => {
      clearErrorAndMessage();
    };
  }, [error, msg, clearErrorAndMessage]);

  useEffect(() => {
    if (typeWatcher) {
      getTransactonMapping(typeWatcher);

      resetField("glCode", {
        defaultValue: null,
      });
      resetField("depositAccountNumber", {
        defaultValue: null,
      });
    }
  }, [typeWatcher]);

  useEffect(() => {
    if (transactionMap) {
      setDrCr(() =>
        transactionMap[0]?.drCrFlag ? transactionMap[0]?.drCrFlag : ""
      );
    }
  }, [transactionMap]);

  const handleBatchUpload = async (payload: FormData) => {
    setSpinner(true);

    try {
      const apiService = new ApiService();

      await apiService.BatchTellerPosting(payload);
      navigate("/account/gl/reports/batch-upload", {
        state: {
          previousPath: location.pathname,
        },
      });
    } catch (error: any) {
      message.error(
        error.response.data.error ||
          "Unable to complete process, please try again"
      );
    } finally {
      setSpinner(false);
    }
  };

  const onSubmit = async (form: Partial<FormPayload>) => {
    if ("type" in form) {
      delete form.type;
    }

    let bankCode: number;
    const credit: string = form.glCode.toString().split(" - ")[0];
    const debit: string = form.depositAccountNumber.toString().split(" - ")[0];

    if (drCr) {
      bankCode = transactionMap?.find(
        (item) =>
          item.subAccountId.toString() === (drCr === "DR" ? credit : debit)
      ).bankSubAccountId;
    }

    const payload: any = {
      ...form,
      tellerUserId: user.id,
      reviewerId: user.id,
      valueDate: dayjs(form.valueDate).format("YYYY-MM-DD HH:mm:ss"),
      entryType: "GENERAL",
      creditEntry: {
        subAccountId: drCr === "CR" ? debit : bankCode,
        transactionAmount: form.transactionAmount,
        drCrFlag: "CR",
      },
      debitEntry: {
        subAccountId: drCr === "DR" ? credit : bankCode,
        transactionAmount: form.transactionAmount,
        drCrFlag: "DR",
      },
      customerEntry: {
        transactionAmount: form.transactionAmount,
        depositAccountNumber: drCr === "DR" ? debit : credit.toString(),
        drCrFlag: drCr === "DR" ? "CR" : "DR",
      },
    };

    await createEntryPosting(payload);
  };

  return (
    <>
      <div className="border-b flex justify-between items-center mb-2 md:mb-0">
        <PageTitle
          title="Teller"
          subTitle="Post Deposit and Withdrawal Transactions"
          showAdd={false}
          showSearch={false}
        />

        <div className="relative h-fit w-fit">
          <BatchUpload uploader={handleBatchUpload} />
          <Tooltip
            placement="bottomRight"
            color="#4096ff"
            title="Click the info icon to download batch upload sheet format and sample"
          >
            <a
              className="absolute -top-3 -right-3 bg-red-700 text-white p-1 rounded-full hover:text-white hover:bg-red-600"
              download
              href="/batch-deposit-withdrawal-entries-format.xlsx"
            >
              <BsInfoLg />
            </a>
          </Tooltip>
        </div>
      </div>

      <form
        className="mt-12 flex flex-col min-h-[700px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  w-full">
          <div className="w-full col-span-2 lg:col-span-1">
            <label htmlFor={`transactionId`} className="block mb-1">
              Transaction Type
            </label>
            <div className="flex gap-4">
              <Controller
                name={`type`}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <Select
                    id={`type`}
                    size="large"
                    className="w-full flex-1"
                    placeholder="Select transaction type"
                    options={[
                      {
                        label: "Deposit",
                        value: "DEPOSIT",
                      },
                      {
                        label: "Withdrawal",
                        value: "WITHDRAWAL",
                      },
                      {
                        label: "Deduct Charges",
                        value: "DEDUCT_CHARGES",
                      },
                      {
                        label: "Refund Charges",
                        value: "REFUND_CHARGES",
                      },
                      // {
                      //   label: "Internal Transfer",
                      //   value: "INTERNAL_TRANSFER",
                      // },
                      // {
                      //   label: "Payment",
                      //   value: "PAYMENT",
                      // },
                      // {
                      //   label: "Receipt",
                      //   value: "RECEIPT",
                      // },
                    ]}
                    {...field}
                  ></Select>
                )}
              />
            </div>
          </div>

          <div className="relative col-start-1 col-span-2">
            <Spin spinning={loading} delay={500}>
              {!transactionMap?.length && typeWatcher && !loading && (
                <div className="absolute top-0 bottom-0 left-0 right-0 bg-white bg-opacity-70 z-50 flex flex-col justify-center items-center">
                  <p className="text-red-500 font-semibold text-lg">
                    Please refer to your Finance Adminstrator
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6  w-full my-6">
                <div className="w-full">
                  <label htmlFor={`glCode`} className="block mb-1">
                    Account to Debit
                  </label>
                  <div className="flex gap-4 ">
                    {drCr !== "DR" ? (
                      <div className="relative w-full">
                        <input
                          type="text"
                          id="glCode"
                          className="form-input w-full"
                          readOnly
                          {...register("glCode", { required: true })}
                          placeholder="Enter account here"
                        />
                        <CustomerAccountFinder
                          type="DEPOSIT"
                          onDone={(value) => {
                            setValue("glCode", value.title, {
                              shouldValidate: true,
                            });
                          }}
                          disableButton={!!typeWatcher}
                        />
                      </div>
                    ) : (
                      <Controller
                        name={`glCode`}
                        control={control}
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <Select
                            id={`glCode`}
                            disabled={!typeWatcher}
                            size="large"
                            className="w-full flex-1"
                            placeholder="Select account"
                            options={transactionMap.map((account) => ({
                              label: account.subAccountName,
                              value: account.subAccountId,
                            }))}
                            {...field}
                          ></Select>
                        )}
                      />
                    )}
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor="depositAccountNumber" className="block mb-1">
                    Account to Credit
                  </label>
                  <div className="flex gap-4 ">
                    {drCr !== "CR" ? (
                      <div className="relative w-full">
                        <input
                          type="text"
                          id="depositAccountNumber"
                          readOnly
                          className="form-input w-full"
                          {...register("depositAccountNumber", {
                            required: true,
                          })}
                          placeholder="Enter account here"
                        />
                        <CustomerAccountFinder
                          type="DEPOSIT"
                          onDone={(value) => {
                            setValue("depositAccountNumber", value.title, {
                              shouldValidate: true,
                            });
                          }}
                          disableButton={!!typeWatcher}
                        />
                      </div>
                    ) : (
                      <Controller
                        name={`depositAccountNumber`}
                        control={control}
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <Select
                            id={`depositAccountNumber`}
                            size="large"
                            disabled={!typeWatcher}
                            className="w-full flex-1"
                            placeholder="Select account"
                            options={transactionMap.map((account) => ({
                              label: account.subAccountName,
                              value: account.subAccountId,
                            }))}
                            {...field}
                          ></Select>
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
            </Spin>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <div className="w-full col-start-1">
            <label htmlFor={`transactionAmount`} className="block mb-1">
              Amount
            </label>
            <Controller
              name={`transactionAmount`}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <InputNumber
                  id={`transactionAmount`}
                  controls={false}
                  size="large"
                  placeholder="Enter  Amount here"
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

          <div className="w-full ">
            <label htmlFor="valueDate" className="block mb-1">
              Value Date
            </label>
            <Controller
              name="valueDate"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  id="valueDate"
                  size="large"
                  className="w-full"
                  placeholder="Select Date"
                  value={dayjs(value)}
                  onChange={(_, dateString) => {
                    onChange(dateString);
                  }}
                />
              )}
            />
          </div>

          <div className="w-full col-span-2 col-start-1">
            <label htmlFor="description" className="block mb-1">
              Narration
            </label>
            <input
              type="text"
              id="description"
              className="form-input w-full"
              {...register("transactionDescription", { required: true })}
              placeholder="Enter narration here"
            />
          </div>
          <div className="w-full col-span-2 col-start-1 text-end">
            <Button
              title={"Post"}
              disabled={!isValid || processing}
              isLoading={processing}
              type="primary"
              className="mt-12"
              forForm
              size="large"
            />
          </div>
        </div>

        <div className="mt-12 md:mt-auto text-end "></div>
      </form>
    </>
  );
};

export default NewJournalPosting;
