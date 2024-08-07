import React, { useState, useEffect } from "react";
import PageTitle from "@/components/common/PageTitle";
import useStore from "@/store";
import Button from "@/components/common/Button";
import { RiCloseFill } from "react-icons/ri";
import CustomerAccountFinder from "@/components/common/CustomerAccountFinder";
import { TbDownload, TbSearch, TbSelect } from "react-icons/tb";
import Alert from "@/shared/utils/alert";
import StringFormat from "@/shared/utils/string";
import { message } from "antd";
import { IUser } from "@/interfaces/iUserManagement";

const FixedDeposit: React.FC = () => {
  const [account, setAccount] = useState<string>("");

  const {
    postingStore: {
      fixedDeposit,
      getFixedDepositByAccountNumber,
      loading,
      processing,
      terminateFixedDeposit,
      clearField,
      message: msg,
      error,
      clearErrorAndMessage,
    },
    authStore: { user: originalUser, impersonated_user },
    miscStore: { setSpinner },
  } = useStore();

  const [user, setUser] = useState<IUser>(impersonated_user || originalUser);

  useEffect(() => {
    setUser(impersonated_user || originalUser);
  }, [impersonated_user, originalUser]);

  useEffect(() => {
    setSpinner(loading || processing);
  }, [loading, processing]);

  useEffect(() => {
    clearField("fixedDeposit");
  }, [account]);

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

  const handleAccountFind = async () => {
    if (account) {
      clearField("fixedDeposit");
      await getFixedDepositByAccountNumber(account);
    }
  };

  const handleLoanLiquidate = async () => {
    Alert.confirm(
      "Confirmation",
      "Are you sure you want to liquidate fixed deposit",
      async (response) => {
        if (response.isConfirmed) {
          await terminateFixedDeposit(account, user.id);
        }
      }
    );
  };

  return (
    <div>
      <PageTitle
        title="Fixed Deposit"
        subTitle="Manage Fixed Deposit Transaction"
        showAdd={false}
        showSearch={false}
        showBackButton={false}
      />

      <div className="mt-20 flex flex-col gap-y-6">
        <div className="flex flex-row gap-x-2 items-center">
          <div className="relative w-full md:w-2/4 lg:w-1/3">
            <input
              type="text"
              readOnly
              disabled
              className="form-input w-full"
              value={account}
              onChange={() => {}}
              placeholder="Select Customer Account"
            />
            <CustomerAccountFinder
              type="FIXED"
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

        {fixedDeposit && account && (
          <div className="w-full lg:w-1/2">
            {fixedDeposit?.depositStatus === "RUNNING" && (
              <Button
                onClick={handleLoanLiquidate}
                className="min-w-[50px] w-full md:w-fit h-12 ml-auto"
                title={
                  <div className="flex items-center justify-center gap-x-2">
                    <RiCloseFill className="text-xl" />
                    <span className="text-sm">Liquidate</span>
                  </div>
                }
                type={"warning"}
                size={"large"}
              ></Button>
            )}

            <div
              className="border border-gray-300 rounded-lg overflow-hidden mt-12 w-full
            "
            >
              <table className="w-full">
                <tbody className="mb-3 text-sm">
                  <tr className="border-b border-gray-300">
                    <th className="bg-blue-100 p-4 text-start">Principal</th>
                    <td className="bg-blue-50 p-4">
                      {StringFormat.formatNumber(fixedDeposit.principal)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="bg-blue-100 p-4 text-start">
                      Deposit Status
                    </th>
                    <td className="bg-blue-50 p-4">
                      {StringFormat.toTitleCase(fixedDeposit.depositStatus)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="bg-blue-100 p-4 text-start">
                      Deposit Account Number
                    </th>
                    <td className="bg-blue-50 p-4">
                      {fixedDeposit.depositAccountNumber}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="bg-blue-100 p-4 text-start">
                      Funding Account Number
                    </th>
                    <td className="bg-blue-50 p-4">
                      {fixedDeposit.fundingAccountNumber}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="bg-blue-100 p-4 text-start">
                      Proceeds Account Number
                    </th>
                    <td className="bg-blue-50 p-4">
                      {fixedDeposit.proceedsAccountNumber}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="bg-blue-100 p-4 text-start">Tenor (Days)</th>
                    <td className="bg-blue-50 p-4">{fixedDeposit.tenorDays}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="bg-blue-100 p-4 text-start">
                      Interest On Deposit
                    </th>
                    <td className="bg-blue-50 p-4">
                      {fixedDeposit.interestOnDeposit}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="bg-blue-100 p-4 text-start">
                      Effective Date
                    </th>
                    <td className="bg-blue-50 p-4">
                      {fixedDeposit.effectiveDate?.toString() || "--"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="bg-blue-100 p-4 text-start">Create Date</th>
                    <td className="bg-blue-50 p-4">
                      {fixedDeposit.createDate?.toString() || "--"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="bg-blue-100 p-4 text-start">
                      Termination Date
                    </th>
                    <td className="bg-blue-50 p-4">
                      {fixedDeposit?.terminationDate?.toString() || "--"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="bg-blue-100 p-4 text-start">Booking Date</th>
                    <td className="bg-blue-50 p-4">
                      {fixedDeposit.bookingDate?.toString() || "--"}
                    </td>
                  </tr>
                  <tr className="">
                    <th className="bg-blue-100 p-4 text-start">Instructions</th>
                    <td className="bg-blue-50 p-4">
                      {fixedDeposit.bookingInstruction || "--"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedDeposit;
