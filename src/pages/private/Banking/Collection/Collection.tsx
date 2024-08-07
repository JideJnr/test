import Button from "@/components/common/Button";
import CustomerAccountFinder from "@/components/common/CustomerAccountFinder";
import PageTitle from "@/components/common/PageTitle";
import { useEffect, useState } from "react";
import { TbDownload, TbSearch } from "react-icons/tb";
import useStore from "@/store";
import CollectionDetail from "./CollectionDetail";

const Collections: React.FC<any> = () => {
  const {
    loanStore: {
      getLoanCollection,
      collection,
      loading,
      processing,
      clearField,
    },
    miscStore: { setSpinner },
  } = useStore();
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    setSpinner(processing || loading);
  }, [processing, loading]);

  useEffect(() => {
    clearField("collection");
  }, [account]);

  const handleAccountFind = async () => {
    if (account) {
      await getLoanCollection(account);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
        <PageTitle
          title={"Collection"}
          subTitle={`View loan repayment schedule and collection`}
          showAdd={false}
          showSearch={false}
          className="mb-2"
        />
      </div>

      <div className="mt-20 flex flex-col gap-y-6">
        <div className="flex flex-row gap-x-2 items-center">
          <div className="relative w-full md:w-2/4 lg:w-1/3">
            <input
              type="text"
              readOnly
              className="form-input w-full"
              value={account}
              onChange={() => {}}
              placeholder="Select Customer Account"
            />
            <CustomerAccountFinder
              type="LOAN"
              disableButton
              onDone={(value) => {
                setAccount(value.account);
              }}
              icon={<TbSearch className="text-xl mx-auto" />}
            />
          </div>
          <Button
            onClick={handleAccountFind}
            className="min-w-[50px] w-1/3 md:w-fit h-12"
            title={
              <div className="flex items-center justify-center gap-x-2">
                <TbDownload className="text-xl" />
                <span className="text-sm hidden md:inline">Fetch</span>
              </div>
            }
            type={"primary"}
            size={"large"}
          ></Button>
        </div>

        {collection && account && collection.loanAccountNumber === account && (
          <CollectionDetail
            collection={collection}
            account={account}
            showAction
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default Collections;
