import React, { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import StepOne from "@/pages/private/Customer/OnBoard/StepOne";
import StepFive from "@/pages/private/Customer/OnBoard/StepFive";
import StepThree from "@/pages/private/Customer/OnBoard/StepThree";
import StepTwo from "@/pages/private/Customer/OnBoard/StepTwo";
import { BusinessOnboardingSteps } from "@/shared/utils/constants";
import { ICustomer } from "@/interfaces/iCustomer";
import useStore from "@/store";
import MemoryService from "@/shared/utils/memory";
import Stepper from "@/components/common/Steper";

const Business: React.FC<{
  customerId?: string | number;
}> = ({ customerId }) => {
  const navigate = useNavigate();
  const { customerStore } = useStore();
  const {
    createCustomer,
    updateCustomer,
    getCustomer,
    customer,
    clearErrorAndMessage,
    clearCustomer,
    processing,
    fetching,
    error,
    message: customerMessage,
  } = customerStore;
  const [formData, setFormData] = useState<ICustomer>({} as ICustomer);
  const [selectedStep, setSelectedStep] = useState(0);

  useEffect(() => {
    const storedData = MemoryService.decryptAndGet(
      "onboarding_customer_business"
    );

    if (customerId) {
      getCustomer(+customerId);
    } else if (storedData) {
      updateFields(storedData);
    }
  }, []);

  useEffect(() => {
    if (customerId && !fetching && !customer) {
      message.error("Customer record does not exist");
      navigate("/account/customer");
    }
  }, [customerId, customer, fetching]);

  useEffect(() => {
    if (customer && customerId && customerId === customer.customerId) {
      updateFields(customer);
    }

    return () => {
      if (customerId && customer) {
        clearCustomer();
        MemoryService.remove("onboarding_customer_business", true);
      }
    };
  }, [customer, customerId]);

  useEffect(() => {
    MemoryService.encryptAndSave(formData, "onboarding_customer_business");
  }, [formData]);

  useEffect(() => {
    if (customerMessage) {
      message.success(customerMessage);

      MemoryService.remove("onboarding_customer_business", true);
      navigate("/account/customer");
    }

    if (error) {
      message.error(error);
    }

    return clearErrorAndMessage;
  }, [customerMessage, error, navigate, clearErrorAndMessage]);

  const updateFields = useCallback((fields: Partial<ICustomer>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  }, []);

  const handleNext = useCallback(async () => {
    if (selectedStep === 3) {
      if (customer && customer.customerId) {
        await updateCustomer(formData);
      } else {
        await createCustomer(formData);
      }
    } else {
      setSelectedStep((step) => step + 1);
    }
  }, [selectedStep, customer, formData, createCustomer, updateCustomer]);

  const handlePrevious = useCallback(() => {
    setSelectedStep((step) => step - 1);
  }, []);

  return (
    <>
      <div>
        <Stepper
          selectedStep={selectedStep}
          setSelectedStep={setSelectedStep}
          processing={processing}
          steps={BusinessOnboardingSteps}
        />

        {/* Steps */}
        {selectedStep === 0 && (
          <StepOne
            who="Director"
            next={handleNext}
            previous={handlePrevious}
            data={formData}
            setFormData={updateFields}
            isEdit={customerId ? true : false}
          />
        )}
        {selectedStep === 1 && (
          <StepTwo
            who="Director"
            next={handleNext}
            previous={handlePrevious}
            data={formData}
            setFormData={updateFields}
            isEdit={customerId ? true : false}
          />
        )}
        {selectedStep === 2 && (
          <StepThree
            who="Director"
            next={handleNext}
            previous={handlePrevious}
            data={formData}
            setFormData={updateFields}
            isEdit={customerId ? true : false}
          />
        )}
        {selectedStep === 3 && (
          <StepFive
            who="Director"
            next={handleNext}
            previous={handlePrevious}
            data={formData}
            setFormData={updateFields}
            isEdit={customerId ? true : false}
          />
        )}
      </div>
    </>
  );
};

export default Business;
