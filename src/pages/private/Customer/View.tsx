import { useEffect, useMemo, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import useStore from "@/store";
import { message, Avatar, Typography } from "antd";
import Button from "@/components/common/Button";
import StringFormat from "@/shared/utils/string";
import useCustomerStore from "@/store/states/customer";
import Tabs, { ITab } from "@/components/common/Tabs";
import { UserOutlined, BankOutlined } from "@ant-design/icons";
import File from "@/components/common/File";
import Contract from "@/pages/private/Customer/Contract";
import Loan from "@/pages/private/Customer/Loan";
import Deposit from "@/pages/private/Customer/Deposit";
import dayjs from "dayjs";
import { SwitchOfficerModal } from "@/components/Account/SwitchOfficerModal";

const { Paragraph, Text } = Typography;
const ViewCustomer: React.FC = () => {
  const {
    customerStore: {
      getCustomer,
      customer,
      error,
      fetching,
      message: msg,
      clearErrorAndMessage,
    },
    authStore: { user, impersonated_user },
    locationStore: { getLocations },
    miscStore: { setSpinner },
  } = useStore();
  const customerStore = useCustomerStore();
  const param = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [changeOfficerModal, setChangeOfficerModal] = useState<boolean>(false);

  const tabs: ITab[] = [
    {
      label: "Details",
      id: 0,
    },
    {
      label: "Contracts",
      id: 1,
    },
    {
      label: "Loan Accounts",
      id: 2,
    },
    {
      label: "Deposit Accounts",
      id: 3,
    },
  ];

  useEffect(() => {
    if (param && param.id) {
      getCustomer(+param.id);
    }
  }, [param]);

  useEffect(() => {
    if (
      (user && user.role === "ADMINISTRATOR") ||
      (impersonated_user && impersonated_user.role === "ADMINISTRATOR")
    ) {
      getLocations();
    }
  }, [user, impersonated_user]);

  useEffect(() => {
    if (fetching) {
      setSpinner(true);
      return;
    }

    setSpinner(false);

    return () => setSpinner(false);
  }, [fetching]);

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

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
        <PageTitle
          title={`Customer Details`}
          subTitle="View customer's details"
          showAdd={false}
          showBackButton={true}
          backButtonRoute={
            impersonated_user?.role === "ACCOUNT_OFFICER" ||
            user?.role === "ACCOUNT_OFFICER"
              ? "/account/banking/portfolio"
              : "/account/customer"
          }
          showSearch={false}
          className="mb-2"
        />

        {customer &&
          (impersonated_user?.role === "ACCOUNT_OFFICER" ||
            user?.role === "ACCOUNT_OFFICER") && (
            <Button
              title={"Edit"}
              size="large"
              onClick={() => {
                navigate(
                  `/account/customer/edit/${customer.customerId}/${
                    customer.gender === "CORPORATE" ? "BUSINESS" : "PERSONAL"
                  }`
                );
              }}
              className="mb-4 md:mb-0"
              type="primary"
            />
          )}

        {customer &&
          (impersonated_user?.role === "ADMINISTRATOR" ||
            user?.role === "ADMINISTRATOR") && (
            <Button
              title={"Change Officer"}
              size="large"
              onClick={() => {
                setChangeOfficerModal(true);
              }}
              className="mb-4 md:mb-0"
              type="default"
            />
          )}
      </div>

      {fetching ? (
        <div className="flex h-[500px] flex-col gap-6 justify-center items-center">
          <p className="text-sm font-semibold text-gray-400">loading</p>
        </div>
      ) : !customer ? (
        <div className="flex h-[500px] flex-col gap-6 justify-center items-center">
          <h3 className="text-5xl font-normal text-gray-400">
            Invalid Customer
          </h3>
          <p className="text-sm font-semibold text-gray-400">
            Please select a valid customer
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-y-2">
          <Tabs
            tabs={tabs}
            selectedTab={selectedTab}
            onChange={setSelectedTab}
            className="mb-0"
            size="small"
          />

          {/* Tab Content */}
          <div>
            {selectedTab === 0 && (
              <>
                <div className="flex flex-row items-center md:items-start gap-x-6 mb-6 border rounded-lg p-6">
                  {customer?.passportPhoto?.fileName ? (
                    <Avatar
                      shape="square"
                      src={`/file/${customer.passportPhoto.fileName}`}
                      size={{
                        xs: 64,
                        sm: 64,
                        md: 64,
                        lg: 64,
                        xl: 80,
                        xxl: 80,
                      }}
                    />
                  ) : (
                    <Avatar
                      shape="square"
                      size={{
                        xs: 64,
                        sm: 64,
                        md: 64,
                        lg: 64,
                        xl: 80,
                        xxl: 80,
                      }}
                      icon={<UserOutlined />}
                    />
                  )}
                  <div className="flex flex-col justify-between h-fit md:h-[50px] lg:h-[80px] gap-y-2">
                    <h1 className="text-lg m-0 font-medium">{`${
                      customer.lastName
                    } ${customer.firstName ?? ""} ${
                      customer.middleName ?? ""
                    }`}</h1>

                    {customer.gender !== "CORPORATE" ? (
                      customer.employments &&
                      customer.employments.length > 0 && (
                        <p className="text-sm text-gray-600">
                          {customer.occupation},{" "}
                          {
                            customer.employments[
                              customer?.employments.length - 1
                            ].employerName
                          }
                        </p>
                      )
                    ) : (
                      <p className="text-sm text-gray-600">
                        {customer.nextOfKinName}
                      </p>
                    )}

                    <p className="text-xs h-fit">
                      <span className="font-semibold">Customer ID:</span>{" "}
                      {customer.customerId}
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6 mb-6">
                  <p className="uppercase mb-4 text-sm text-gray-500">Bio</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Mobile
                      </p>
                      <h3 className="text-sm text-medium">
                        {customer.mobile || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Email
                      </p>
                      <h3 className="text-sm text-medium">
                        {customer.email || "--"}
                      </h3>
                    </div>

                    {customer.gender !== "CORPORATE" && (
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Gender
                        </p>
                        <h3 className="text-sm text-medium">
                          {StringFormat.toTitleCase(customer.gender) || "--"}
                        </h3>
                      </div>
                    )}
                    {customer.gender !== "CORPORATE" && (
                      <>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Marital Status
                          </p>
                          <h3 className="text-sm text-medium">
                            {StringFormat.toTitleCase(customer.maritalStatus) ||
                              "--"}
                          </h3>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Education Level
                          </p>
                          <h3 className="text-sm text-medium">
                            {StringFormat.toTitleCase(
                              customer.educationLevel
                            ) || "--"}
                          </h3>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        {customer.gender !== "CORPORATE"
                          ? "Date of Birth"
                          : "Incorporation Date"}
                      </p>
                      <h3 className="text-sm text-medium">
                        {customer.birthDate
                          ? dayjs(customer.birthDate).format("YYYY-MM-DD")
                          : "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        {customer.gender !== "CORPORATE" ? "Home" : "Office"}{" "}
                        Address
                      </p>
                      <h3 className="text-sm text-medium">
                        {customer.homeAddress || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        {customer.gender !== "CORPORATE" ? "Home" : "Office"}{" "}
                        Address LGA
                      </p>
                      <h3 className="text-sm text-medium">
                        {customer.homeAddressLGA || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        {customer.gender !== "CORPORATE" ? "Home" : "Office"}{" "}
                        Address State
                      </p>
                      <h3 className="text-sm text-medium">
                        {customer.homeAddressState || "--"}
                      </h3>
                    </div>
                    {customer.gender !== "CORPORATE" && (
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Identification Means
                        </p>
                        <h3 className="text-sm text-medium">
                          {customer.identificationMeans || "--"}
                        </h3>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        {customer.gender !== "CORPORATE"
                          ? "Identification"
                          : "RC/BN"}{" "}
                        Number
                      </p>
                      <h3 className="text-sm text-medium">
                        {customer.identificationNumber || "--"}
                      </h3>
                    </div>
                    {customer.gender !== "CORPORATE" && (
                      <>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Identification Issued Date
                          </p>
                          <h3 className="text-sm text-medium">
                            {customer.identificationIssuedDate
                              ? new Date(
                                  customer.identificationIssuedDate
                                ).toDateString()
                              : "--"}
                          </h3>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Identification Expiry Date
                          </p>
                          <h3 className="text-sm text-medium">
                            {customer.identificationExpiryDate
                              ? new Date(
                                  customer.identificationExpiryDate
                                ).toDateString()
                              : "--"}
                          </h3>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Account Officer
                      </p>
                      <h3 className="text-sm text-medium">
                        {customer.accountOfficer || "--"}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6 mb-6">
                  <p className="uppercase mb-4 text-sm text-gray-500">
                    Bank Details
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Bank Verification number
                      </p>
                      <h3 className="text-sm text-medium">
                        {customer.bvnNumber || "--"}
                      </h3>
                    </div>

                    <div>
                      {customer.nubanNumber ? (
                        <Paragraph className="text-sm font-semibold text-blue-700 mb-2">
                          NUBAN number
                        </Paragraph>
                      ) : (
                        <Paragraph
                          copyable={{
                            icon: [
                              <BankOutlined
                                key="copy-icon"
                                onClick={async () => {
                                  const result =
                                    await customerStore.generateNubanForCustomer(
                                      parseInt(customer.customerId)
                                    );
                                }}
                              />,
                            ],
                            tooltips: [
                              "Generate NUBAN Number",
                              "Request is currently being processed!!",
                            ],
                          }}
                          className="text-sm font-semibold text-blue-700 mb-2"
                        >
                          NUBAN number
                        </Paragraph>
                      )}
                      <h3 className="text-sm text-medium">
                        {customer.nubanNumber || "--"}
                      </h3>
                    </div>
                  </div>
                </div>

                {customer.gender !== "CORPORATE" && (
                  <div className="border rounded-lg p-6 mb-6">
                    <p className="uppercase mb-4 text-sm text-gray-500">
                      Employment
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Occupation
                        </p>
                        <h3 className="text-sm text-medium">
                          {StringFormat.toTitleCase(customer.occupation) ||
                            "--"}
                        </h3>
                      </div>
                      {customer.employments &&
                        customer.employments.length > 0 && (
                          <>
                            <div>
                              <p className="text-sm font-semibold text-blue-700 mb-2">
                                Employer Name
                              </p>
                              <h3 className="text-sm text-medium">
                                {customer.employments[
                                  customer.employments.length - 1
                                ].employerName || "--"}
                              </h3>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-blue-700 mb-2">
                                Employment Number
                              </p>
                              <h3 className="text-sm text-medium">
                                {customer.employments[
                                  customer.employments.length - 1
                                ].employmentNumber || "--"}
                              </h3>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-blue-700 mb-2">
                                Date Employed
                              </p>
                              <h3 className="text-sm text-medium">
                                {customer.employments[
                                  customer.employments.length - 1
                                ]?.dateEmployed
                                  ? new Date(
                                      customer.employments[
                                        customer.employments.length - 1
                                      ]?.dateEmployed
                                    ).toDateString()
                                  : "--"}
                              </h3>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-blue-700 mb-2">
                                Date Retiring
                              </p>
                              <h3 className="text-sm text-medium">
                                {customer.employments[
                                  customer.employments.length - 1
                                ].dateRetiring
                                  ? new Date(
                                      customer.employments[
                                        customer.employments.length - 1
                                      ].dateRetiring
                                    ).toDateString()
                                  : "--"}
                              </h3>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-blue-700 mb-2">
                                Reference
                              </p>
                              <h3 className="text-sm text-medium">
                                {customer.employments[
                                  customer.employments.length - 1
                                ].reference || "--"}
                              </h3>
                            </div>
                          </>
                        )}
                    </div>
                  </div>
                )}

                <div className="border rounded-lg p-6 mb-6">
                  <p className="uppercase mb-4 text-sm text-gray-500">
                    {customer.gender !== "CORPORATE"
                      ? "Next of Kin"
                      : "Director"}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Full Name
                      </p>
                      <h3 className="text-sm text-medium">
                        {customer.nextOfKinName || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        {customer.gender !== "CORPORATE"
                          ? "Relationship"
                          : "Designation"}
                      </p>
                      <h3 className="text-sm text-medium">
                        {StringFormat.toTitleCase(
                          customer.nextOfKinRelationship
                        ) || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Address
                      </p>
                      <h3 className="text-sm text-medium">
                        {StringFormat.toTitleCase(customer.nextOfKinAddress) ||
                          "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Mobile
                      </p>
                      <h3 className="text-sm text-medium">
                        {customer.nextOfKinMobile || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Email
                      </p>
                      <h3 className="text-sm text-medium">
                        {customer.nextOfKinEmail || "--"}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="mb-6 rounded-lg p-6 border">
                  <div className="flex justify-between items-center mb-4">
                    <p className="uppercase text-sm text-gray-500">Documents</p>
                  </div>

                  {customer?.files?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      {customer.files.map((file) => (
                        <File key={file.fileName} {...file} />
                      ))}
                    </div>
                  ) : (
                    <div className="w-full text-start">
                      <p className="uppercase text-sm font-semibold text-gray-500">
                        No Document
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
            {selectedTab === 1 && <Contract />}
            {selectedTab === 2 && <Loan />}
            {selectedTab === 3 && <Deposit />}
          </div>
        </div>
      )}

      {customer && (
        <SwitchOfficerModal
          show={changeOfficerModal}
          onClose={() => {
            setChangeOfficerModal(false);
          }}
          customerId={customer.customerId}
        />
      )}
    </div>
  );
};

export default ViewCustomer;
