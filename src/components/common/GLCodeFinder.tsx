import { Popover, Select } from "antd";
import { useEffect, useState } from "react";
import useStore from "@/store/index";
import Button from "./Button";
import { AiOutlineSearch } from "react-icons/ai";
import { Controller, useForm } from "react-hook-form";
import { SubAccount } from "@/interfaces/iLoan";

const GLCodeFinder: React.FC<{
  onDone: (value: any) => void;
  className?: string;
}> = ({ onDone, className }) => {
  const { control, getValues, watch, formState, reset } = useForm<
    Partial<SubAccount>
  >({
    mode: "onChange",
  });
  const [open, setOpen] = useState(false);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [accountNameOptions, setAccountNameOptions] = useState([]);
  const [nameOptions, setNameOptions] = useState([]);
  const {
    postingStore: { gls, getGLs },
  } = useStore();

  useEffect(() => {
    getGLs();
  }, []);

  const categoryOptions = [...new Set(gls.map((asset) => asset.categoryName))];
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    const subscription = watch((value) => {
      const subCategoryOptions = [
        ...new Set(
          gls
            .filter((gl) => gl.categoryName === value.categoryName)
            .map((gl) => gl.subCategoryName)
        ),
      ];

      const accountNameOptions = [
        ...new Set(
          gls
            .filter((gl) => gl.subCategoryName === value.subCategoryName)
            .map((gl) => gl.accountName)
        ),
      ];

      const nameOptions = [
        ...new Set(
          gls
            .filter((gl) => gl.accountName === value.accountName)
            .map((gl) => gl.name)
        ),
      ];

      setSubCategoryOptions(subCategoryOptions);
      setAccountNameOptions(accountNameOptions);
      setNameOptions(nameOptions);
    });

    return () => subscription.unsubscribe();
  }, [watch, formState]);

  return (
    <div className={`absolute top-2 right-2  ${className}`}>
      <Popover
        content={
          <form>
            <div className="flex flex-col gap-y-4 p-2">
              <div className="w-full">
                <label htmlFor={`categoryName`} className="block mb-1">
                  Category Name
                </label>
                <div className="flex gap-4 ">
                  <Controller
                    name={`categoryName`}
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <Select
                        id={`categoryName`}
                        size="large"
                        showSearch
                        allowClear
                        className="w-full flex-1"
                        placeholder="Select Category"
                        options={categoryOptions.map((item) => ({
                          label: item,
                          value: item,
                        }))}
                        {...field}
                      ></Select>
                    )}
                  />
                </div>
              </div>

              <div className="w-full">
                <label htmlFor={`subCategoryName`} className="block mb-1">
                  Sub-Category Name
                </label>
                <div className="flex gap-4 ">
                  <Controller
                    name={`subCategoryName`}
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <Select
                        id={`subCategoryName`}
                        size="large"
                        showSearch
                        allowClear
                        disabled={!subCategoryOptions?.length}
                        className="w-full flex-1"
                        placeholder="Select Sub-Category Name"
                        options={subCategoryOptions.map((item) => ({
                          label: item,
                          value: item,
                        }))}
                        {...field}
                      ></Select>
                    )}
                  />
                </div>
              </div>

              <div className="w-full">
                <label htmlFor={`accountName`} className="block mb-1">
                  Account Name
                </label>
                <div className="flex gap-4 ">
                  <Controller
                    name={`accountName`}
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <Select
                        id={`accountName`}
                        size="large"
                        showSearch
                        allowClear
                        disabled={!accountNameOptions?.length}
                        className="w-full flex-1"
                        placeholder="Select Account Name"
                        options={accountNameOptions.map((item) => ({
                          label: item,
                          value: item,
                        }))}
                        {...field}
                      ></Select>
                    )}
                  />
                </div>
              </div>

              <div className="w-full">
                <label htmlFor={`name`} className="block mb-1">
                  Name
                </label>
                <div className="flex gap-4 ">
                  <Controller
                    name={`name`}
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <Select
                        id={`name`}
                        size="large"
                        showSearch
                        allowClear
                        disabled={!nameOptions?.length}
                        className="w-full flex-1"
                        placeholder="Select Name"
                        options={nameOptions.map((item) => ({
                          label: item,
                          value: item,
                        }))}
                        {...field}
                      ></Select>
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-x-4 justify-end mt-6 items-center">
                <a
                  onClick={() => hide()}
                  className="text-red-600 hover:text-red-700 w-24"
                >
                  Close
                </a>
                <Button
                  title="Select"
                  type="primary"
                  size="medium"
                  onClick={(e) => {
                    e.preventDefault();

                    const selectedGl = gls.find(
                      (item) => item.name === getValues("name")
                    );

                    onDone(`${selectedGl.id}-${selectedGl.name}`);
                    hide();
                    reset();
                  }}
                />
              </div>
            </div>
          </form>
        }
        title={
          <div>
            <h1 className="text-lg">GL Code Finder</h1>
          </div>
        }
        trigger="click"
        showArrow
        style={{
          width: "500px",
        }}
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button
          type="primary"
          onClick={() => {}}
          className="text-center"
          title={<AiOutlineSearch className={`mx-auto text-xl`} />}
        />
      </Popover>
    </div>
  );
};

export default GLCodeFinder;
