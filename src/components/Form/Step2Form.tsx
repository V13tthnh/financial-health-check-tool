"use client";
import { useFormContext } from "../../lib/context/FormContext";
import { FINANCIAL_GOALS } from "../../lib/Constants";
import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ErrorModal from "../ErrorModal/ErrorModal";

export default function Step2Form() {
  const { formData, setFormData, setCurrentStep } = useFormContext();
  const { step2 } = formData;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (goal: string) => {
    if (step2.includes(goal)) {
      setFormData({ step2: step2.filter((g: string) => g !== goal) });
      setErrorMessage(null);
    } else if (step2.length < 3) {
      setFormData({ step2: [...step2, goal] });
      setErrorMessage(null);
    } else {
      setErrorMessage("Bạn chỉ có thể chọn tối đa 3 mục tiêu!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step2.length > 0) {
      setCurrentStep(3);
      setErrorMessage(null);
    } else {
      setErrorMessage("Vui lòng chọn ít nhất 1 mục tiêu!");
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const closeModal = () => {
    setErrorMessage(null);
  };

  return (
    <>
      {" "}
      <div className="flex justify-center items-center min-h-screen ">
        <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-md">
          <h2 className="text-2xl text-center mb-6">
            Bước 2: <br />
            <span className="font-bold">Mục tiêu tài chính</span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {FINANCIAL_GOALS.map((goal, index) => (
                <React.Fragment key={goal.value}>
                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      step2.includes(goal.value)
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={step2.includes(goal.value)}
                      onChange={() => handleChange(goal.value)}
                      className="hidden"
                    />
                    <span className="text-2xl mr-4">{goal.icon}</span>
                    <span className="text-md font-bold">{goal.label}</span>
                  </label>
                  {/* Add buttons in the same row as "Khác" (last item) */}
                  {index === FINANCIAL_GOALS.length - 1 && (
                    <div className="flex justify-center gap-4">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition font-semibold flex items-center"
                      >
                        <FaArrowLeft className="w-4 h-4 mr-2" />
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-pink-200 text-gray-800 hover:bg-pink-300 transition font-semibold flex items-center"
                      >
                        <FaArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </form>
        </div>
      </div>
      {errorMessage && (
        <ErrorModal message={errorMessage} onClose={closeModal} />
      )}
    </>
  );
}
