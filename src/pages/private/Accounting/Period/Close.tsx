import { useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import { message } from "antd";
import Button from "@/components/common/Button";
import { useNavigate, useParams } from "react-router-dom";
import GLCodeFinder from "@/components/common/GLCodeFinder";
import { IAccountingPeriod } from "@/interfaces/iPosting";

const CloseAccountPeriod = () => {
  const {
    postingStore: {
      processing,
      message: msg,
      error,
      getAccountingPeriod,
      closeAccountingPeriod,
      accountingPeriod,
      clearErrorAndMessage,
    },
    miscStore: { setSpinner },
  } = useStore();
  const navigate = useNavigate();
  const params = useParams();
  const [periodEndClosingSubaccount, setPeriodEndClosingSubaccount] =
    useState<string>("");

  useEffect(() => {
    if (params["id"]) {
      getAccountingPeriod(+params["id"]);
    }
  }, [params]);

  useEffect(() => {
    setSpinner(processing);
  }, [processing]);

  useEffect(() => {
    if (msg) {
      message.success(msg);
      navigate("/account/gl/accounting-period");
    }

    if (error) {
      message.error(error);
    }

    return () => {
      clearErrorAndMessage();
    };
  }, [error, msg, clearErrorAndMessage]);

  const handleClosePeriod = async () => {
    if (!periodEndClosingSubaccount) {
      message.error("Please select a sub-account to close the period");
      return;
    }

    if (!accountingPeriod || !accountingPeriod.id) {
      message.error("Invalid accounting period");
      navigate("/account/gl/accounting-period");
      return;
    }

    const subAccount: number = parseInt(
      periodEndClosingSubaccount.split("-")[0]
    );

    await closeAccountingPeriod({
      id: accountingPeriod.id,
      periodEndClosingSubaccount: subAccount,
    });
  };

  return (
    <div>
      <div className="border-b">
        <PageTitle
          title={`Accounting Period ${
            accountingPeriod &&
            accountingPeriod.periodName &&
            "- " + accountingPeriod?.periodName
          }`}
          subTitle={`Close accounting period`}
          showAdd={false}
          showBackButton={false}
          showSearch={false}
        />
      </div>

      <div className="mt-12 flex flex-row gap-x-6">
        <div className="relative md:min-w-[300px]">
          <input
            type="text"
            id={`subAccountName`}
            className="form-input w-full pr-12"
            readOnly
            placeholder="Select Sub-Account"
            value={periodEndClosingSubaccount}
          />
          <GLCodeFinder
            className="top-1.5"
            onDone={(resp) => {
              setPeriodEndClosingSubaccount(resp);
            }}
          />
        </div>
        <Button
          title="Close Period"
          size="large"
          onClick={() => handleClosePeriod()}
          className="text-sm"
          type="primary"
        />
      </div>
    </div>
  );
};

export default CloseAccountPeriod;
