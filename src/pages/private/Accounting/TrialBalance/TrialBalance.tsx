import Button from "@/components/common/Button";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import { DatePicker, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const TrialBalance = () => {
  const [range, setRange] = useState<dayjs.Dayjs>(dayjs());
  const {
    postingStore: {
      generateTrialBalance,
      clearErrorAndMessage,
      message: msg,
      error,
      loading,
    },
    miscStore: { setSpinner },
  } = useStore();

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

  useEffect(() => {
    setSpinner(loading);
  }, [loading, setSpinner]);

  const handleFetch = async () => {
    await generateTrialBalance(range.format("YYYY-MM-DD"));
  };

  return (
    <div>
      <div className="border-b">
        <PageTitle
          title="Trial Balance"
          subTitle="Generate trial balances"
          showAdd={false}
          showSearch={false}
        />
      </div>

      <div className="mt-20 flex flex-col">
        <div className="max-w-md flex flex-col gap-8">
          <DatePicker
            value={range}
            allowClear={false}
            className="w-full"
            disabledDate={(current) => {
              return current && current > dayjs().endOf("day");
            }}
            onChange={(date) => setRange((prevRange) => date)}
          />

          <Button
            title="Generate"
            size="large"
            onClick={() => handleFetch()}
            className="text-sm"
            type="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default TrialBalance;
