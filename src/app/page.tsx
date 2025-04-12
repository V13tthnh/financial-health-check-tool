"use client";
import { useFormContext } from "../lib/context/FormContext";
import Step1Form from "../components/Form/Step1Form";
import Step2Form from "../components/Form/Step2Form";
import Step3Form from "../components/Form/Step3Form";
import Step4Form from "../components/Form/Step4Form";
import WelcomePage from "@/components/WelcomPage";
import CurrentFinancialSituation from "@/components/Results/CurrentFinancialSituation";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { currentStep, setCurrentStep, formData, setFormData } =
    useFormContext();
  const [showWelcome, setShowWelcome] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const prevFormDataRef = useRef(formData); // Lưu giá trị formData trước đó

  // Khởi tạo dữ liệu từ localStorage khi component mount
  useEffect(() => {
    const savedStep = localStorage.getItem("currentStep");
    const savedFormData = localStorage.getItem("formData");
    const savedWelcome = localStorage.getItem("showWelcome");

    let newStep = 1;
    let newShowWelcome = true;

    if (savedStep) {
      newStep = parseInt(savedStep, 10);
    }

    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        if (!parsedData.step2 || !Array.isArray(parsedData.step2)) {
          parsedData.step2 = [];
        }
        setFormData({
          step1: {
            fullName: parsedData.step1?.fullName ?? "",
            age: parsedData.step1?.age ?? 0,
            city: parsedData.step1?.city ?? "",
            jobGroup: parsedData.step1?.jobGroup ?? "",
            customJob: parsedData.step1?.customJob ?? "",
          },
          step2: parsedData.step2,
          step3: {
            income: parsedData.step3?.income ?? 0,
            expenses: parsedData.step3?.expenses ?? 0,
            needs: parsedData.step3?.needs ?? 0,
            wants: parsedData.step3?.wants ?? 0,
            hasEmergencyFund: parsedData.step3?.hasEmergencyFund ?? "",
            emergencyFund: parsedData.step3?.emergencyFund ?? 0,
            debtAmount: parsedData.step3?.debtAmount ?? 0,
            debtStatus: parsedData.step3?.debtStatus ?? "",
            insurance: parsedData.step3?.insurance ?? "",
          },
          step4: {
            children: parsedData.step4?.children ?? 0,
            maritalStatus: parsedData.step4?.maritalStatus ?? "",
            retirementAge: parsedData.step4?.retirementAge ?? 0,
          },
        });
      } catch (error) {
        console.error("Error parsing formData from localStorage:", error);
      }
    }

    if (savedWelcome) {
      newShowWelcome = savedWelcome === "true";
    }

    // Đặt state đồng bộ
    setCurrentStep(newStep);
    setShowWelcome(newShowWelcome);
    setIsInitialized(true);
  }, []); // Mảng phụ thuộc rỗng để chỉ chạy một lần

  // Lưu dữ liệu vào localStorage khi thay đổi
  useEffect(() => {
    if (!isInitialized) return;

    // So sánh formData để tránh lưu không cần thiết
    const formDataChanged =
      JSON.stringify(formData) !== JSON.stringify(prevFormDataRef.current);

    if (
      formDataChanged ||
      localStorage.getItem("currentStep") !== currentStep.toString() ||
      localStorage.getItem("showWelcome") !== showWelcome.toString()
    ) {
      localStorage.setItem("currentStep", currentStep.toString());
      localStorage.setItem("formData", JSON.stringify(formData));
      localStorage.setItem("showWelcome", showWelcome.toString());
      prevFormDataRef.current = formData; // Cập nhật giá trị trước đó
    }
  }, [currentStep, formData, showWelcome, isInitialized]);

  const handleStart = () => {
    setShowWelcome(false);
    setCurrentStep(1);
  };

  const handleReset = () => {
    localStorage.removeItem("currentStep");
    localStorage.removeItem("formData");
    localStorage.removeItem("showWelcome");
    setShowWelcome(true);
    setCurrentStep(1);
    setFormData({
      step1: {
        fullName: "",
        age: 0,
        city: "",
        jobGroup: "",
        customJob: "",
      },
      step2: [],
      step3: {
        income: 0,
        expenses: 0,
        needs: 0,
        wants: 0,
        hasEmergencyFund: "",
        emergencyFund: 0,
        debtAmount: 0,
        debtStatus: "",
        insurance: "",
      },
      step4: {
        children: 0,
        maritalStatus: "",
        retirementAge: 0,
      },
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Form />;
      case 2:
        return <Step2Form />;
      case 3:
        return <Step3Form />;
      case 4:
        return <Step4Form />;
      case 5:
        return (
          <>
            <CurrentFinancialSituation />
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition font-semibold"
              >
                Bắt đầu lại
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (!isInitialized) {
    return null; // Hoặc hiển thị loading spinner
  }

  return (
    <>
      {showWelcome ? (
        <WelcomePage onStart={handleStart} />
      ) : (
        <div className="">{renderStep()}</div>
      )}
    </>
  );
}
