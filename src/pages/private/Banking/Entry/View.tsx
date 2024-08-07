import Statement from "@/components/Account/Statement";
import Button from "@/components/common/Button";
import GLCodeFinder from "@/components/common/GLCodeFinder";
import PageTitle from "@/components/common/PageTitle";
import StringFormat from "@/shared/utils/string";
import useStore from "@/store";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { BsFiletypeCsv } from "react-icons/bs";
import { CSVLink } from "react-csv";

const { RangePicker } = DatePicker;
type RangeValue = [Dayjs | null, Dayjs | null] | null;

const ViewJournalEntries: React.FC<any> = () => {
  const {
    postingStore: {
      getGLs,
      getGlStatement,
      loading,
      processing,
      clearField,
      statement,
    },
    miscStore: { setSpinner },
  } = useStore();
  const [account, setAccount] = useState<string>("");
  const [dates, setDates] = useState<RangeValue>(null);
  const [range, setRange] = useState<RangeValue>([dayjs(), dayjs()]);

  useEffect(() => {
    getGLs();
  }, []);

  useEffect(() => {
    setSpinner(processing || loading);
  }, [processing, loading]);

  useEffect(() => {
    clearField("statement");
  }, [account]);

  const handleAccountFind = async () => {
    if (account) {
      await getGlStatement(
        +account.split("-")[0],
        range[0].format("YYYY-MM-DD"),
        range[1].format("YYYY-MM-DD")
      );
    }
  };

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
    const tooLate = dates[0] && current.diff(dates[0], "days") >= 7;
    const tooEarly = dates[1] && dates[1].diff(current, "days") >= 7;
    return !!tooEarly || !!tooLate;
  };

  return (
    <>
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
          <PageTitle
            title={"Search GL Account"}
            subTitle={`View GL transaction history`}
            showAdd={false}
            showSearch={false}
            className="mb-2"
          />
        </div>

        <div className="flex flex-row gap-x-2 items-center mt-20">
          <div className="relative w-full md:w-2/4 lg:w-1/3">
            <input
              type="text"
              readOnly
              className="form-input w-full"
              value={account}
              onChange={() => {}}
              placeholder="Select GL Account"
            />
            <GLCodeFinder
              onDone={(value) => {
                setAccount(value);
              }}
            />
          </div>
        </div>

        {account && (
          <>
            <div className="mt-6 flex flex-col gap-y-6">
              <div>
                <h3 className="text-lg text-blue-700 font-medium">
                  {account.split("-")[0]} | {account}
                </h3>
                <p className="text-sm">
                  Statement from {range[0].format("YYYY-MM-DD")} to{" "}
                  {range[1].format("YYYY-MM-DD")}
                </p>
              </div>

              <div className="flex gap-x-4 place-self-end">
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
                />

                <Button
                  title="Filter"
                  size="large"
                  onClick={handleAccountFind}
                  className="text-sm"
                  type="primary"
                />
                <CSVLink
                  data={statement?.transactions || []}
                  filename={`chart-account.csv`}
                >
                  <Button
                    title={<BsFiletypeCsv className="text-2xl" />}
                    onClick={() => {}}
                    className="min-w-[50px]"
                    size="large"
                  />
                </CSVLink>
              </div>

              <div className="relative overflow-x-auto sm:rounded-lg w-full lg:w-[800px] place-self-end">
                <table className="w-full text-sm text-left text-gray-500 ">
                  <thead className="text-xs text-white uppercase bg-blue-700">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Opening Balance
                      </th>
                      <th scope="col" className="px-6 py-3 text-end">
                        Total Debit
                      </th>
                      <th scope="col" className="px-6 py-3 text-end">
                        Total Credit
                      </th>
                      <th scope="col" className="px-6 py-3 text-end">
                        Closing Balance
                      </th>
                    </tr>
                  </thead>
                  {statement && !loading && (
                    <tbody>
                      <tr>
                        <td className="px-6 py-4">
                          {StringFormat.formatNumber(
                            statement?.openingBalance
                          ) || "0.00"}
                        </td>
                        <td className="px-6 py-4 text-end">
                          {StringFormat.formatNumber(statement?.totalDebit) ||
                            "--"}
                        </td>
                        <td className="px-6 py-4 text-end">
                          {StringFormat.formatNumber(statement?.totalCredit) ||
                            "--"}
                        </td>
                        <td className="px-6 py-4 text-end">
                          {StringFormat.formatNumber(
                            statement?.closingBalance
                          ) || "0.00"}
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>

              <Statement
                data={statement?.transactions || []}
                fetching={loading}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ViewJournalEntries;
