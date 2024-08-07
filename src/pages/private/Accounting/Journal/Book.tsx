import React, { useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Select, DatePicker, InputNumber, message, Badge, Tooltip } from "antd";
import { IJournalPostingPayload, PostEntry } from "@/interfaces/iPosting";
import dayjs from "dayjs";
import Button from "@/components/common/Button";
import { RiAddLine, RiDeleteBin4Line } from "react-icons/ri";
import GLCodeFinder from "@/components/common/GLCodeFinder";
import BatchUpload from "@/components/common/BatchUploader";
import { BsInfoLg } from "react-icons/bs";
import { IUser } from "@/interfaces/iUserManagement";
import ApiService from "@/services/api";
import { useLocation, useNavigate } from "react-router-dom";

const calculateDebitCredit = (entries: PostEntry[]): [number, number] => {
  let debitTotal = 0.0;
  let creditTotal = 0.0;

  for (const entry of entries) {
    const { transactionAmount, drCrFlag } = entry;

    if (drCrFlag === "DR") {
      debitTotal += transactionAmount;
    } else if (drCrFlag === "CR") {
      creditTotal += transactionAmount;
    }
  }

  return [debitTotal, creditTotal];
};

const NewJournalPosting: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    handleSubmit,
    control,
    register,
    setValue,
    reset,
    formState: { isValid },
    watch,
  } = useForm<
    Partial<
      IJournalPostingPayload & {
        isAmotization: boolean;
        noOfAmotizations: number;
      }
    >
  >({
    mode: "onChange",
    defaultValues: {
      valueDate: new Date(),
      entry: [
        {
          subAccountId: null,
          transactionAmount: 0.0,
          description: "",
          drCrFlag: "DR",
        },
        {
          subAccountId: null,
          transactionAmount: 0.0,
          description: "",
          drCrFlag: "CR",
        },
      ],
    },
  });

  const isAmotization = watch("isAmotization");

  const { fields, append, remove } = useFieldArray({
    name: "entry",
    control,
  });

  const {
    postingStore: {
      message: msg,
      error,
      clearErrorAndMessage,
      processing,
      createJournalPosting,
      createAmotizationPosting,
      getGLs,
    },
    authStore: { user: originalUser, impersonated_user },
    miscStore: { setSpinner },
  } = useStore();
  const [user, setUser] = useState<IUser>(impersonated_user || originalUser);

  useEffect(() => {
    setUser(impersonated_user || originalUser);
  }, [impersonated_user, originalUser]);

  useEffect(() => {
    if (msg) {
      message.success(msg);
      reset({
        description: "",
        entry: [
          {
            subAccountId: null,
            subAccount: "",
            transactionAmount: 0.0,
            description: "",
            drCrFlag: "DR",
          },
          {
            subAccountId: null,
            subAccount: "",
            transactionAmount: 0.0,
            description: "",
            drCrFlag: "CR",
          },
        ],
      });
    }

    if (error) {
      message.error(error);
    }

    return () => {
      clearErrorAndMessage();
    };
  }, [error, msg, clearErrorAndMessage]);

  useEffect(() => {
    getGLs();
  }, []);

  const handleBatchUpload = async (payload: FormData) => {
    setSpinner(true);

    try {
      const apiService = new ApiService();
      await apiService.BatchJournalPosting(payload);

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

  const onSubmit = async (
    form: Partial<
      IJournalPostingPayload & {
        isAmotization: boolean;
        noOfAmotizations: number;
      }
    >
  ) => {
    const { entry } = form;
    const [debit, credit] = calculateDebitCredit(entry);

    if (debit === 0.0 || credit === 0.0) {
      message.error("Debits or credit amounts must be greater than zero");
      return;
    }

    if (debit !== credit) {
      message.error(
        `Total amount of credits does not match total amount of debits.`
      );
      return;
    }

    const payload: Partial<IJournalPostingPayload> = {
      ...form,
      tellerUserId: user.id,
      transactionId: "12345",
      entryType: "GENERAL",
      reviewerUserId: user.id,
    };

    if (form.isAmotization) {
      await createAmotizationPosting(payload, form.noOfAmotizations);
    } else {
      await createJournalPosting(payload);
    }
  };

  return (
    <>
      <div className="border-b flex justify-between items-center mb-2 md:mb-0">
        <PageTitle
          title="Journal Entry"
          subTitle="Add Journal Entries"
          showAdd={false}
          showSearch={false}
        />
        {/* <
        <Badge
          count={<BsInfoLg />}
          status="processing"
          
        > */}
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
              href="/batch-journal-entries-format.xlsx"
            >
              <BsInfoLg />
            </a>
          </Tooltip>
        </div>
        {/* </Badge> */}
      </div>

      <form
        className="mt-12 flex flex-col min-h-[700px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6  w-full">
          <div className="w-full col-span-2">
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
                  allowClear={false}
                  disabledDate={(current) => {
                    return current && current > dayjs().add(0, "day");
                  }}
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
          <div className="w-full col-span-2">
            <label htmlFor="description" className="block mb-1">
              Narration
            </label>
            <input
              type="text"
              id="description"
              className="form-input w-full"
              {...register("description", { required: true })}
              placeholder="Enter narration here"
            />
          </div>
          <div className="col-start-1 col-span-2">
            <div className="w-full">
              <label className="flex gap-2 items-center cursor-pointer mb-8 mt-4 text-sm w-fit">
                <input
                  {...{
                    type: "checkbox",
                    ...register("isAmotization"),
                  }}
                />
                Amortize Posting
              </label>
              {isAmotization && (
                <>
                  <label htmlFor={`noOfAmotizations`} className="block mb-1">
                    Number Of Amortization <i>(Months)</i>
                  </label>

                  <div className="w-full">
                    <Controller
                      name={`noOfAmotizations` as const}
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <InputNumber
                          id={`noOfAmotizations`}
                          controls={false}
                          size="large"
                          placeholder="Enter number of amotizations"
                          className="w-full"
                          precision={0}
                          defaultValue={0}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="w-full mt-16">
          <p className="text-lg text-gray-600 font-medium uppercase mb-6">
            Entries
          </p>

          {fields.map((field, index) => (
            <div
              className="grid grid-cols-1 md:grid-cols-5 gap-6 first:mt-0 mt-6 "
              key={field.id}
            >
              <div className="w-full">
                <label
                  htmlFor={`entry.${index}.subAccount` as const}
                  className="block mb-1"
                >
                  GL Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={`entry.${index}.subAccount`}
                    readOnly
                    className="form-input w-full pr-12"
                    {...register(`entry.${index}.subAccount` as const, {
                      required: true,
                    })}
                    placeholder="Select a Sub Account"
                  />
                  <GLCodeFinder
                    onDone={(resp) => {
                      setValue(
                        `entry.${index}.subAccountId`,
                        +resp.split("-")[0]
                      );

                      setValue(`entry.${index}.subAccount`, resp);
                    }}
                    className="top-1.5"
                  />
                </div>
              </div>
              <div className="w-full">
                <label
                  htmlFor={`entry.${index}.transactionAmount`}
                  className="block mb-1"
                >
                  Amount
                </label>
                <div className="relative">
                  <Controller
                    name={`entry.${index}.transactionAmount` as const}
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <InputNumber
                        id={`entry.${index}.transactionAmount`}
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
              </div>
              <div className="w-full">
                <label
                  htmlFor={`entry.${index}.drCrFlag`}
                  className="block mb-1"
                >
                  Transaction Type
                </label>
                <div className="flex gap-4 ">
                  <Controller
                    name={`entry.${index}.drCrFlag`}
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <Select
                        id={`entry.${index}.drCrFlag` as const}
                        size="large"
                        className="w-full flex-1 formSingleSelect"
                        placeholder="Select transaction type"
                        options={[
                          {
                            label: "Debit",
                            value: "DR",
                          },
                          {
                            label: "Credit",
                            value: "CR",
                          },
                        ]}
                        {...field}
                      ></Select>
                    )}
                  />
                </div>
              </div>
              <div className="w-full">
                <label
                  htmlFor={`entry.${index}.description`}
                  className="block mb-1"
                >
                  Narration
                </label>
                <input
                  type="text"
                  id={`entry.${index}.description`}
                  className="form-input w-full"
                  {...register(`entry.${index}.description` as const)}
                  placeholder="Enter narration here"
                />
              </div>
              <div className="flex flex-col-reverse">
                {index > 1 && (
                  <Button
                    title={
                      <div className="flex items-center justify-center gap-x-2">
                        <RiDeleteBin4Line className="text-2xl" />
                      </div>
                    }
                    size="large"
                    type="danger"
                    className="place- !min-w-fit"
                    onClick={(e) => {
                      e.preventDefault();

                      remove(index);
                    }}
                  />
                )}
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-7 gap-6 first:mt-0 mt-12 ">
            <div className="col-span-6 flex justify-between items-center">
              <Button
                title={
                  <div className="flex items-center justify-center gap-x-2">
                    <RiAddLine className="text-lg" />
                    <span className="text-sm">Add Entry</span>
                  </div>
                }
                size="large"
                onClick={(e) => {
                  e.preventDefault();

                  append({
                    subAccountId: null,
                    transactionAmount: 0.0,
                    drCrFlag: null,
                    description: "",
                  });
                }}
              />
              <Button
                title={"Save"}
                disabled={!isValid || processing}
                isLoading={processing}
                type="primary"
                forForm
                size="large"
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default NewJournalPosting;
