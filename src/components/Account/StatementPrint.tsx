// import Logo from "@/assets/images/logo.png";
import { ITransactionStatement, StatementInfo } from "@/interfaces/iCustomer";
import StringFormat from "@/shared/utils/string";
import dayjs from "dayjs";
import { forwardRef } from "react";

const StatementPrint = forwardRef<
  HTMLDivElement,
  {
    statement: ITransactionStatement;
    info: StatementInfo;
  }
>(({ statement, info }, ref) => {
  return (
    <div ref={ref}>
      <table className="flex flex-col gap-y-2 mb-10 w-full">
        <tbody>
          <tr>
            <td className="whitespace-nowrap">
              {/* <img src={Logo} className="w-56" alt="Octiver Logo" /> */}
              <p className="text-lg text-gray-600">Account Statement</p>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="mb-10 w-full">
        <tbody>
          <tr>
            <td className="whitespace-nowrap">
              <h3 className="text-lg text-gray-700 font-medium">
                {info.name} | {info.account}
              </h3>
              <p className="text-sm">
                Statement from {info.startDate} to {info.endDate}
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="text-sm mb-20">
        <tbody>
          <tr className="border-b border-gray-300">
            <th className="bg-blue-200 text-start whitespace-nowrap font-semibold">
              <div className="p-2 text-gray-800 w-[250px]">Opening Balance</div>
            </th>
            <td className="bg-blue-50 text-start font-medium p-2 text-gray-600">
              {StringFormat.formatNumber(statement.openingBalance)}
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="bg-blue-200 text-start whitespace-nowrap font-semibold p-2 text-gray-800 w-[250px]">
              Closing Balance
            </th>
            <td className="bg-blue-50 text-start font-medium p-2 text-gray-600">
              {StringFormat.formatNumber(statement.closingBalance)}
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="bg-blue-200 text-start whitespace-nowrap font-semibold p-2 text-gray-800 w-[250px]">
              Total Credit
            </th>
            <td className="bg-blue-50 text-start font-medium p-2 text-gray-600">
              {StringFormat.formatNumber(statement.totalCredit)}
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="bg-blue-200 text-start whitespace-nowrap font-semibold p-2 text-gray-800 w-[250px]">
              Total Debit
            </th>
            <td className="bg-blue-50 text-start font-medium p-2 text-gray-600">
              {StringFormat.formatNumber(statement.totalDebit)}
            </td>
          </tr>
        </tbody>
      </table>

      <table className="w-full">
        <thead>
          <tr className="bg-blue-50 ">
            <th className="text-start whitespace-nowrap px-3 py-2 font-semibold text-sm">
              Posting Date
            </th>
            <th className="text-start whitespace-nowrap px-3 py-2 font-semibold text-sm">
              Value Date
            </th>
            {info.type !== "DEPOSIT" && (
              <th className="text-start whitespace-nowrap px-3 py-2 font-semibold text-sm">
                Transaction ID
              </th>
            )}
            <th className="text-start whitespace-nowrap px-3 py-2 font-semibold text-sm">
              Description
            </th>
            <th className="text-start whitespace-nowrap px-3 py-2 font-semibold text-sm">
              Debit
            </th>
            <th className="text-start whitespace-nowrap px-3 py-2 font-semibold text-sm">
              Credit
            </th>
            <th className="wtext-start hitespace-nowrap px-3 py-2 font-semibold text-sm">
              Balance
            </th>
          </tr>
        </thead>
        <tbody>
          {(statement.transactions ?? []).map((transaction, index) => (
            <tr key={index} className="border-b border-gray-200 last:border-0">
              <td className="text-start px-3 py-1 whitespace-nowrap">
                {dayjs(transaction.postingDate).format("DD-MMM-YYYY hh:mm A")}
              </td>
              <td className="text-start px-3 py-1 whitespace-nowrap">
                {dayjs(transaction.valueDate).format("DD-MMM-YYYY hh:mm A")}
              </td>
              {info.type !== "DEPOSIT" && (
                <td className="text-start px-3 py-1 whitespace-nowrap">
                  {transaction.transactionId} {info.type}
                </td>
              )}
              <td className="text-start">
                <div className="w-[200px] whitespace-break-spaces px-3 py-1">
                  {transaction.transactionDescription}
                </div>
              </td>
              <td className="text-start px-3 py-1 whitespace-nowrap">
                {transaction.drCrFlag === "DR"
                  ? StringFormat.formatNumber(transaction.transactionAmount)
                  : ""}
              </td>
              <td className="text-start px-3 py-1 whitespace-nowrap">
                {transaction.drCrFlag === "CR"
                  ? StringFormat.formatNumber(transaction.transactionAmount)
                  : ""}
              </td>
              <td className="px-3 py-1 whitespace-nowrap">
                {StringFormat.formatNumber(transaction.balance)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default StatementPrint;
