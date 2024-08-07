import { Popover, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import useStore from "@/store/index";
import Button from "./Button";
import { AiOutlineSearch } from "react-icons/ai";
import { ICustomer } from "@/interfaces/iCustomer";

const CustomerAccountFinder: React.FC<{
  onDone: (value: any) => void;
  type?: "DEPOSIT" | "LOAN" | "FIXED" | "ALL";
  icon?: React.ReactNode;
  disableButton?: boolean;
}> = ({ onDone, type = "LOAN", icon, disableButton }) => {
  const [search, setSearch] = useState<string>("");
  const [customer, setCustomer] = useState<ICustomer>(null);
  const [selectedAcc, setSelectedAcc] = useState<string>("");
  const [options, setOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [open, setOpen] = useState(false);

  const {
    customerStore: {
      clearField,
      genericCustomers,
      getCustomers,
      loading: fetching,
    },
  } = useStore();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    setCustomer(null);
    setSelectedAcc("");
  }, [getCustomers, genericCustomers]);

  useEffect(() => {
    if (type === "LOAN") {
      setOptions(
        customer?.loanAccounts.map((acc) => ({
          label: `${acc.accountNumber}`,
          value: acc.accountNumber,
        }))
      );
    } else {
      const newOptions = customer?.depositAccounts
        .filter((item) => {
          switch (type) {
            case "DEPOSIT":
              return item.depositType !== "TERM_DEPOSIT";

            case "FIXED":
              return item.depositType === "TERM_DEPOSIT";

            default:
              return item;
          }
        })
        .map((acc) => ({
          label: `${acc.accountNumber}`,
          value: acc.accountNumber,
        }));

      setOptions(newOptions);
    }
  }, [customer]);

  const handleClear = () => {
    setSearch("");
    setCustomer(null);
    setSelectedAcc("");
    clearField("genericCustomers");

    setOpen(false);
  };

  return (
    <div className="absolute top-2 right-2">
      <Popover
        content={
          <form>
            <div className="flex flex-col gap-y-4 p-2">
              <div className="w-full">
                <label htmlFor={`search-input`} className="block mb-1">
                  Customer Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search-input"
                    className="form-input w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.keyCode === 13) {
                        e.preventDefault();

                        if (search.length > 2) {
                          await getCustomers(search, "GENERIC");
                        }
                      }
                    }}
                    placeholder="Search IDs, names, ect..."
                  />
                  <Button
                    type="primary"
                    onClick={async () => {
                      if (search.length > 2) {
                        await getCustomers(search, "GENERIC");
                      }
                    }}
                    className="text-center absolute top-2 right-2"
                    title={<AiOutlineSearch className="mx-auto text-xl" />}
                  />
                </div>
              </div>

              <div className="w-full">
                <label htmlFor={`customer`} className="block mb-1">
                  Customers
                </label>
                <div className="flex gap-4 ">
                  <Select
                    id={`customer`}
                    size="large"
                    showSearch
                    allowClear
                    defaultValue=""
                    value={customer?.customerId}
                    onChange={(value) => {
                      if (value) {
                        const selectCustomer = genericCustomers.find(
                          (customer) => customer.customerId === value
                        );

                        setCustomer(selectCustomer);
                      }
                    }}
                    loading={fetching}
                    disabled={!genericCustomers?.length}
                    className="w-full flex-1"
                    placeholder="Select Customer..."
                    filterOption={(input, option) =>
                      option.label?.toLowerCase().includes(input?.toLowerCase())
                    }
                    options={genericCustomers.map((customer) => ({
                      label: customer.fullName,
                      value: customer.customerId,
                    }))}
                  ></Select>
                </div>
              </div>

              <div className="w-full">
                <label htmlFor={`account`} className="block mb-1">
                  Accounts
                </label>
                <div className="flex gap-4 ">
                  <Select
                    id={`accountName`}
                    size="large"
                    showSearch
                    allowClear
                    defaultValue=""
                    value={selectedAcc}
                    filterOption={(input, option) =>
                      option.label?.toLowerCase().includes(input?.toLowerCase())
                    }
                    onChange={(value) => {
                      setSelectedAcc(value);
                    }}
                    loading={fetching}
                    disabled={!options?.length}
                    className="w-full flex-1"
                    placeholder="Select Account"
                    options={options}
                  ></Select>
                </div>
              </div>

              <div className="flex gap-x-4 justify-end mt-6 items-center">
                <a
                  onClick={() => handleClear()}
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
                    if (selectedAcc) {
                      const selectedAccount =
                        type === "LOAN"
                          ? customer.loanAccounts.find(
                              (item) => item.accountNumber === selectedAcc
                            )
                          : customer.depositAccounts.find(
                              (item) => item.accountNumber === selectedAcc
                            );

                      onDone({
                        account: selectedAccount.accountNumber,
                        title: `${selectedAccount.accountNumber} - ${customer.fullName}`,
                        customerName: customer.fullName,
                      });
                      handleClear();
                    }
                  }}
                />
              </div>
            </div>
          </form>
        }
        title={
          <div>
            <h1 className="text-lg">Customer Account Finder</h1>
          </div>
        }
        trigger="click"
        showArrow
        style={{
          width: "500px",
        }}
        open={disableButton && open}
        onOpenChange={handleOpenChange}
      >
        <Button
          type="primary"
          onClick={() => {}}
          disabled={!disableButton}
          className="text-center"
          title={icon ? icon : <AiOutlineSearch className="mx-auto text-xl" />}
        />
      </Popover>
    </div>
  );
};

export default CustomerAccountFinder;
