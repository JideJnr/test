import { Popover, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import useStore from "@/store/index";
import Button from "./Button";
import { AiOutlineSearch } from "react-icons/ai";
import { ICustomer } from "@/interfaces/iCustomer";

const CustomerFinder: React.FC<{
  onDone: (value: any) => void;
  icon?: React.ReactNode;
}> = ({ onDone, icon }) => {
  const [search, setSearch] = useState<string>("");
  const [customer, setCustomer] = useState<ICustomer>(null);
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
  }, [getCustomers, genericCustomers]);

  const handleClear = () => {
    setSearch("");
    setCustomer(null);
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
                    filterOption={(input, option) =>
                      option.label?.toLowerCase().includes(input?.toLowerCase())
                    }
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
                    options={genericCustomers.map((customer) => ({
                      label: customer.fullName,
                      value: customer.customerId,
                    }))}
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
                    if (customer) {
                      onDone({
                        account: customer.customerId,
                        title: `${customer.customerId} - ${customer.fullName}`,
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
            <h1 className="text-lg">Customer Finder</h1>
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
          title={icon ? icon : <AiOutlineSearch className="mx-auto text-xl" />}
        />
      </Popover>
    </div>
  );
};

export default CustomerFinder;
