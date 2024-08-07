import { StepPropType } from "@/types/misc";
import Button from "@/components/common/Button";
import { ICustomer } from "@/interfaces/iCustomer";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import useStore from "@/store";

const StepFour: React.FC<StepPropType> = ({
  next,
  previous,
  data,
  setFormData,
  isEdit,
}) => {
  const { customerStore } = useStore();
  const { employers, getEmployers } = customerStore;
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<ICustomer>({
    mode: "onChange",
    defaultValues: {
      dateEmployed: new Date(),
      dateRetiring: new Date(),
    },
  });

  useEffect(() => {
    getEmployers();
  }, []);

  useEffect(() => {
    if (data) {
      setValue("occupation", data.occupation, {
        shouldValidate: true,
      });

      const lastCompany =
        data.employments && data.employments.length > 0
          ? data.employments.length - 1
          : null;

      if (
        isEdit &&
        data.employments &&
        data.employments.length > 0 &&
        lastCompany >= 0
      ) {
        const employment = data.employments[lastCompany];

        data.employerId = employment.employerId as string;
        setValue("employerId", data.employerId, {
          shouldValidate: true,
        });
        data.employmentNumber = employment.employmentNumber;
        data.reference = employment.reference;

        if (employment.dateRetiring) {
          data.dateRetiring = employment.dateRetiring;
        }

        if (employment.dateEmployed) {
          data.dateEmployed = employment.dateEmployed;
        }
      }

      setValue("employerId", data.employerId, {
        shouldValidate: true,
      });
      setValue("employmentNumber", data.employmentNumber, {
        shouldValidate: true,
      });
      setValue("reference", data.reference, {
        shouldValidate: true,
      });
      setValue("dateEmployed", data.dateEmployed, {
        shouldValidate: true,
      });
      setValue("dateRetiring", data.dateRetiring, {
        shouldValidate: true,
      });
    }
  }, [data]);

  const onSubmit = (form: ICustomer) => {
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
            <label htmlFor="occupation" className="block mb-1">
              Occupation
            </label>
            <input
              type="text"
              id="occupation"
              {...register("occupation", { required: true })}
              className="form-input w-full"
              placeholder="Civil Servant"
            />
          </div>
          <div className="w-full">
            <label htmlFor="employerId" className="block mb-1">
              Employer
            </label>
            <Controller
              name="employerId"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Select
                  id="employerId"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    option.label?.toLowerCase().includes(input?.toLowerCase())
                  }
                  className="w-full"
                  placeholder="Select Employer"
                  options={employers.map((employer) => ({
                    label: employer.name,
                    value: employer.id as any,
                  }))}
                  {...field}
                ></Select>
              )}
            />
          </div>
          <div className="w-full">
            <label htmlFor="employmentNumber" className="block mb-1">
              Employment Number
            </label>
            <input
              type="text"
              id="employmentNumber"
              {...register("employmentNumber", { required: true })}
              className="form-input w-full"
              placeholder="Enter IPPIS, Oracle Number, etc... here"
            />
          </div>

          <div className="w-full">
            <label htmlFor="reference" className="block mb-1">
              Employment Reference
            </label>
            <input
              type="text"
              id="reference"
              {...register("reference")}
              className="form-input w-full"
              placeholder="Enter Employment Reference"
            />
          </div>
          <div className="w-full">
            <label htmlFor="dateEmployed" className="block mb-1">
              Employment Date
            </label>
            <Controller
              name="dateEmployed"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  id="birthDate"
                  size="large"
                  className="w-full"
                  allowClear={false}
                  placeholder="Select Employment Date"
                  value={dayjs(value)}
                  onChange={(_, dateString) => {
                    onChange(dateString);
                  }}
                />
              )}
            />
          </div>
          <div className="w-full">
            <label htmlFor="dateRetiring" className="block mb-1">
              Retiring Date
            </label>
            <Controller
              name="dateRetiring"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  id="dateRetiring"
                  size="large"
                  className="w-full"
                  placeholder="Select Retirement Date"
                  value={dayjs(value)}
                  allowClear={false}
                  onChange={(_, dateString) => {
                    onChange(dateString);
                  }}
                />
              )}
            />
          </div>
        </div>

        <div className="mt-12 md:mt-auto text-end flex items-center gap-3 justify-end">
          <Button
            title={"Back"}
            onClick={() => {
              previous();
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

export default StepFour;
