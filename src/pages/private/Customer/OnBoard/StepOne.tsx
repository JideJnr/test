import { StepPropType } from "@/types/misc";
import Button from "@/components/common/Button";
import { ICustomer, IFiles } from "@/interfaces/iCustomer";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { Select, DatePicker, Upload, ConfigProvider } from "antd";
import {
  BusinessLegalStatus,
  CustomerEducationalLevel,
  CustomerMaritalStatus,
  CustomerTitle,
} from "@/shared/utils/constants";
import dayjs from "dayjs";
import useStore from "@/store";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadChangeParam } from "antd/es/upload";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import ApiService from "@/services/api";

const apiService = new ApiService();

const StepOne: React.FC<StepPropType> = ({
  who,
  next,
  data,
  setFormData,
  isEdit,
}) => {
  const {
    locationStore: { locations, officers, getOfficers },
  } = useStore();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState,
    resetField,
    formState: { errors, isValid },
  } = useForm<
    ICustomer & {
      location: string | number;
    }
  >({
    mode: "onChange",
    defaultValues: {
      birthDate: dayjs().subtract(17, "year"),
    },
  });
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<IFiles>();

  useEffect(() => {
    const newPayload = {
      ...data,
    } as ICustomer;

    if (data) {
      setValue("title", data.title, { shouldValidate: !!data.title });
      setValue("lastName", data.lastName, { shouldValidate: !!data.lastName });
      setValue("firstName", data.firstName, {
        shouldValidate: !!data.firstName,
      });
      setValue("middleName", data.middleName, {
        shouldValidate: !!data.middleName,
      });
      setValue("gender", data.gender, { shouldValidate: !!data.gender });
      setValue("maritalStatus", data.maritalStatus, {
        shouldValidate: !!data.maritalStatus,
      });
      setValue("educationLevel", data.educationLevel, {
        shouldValidate: !!data.educationLevel,
      });
      setValue("birthDate", data.birthDate, {
        shouldValidate: !!data.birthDate,
      });
      setValue("location", (newPayload?.locationId || "") as string, {
        shouldValidate: !!newPayload.locationId,
      });

      if (newPayload.locationId) {
        getOfficers(newPayload.locationId);

        setValue("accountOfficerId", data.accountOfficerId, {
          shouldValidate: !!data.accountOfficerId,
        });
      }

      if (data.passportPhoto) {
        setImageUrl({
          ...data.passportPhoto,
          // fileUrl: `/file/${data.passportPhoto.fileName}`,
        });
      }
    }
  }, [data]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "location" && value?.location) {
        getOfficers(value.location);
        resetField("accountOfficerId");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, formState]);

  const onSubmit = (form: ICustomer) => {
    const payload = {
      ...form,
      passportPhoto: imageUrl as IFiles,
    };

    if (who === "Director") {
      payload.gender = "CORPORATE";
      payload.educationLevel = "COPORATE";
    }

    setFormData({ ...data, ...payload });
    next();
  };

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      setLoading(false);
      setImageUrl(info.file.response);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {who === "Director" ? "Company logo" : "Photo"}
      </div>
    </div>
  );

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError, onProgress } = options;
    const formData = new FormData();

    formData.append("file", file);
    formData.append("fileName", "profilePicture");

    apiService
      .FileUploadUniRest(formData)
      .then((body: Record<string, any>) => {
        if (body.isSuccessful) {
          onSuccess({
            ...body.data,
            fileUrl: `/file/${body.data.fileName}`,
          });
        } else {
          onError("File upload error!");
        }
      })
      .catch((e) => {
        onError("File upload error!");
      })
      .finally(() => {
        onProgress(0);
      });
  };

  return (
    <ConfigProvider
      theme={{
        token: {},
      }}
    >
      <form
        autoComplete={"off"}
        className="flex flex-col min-h-[600px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full my-6 text-start">
          {/* <Controller
            name="passportPhoto"
            control={control}
            rules={{
              required: "Image is required",
            }}
            render={({ field: { onChange, value } }) => ( */}
          <Upload
            name="passportPhoto"
            listType="picture-card"
            className="avatar-uploader"
            customRequest={customRequest}
            showUploadList={false}
            onChange={(e) => {
              handleChange(e);
            }}
            // onChange={(_, dateString) => {
            //   onChange(dateString);
            // }
          >
            {imageUrl?.fileUrl ? (
              <div className="overflow-hidden h-full w-full rounded-lg">
                <img src={imageUrl.fileUrl} alt="avatar" className="w-full" />
              </div>
            ) : (
              uploadButton
            )}
          </Upload>
          {/* )}
          /> */}
        </div>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            who === "NOK" ? "md:grid-cols-3" : "md:grid-cols-2"
          } gap-6`}
        >
          {who === "NOK" && (
            <div className="col-end-2">
              <label htmlFor="title" className="block mb-1">
                Title
              </label>
              <Controller
                name="title"
                control={control}
                rules={{
                  required: "Title is required",
                }}
                render={({ field }) => (
                  <Select
                    id="title"
                    size="large"
                    className="w-full"
                    placeholder="Select Title"
                    options={CustomerTitle}
                    status={errors?.title?.message ? "error" : ""}
                    {...field}
                  ></Select>
                )}
              />
              {errors?.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors?.title?.message}
                </p>
              )}
            </div>
          )}

          <div className="w-full col-start-1">
            <label htmlFor="lastName" className="block mb-1">
              {who === "NOK" ? "Last Name" : "Corporate Name"}
            </label>
            <input
              type="text"
              id="lastName"
              className={`form-input w-full ${
                errors?.lastName?.message && "error"
              }`}
              {...register("lastName", {
                required: `${
                  who === "NOK" ? "Last Name" : "Corporate Name"
                } is required`,
              })}
              placeholder="Enter name here"
            />
            {errors?.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {errors?.lastName?.message}
              </p>
            )}
          </div>
          {who === "NOK" && (
            <>
              <div className="w-full">
                <label htmlFor="firstName" className="block mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className={`form-input w-full ${
                    errors?.firstName?.message && "error"
                  }`}
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  placeholder="Enter firstname here"
                />
                {errors?.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors?.firstName?.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="middleName" className="block mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middleName"
                  {...register("middleName")}
                  className={`form-input w-full`}
                  placeholder="Enter middle name here"
                />
              </div>
              <div className="w-full">
                <label htmlFor="gender" className="block mb-1">
                  Gender
                </label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{
                    required: "Gender must be selected",
                  }}
                  render={({ field }) => (
                    <Select
                      id="gender"
                      size="large"
                      className="w-full"
                      placeholder="Select Gender"
                      options={[
                        {
                          label: "Male",
                          value: "MALE",
                        },
                        {
                          label: "Female",
                          value: "FEMALE",
                        },
                      ]}
                      status={errors?.gender?.message && "error"}
                      {...field}
                    ></Select>
                  )}
                />
                {errors?.gender && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors?.gender?.message}
                  </p>
                )}
              </div>
            </>
          )}
          <div className="w-full">
            <label htmlFor="maritalStatus" className="block mb-1">
              {who === "NOK" ? "Marital" : "Legal"} Status
            </label>
            <Controller
              name="maritalStatus"
              control={control}
              rules={{
                required: `${
                  who === "NOK" ? "Marital" : "Legal"
                } status must be selected`,
              }}
              render={({ field }) => (
                <Select
                  id="maritalStatus"
                  size="large"
                  className="w-full"
                  placeholder="Select Status"
                  status={errors?.maritalStatus?.message && "error"}
                  options={
                    who === "NOK" ? CustomerMaritalStatus : BusinessLegalStatus
                  }
                  {...field}
                ></Select>
              )}
            />
            {errors?.maritalStatus && (
              <p className="mt-1 text-sm text-red-500">
                {errors?.maritalStatus?.message}
              </p>
            )}
          </div>
          {who === "NOK" && (
            <div className="w-full">
              <label htmlFor="educationLevel" className="block mb-1">
                Education Level
              </label>
              <Controller
                name="educationLevel"
                control={control}
                rules={{
                  required: "Education level must be selected",
                }}
                render={({ field }) => (
                  <Select
                    id="educationLevel"
                    size="large"
                    className="w-full"
                    placeholder="Select Education Level"
                    status={errors?.educationLevel?.message && "error"}
                    options={CustomerEducationalLevel}
                    {...field}
                  ></Select>
                )}
              />
              {errors?.educationLevel && (
                <p className="mt-1 text-sm text-red-500">
                  {errors?.educationLevel?.message}
                </p>
              )}
            </div>
          )}
          <div className="w-full">
            <label htmlFor="birthDate" className="block mb-1">
              {who === "NOK" ? "Birth Date" : "Date of Incorporation"}
            </label>
            <Controller
              name="birthDate"
              control={control}
              rules={{
                required:
                  who === "NOK"
                    ? "Birth Date is required"
                    : "Date of Incorporation is required",
              }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  id="birthDate"
                  size="large"
                  allowClear={false}
                  className="w-full"
                  placeholder="Select Date"
                  value={dayjs(value)}
                  disabledDate={(current) => {
                    return (
                      who === "NOK" &&
                      current &&
                      current > dayjs().subtract(17, "year")
                    );
                  }}
                  status={errors?.birthDate?.message && "error"}
                  onChange={(_, dateString) => {
                    onChange(dateString);
                  }}
                />
              )}
            />
            {errors?.birthDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors?.birthDate?.message}
              </p>
            )}
          </div>
          {!isEdit && (
            <>
              <div className="w-full">
                <label htmlFor="location" className="block mb-1">
                  Location
                </label>
                <Controller
                  name="location"
                  control={control}
                  rules={{
                    required: "Please select a location",
                  }}
                  render={({ field }) => (
                    <Select
                      id="location"
                      size="large"
                      showSearch
                      filterOption={(input, option) =>
                        option.label
                          ?.toLowerCase()
                          .includes(input?.toLowerCase())
                      }
                      className="w-full"
                      placeholder="Select Location"
                      status={errors?.location?.message && "error"}
                      options={locations.map((location) => ({
                        label: location.name,
                        value: location.id,
                      }))}
                      {...field}
                    ></Select>
                  )}
                />
                {errors?.location && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors?.location?.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="accountOfficerId" className="block mb-1">
                  Account Officer
                </label>
                <Controller
                  name="accountOfficerId"
                  control={control}
                  rules={{
                    required: "Please select an account officer",
                  }}
                  render={({ field }) => (
                    <Select
                      id="accountOfficerId"
                      size="large"
                      className="w-full"
                      showSearch
                      filterOption={(input, option) =>
                        option.label
                          ?.toLowerCase()
                          .includes(input?.toLowerCase())
                      }
                      placeholder="Select Officer"
                      status={errors?.accountOfficerId?.message && "error"}
                      options={officers.map((officer) => ({
                        label: `${officer.firstName} ${officer.lastName}`,
                        value: officer.accountOfficerId,
                      }))}
                      {...field}
                    ></Select>
                  )}
                />
                {errors?.accountOfficerId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors?.accountOfficerId?.message}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-12 md:mt-6 text-end">
          <Button
            title={"Next"}
            // disabled={!isValid}
            type="primary"
            forForm
            size="large"
          />
        </div>
      </form>
    </ConfigProvider>
  );
};

export default StepOne;
