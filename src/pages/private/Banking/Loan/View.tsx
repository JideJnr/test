import { useEffect, useState, useMemo, useCallback } from "react";
import PageTitle from "@/components/common/PageTitle";
import {
  ApplicationStatus,
  Decision,
  IApprovalTerms,
  ILoanDecisionPayload,
} from "@/interfaces/iLoan";
import { useNavigate, useParams } from "react-router-dom";
import useStore from "@/store";
import { message, Avatar, Timeline, InputNumber, Image } from "antd";
import Button from "@/components/common/Button";
import StringFormat from "@/shared/utils/string";
import Tabs, { ITab } from "@/components/common/Tabs";
import { UserOutlined } from "@ant-design/icons";
import File from "@/components/common/File";
import { LoanProgressModal } from "@/components/Loan/LoanProgressModal";
import { TimelineDetail } from "@/components/Loan/LoanTimelineDetail";
import { Controller, useForm } from "react-hook-form";
import { IUser, SystemRoles } from "@/interfaces/iUserManagement";
import Alert from "@/shared/utils/alert";
import { LoanBookModal } from "@/components/Loan/LoanBookModal";
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import { IoReturnUpBack } from "react-icons/io5";
import LoanHistory from "./Histories";
import dayjs from "dayjs";
import FileUpload from "@/components/common/FileUpload";
import ApiService from "@/services/api";
import { base64 } from "@/shared/utils/base64";

const apiService = new ApiService();

const getApproveButtonTitleByRole = (role: string): string => {
  switch (role) {
    case "FIRST_REVIEWER":
    case "SECOND_REVIEWER":
      return "Approve";
    case "ACCOUNT_OFFICER":
      return "Resubmit";
    case "ACCEPTANCE_OPERATIONS":
      return "Accept";
    case "BOOKING_OPERATIONS":
      return "Book";
    default:
      return "";
  }
};

const canSeeAction = (
  userRole: SystemRoles,
  applicationStatus: ApplicationStatus
): boolean => {
  if (
    userRole === "ADMINISTRATOR" ||
    userRole === "INTERNAL_CONTROL" ||
    userRole === "USER_SUPPORT"
  ) {
    return false;
  }

  if (
    userRole === "ACCOUNT_OFFICER" &&
    applicationStatus === "PENDING_SUBMISSION"
  ) {
    return true;
  }

  if (
    userRole === "FIRST_REVIEWER" &&
    applicationStatus === "PENDING_FIRST_REVIEW"
  ) {
    return true;
  }

  if (
    userRole === "SECOND_REVIEWER" &&
    applicationStatus === "PENDING_SECOND_REVIEW"
  ) {
    return true;
  }

  if (
    userRole === "ACCEPTANCE_OPERATIONS" &&
    applicationStatus === "PENDING_ACCEPTANCE"
  ) {
    return true;
  }

  if (
    userRole === "BOOKING_OPERATIONS" &&
    applicationStatus === "PENDING_BOOKING"
  ) {
    return true;
  }

  return false;
};

function calculateLoanDetails(
  loanAmount: number,
  rate: number,
  tenorMonths: number,
  dsrRate: number,
  netSalary: number
): { monthlyRepayment: number; maximumLoanAmount: number } {
  const newRate = rate / 100;
  const newDsr = dsrRate / 100;

  const calc1 = 1 + newRate * tenorMonths;

  return {
    monthlyRepayment: (loanAmount * calc1) / tenorMonths,
    maximumLoanAmount: (netSalary * newDsr * tenorMonths) / calc1,
  };
}

const ViewLoan = () => {
  const {
    handleSubmit,
    setValue,
    control,
    watch,
    formState,
    formState: { isValid },
  } = useForm<IApprovalTerms>({
    mode: "onChange",
  });
  const {
    loanStore: {
      getLoanById,
      loanDecision,
      processing,
      loan,
      error,
      fetching,
      message: msg,
      setLoanInfo,
      clearErrorAndMessage,
    },
    miscStore: { setSpinner },
    authStore: { user: originalUser, impersonated_user },
  } = useStore();
  const param = useParams();
  const navigate = useNavigate();
  const [loanProgressModal, setLoanProgressModal] = useState<boolean>(false);
  const [loanBookModal, setLoanBookModal] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [approvalTerms, setApprovalTerms] = useState<IApprovalTerms>();
  const [terms, setTerms] = useState<
    IApprovalTerms & { monthlyRepayment: number; maximumLoanAmount: number }
  >();
  const [user, setUser] = useState<IUser>(impersonated_user || originalUser);
  const [mgtFee, setMgtFee] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setUser(impersonated_user || originalUser);
  }, [impersonated_user, originalUser]);

  const tabs = useMemo<ITab[]>(() => {
    const initialTab: ITab[] = [
      {
        label: "Details",
        id: 0,
      },
      {
        label: "Approval Trail",
        id: 1,
      },
      {
        label: "Documents",
        id: 2,
      },
      {
        label: "History",
        id: 3,
      },
    ];

    if (
      user &&
      (user.role === "FIRST_REVIEWER" || user.role === "SECOND_REVIEWER")
    ) {
      initialTab[1].label = "Approval Trail & Terms";
    }

    return initialTab;
  }, [user]);

  useEffect(() => {
    if (loan) {
      const terms: IApprovalTerms = {
        approvedLoanAmount: loan.loanAmount,
        approvedDsrRate: loan.approvedDsrRate,
        approvedTenorMths: loan.loanTenorMths,
        loanProductId: loan.loanProduct.id,
        approvedMthlyRate: loan.loanProduct.defaultInterestRate,
        approvedMthlyRepayment: loan.approvedMthlyRepayment,
      };

      if (loan.approvedLoanAmount) {
        terms.approvedLoanAmount = loan.approvedLoanAmount;
        terms.approvedMthlyRate = loan.approvedMthlyRate;
        terms.approvedTenorMths = loan.approvedTenorMths;
      }

      setValue("approvedLoanAmount", terms.approvedLoanAmount || 0, {
        shouldValidate: true,
      });
      setValue("approvedMthlyRate", terms.approvedMthlyRate, {
        shouldValidate: true,
      });
      setValue("approvedDsrRate", terms.approvedDsrRate || 0, {
        shouldValidate: true,
      });
      setValue("approvedTenorMths", terms.approvedTenorMths || 0, {
        shouldValidate: true,
      });

      setApprovalTerms(terms);

      const {
        approvedLoanAmount,
        approvedMthlyRate,
        approvedTenorMths,
        approvedDsrRate,
      } = terms;

      const resp = calculateLoanDetails(
        approvedLoanAmount,
        approvedMthlyRate,
        approvedTenorMths,
        approvedDsrRate,
        loan.netMthlyIncome
      );

      setTerms({
        ...terms,
        monthlyRepayment: resp.monthlyRepayment,
        maximumLoanAmount: resp.maximumLoanAmount,
      });

      if (
        loan.approvedLoanAmount &&
        loan.loanProduct.defaultManagementFeeRate
      ) {
        setMgtFee(
          () =>
            loan.loanProduct.defaultManagementFeeRate * loan.approvedLoanAmount
        );
      }
    }
  }, [loan]);

  useEffect(() => {
    if (
      processing &&
      (user.role === "ACCOUNT_OFFICER" || user.role === "ACCEPTANCE_OPERATIONS")
    ) {
      setSpinner(true);
      return;
    }

    if (fetching) {
      setSpinner(true);
      return;
    }

    setSpinner(false);

    return () => setSpinner(false);
  }, [processing, user, fetching]);

  useEffect(() => {
    const subscription = watch((value) => {
      setApprovalTerms((prev) => ({ ...prev, ...value }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, formState]);

  useEffect(() => {
    if (param && param.id) {
      getLoanById(param.id);
    }
  }, [param]);

  useEffect(() => {
    if (msg) {
      message.success(msg);
      setLoanProgressModal(false);
      setLoanBookModal(false);

      navigate("/account/banking/loans");
    }

    if (error) {
      message.error(error);
    }

    return () => {
      clearErrorAndMessage();
    };
  }, [error, msg, clearErrorAndMessage]);

  const onSubmit = (form: Partial<IApprovalTerms>) => {
    const {
      approvedLoanAmount,
      approvedMthlyRate,
      approvedTenorMths,
      approvedDsrRate,
    } = form;

    const resp = calculateLoanDetails(
      approvedLoanAmount,
      approvedMthlyRate,
      approvedTenorMths,
      approvedDsrRate,
      loan.netMthlyIncome
    );

    setTerms((prev) => ({
      ...prev,
      monthlyRepayment: resp.monthlyRepayment,
      maximumLoanAmount: resp.maximumLoanAmount,
    }));
  };

  const handleApprove = useCallback(() => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (
        loan.applicationStatus === "PENDING_BOOKING" ||
        loan.applicationStatus === "PENDING_SUBMISSION" ||
        loan.applicationStatus === "PENDING_ACCEPTANCE"
      ) {
        if (loan.applicationStatus === "PENDING_BOOKING") {
          setLoanBookModal(true);
        } else if (
          loan.applicationStatus === "PENDING_ACCEPTANCE" ||
          loan.applicationStatus === "PENDING_SUBMISSION"
        ) {
          Alert.confirm(
            <p>Confirmation</p>,
            <p>
              Are you sure you want to{" "}
              {loan.applicationStatus === "PENDING_ACCEPTANCE"
                ? "accept"
                : "resubmit"}
              ?
            </p>,
            async (e) => {
              if (e.isConfirmed) {
                const payload: Partial<ILoanDecisionPayload> = {
                  decisionFlag: "APPROVED",
                  comment:
                    loan.applicationStatus === "PENDING_ACCEPTANCE"
                      ? "Accepted"
                      : "Application revised",
                  loanApplicationId: loan.id,
                  currentProcessorUid: user.id,
                };

                await loanDecision(payload);
              }
            }
          );
        }
      } else {
        setDecision("APPROVED");
        setLoanProgressModal(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    loan,
    user,
    setLoanBookModal,
    loanDecision,
    setDecision,
    setLoanProgressModal,
  ]);

  const handleAddFile = async (formData: FormData) => {
    formData.append("loanApplicationId", loan.id.toString());

    return await apiService.AddFileToLoan(formData);
  };

  const handleSuccessfulFileAddition = (data) => {
    if (data.isSuccessful) {
      message.success(data.message);
      setLoanInfo(data.data);
    } else {
      message.error(data.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
        <PageTitle
          title="Loan Application"
          subTitle="View customer's loan details and make decision"
          showAdd={false}
          showBackButton={true}
          onBackClick={() => navigate(-1)}
          showSearch={false}
        />

        {!fetching &&
          loan &&
          canSeeAction(user.role, loan.applicationStatus) && (
            <div className="flex justify-stretch md:justify-normal gap-x-4 mb-6 md:mb-8">
              {loan.applicationStatus === "PENDING_SUBMISSION" &&
                user.role === "ACCOUNT_OFFICER" && (
                  <Button
                    title={
                      <div className="flex items-center justify-center gap-2">
                        <AiOutlineEdit />
                        <span className="text-sm">Edit</span>
                      </div>
                    }
                    onClick={() => {
                      navigate(
                        `/account/banking/loans/edit/${loan.id}/${loan.customer.customerId}`
                      );
                    }}
                    size="medium"
                    type="default"
                    className="w-1/3 flex justify-center"
                  />
                )}

              <Button
                title={
                  <div className="flex items-center gap-2">
                    <AiOutlineCheck />
                    <span className="text-sm">
                      {getApproveButtonTitleByRole(user.role)}
                    </span>
                  </div>
                }
                onClick={handleApprove}
                size="medium"
                type="primary"
                className="w-1/3"
                disabled={isSubmitting}
              />

              {loan.applicationStatus !== "PENDING_BOOKING" && (
                <Button
                  title={
                    <div className="flex items-center gap-2">
                      <AiOutlineClose />
                      <span className="text-sm">Cancel</span>
                    </div>
                  }
                  onClick={() => {
                    setDecision("DECLINED");
                    setLoanProgressModal(true);
                  }}
                  size="medium"
                  type="danger"
                  className="w-1/3"
                  disabled={isSubmitting}
                />
              )}

              {!["PENDING_SUBMISSION"].includes(loan.applicationStatus) && (
                <Button
                  title={
                    <div className="flex items-center gap-2">
                      <IoReturnUpBack />
                      <span className="text-sm">Return</span>
                    </div>
                  }
                  onClick={() => {
                    setDecision("RETURNED");
                    setLoanProgressModal(true);
                  }}
                  size="medium"
                  type="warning"
                  className="w-1/3"
                  disabled={isSubmitting}
                />
              )}
            </div>
          )}
      </div>
      {fetching ? (
        <div className="flex h-[500px] flex-col gap-6 justify-center items-center">
          <p className="text-sm font-semibold text-gray-400">loading</p>
        </div>
      ) : !loan ? (
        <div className="flex h-[500px] flex-col gap-6 justify-center items-center">
          <h3 className="text-5xl font-normal text-gray-400">Invalid Loan</h3>
          <p className="text-sm font-semibold text-gray-400">
            Please select a valid loan
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-y-2">
          <div className="flex flex-col md:flex-row w-full gap-4 justify-between items-center md:items-start">
            <div>
              <span className="mr-2 bg-green-100 text-green-700 text-sm rounded-lg px-2 py-0.5 h-fit">
                <b>Loan ID: </b> {loan.id}
              </span>
              <span className="mr-2 bg-gray-200 text-gray-700 text-sm rounded-lg px-2 py-0.5 h-fit">
                {loan.isTopup ? "Topup Loan" : "Fresh Loan"}
              </span>
              <span className="bg-blue-100 text-blue-700 text-sm rounded-lg px-2 py-0.5 h-fit">
                {StringFormat.toTitleCase(loan.applicationStatus)}
              </span>
            </div>
          </div>

          {/* /Tab */}
          <Tabs
            tabs={tabs}
            selectedTab={selectedTab}
            onChange={setSelectedTab}
            className="mt-6"
            size="small"
          />

          {/* Tab Content */}
          <div>
            {selectedTab === 0 && (
              <>
                <div className="flex flex-row items-center md:items-start gap-x-6 mb-6 border rounded-lg p-6">
                  {loan?.customer?.passportPhoto?.fileName ? (
                    <Avatar
                      shape="square"
                      src={`/file/${loan.customer.passportPhoto.fileName}`}
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
                  <div className="flex flex-col justify-between h-[80px] gap-y-2">
                    <h1 className="text-lg m-0 font-medium">{`${
                      loan.customer.lastName
                    } ${loan.customer.firstName ?? ""} ${
                      loan.customer.middleName ?? ""
                    }`}</h1>

                    {loan.customer.gender !== "CORPORATE" ? (
                      <p className="text-sm text-gray-600">
                        {loan.customer?.occupation}
                        {loan.customer?.employments &&
                          loan.customer?.employments.length > 0 &&
                          ", " +
                            loan.customer?.employments[
                              loan.customer?.employments?.length - 1
                            ]?.employerName}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        {loan.customer.nextOfKinName}
                      </p>
                    )}

                    <p className="text-xs h-fit">
                      <span className="font-semibold">Customer ID:</span>{" "}
                      {loan.customer.customerId}
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6 mb-6">
                  <p className="uppercase mb-4 text-sm text-gray-500">Bio</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {loan.customer.gender !== "CORPORATE" && (
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Gender
                        </p>
                        <h3 className="text-sm text-medium">
                          {StringFormat.toTitleCase(loan.customer.gender) ||
                            "--"}
                        </h3>
                      </div>
                    )}
                    {loan.customer.gender !== "CORPORATE" && (
                      <>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Marital Status
                          </p>
                          <h3 className="text-sm text-medium">
                            {StringFormat.toTitleCase(
                              loan.customer.maritalStatus
                            ) || "--"}
                          </h3>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Education Level
                          </p>
                          <h3 className="text-sm text-medium">
                            {StringFormat.toTitleCase(
                              loan.customer.educationLevel
                            ) || "--"}
                          </h3>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        {loan.customer.gender !== "CORPORATE"
                          ? "Date of Birth"
                          : "Incorporation Date"}
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.customer.birthDate
                          ? dayjs(loan.customer.birthDate).format("YYYY-MM-DD")
                          : "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        {loan.customer.gender !== "CORPORATE"
                          ? "Home"
                          : "Office"}{" "}
                        Address
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.customer.homeAddress || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        {loan.customer.gender !== "CORPORATE"
                          ? "Home"
                          : "Office"}{" "}
                        Address LGA
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.customer.homeAddressLGA || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        {loan.customer.gender !== "CORPORATE"
                          ? "Home"
                          : "Office"}{" "}
                        Address State
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.customer.homeAddressState || "--"}
                      </h3>
                    </div>
                    {loan.customer.gender !== "CORPORATE" && (
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Identification Means
                        </p>
                        <h3 className="text-sm text-medium">
                          {loan.customer.identificationMeans || "--"}
                        </h3>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        {loan.customer.gender !== "CORPORATE"
                          ? "Identification"
                          : "RC/BN"}{" "}
                        Number
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.customer.identificationNumber || "--"}
                      </h3>
                    </div>

                    {loan.customer.gender !== "CORPORATE" && (
                      <>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Identification Issued Date
                          </p>
                          <h3 className="text-sm text-medium">
                            {loan.customer.identificationIssuedDate
                              ? new Date(
                                  loan.customer.identificationIssuedDate
                                ).toDateString()
                              : "--"}
                          </h3>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Identification Expiry Date
                          </p>
                          <h3 className="text-sm text-medium">
                            {loan.customer.identificationExpiryDate
                              ? new Date(
                                  loan.customer.identificationExpiryDate
                                ).toDateString()
                              : "--"}
                          </h3>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        DSE
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.customer.accountOfficer || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        DSE Location
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.customer.location || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Employment Validation Status
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.employmentValidation
                          ? "Matching Record Found"
                          : "No Matching Record Found"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        BVN Validation Status
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.bvnValidation?.response_code === "00"
                          ? "Matching Record Found"
                          : loan.bvnValidation?.response_code === "03" ||
                            loan.bvnValidation?.response_code === "02"
                          ? "Not Validated - Contact Administrator"
                          : "No Matching Record Found"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Mobile Number
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.customer.mobile ?? "--"}
                      </h3>
                    </div>
                  </div>
                </div>

                {loan.customer.gender !== "CORPORATE" && (
                  <div className="border rounded-lg p-6 mb-6">
                    <p className="uppercase mb-4 text-sm text-gray-500">
                      Identity Verification
                    </p>

                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {loan?.bvnValidation.data?.base64Image && (
                        <Image
                          className="rounded-lg h-full max-h-[80px] overflow-hidden object-cover w-20"
                          width={80}
                          src={`${base64().toImageURL(
                            loan.bvnValidation.data.base64Image
                          )}`}
                        />
                      )}

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            First Name
                          </p>
                          <h3 className="text-sm text-medium">
                            {StringFormat.toTitleCase(
                              loan.bvnValidation.data?.firstName
                            ) || "--"}
                          </h3>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Last Name
                          </p>
                          <h3 className="text-sm text-medium">
                            {StringFormat.toTitleCase(
                              loan.bvnValidation.data?.lastName
                            ) || "--"}
                          </h3>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Date of Birth
                          </p>
                          <h3 className="text-sm text-medium">
                            {loan.bvnValidation.data?.dateOfBirth || "--"}
                          </h3>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Gender
                          </p>
                          <h3 className="text-sm text-medium">
                            {loan.bvnValidation.data?.gender || "--"}
                          </h3>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            BVN
                          </p>
                          <h3 className="text-sm text-medium">
                            {loan.bvnValidation.data?.bvn || "--"}
                          </h3>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            NIN
                          </p>
                          <h3 className="text-sm text-medium">
                            {loan.bvnValidation.data?.nin || "--"}
                          </h3>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Phone Number
                          </p>
                          <h3 className="text-sm text-medium">
                            {loan.bvnValidation.data?.phoneNumber1 || "--"}
                          </h3>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Watchlisted?
                          </p>
                          <h3 className="text-sm text-medium">
                            {StringFormat.toTitleCase(
                              loan.bvnValidation.data?.watchListed
                            ) || "--"}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {loan.customer.gender !== "CORPORATE" && (
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
                          {StringFormat.toTitleCase(
                            loan.customer?.occupation
                          ) || "--"}
                        </h3>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Work Experience Years
                        </p>
                        <h3 className="text-sm text-medium">
                          {loan.workExperienceYrs || "--"}
                        </h3>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Employer Name
                        </p>
                        <h3 className="text-sm text-medium">
                          {(loan.customer?.employments &&
                            loan.customer?.employments.length > 0 &&
                            loan.customer?.employments[
                              loan.customer?.employments.length - 1
                            ]?.employerName) ||
                            "--"}
                        </h3>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Employment Number
                        </p>
                        <h3 className="text-sm text-medium">
                          {(loan.customer?.employments &&
                            loan.customer?.employments.length > 0 &&
                            loan.customer?.employments[
                              loan.customer?.employments.length - 1
                            ]?.employmentNumber) ||
                            "--"}
                        </h3>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Date Employed
                        </p>
                        <h3 className="text-sm text-medium">
                          {loan.customer?.employments &&
                          loan.customer?.employments.length > 0 &&
                          loan.customer?.employments[
                            loan.customer?.employments?.length - 1
                          ]?.dateEmployed
                            ? new Date(
                                loan.customer?.employments[
                                  loan.customer?.employments?.length - 1
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
                          {loan.customer?.employments &&
                          loan.customer?.employments.length > 0 &&
                          loan.customer?.employments[
                            loan.customer?.employments.length - 1
                          ]?.dateRetiring
                            ? new Date(
                                loan.customer?.employments[
                                  loan.customer?.employments.length - 1
                                ]?.dateRetiring
                              ).toDateString()
                            : "--"}
                        </h3>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Reference
                        </p>
                        <h3 className="text-sm text-medium">
                          {(loan.customer?.employments &&
                            loan.customer?.employments.length > 0 &&
                            loan.customer?.employments[
                              loan.customer?.employments.length - 1
                            ].reference) ||
                            "--"}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                {loan.employmentValidation && (
                  <div className="border rounded-lg p-6 mb-6">
                    <p className="uppercase mb-4 text-sm text-gray-500">
                      Employment Verification
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Employee Name
                        </p>
                        <h3 className="text-sm text-medium">
                          {loan.employmentValidation.fullName || "--"}
                        </h3>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Employment Number
                        </p>
                        <h3 className="text-sm text-medium">
                          {StringFormat.toTitleCase(
                            loan.employmentValidation.employmentNumber
                          ) || "--"}
                        </h3>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Date of Birth
                        </p>
                        <h3 className="text-sm text-medium">
                          {loan.employmentValidation.dateOfBirth || "--"}
                        </h3>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Gender
                        </p>
                        <h3 className="text-sm text-medium">
                          {loan.employmentValidation.gender || "--"}
                        </h3>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Grade
                        </p>
                        <h3 className="text-sm text-medium">
                          {loan.employmentValidation.grade || "--"}
                        </h3>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          MDA
                        </p>
                        <h3 className="text-sm text-medium">
                          {loan.employmentValidation.mda || "--"}
                        </h3>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Employment Date
                        </p>
                        <h3 className="text-sm text-medium">
                          {loan.employmentValidation.employmentDate || "--"}
                        </h3>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Salary Account Number
                        </p>
                        <h3 className="text-sm text-medium">
                          {loan.employmentValidation.salaryAccountNumber ||
                            "--"}
                        </h3>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          Salary Account Bank
                        </p>
                        <h3 className="text-sm text-medium">
                          {loan.employmentValidation.salaryAccountBank || "--"}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border rounded-lg p-6 mb-6">
                  <p className="uppercase mb-4 text-sm text-gray-500">Loan</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Requested Amount
                      </p>
                      <h3 className="text-sm text-medium">
                        {StringFormat.Currency(loan.loanAmount) || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Loan Purpose
                      </p>
                      <h3 className="text-sm text-medium">
                        {StringFormat.toTitleCase(loan.loanPurpose) || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Requested Duration (Months)
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.loanTenorMths || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Monthly Income
                      </p>
                      <h3 className="text-sm text-medium">
                        {StringFormat.Currency(loan.netMthlyIncome) || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Approved Loan Amount
                      </p>
                      <h3 className="text-sm text-medium">
                        {StringFormat.Currency(loan.approvedLoanAmount) || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Approved Loan Duration (Months)
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.approvedTenorMths || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Approved Monthly Repayment
                      </p>
                      <h3 className="text-sm text-medium">
                        {StringFormat.Currency(loan.approvedMthlyRepayment) ||
                          "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Approved Monthly Rate
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.approvedMthlyRate || "--"}
                        {loan.approvedMthlyRate && "%"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Approved DSR Rate
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.approvedDsrRate > 0
                          ? loan.approvedDsrRate + "%"
                          : "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Currently Indebted?
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.currentlyIndebted ? "Yes" : "No"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Outstanding Loan Amount
                      </p>
                      <h3 className="text-sm text-medium">
                        {StringFormat.Currency(loan.outstandingLoanAmount) ||
                          "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Outstanding Monthly Rentals
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.outstandingMthlyRentals || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Repayment Account Number
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.repaymentAccountNumber || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Repayment Method
                      </p>
                      <h3 className="text-sm text-medium">
                        {StringFormat.toTitleCase(loan.repaymentMethod) || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Management Fee
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.managementFee || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        First Repayment Date
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.firstRepaymentDate
                          ? new Date(loan.firstRepaymentDate).toDateString()
                          : "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Disbursement Date
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.disbursementDate
                          ? new Date(loan.disbursementDate).toDateString()
                          : "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Offer Date
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.offerDate
                          ? new Date(loan.offerDate).toDateString()
                          : "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Booking Date
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.bookingDate
                          ? new Date(loan.bookingDate).toDateString()
                          : "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Acceptance Date
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.acceptanceDate
                          ? new Date(loan.acceptanceDate).toDateString()
                          : "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Date Completed
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.dateCompleted
                          ? new Date(loan.dateCompleted).toDateString()
                          : "--"}
                      </h3>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Pension RSA Number
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.pensionRsaNumber || "--"}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6 mb-6">
                  <p className="uppercase mb-4 text-sm text-gray-500">
                    {loan.customer.gender !== "CORPORATE"
                      ? "Next of Kin"
                      : "Director"}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Fullname
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.customer.nextOfKinName || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        {loan.customer.gender !== "CORPORATE"
                          ? "Relationship"
                          : "Designation"}
                      </p>
                      <h3 className="text-sm text-medium">
                        {StringFormat.toTitleCase(
                          loan.customer.nextOfKinRelationship
                        ) || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Address
                      </p>
                      <h3 className="text-sm text-medium">
                        {StringFormat.toTitleCase(
                          loan.customer.nextOfKinAddress
                        ) || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Mobile
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.customer.nextOfKinMobile || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Email
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.customer.nextOfKinEmail || "--"}
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
                        Bank Account Name
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.bankAccountName || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Bank Name
                      </p>
                      <h3 className="text-sm text-medium">
                        {StringFormat.toSentenceCase(loan.bankName) || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Bank Account Number
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.bankAccountNumber || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Bank Verification Number
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.customer.bvnNumber || "--"}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6 mb-6">
                  <p className="uppercase mb-4 text-sm text-gray-500">
                    Loan Product
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Name
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.loanProduct.name || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Repayment Cycle
                      </p>
                      <h3 className="text-sm text-medium">
                        {StringFormat.toSentenceCase(
                          loan.loanProduct.repaymentCycle
                        ) || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Default Interest Rate %
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.loanProduct.defaultInterestRate || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Daily Penalty Rate %
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.loanProduct.dailyPenalRate || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Asset Sub Account
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.loanProduct.assetSubAccount.name || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Interest Income Sub Account
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.loanProduct.interestIncomeSubAccount.name || "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Interest Receivable Sub Account
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.loanProduct.interestReceivableSubAccount.name ||
                          "--"}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        Default Management Fee Rate %
                      </p>
                      <h3 className="text-sm text-medium">
                        {loan.loanProduct.defaultManagementFeeRate
                          ? `${loan.loanProduct.defaultManagementFeeRate}%`
                          : "--"}
                      </h3>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedTab === 1 && (
              <div>
                {(user.role === "FIRST_REVIEWER" ||
                  user.role === "SECOND_REVIEWER") && (
                  <div className="mb-6 rounded-lg p-6 border">
                    <div className="flex justify-between items-center mb-4">
                      <p className="uppercase text-sm text-gray-500">Terms</p>
                    </div>

                    <form
                      autoComplete={"off"}
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Amount
                          </p>
                          <h3 className="text-sm text-medium">
                            {StringFormat.Currency(terms.approvedLoanAmount) ||
                              "--"}
                          </h3>
                          <Controller
                            name="approvedLoanAmount"
                            control={control}
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <InputNumber
                                id="approvedLoanAmount"
                                controls={false}
                                size="large"
                                placeholder="Enter Loan Amount here"
                                className="w-full mt-4"
                                precision={2}
                                defaultValue={0}
                                formatter={(value) =>
                                  `₦ ${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                parser={(value) =>
                                  value!.replace(/\₦\s?|(,*)/g, "")
                                }
                                {...field}
                              />
                            )}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Monthly Rate %
                          </p>
                          <h3 className="text-sm text-medium">
                            {terms.approvedMthlyRate || "--"}
                          </h3>
                          <Controller
                            name="approvedMthlyRate"
                            control={control}
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <InputNumber
                                id="approvedMthlyRate"
                                size="large"
                                addonAfter="%"
                                min={0}
                                max={100}
                                placeholder="Enter loan rate here"
                                className="w-full mt-4"
                                precision={2}
                                {...field}
                              />
                            )}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            Instalment (Months)
                          </p>
                          <h3 className="text-sm text-medium">
                            {terms.approvedTenorMths || "--"}
                          </h3>
                          <Controller
                            name="approvedTenorMths"
                            control={control}
                            rules={{
                              required: true,
                            }}
                            render={({ field }) => (
                              <InputNumber
                                id="approvedTenorMths"
                                size="large"
                                placeholder="Enter tenor here"
                                className="w-full mt-4"
                                precision={0}
                                {...field}
                              />
                            )}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">
                            DSR Rate
                          </p>
                          <h3 className="text-sm text-medium">
                            {terms.approvedDsrRate || "--"}
                          </h3>
                          <Controller
                            name="approvedDsrRate"
                            control={control}
                            render={({ field }) => (
                              <InputNumber
                                id="approvedDsrRate"
                                size="large"
                                min={0}
                                max={100}
                                addonAfter="%"
                                placeholder="Enter DSR rate here"
                                className="w-full mt-4"
                                precision={2}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6 md:items-center mt-8">
                        <div className="flex justify-between md:justify-normal md:items-center gap-6">
                          <div>
                            <p className="text-sm font-semibold text-blue-700 mb-2">
                              Instalment Repayment
                            </p>
                            <h3 className="text-base text-medium">
                              {StringFormat.Currency(terms.monthlyRepayment) ||
                                "--"}
                            </h3>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-blue-700 mb-2">
                              Maximum Loan
                            </p>
                            <h3 className="text-base text-medium">
                              {StringFormat.Currency(terms.maximumLoanAmount) ||
                                "--"}
                            </h3>
                          </div>
                        </div>

                        <Button
                          title="Recompute"
                          disabled={!isValid}
                          className="ml-auto h-fit mt-4 md:mt-0"
                          type="default"
                          size="medium"
                          forForm
                        />
                      </div>
                    </form>
                  </div>
                )}

                <div className="mb-6 rounded-lg p-6 border">
                  <p className="uppercase mb-8 text-sm text-gray-500">Trail</p>

                  <Timeline
                    mode="alternate"
                    items={loan.approvalTrail
                      .sort((a, b) =>
                        dayjs(a.dateCompleted).diff(dayjs(b.dateCompleted))
                      )
                      .map((trail) => ({
                        color:
                          trail.decisionFlag === "APPROVED"
                            ? "green"
                            : trail.decisionFlag === "RETURNED"
                            ? "orange"
                            : "red",
                        label: (
                          <span className="text-sm font-medium block">
                            {new Date(trail?.dateCompleted).toLocaleString()}
                          </span>
                        ),
                        children: (
                          <TimelineDetail
                            name={trail.processedBy}
                            status={StringFormat.toTitleCase(
                              trail.decisionFlag
                            )}
                            comment={
                              trail.comment || (
                                <span className="italic">No Comment</span>
                              )
                            }
                          />
                        ),
                      }))}
                  />
                </div>
              </div>
            )}

            {selectedTab === 2 && (
              <div>
                {loan?.files?.length > 0 ||
                loan?.customer?.files?.length > 0 ? (
                  <>
                    <div className="mb-6 rounded-lg p-6 border">
                      <div className="flex justify-between items-center mb-4">
                        <p className="uppercase text-sm text-gray-500">
                          Loan files
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                        {loan.files.map((file) => (
                          <File key={file.fileName} {...file} />
                        ))}

                        {user.role === "FIRST_REVIEWER" &&
                          loan.applicationStatus === "PENDING_FIRST_REVIEW" && (
                            <FileUpload
                              onDone={handleSuccessfulFileAddition}
                              editFileName
                              useExternalApi
                              externalAPI={handleAddFile}
                            />
                          )}
                      </div>
                    </div>

                    {loan.customer.files && loan.customer.files.length > 0 && (
                      <div className="mb-6 rounded-lg p-6 border">
                        <div className="flex justify-between items-center mb-4">
                          <p className="uppercase text-sm text-gray-500">
                            Customer files
                          </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                          {loan.customer.files.map((file) => (
                            <File key={file.fileName} {...file} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full text-center p-6">
                    <p className="uppercase text-sm font-semibold text-gray-500">
                      No Document
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 3 && loan && (
              <LoanHistory setSelectedTab={setSelectedTab} />
            )}
          </div>
        </div>
      )}

      <LoanProgressModal
        show={loanProgressModal}
        onClose={() => {
          setLoanProgressModal(false);
        }}
        loan={loan}
        status={decision}
        terms={approvalTerms}
      />

      {loan && (
        <LoanBookModal
          show={loanBookModal}
          onClose={() => {
            setLoanBookModal(false);
          }}
          loanProductId={loan.loanProduct.id}
          decision={{
            decisionFlag: "APPROVED",
            comment: "Application resubmission",
            loanApplicationId: loan.id,
            currentProcessorUid: user.id,
          }}
          managementFee={mgtFee}
        />
      )}
    </div>
  );
};

export default ViewLoan;
