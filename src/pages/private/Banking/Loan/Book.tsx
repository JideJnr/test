import { useEffect, useState, useCallback } from "react";
import PageTitle from "@/components/common/PageTitle";
import { LoanOnboardingSteps } from "@/shared/utils/constants";
import StepOne from "@/pages/private/Banking/Loan/Application/StepOne";
import StepTwo from "@/pages/private/Banking/Loan/Application/StepTwo";
import StepThree from "@/pages/private/Banking/Loan/Application/StepThree";
import { ILoan } from "@/interfaces/iLoan";
import { useNavigate, useParams } from "react-router-dom";
import useStore from "@/store";
import { message } from "antd";
import Button from "@/components/common/Button";
import Stepper from "@/components/common/Steper";
import { LoanProductModal } from "@/components/Loan/LoanProductModal";
import MemoryService from "@/shared/utils/memory";

const BookLoan = () => {
  const {
    loanStore: {
      createLoan,
      updateLoan,
      getLoanProducts,
      getLoanById,
      getActiveCustomerLoans,
      loanProduct,
      processing,
      loan,
      error,
      message: msg,
      clearErrorAndMessage,
    },
    customerStore: { customer, getCustomer },
  } = useStore();

  const navigate = useNavigate();
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const [formData, setFormData] = useState<ILoan>({} as ILoan);
  const { id: customerId, loanType, loanId, currentLoanId } = useParams();
  const [loanProductModal, setLoanProductModal] = useState<boolean>(false);

  useEffect(() => {
    if (customerId) {
      getCustomer(+customerId);

      updateFields({
        customerId: customerId,
        isTopup: +loanType !== 0,
      });

      if (loanType === "0") {
        setLoanProductModal(true);
      } else {
        getActiveCustomerLoans(customerId);
      }
    }
  }, [customerId, loanType, currentLoanId]);

  useEffect(() => {
    getLoanProducts();
  }, []);

  useEffect(() => {
    if (loanId) {
      getLoanById(loanId);
    }
  }, [loanId]);

  useEffect(() => {
    if (loan && loan.id && loanId) {
      updateFields({
        ...loan,
        customerId: loan.customer.customerId,
        loanProductId: loan.loanProduct.id,
        currentlyIndebted: loan.currentlyIndebted ? "true" : "false",
      });
    }
  }, [loan]);

  useEffect(() => {
    MemoryService.encryptAndSave(formData, "loan_application");
  }, [formData]);

  useEffect(() => {
    if (msg) {
      message.success(msg);

      if (loanId) {
        navigate(`/account/banking/loans/${loanId}`);
      } else {
        navigate("/account/banking/loans");
      }
    }

    if (error) {
      message.error(error);
    }

    return () => {
      clearErrorAndMessage();
      MemoryService.remove("loan_application");
    };
  }, [error, msg, clearErrorAndMessage]);

  const updateFields = (fields: Partial<ILoan>) => {
    setFormData((prev) => {
      return { ...prev, ...fields };
    });
  };

  const handleNext = useCallback(async () => {
    if (selectedStep === 2) {
      const extendedFormData: ILoan = {
        ...formData,

        currentlyIndebted: formData.currentlyIndebted === "true",
        customerId: customer.customerId,
      };

      if (loan && loan.id && loanId) {
        await updateLoan(extendedFormData, loan.id);
      } else {
        await createLoan(extendedFormData);
      }
    } else {
      setSelectedStep((step) => step + 1);
    }
  }, [formData, loan, selectedStep]);

  const handlePrevious = useCallback(() => {
    setSelectedStep((step) => step - 1);
  }, []);

  const getLoanProductWithId = () => {
    const selectedLoanProduct = loanProduct.find(
      (p) => p.id === formData.loanProductId
    );

    return selectedLoanProduct ? selectedLoanProduct.name : "";
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b">
        <PageTitle
          title={`Loan Application ${
            getLoanProductWithId() ? " - " + getLoanProductWithId() : ""
          }`}
          subTitle="Apply for new loan for a customer account"
          showAdd={false}
          showBackButton={true}
          backButtonRoute={
            loanId
              ? `/account/banking/loans/${loanId}`
              : "/account/banking/loans/book"
          }
          showSearch={false}
        />

        {+loanType === 0 && (
          <Button
            title={"Change Loan Product"}
            size="large"
            type="primary"
            className="text-sm"
            onClick={() => setLoanProductModal(true)}
          />
        )}
      </div>

      {customer && (
        <div className="my-4">
          <h2 className="text-xl fonr-semibold ">
            Loan Application for{" "}
            <span className="text-blue-600">{customer.fullName}</span>
          </h2>
        </div>
      )}

      <Stepper
        steps={LoanOnboardingSteps}
        processing={processing}
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
      />

      {selectedStep === 0 && (
        <StepOne setFormData={updateFields} next={handleNext} data={formData} />
      )}
      {selectedStep === 1 && (
        <StepTwo
          next={handleNext}
          setFormData={updateFields}
          previous={handlePrevious}
          data={formData}
        />
      )}
      {selectedStep === 2 && (
        <StepThree
          next={handleNext}
          setFormData={updateFields}
          previous={handlePrevious}
          data={formData}
        />
      )}

      <LoanProductModal
        show={loanProductModal}
        onClose={() => {
          setLoanProductModal(false);
        }}
        setLoanProduct={updateFields}
        formData={formData}
      />
    </div>
  );
};

export default BookLoan;
