import Button from "@/components/common/Button";
import * as nigerianStates from "nigerian-states-and-lgas";
import { useEffect, useState } from "react";
import { StepPropType } from "@/types/misc";
import { ICustomer } from "@/interfaces/iCustomer";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { Select, DatePicker } from "antd";
import { CustomerIdentificationType } from "@/shared/utils/constants";
import { useHookFormMask } from "use-mask-input";

const StepTwo: React.FC<StepPropType> = ({
  who,
  next,
  previous,
  data,
  setFormData,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    resetField,
    control,
    formState: { errors },
  } = useForm<ICustomer>({
    mode: "onChange",
    defaultValues: {
      identificationIssuedDate: new Date(),
      identificationExpiryDate: new Date(),
    },
  });
  const registerWithMask = useHookFormMask(register);
  const states = nigerianStates.states();
  const watchState = watch("homeAddressState");

  useEffect(() => {
    if (data) {
      setValue("mobile", data.mobile, { shouldValidate: !!data.mobile });
      setValue("email", data.email, { shouldValidate: !!data.email });
      setValue("bvnNumber", data.bvnNumber, {
        shouldValidate: !!data.bvnNumber,
      });
      setValue("homeAddress", data.homeAddress, {
        shouldValidate: !!data.homeAddress,
      });
      setValue("homeAddressState", data.homeAddressState, {
        shouldValidate: !!data.homeAddressState,
      });
      setValue("identificationMeans", data.identificationMeans, {
        shouldValidate: !!data.identificationMeans,
      });
      setValue("identificationNumber", data.identificationNumber, {
        shouldValidate: !!data.identificationNumber,
      });
      setValue("identificationIssuedDate", data.identificationIssuedDate, {
        shouldValidate: !!data.identificationIssuedDate,
      });
      setValue("identificationExpiryDate", data.identificationExpiryDate, {
        shouldValidate: !!data.identificationExpiryDate,
      });
      setValue("secondaryCustomerId", data.secondaryCustomerId, {
        shouldValidate: !!data.secondaryCustomerId,
      });

      setTimeout(() => {
        setValue("homeAddressLGA", data.homeAddressLGA, {
          shouldValidate: true,
        });
      }, 100);
    }
  }, [data]);

  useEffect(() => {
    resetField("homeAddressLGA");
  }, [watchState]);

  const onSubmit = (form: any) => {
    if (who === "Director") {
      form.identificationMeans = "OTHERS";
    }

    setFormData({ ...data, ...form });
    next();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete={"off"}
        className="flex flex-col min-h-[600px]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="w-full">
            <label htmlFor="mobile" className="block mb-1">
              Mobile
            </label>
            <input
              type="text"
              id="mobile"
              {...registerWithMask("mobile", "99999999999", {
                required: "Phone number is required",
                valueAsNumber: "Enter valid phone number",
              })}
              className={`form-input w-full ${
                errors?.mobile?.message && "error"
              }`}
              placeholder="Enter phone number here"
            />
            {errors?.mobile && (
              <p className="mt-1 text-sm text-red-500">
                {errors?.mobile?.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="email" className="block mb-1">
              {who === "Director" && "Corporate"} Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "Email address is required" })}
              className={`form-input w-full ${
                errors?.email?.message && "error"
              }`}
              placeholder="Enter email address here"
            />
            {errors?.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors?.email?.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="bvnNumber" className="block mb-1">
              {who === "Director" && "Director's"} BVN
            </label>
            <input
              type="text"
              inputMode="numeric"
              id="bvnNumber"
              {...registerWithMask("bvnNumber", "99999999999", {
                required: "BVN is required",
                valueAsNumber: "Enter valid BVN",
              })}
              className={`form-input w-full ${
                errors?.bvnNumber?.message && "error"
              }`}
              placeholder="Enter BVN here"
            />
            {errors?.bvnNumber && (
              <p className="mt-1 text-sm text-red-500">
                {errors?.bvnNumber?.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="homeAddress" className="block mb-1">
              {who === "Director" ? "Corporate" : "Home"} Address
            </label>
            <input
              type="text"
              id="homeAddress"
              {...register("homeAddress", { required: "Address is required" })}
              className={`form-input w-full ${
                errors?.homeAddress?.message && "error"
              }`}
              placeholder="123, Jane & Doe Street"
            />
            {errors?.homeAddress && (
              <p className="mt-1 text-sm text-red-500">
                {errors?.homeAddress?.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="homeAddressState" className="block mb-1">
              {who === "Director" ? "Corporate" : "Home"} Address State
            </label>
            <Controller
              name="homeAddressState"
              control={control}
              rules={{
                required: "Select state",
              }}
              render={({ field }) => (
                <Select
                  id="homeAddressState"
                  size="large"
                  className="w-full"
                  showSearch
                  filterOption={(input, option) =>
                    option.label?.toLowerCase().includes(input?.toLowerCase())
                  }
                  placeholder="Select State"
                  options={states.map((state) => {
                    return {
                      label: state,
                      value: state,
                    };
                  })}
                  status={errors?.homeAddressState?.message && "error"}
                  {...field}
                ></Select>
              )}
            />
            {errors?.homeAddressState && (
              <p className="mt-1 text-sm text-red-500">
                {errors?.homeAddressState?.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="homeAddressLGA" className="block mb-1">
              {who === "Director" ? "Corporate" : "Home"} Address LGA
            </label>
            <Controller
              name="homeAddressLGA"
              control={control}
              rules={{
                required: "Select local goverment area",
              }}
              render={({ field }) => (
                <Select
                  id="homeAddressLGA"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    option.label?.toLowerCase().includes(input?.toLowerCase())
                  }
                  className="w-full"
                  placeholder="Select Local Govt"
                  options={(nigerianStates.lgas(watchState) || [])?.map(
                    (lga) => {
                      return {
                        label: lga,
                        value: lga,
                      };
                    }
                  )}
                  status={errors?.homeAddressLGA?.message && "error"}
                  {...field}
                ></Select>
              )}
            />
            {errors?.homeAddressLGA && (
              <p className="mt-1 text-sm text-red-500">
                {errors?.homeAddressLGA?.message}
              </p>
            )}
          </div>
          {who === "NOK" && (
            <div className="w-full">
              <label htmlFor="identificationMeans" className="block mb-1">
                Identification Means
              </label>
              <Controller
                name="identificationMeans"
                control={control}
                rules={{
                  required: "Select means of identification",
                }}
                render={({ field }) => (
                  <Select
                    id="identificationMeans"
                    size="large"
                    className="w-full"
                    placeholder="Select Identification Means"
                    options={CustomerIdentificationType}
                    status={errors?.identificationMeans?.message && "error"}
                    {...field}
                  ></Select>
                )}
              />
              {errors?.identificationMeans && (
                <p className="mt-1 text-sm text-red-500">
                  {errors?.identificationMeans?.message}
                </p>
              )}
            </div>
          )}
          <div className="w-full">
            <label htmlFor="identificationNumber" className="block mb-1">
              {who === "NOK" ? "Identification Number" : "RC/BN Number"}
            </label>
            <input
              type="text"
              id="identificationNumber"
              {...register("identificationNumber", {
                required:
                  who === "NOK"
                    ? "Identification Number is required"
                    : "RC/BN Number  is required",
              })}
              className={`form-input w-full ${
                errors?.identificationNumber?.message && "error"
              }`}
              placeholder="00000000"
            />
            {errors?.identificationNumber && (
              <p className="mt-1 text-sm text-red-500">
                {errors?.identificationNumber?.message}
              </p>
            )}
          </div>
          {who === "NOK" && (
            <>
              <div className="w-full">
                <label
                  htmlFor="identificationIssuedDate"
                  className="block mb-1"
                >
                  Identification Issued Date
                </label>
                <Controller
                  name="identificationIssuedDate"
                  control={control}
                  rules={{
                    required: "Issue Date must be selected",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      id="identificationIssuedDate"
                      size="large"
                      allowClear={false}
                      className="w-full"
                      placeholder="Select Issued Date"
                      value={dayjs(value)}
                      status={
                        errors?.identificationIssuedDate?.message && "error"
                      }
                      onChange={(_, dateString) => {
                        onChange(dateString);
                      }}
                    />
                  )}
                />
                {errors?.identificationIssuedDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors?.identificationIssuedDate?.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="identificationExpiryDate"
                  className="block mb-1"
                >
                  Identification Expiry Date
                </label>
                <Controller
                  name="identificationExpiryDate"
                  control={control}
                  rules={{
                    required: "Expiration Date must be selected",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      id="identificationExpiryDate"
                      size="large"
                      className="w-full"
                      placeholder="Select Expiry Date"
                      allowClear={false}
                      value={dayjs(value)}
                      status={
                        errors?.identificationExpiryDate?.message && "error"
                      }
                      onChange={(_, dateString) => {
                        onChange(dateString);
                      }}
                    />
                  )}
                />
                {errors?.identificationExpiryDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors?.identificationExpiryDate?.message}
                  </p>
                )}
              </div>
            </>
          )}
          {who === "NOK" && (
            <div className="w-full">
              <label htmlFor="secondaryCustomerId" className="block mb-1">
                Secondary Customer ID
              </label>
              <input
                type="text"
                id="secondaryCustomerId"
                className={`form-input w-full ${
                  errors?.secondaryCustomerId?.message && "error"
                }`}
                {...register("secondaryCustomerId")}
                placeholder="Enter Secondary Customer ID"
              />
            </div>
          )}
        </div>

        <div className="mt-12 md:mt-auto text-end flex items-center gap-3 justify-end">
          <Button
            title={"Back"}
            type="default"
            size="large"
            onClick={() => {
              previous();
            }}
          />

          <Button
            title={"Next"}
            // disabled={!isValid}
            type="primary"
            forForm
            size="large"
          />
        </div>
      </form>
    </>
  );
};

export default StepTwo;
