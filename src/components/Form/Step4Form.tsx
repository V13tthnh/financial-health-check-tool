import React, { useState } from "react";
import { useFormContext } from "../../lib/context/FormContext";
import { MARITAL_STATUS } from "@/lib/Constants";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ErrorModal from "../ErrorModal/ErrorModal";
import Image from "next/image";

export default function Step4Form() {
  const { formData, setFormData, setCurrentStep } = useFormContext();
  const { step1, step4 } = formData;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Xử lý trạng thái tình trạng hôn nhân
  const handleMaritalStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newValue = e.target.value;
    // If selecting "single", reset children to 0
    setFormData({
      step4: {
        ...step4,
        maritalStatus: newValue,
        ...(newValue === "single" ? { children: 0 } : {}),
      },
    });
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step4.retirementAge <= step1.age) {
      setErrorMessage("Độ tuổi nghỉ hưu phải lớn hơn tuổi hiện tại của bạn!");
      return;
    }

    if (Number(step4.retirementAge) <= 0) {
      setErrorMessage("Vui lòng nhập độ tuổi phù hợp!");
      return;
    }

    if (step4.maritalStatus !== "single" && step4.children < 0) {
      setErrorMessage("Vui lòng nhập số con phù hợp!");
      return;
    }

    if (step4.maritalStatus) {
      setCurrentStep(5);
      setErrorMessage(null);
    } else {
      setErrorMessage("Vui lòng điền/chọn đầy đủ thông tin!");
    }
  };

  // Trờ về step trước
  const handleBack = () => {
    setCurrentStep(3);
  };

  // Đóng modal thông báo lỗi
  const closeModal = () => {
    setErrorMessage(null);
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-xl mx-auto px-25 py-6 bg-white shadow-md">
          <h2 className="text-2xl text-center mb-6">Bước 4:</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-2xl font-bold text-black">
              Bí mật cuối cùng, tôi hiện nay{" "}
              <select
                value={step4.maritalStatus || ""}
                onChange={handleMaritalStatusChange}
                className="inline-block border-b text-center font-bold border-gray-400 focus:border-pink-500 outline-none appearance-none"
              >
                <option
                  className="text-center text-lg font-bold"
                  value=""
                  disabled
                >
                  Chọn tình trạng
                </option>
                {MARITAL_STATUS.map((option) => (
                  <option
                    className="text-center text-lg font-bold"
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>{" "}
              và có{" "}
              <input
                type="number"
                value={step4.children || ""}
                onChange={(e) =>
                  setFormData({
                    step4: {
                      ...step4,
                      children: parseInt(e.target.value) || 0,
                    },
                  })
                }
                disabled={step4.maritalStatus === "single"}
                className={` ${
                  step4.maritalStatus === "single"
                    ? "inline-block w-16 border-b text-gray-400 border-gray-300 outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    : "inline-block w-16 border-b border-gray-400 focus:border-pink-500 outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                }`}
                placeholder="0"
                min="0"
              />{" "}
              con.
            </p>
            <p className="text-2xl font-bold text-black-700">
              Tôi rất mong được nghỉ hưu sớm và độc lập tài chính (FI) ở độ tuổi{" "}
              <input
                type="number"
                value={step4.retirementAge || ""}
                onChange={(e) =>
                  setFormData({
                    step4: {
                      ...step4,
                      retirementAge: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="inline-block w-16 border-b border-gray-400 focus:border-pink-500 outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
                min="0"
              />
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="w-40 px-6 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition font-semibold flex items-center justify-center"
              >
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Trở lại
              </button>
              <button
                type="submit"
                className="w-40 px-6 py-2 bg-pink-200 text-gray-800 hover:bg-pink-300 transition font-semibold flex items-center justify-center"
              >
                Xong
                <FaArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </form>
          {/* Placeholder for the illustration */}
          <div className="mt-6 flex justify-center mb-6">
            <Image
              src="/images/icon-step4.png"
              alt="Financial Independence"
              width={450}
              height={450}
              objectFit="contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      {errorMessage && (
        <ErrorModal message={errorMessage} onClose={closeModal} />
      )}
    </>
  );
}
