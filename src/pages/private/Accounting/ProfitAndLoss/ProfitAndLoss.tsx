import { useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, message } from "antd";
import Button from "@/components/common/Button";
type RangeValue = [Dayjs | null, Dayjs | null] | null;
const { RangePicker } = DatePicker;

const ProfitAndLossReport = () => {
  const {
    postingStore: {
      loading,
      getProfitAndLossReport,
      clearErrorAndMessage,
      message: msg,
      error,
    },
    miscStore: { setSpinner },
  } = useStore();
  const [dates, setDates] = useState<RangeValue>(null);
  const [range, setRange] = useState<RangeValue>([
    dayjs().subtract(1, "year"),
    dayjs(),
  ]);

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

  const onOpenChange = (open: boolean) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  const disabledDate = (current: Dayjs) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], "year") >= 1;
    const tooEarly = dates[1] && dates[1].diff(current, "year") >= 1;
    return !!tooEarly || !!tooLate;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
        <PageTitle
          title="Profit and Loss"
          subTitle="View all profit and loss report"
          showAdd={false}
          showBackButton={false}
          showSearch={false}
        />
      </div>

      <div className="mt-20 flex flex-col">
        <div className="max-w-md flex flex-col gap-8">
          <RangePicker
            allowClear={false}
            value={dates || range}
            presets={[
              {
                label: "This Week",
                value: [dayjs(), dayjs()],
              },
              {
                label: "Last Week",
                value: [
                  dayjs().subtract(1, "week"),
                  dayjs().subtract(1, "week").endOf("week"),
                ],
              },
            ]}
            disabledDate={disabledDate}
            onCalendarChange={(val) => {
              setDates(val);
            }}
            onChange={(payload) => {
              setRange(payload);
            }}
            onOpenChange={onOpenChange}
            className="w-full"
          />
          <Button
            title="Fetch"
            size="large"
            onClick={async () => {
              await getProfitAndLossReport(
                range[0].format("YYYY-MM-DD"),
                range[1].format("YYYY-MM-DD")
              );
            }}
            className="text-sm"
            type="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfitAndLossReport;
