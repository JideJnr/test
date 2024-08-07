import PageTitle from "@/components/common/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import useStore from "@/store";
import { message, DatePicker } from "antd";
import Button from "@/components/common/Button";
import StringFormat from "@/shared/utils/string";
import Statement from "@/components/Account/Statement";
import { useCallback, useEffect, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ITransactionStatement } from "@/interfaces/iCustomer";
import Tabs, { ITab } from "@/components/common/Tabs";
import CollectionDetail from "../Banking/Collection/CollectionDetail";
import { AiFillPrinter } from "react-icons/ai";
import StatementPrint from "@/components/Account/StatementPrint";
import jsPDF from "jspdf";

const { RangePicker } = DatePicker;

type RangeValue = [Dayjs | null, Dayjs | null] | null;

const DepositView: React.FC = () => {
  const navigate = useNavigate();
  const [dates, setDates] = useState<RangeValue>(null);
  const [range, setRange] = useState<RangeValue>([
    dayjs().subtract(2, "year"),
    dayjs(),
  ]);
  const {
    customerStore: {
      customer,
      getAccountStatement,
      loading,
      statement,
      getLoanAccountStatement,
    },
    loanStore: { getLoanCollection, collection, loading: collectionLoading },
  } = useStore();
  const param = useParams();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const tabs: ITab[] = [
    {
      label: "Account",
      id: 0,
    },
    {
      label: "Collection",
      id: 1,
    },
  ];

  useEffect(() => {
    handleFetch();

    if (param?.type === "loan") {
      getLoanCollection(param.account);
    }
  }, []);

  useEffect(() => {
    if (!customer) {
      navigate("/account/customer");
    }
  }, [customer]);

  const handleFetch = async () => {
    if (!param?.type) {
      await getAccountStatement(range, param.account);
    } else {
      if (param?.type === "loan") {
        await getLoanAccountStatement(range, param.account);
      } else {
        message.error("Invalid account");
      }
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

    const tooLate = dates[0] && current.diff(dates[0], "year") >= 2;
    const tooEarly = dates[1] && dates[1].diff(current, "year") >= 2;

    return !!tooEarly || !!tooLate;
  };

  const handleGeneratePdf = useCallback(() => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    doc.html(contentRef.current, {
      async callback(doc) {
        await doc.save(`${param.account}-statement.pdf`);
      },
      x: 10,
      y: 10,
      margin: 10,
      autoPaging: "text",
      html2canvas: {
        allowTaint: true,
        letterRendering: true,
        logging: false,
        scale: 0.55,
      },
    });
  }, [contentRef, param.account]);

  return (
    <>
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
          <PageTitle
            title={
              param?.type === "loan" ? "Loan History" : `Transaction History`
            }
            subTitle={`View ${
              param?.type === "loan"
                ? "loan account history"
                : "deposit account history"
            }`}
            showAdd={false}
            showBackButton={true}
            backButtonRoute={`/account/customer/${customer?.customerId}`}
            showSearch={false}
            className="mb-2"
          />
        </div>

        <div className="mt-6 flex flex-col gap-y-6">
          {param.type === "loan" && (
            <Tabs
              tabs={tabs}
              selectedTab={selectedTab}
              onChange={setSelectedTab}
              className="mb-0"
              size="small"
            />
          )}

          {selectedTab === 0 && (
            <>
              <div>
                <h3 className="text-lg text-blue-700 font-medium">
                  {param.account} | {customer && customer.fullName}
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
                    {
                      label: "Last Year",
                      value: [dayjs().subtract(1, "year"), dayjs()],
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
                  title="Fetch"
                  size="large"
                  onClick={handleFetch}
                  className="text-sm"
                  type="primary"
                ></Button>
                <Button
                  onClick={() => handleGeneratePdf()}
                  title={<AiFillPrinter className="mx-auto text-xl" />}
                  className="min-w-[50px] text-sm"
                  size="large"
                />
              </div>

              <div className="flex flex-col">
                <div className="relative overflow-x-auto sm:rounded-lg w-full lg:w-[800px] place-self-end">
                  <table className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-white uppercase bg-blue-700">
                      <tr>
                        <th scope="col" className="px-3 py-1.5">
                          Product
                        </th>
                        <th scope="col" className="px-3 py-1.5 text-end">
                          Opening Balance
                        </th>
                        {param.type === "loan" && (
                          <th scope="col" className="px-3 py-1.5 text-end">
                            Rate
                          </th>
                        )}
                        <th scope="col" className="px-3 py-1.5 text-end">
                          Total Debit
                        </th>
                        <th scope="col" className="px-3 py-1.5 text-end">
                          Total Credit
                        </th>
                        <th scope="col" className="px-3 py-1.5 text-end">
                          Closing Balance
                        </th>
                      </tr>
                    </thead>
                    {statement && !loading && (
                      <tbody>
                        <tr>
                          <th
                            scope="row"
                            className="px-3 py-1.5 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {param.product || "--"}
                          </th>
                          <td className="px-3 py-1.5 text-end">
                            {StringFormat.formatNumber(
                              statement.openingBalance
                            ) || "0.00"}
                          </td>
                          {param.rate && (
                            <td className="px-3 py-1.5 text-end">
                              {param.rate ? param.rate + "%" : "--"}
                            </td>
                          )}
                          <td className="px-3 py-1.5 text-end">
                            {StringFormat.formatNumber(statement.totalDebit) ||
                              "--"}
                          </td>
                          <td className="px-3 py-1.5 text-end">
                            {StringFormat.formatNumber(statement.totalCredit) ||
                              "--"}
                          </td>
                          <td className="px-3 py-1.5 text-end">
                            {StringFormat.formatNumber(
                              statement.closingBalance
                            ) || "0.00"}
                          </td>
                        </tr>
                      </tbody>
                    )}
                    {loading && (
                      <tbody>
                        <tr>
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {param.product ? param.product : "--"}
                          </th>
                          <td className="px-6 py-4 text-end">--</td>
                          {param.rate && (
                            <td className="px-6 py-4 text-end">--</td>
                          )}
                          <td className="px-6 py-4 text-end">--</td>
                          <td className="px-6 py-4 text-end">--</td>
                          <td className="px-6 py-4 text-end">--</td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>

                <Statement
                  data={statement?.transactions ?? []}
                  fetching={loading}
                />
              </div>
            </>
          )}

          {selectedTab === 1 &&
            (collection &&
            param?.account &&
            collection.loanAccountNumber === param.account ? (
              <CollectionDetail
                collection={collection}
                account={param.account}
                showAction={false}
                loading={collectionLoading}
              />
            ) : (
              <div className="text-center text-gray-500">
                No collection record found
              </div>
            ))}
        </div>
      </div>

      <div className="hidden">
        <StatementPrint
          ref={contentRef}
          statement={statement ?? ({} as ITransactionStatement)}
          info={{
            name: customer?.fullName,
            account: param.account,
            type: "DEPOSIT",
            startDate: range[0].format("YYYY-MM-DD"),
            endDate: range[1].format("YYYY-MM-DD"),
          }}
        />
      </div>
    </>
  );
};

export default DepositView;
