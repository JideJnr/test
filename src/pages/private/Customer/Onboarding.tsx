import React, { useEffect, useMemo, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import Tabs, { ITab } from "@/components/common/Tabs";
import Business from "@/pages/private/Customer/Business";
import Personal from "@/pages/private/Customer/Personal";
import useStore from "@/store";
import { useParams } from "react-router-dom";

const CustomerOnboarding: React.FC = () => {
  const param = useParams();
  const {
    locationStore: { getLocations },
  } = useStore();
  const tabs = useMemo<ITab[]>(
    () => [
      {
        label: "Personal",
        id: 0,
      },
      {
        label: "Business",
        id: 1,
      },
    ],
    []
  );
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [edit, setEdit] = useState<string | number | null>(null);

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    if (param) {
      setEdit(param.id);

      if (param.type === "BUSINESS") {
        setSelectedTab(1);
      } else if (param.type === "PERSONAL") {
        setSelectedTab(0);
      }
    }
  }, [param]);

  return (
    <div>
      <div
        className={`flex flex-col md:flex-row md:justify-between md:items-center ${
          edit ? "border-b" : "md:border-b"
        }`}
      >
        <PageTitle
          title={!edit ? "Onboarding" : "Update"}
          subTitle={
            !edit
              ? `Add new business or private customers to the system`
              : "Update customer details"
          }
          showAdd={false}
          showBackButton={!!edit}
          backButtonRoute={`/account/customer${edit && "/" + edit}`}
          showSearch={false}
        />
        {!edit && (
          <Tabs
            tabs={tabs}
            selectedTab={selectedTab}
            onChange={setSelectedTab}
            className="md:mb-8"
          />
        )}
      </div>
      <div id="tabContent">
        {selectedTab === 0 && <Personal customerId={edit} />}
        {selectedTab === 1 && <Business customerId={edit} />}
      </div>
    </div>
  );
};

export default CustomerOnboarding;
