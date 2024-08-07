import { useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import Tabs, { ITab } from "@/components/common/Tabs";
import { message } from "antd";
import DepositProductComponent from "./Deposit";
import LoanProductComponent from "./Loan";

const Products = () => {
  const {
    postingStore: { getGLs, message: msg, error, clearErrorAndMessage },
  } = useStore();
  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    getGLs();
  }, []);

  useEffect(() => {
    if (msg) {
      message.success(msg);
    }

    if (error) {
      message.error(error);
    }

    return () => {
      clearErrorAndMessage();
    };
  }, [error, msg, clearErrorAndMessage]);

  const tabs: ITab[] = [
    {
      label: "Deposit",
      id: 0,
    },
    {
      label: "Loan",
      id: 1,
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
        <PageTitle
          title="Products"
          subTitle="View and add products"
          showAdd={false}
          showBackButton={false}
          showSearch={false}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        {/* /Tab */}
        <Tabs
          tabs={tabs}
          selectedTab={selectedTab}
          onChange={setSelectedTab}
          className="mt-6"
          size="small"
        />
      </div>

      <div>
        {selectedTab === 0 && <DepositProductComponent />}
        {selectedTab === 1 && <LoanProductComponent />}
      </div>
    </div>
  );
};

export default Products;
