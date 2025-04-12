"use client";
import { createContext, useContext, useState } from "react";

interface FormData {
  step1: {
    fullName: string;
    age: number;
    city: string;
    jobGroup: string;
    customJob?: string;
  };
  step2: string[];
  step3: {
    income: number;
    expenses: number;
    needs: number;
    wants: number;
    hasEmergencyFund?: string;
    emergencyFund: number;
    debtAmount: number;
    debtStatus: string;
    insurance: string;
  };
  step4: { children: number; maritalStatus: string; retirementAge: number };
}

const FormContext = createContext<{
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}>({
  formData: {} as FormData,
  setFormData: () => {},
  currentStep: 1,
  setCurrentStep: () => {},
});

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormDataState] = useState<FormData>({
    step1: { fullName: "", age: 0, city: "", jobGroup: "", customJob: "" },
    step2: [],
    step3: {
      income: 0,
      expenses: 0,
      needs: 0,
      wants: 0,
      emergencyFund: 0,
      hasEmergencyFund: "",
      debtAmount: 0,
      debtStatus: "",
      insurance: "",
    },
    step4: { children: 0, maritalStatus: "", retirementAge: 0 },
  });
  const [currentStep, setCurrentStep] = useState(1);

  const setFormData = (data: Partial<FormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  return (
    <FormContext.Provider
      value={{ formData, setFormData, currentStep, setCurrentStep }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);
