import { Modal, Select } from "antd";
import Button from "@/components/common/Button";
import PageTitle from "@/components/common/PageTitle";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import useStore from "@/store";
import ModalClose from "../common/ModalClose";
import { IModal } from "@/interfaces/iModal";
import { SubAccount } from "@/interfaces/iLoan";
import { IAccount, ICategory, ISubCategory } from "@/interfaces/iPosting";

interface FormPayload {
  name: string;
  balanceType: "DR" | "CR";
  category: number;
  subCategory: number;
  account: number;
}

interface IProps extends IModal {
  isCategory?: boolean;
  isSubCategory?: boolean;
  isAccount?: boolean;
  data?: ICategory | ISubCategory | IAccount | SubAccount;
}

function getUniqueOptions(
  arr: SubAccount[],
  labelProp: keyof SubAccount,
  valueProp: keyof SubAccount
): any[] {
  return arr.reduce((options: any[], asset) => {
    const existingOption = options.find(
      (option) =>
        option.label === asset[labelProp] && option.value === asset[valueProp]
    );

    if (!existingOption) {
      options.push({
        label: asset[labelProp],
        value: asset[valueProp],
      });
    }

    return options;
  }, []);
}

export const UpsertChartModal: React.FC<IProps> = ({
  show,
  onClose,
  isCategory,
  isSubCategory,
  isAccount,
  data,
}) => {
  const {
    postingStore: { gls, upsertChart, processing, message: msg },
  } = useStore();

  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [accountNameOptions, setAccountNameOptions] = useState([]);
  const categoryOptions = gls.reduce((options, asset) => {
    const existingOption = options.find(
      (option) =>
        option.label === asset.categoryName && option.value === asset.categoryId
    );

    if (!existingOption) {
      options.push({
        label: asset.categoryName,
        value: asset.categoryId,
      });
    }

    return options;
  }, []);

  const {
    handleSubmit,
    control,
    register,
    watch,
    setValue,
    reset,
    formState,
    formState: { isValid },
  } = useForm<FormPayload>({
    mode: "onChange",
  });
  const category = watch("category");
  const subCategory = watch("subCategory");

  useEffect(() => {
    if (msg) {
      reset();
    }
  }, [msg]);

  useEffect(() => {
    if (data) {
      setValue("name", data.name, { shouldValidate: true });

      if (isCategory && "balanceType" in data) {
        setValue("balanceType", data.balanceType, { shouldValidate: true });
      } else if (!isCategory && "categoryId" in data) {
        setValue("category", data.categoryId, {
          shouldValidate: true,
          shouldTouch: true,
        });
      }

      if ("subCategoryId" in data) {
        setValue("subCategory", data.subCategoryId, {
          shouldValidate: true,
          shouldTouch: true,
        });
      }

      if ("accountId" in data) {
        setValue("account", data.accountId, { shouldValidate: true });
      }
    }
  }, [data]);

  useEffect(() => {
    const filteredGls = gls.filter((gl) => gl.categoryId === category);

    if (formState.touchedFields.category) {
      const subCategoryOptions = getUniqueOptions(
        filteredGls,
        "subCategoryName",
        "subCategoryId"
      );

      setSubCategoryOptions(subCategoryOptions);
    }

    if (formState.touchedFields.subCategory) {
      const filteredGlsWithSubCategory = filteredGls.filter(
        (gl) => gl.subCategoryId === subCategory
      );
      const accountNameOptions = getUniqueOptions(
        filteredGlsWithSubCategory,
        "accountName",
        "accountId"
      );

      setAccountNameOptions(accountNameOptions);
    }
  }, [
    formState.touchedFields.category,
    formState.touchedFields.subCategory,
    category,
    subCategory,
    setValue,
    setSubCategoryOptions,
    setAccountNameOptions,
    gls,
  ]);

  const onSubmit = async (form: FormPayload) => {
    let chartType: "CAT" | "SCAT" | "ACC" | "SACC";
    let parentId: number | null = null;
    let balanceType: string | undefined;

    if (isCategory) {
      chartType = "CAT";
      balanceType = form.balanceType;
    } else if (isSubCategory) {
      chartType = "SCAT";
      parentId = form.category || null;
    } else if (isAccount) {
      chartType = "ACC";
      parentId = form.subCategory || form.category || null;
    } else {
      chartType = "SACC";
      parentId = form.account || form.category || null;
    }

    const payload = {
      name: form.name,
      parentId,
      balanceType,
    };

    await upsertChart(chartType, payload, data?.id);
  };

  return (
    <Modal
      closeIcon={<ModalClose />}
      open={show}
      onCancel={() => {
        onClose();
        reset();
      }}
      closable={!processing}
      maskClosable={!processing}
      footer={null}
      className="min-h-[1600px]"
      title={
        <PageTitle
          showAdd={false}
          showSearch={false}
          isModal
          title={"Chart of Account"}
        />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {!isCategory && (
          <div className="mb-6">
            <label htmlFor="category" className="block mb-2">
              Category
            </label>
            <Controller
              name="category"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Select
                  id="category"
                  size="large"
                  className="w-full"
                  showSearch
                  placeholder="Select Category"
                  options={categoryOptions}
                  {...field}
                ></Select>
              )}
            />
          </div>
        )}

        {!isCategory && !isSubCategory && (
          <div className="mb-6">
            <label htmlFor="subCategory" className="block mb-2">
              Sub-Category
            </label>
            <Controller
              name="subCategory"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Select
                  id="subCategory"
                  size="large"
                  className="w-full"
                  placeholder="Select Sub-Category"
                  options={subCategoryOptions}
                  {...field}
                ></Select>
              )}
            />
          </div>
        )}

        {!isCategory && !isSubCategory && !isAccount && (
          <div className="mb-6">
            <label htmlFor="account" className="block mb-2">
              Account
            </label>
            <Controller
              name="account"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Select
                  id="account"
                  size="large"
                  className="w-full"
                  placeholder="Select Account"
                  options={accountNameOptions}
                  {...field}
                ></Select>
              )}
            />
          </div>
        )}

        <div className="mb-6">
          <label htmlFor={`name`} className="block mb-1">
            Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              {...register("name", { required: true })}
              className="form-input w-full"
              placeholder="Enter Name here"
            />
          </div>
        </div>

        {isCategory && (
          <div className="mb-6">
            <label htmlFor="balanceType" className="block mb-2">
              Balance Type
            </label>
            <Controller
              name="balanceType"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Select
                  id="balanceType"
                  size="large"
                  className="w-full"
                  placeholder="Select Balance Type"
                  options={[
                    {
                      label: "Credit",
                      value: "CR",
                    },
                    {
                      label: "Debit",
                      value: "DR",
                    },
                  ]}
                  {...field}
                ></Select>
              )}
            />
          </div>
        )}

        <div className="mb-3 mt-24 flex gap-4 justify-end items-center">
          <a
            onClick={() => {
              onClose();
              reset();
            }}
            className="text-red-600 hover:text-red-700 w-24"
          >
            Cancel
          </a>
          <Button
            disabled={!isValid || processing}
            title={data?.id ? "Update" : "Create"}
            forForm
            isLoading={processing}
            type="primary"
            size="medium"
          />
        </div>
      </form>
    </Modal>
  );
};
