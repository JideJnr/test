import { ILoan } from "@/interfaces/iLoan";
import { Controller, useForm } from "react-hook-form";
import { InputNumber, Select } from "antd";
import Button from "@/components/common/Button";
import { useEffect } from "react";
import ngBanks from "ng-banks";
import { Bank } from "ng-banks/lib/types";
import { useHookFormMask } from "use-mask-input";

const banks: Bank[] = ngBanks.getBanks() as Bank[];
const StepTwo: React.FC<{
  next: () => void;
  previous: () => void;
  setFormData: (data: ILoan) => void;
  data: Partial<ILoan>;
}> = ({ next, previous, data, setFormData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<ILoan>({
    mode: "onChange",
  });
  const registerWithMask = useHookFormMask(register);

  useEffect(() => {
    if (data) {
      setValue("bankAccountName", data.bankAccountName, {
        shouldValidate: true,
      });
      setValue("bankAccountNumber", data.bankAccountNumber, {
        shouldValidate: true,
      });
      setValue("bankName", data.bankName, { shouldValidate: true });
      setValue("workExperienceYrs", data.workExperienceYrs, {
        shouldValidate: true,
      });
      setValue("pensionRsaNumber", data.pensionRsaNumber, {
        shouldValidate: true,
      });
    }
  }, [data]);

  const onSubmit = (form: Partial<ILoan>) => {
    setFormData({ ...data, ...form } as ILoan);
    next();
  };

  return (
    <form
      autoComplete={"off"}
      className="flex flex-col min-h-[600px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
        <div className="w-full">
          <label htmlFor="bankAccountName" className="block mb-1">
            Bank Account Name
          </label>

          <input
            type="text"
            id="bankAccountName"
            className="form-input w-full"
            {...register("bankAccountName", { required: true })}
            placeholder="Enter Bank Account Name here"
          />
        </div>

        <div className="w-full">
          <label htmlFor="bankAccountNumber" className="block mb-1">
            Bank Account Number
          </label>
          <input
            type="text"
            inputMode="numeric"
            id="bvnNumber"
            {...registerWithMask("bankAccountNumber", "9999999999", {
              required: true,
            })}
            className="form-input w-full"
            placeholder="Enter account number here"
          />
        </div>

        <div className="w-full">
          <label htmlFor="bankName" className="block mb-1">
            Bank Name
          </label>
          <Controller
            name="bankName"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Select
                id="bankName"
                size="large"
                showSearch
                className="w-full"
                placeholder="Select Bank"
                options={banks.map((bank) => ({
                  label: bank.name,
                  value: bank.name,
                }))}
                {...field}
              ></Select>
            )}
          />
        </div>

        <div className="w-full">
          <label htmlFor="workExperienceYrs" className="block mb-1">
            Years of Work Experience
          </label>
          <Controller
            name="workExperienceYrs"
            control={control}
            render={({ field }) => (
              <InputNumber
                controls={false}
                id="workExperienceYrs"
                precision={0}
                size="large"
                placeholder="Enter Years of Work Experience here"
                className=" w-full"
                {...field}
              />
            )}
          />
        </div>

        <div className="w-full">
          <label htmlFor="pensionRsaNumber" className="block mb-1">
            Pension RSA Number
          </label>
          <Controller
            name="pensionRsaNumber"
            control={control}
            render={({ field }) => (
              <InputNumber
                controls={false}
                id="pensionRsaNumber"
                stringMode
                precision={0}
                size="large"
                placeholder="Enter Pension RSA Number here"
                className=" w-full"
                {...field}
              />
            )}
          />
        </div>
      </div>

      <div className="mt-auto text-end flex items-center gap-3 justify-end">
        <Button
          title={"Back"}
          onClick={() => {
            previous();
          }}
          type="default"
          size="large"
        />

        <Button
          title={"Next"}
          disabled={!isValid}
          forForm
          type="primary"
          size="large"
        />
      </div>
    </form>
  );
};

export default StepTwo;
