import Button from "@/components/common/Button";
import * as nigerianStates from "nigerian-states-and-lgas";
import { useEffect, useState } from "react";
import { StepPropType } from "@/types/misc";
import { useForm, Controller } from "react-hook-form";
import { Select } from "antd";
import { ICustomer } from "@/interfaces/iCustomer";
import { CustomerNOKRelationship } from "@/shared/utils/constants";
import { useHookFormMask } from "use-mask-input";

const StepThree: React.FC<StepPropType> = ({
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
    resetField,
    watch,
    control,
    formState: { isValid },
  } = useForm<
    ICustomer & {
      nextOfKinAddressState: string;
      nextOfKinAddressLGA: string;
    }
  >({
    mode: "onChange",
  });
  const registerWithMask = useHookFormMask(register);
  const states = nigerianStates.states();
  const watchState = watch("nextOfKinAddressState");

  useEffect(() => {
    if (data) {
      const { nextOfKinAddress, ...rest } = data as ICustomer & {
        nextOfKinAddressState: string;
        nextOfKinAddressLGA: string;
      };

      if (nextOfKinAddress) {
        const [address, LGA, state] = nextOfKinAddress.split(", ");

        setValue("nextOfKinAddress", address, {
          shouldValidate: true,
        });
        setValue("nextOfKinAddressState", state, {
          shouldValidate: true,
        });

        setTimeout(() => {
          setValue("nextOfKinAddressLGA", LGA, {
            shouldValidate: true,
          });
        }, 100);
      }

      setValue("nextOfKinEmail", rest.nextOfKinEmail, { shouldValidate: true });
      setValue("nextOfKinMobile", rest.nextOfKinMobile, {
        shouldValidate: true,
      });
      setValue("nextOfKinName", rest.nextOfKinName, {
        shouldValidate: true,
      });
      setValue("nextOfKinRelationship", rest.nextOfKinRelationship, {
        shouldValidate: true,
      });
    }
  }, [data]);

  useEffect(() => {
    resetField("nextOfKinAddressLGA");
  }, [watchState]);

  const onSubmit = (
    form: ICustomer & {
      nextOfKinAddressState: string;
      nextOfKinAddressLGA: string;
    }
  ) => {
    const {
      nextOfKinAddressState,
      nextOfKinAddressLGA,
      nextOfKinAddress,
      ...rest
    } = form;

    const fullAddress = `${nextOfKinAddress}, ${nextOfKinAddressLGA}, ${nextOfKinAddressState}`;

    setFormData({ ...data, ...rest, nextOfKinAddress: fullAddress });
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
          <div className="col-end-2">
            <label htmlFor="nextOfKinName" className="block mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="nextOfKinName"
              {...register("nextOfKinName", { required: true })}
              className="form-input w-full"
              placeholder="Jack Doe"
            />
          </div>
          {who === "NOK" && (
            <div className="w-full col-start-1">
              <label htmlFor="nextOfKinRelationship" className="block mb-1">
                Relationship
              </label>
              <Controller
                name="nextOfKinRelationship"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <Select
                    id="nextOfKinRelationship"
                    size="large"
                    className="w-full"
                    placeholder="Select Relationship"
                    options={CustomerNOKRelationship}
                    {...field}
                  ></Select>
                )}
              />
            </div>
          )}
          {who === "Director" && (
            <div className="w-full col-start-1">
              <label htmlFor="nextOfKinRelationship" className="block mb-1">
                Designation
              </label>
              <input
                type={"tel"}
                id="nextOfKinRelationship"
                {...register("nextOfKinRelationship", { required: true })}
                className="form-input w-full"
                placeholder="Enter designation here"
              />
            </div>
          )}

          <div className="w-full">
            <label htmlFor="nextOfKinMobile" className="block mb-1">
              Mobile
            </label>
            <input
              type={"tel"}
              id="nextOfKinMobile"
              {...registerWithMask("nextOfKinMobile", "99999999999", {
                required: true,
              })}
              className="form-input w-full"
              placeholder="Enter phone number here"
            />
          </div>
          <div className="w-full">
            <label htmlFor="nextOfKinEmail" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="nextOfKinEmail"
              {...register("nextOfKinEmail", { required: true })}
              className="form-input w-full"
              placeholder="Enter email address here"
            />
          </div>

          <div className="w-full">
            <label htmlFor="nextOfKinAddress" className="block mb-1">
              Home Address
            </label>
            <input
              type="text"
              id="nextOfKinAddress"
              {...register("nextOfKinAddress", { required: true })}
              className="form-input w-full"
              placeholder="Enter address here"
            />
          </div>
          <div className="w-full">
            <label htmlFor="nextOfKinAddressState" className="block mb-1">
              Home Address State
            </label>
            <Controller
              name="nextOfKinAddressState"
              control={control}
              render={({ field }) => (
                <Select
                  id="nextOfKinAddressState"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    option.label?.toLowerCase().includes(input?.toLowerCase())
                  }
                  className="w-full"
                  placeholder="Select State"
                  options={states.map((state) => {
                    return {
                      label: state,
                      value: state,
                    };
                  })}
                  {...field}
                ></Select>
              )}
            />
          </div>
          <div className="w-full">
            <label htmlFor="nextOfKinAddressLGA" className="block mb-1">
              Home Address LGA
            </label>
            <Controller
              name="nextOfKinAddressLGA"
              control={control}
              render={({ field }) => (
                <Select
                  id="nextOfKinAddressLGA"
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
                  {...field}
                ></Select>
              )}
            />
          </div>
        </div>

        <div className="mt-12 md:mt-auto text-end flex items-center gap-3 justify-end">
          <Button
            title={"Back"}
            onClick={() => {
              previous?.();
            }}
            type="default"
            size="large"
          />

          <Button
            disabled={!isValid}
            title={"Next"}
            type="primary"
            forForm
            size="large"
          />
        </div>
      </form>
    </>
  );
};

export default StepThree;
