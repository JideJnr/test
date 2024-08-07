import { useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import Tabs, { ITab } from "@/components/common/Tabs";
import Category from "./Category";
import SubCategory from "./SubCategory";
import Account from "./Account";
import SubAccount from "./SubAccount";
import { message } from "antd";
import TransactionMap from "./TransactionMap";
import FixedAssetMapping from "./FixedAssetMapping";

const AccountChart = () => {
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
      label: "Category",
      id: 0,
    },
    {
      label: "Sub-Category",
      id: 1,
    },
    {
      label: "Account",
      id: 2,
    },
    {
      label: "Sub-Account",
      id: 3,
    },
    {
      label: "Transaction Mappings",
      id: 4,
    },
    {
      label: "Fixed Asset Mappings",
      id: 5,
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
        <PageTitle
          title="Chart of Account"
          subTitle="View and add chart of account"
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
        {selectedTab === 0 && <Category />}
        {selectedTab === 1 && <SubCategory />}
        {selectedTab === 2 && <Account />}
        {selectedTab === 3 && <SubAccount />}
        {selectedTab === 4 && <TransactionMap />}
        {selectedTab === 5 && <FixedAssetMapping />}
      </div>
    </div>
  );
};

export default AccountChart;
