import React, { useCallback, useEffect, useState } from "react";
import { CustomerOnboardingSteps } from "@/shared/utils/constants";
import StepOne from "@/pages/private/Customer/OnBoard/StepOne";
import StepFive from "@/pages/private/Customer/OnBoard/StepFive";
import StepFour from "@/pages/private/Customer/OnBoard/StepFour";
import StepThree from "@/pages/private/Customer/OnBoard/StepThree";
import StepTwo from "@/pages/private/Customer/OnBoard/StepTwo";
import { ICustomer } from "@/interfaces/iCustomer";
import useStore from "@/store";
import MemoryService from "@/shared/utils/memory";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import Stepper from "@/components/common/Steper";

const Personal: React.FC<{
  customerId?: string | number;
}> = ({ customerId }) => {
  const navigate = useNavigate();
  const {
    customerStore,
    authStore: { user, impersonated_user },
  } = useStore();
  const {
    createCustomer,
    updateCustomer,
    getCustomer,
    customer,
    clearErrorAndMessage,
    clearCustomer,
    message: msg,
    processing,
    error,
  } = customerStore;
  const [formData, setFormData] = useState<ICustomer>({} as ICustomer);
  const [selectedStep, setSelectedStep] = useState<number>(0);

  useEffect(() => {
    const storedData = MemoryService.decryptAndGet(
      "onboarding_customer_personal"
    );

    if (customerId) {
      getCustomer(+customerId);
    } else if (storedData) {
      updateFields(storedData);
    }
  }, []);

  useEffect(() => {
    if (customer && customerId && customerId === customer.customerId) {
      updateFields(customer);
    }

    return () => {
      if (customerId && customer) {
        clearCustomer();
        MemoryService.remove("onboarding_customer_personal", true);
      }
    };
  }, [customer, customerId]);

  useEffect(() => {
    MemoryService.encryptAndSave(formData, "onboarding_customer_personal");
  }, [formData]);

  useEffect(() => {
    if (msg) {
      message.success(msg);

      MemoryService.remove("onboarding_customer_personal", true);
      clearCustomer();

      if (customerId) {
        navigate(`/account/customer/${customerId}`);
      } else {
        if (
          impersonated_user.role === "ACCOUNT_OFFICER" ||
          user.role === "ACCOUNT_OFFICER"
        ) {
          navigate("/account/banking/portfolio");
        } else {
          navigate("/account/customer");
        }
      }
    }

    if (error) {
      message.error(error);
    }

    return clearErrorAndMessage;
  }, [msg, error, navigate, clearErrorAndMessage]);

  const updateFields = (fields: Partial<ICustomer>) => {
    setFormData((prev) => {
      return { ...prev, ...fields };
    });
  };

  const handleNext = useCallback(async () => {
    if (selectedStep === 4) {
      if (customer && customer.customerId) {
        await updateCustomer(formData);
      } else {
        await createCustomer(formData);
      }
    } else {
      setSelectedStep((step) => step + 1);
    }
  }, [formData, customer, selectedStep]);

  const handlePrevious = useCallback(() => {
    setSelectedStep((step) => step - 1);
  }, []);

  return (
    <div>
      <Stepper
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
        processing={processing}
        steps={CustomerOnboardingSteps}
      />

      {selectedStep === 0 && (
        <StepOne
          who="NOK"
          next={handleNext}
          previous={handlePrevious}
          data={formData}
          setFormData={updateFields}
          isEdit={customerId ? true : false}
        />
      )}
      {selectedStep === 1 && (
        <StepTwo
          who="NOK"
          next={handleNext}
          previous={handlePrevious}
          data={formData}
          setFormData={updateFields}
          isEdit={customerId ? true : false}
        />
      )}
      {selectedStep === 2 && (
        <StepThree
          who="NOK"
          next={handleNext}
          previous={handlePrevious}
          data={formData}
          setFormData={updateFields}
          isEdit={customerId ? true : false}
        />
      )}
      {selectedStep === 3 && (
        <StepFour
          who="NOK"
          next={handleNext}
          previous={handlePrevious}
          data={formData}
          setFormData={updateFields}
          isEdit={customerId ? true : false}
        />
      )}
      {selectedStep === 4 && (
        <StepFive
          who="NOK"
          next={handleNext}
          previous={handlePrevious}
          data={formData}
          setFormData={updateFields}
          isEdit={customerId ? true : false}
        />
      )}
    </div>
  );
};

export default Personal;
