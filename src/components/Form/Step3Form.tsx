import React, { useState } from "react";
import { useFormContext } from "../../lib/context/FormContext";
import {
  DEBT_OPTIONS,
  EMERGENCY_FUND_OPTIONS,
  INSURANCE_STATUS,
} from "@/lib/Constants";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ErrorModal from "../ErrorModal/ErrorModal";

export default function Step3Form() {
  const { formData, setFormData, setCurrentStep } = useFormContext();
  const { step3 } = formData;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Format số theo dạng .000.000 khi nhập
  const formatNumber = (value: unknown): string => {
    if (value === undefined || value === null || value === "") return "";
    const num = parseFloat(value as string); // Ép kiểu nếu cần
    if (isNaN(num)) return "";
    return num.toLocaleString("vi-VN", {
      maximumFractionDigits: 0,
    });
  };

  // Chuyển số đã format sang dạng number
  const parseNumber = (value: string): number => {
    if (!value) return 0;
    // Loại bỏ tất cả ký tự không phải số (dấu chấm hoặc phẩy từ định dạng)
    const cleanedValue = value.replace(/[^\d]/g, "");
    return parseFloat(cleanedValue) || 0;
  };

  // Tự động chỉnh kích thước input phù hợp với nội dung
  const getInputWidth = (value: unknown): string => {
    if (!value) return "4ch";
    return `${value.toString().length + 2}ch`;
  };

  // Xử lý dữ liệu và đến bước tiếp theo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasEmergencyFundValid =
      step3.hasEmergencyFund === "no" ||
      (step3.hasEmergencyFund === "yes" && step3.emergencyFund > 0);

    const debtStatusValid =
      step3.debtStatus === "no" ||
      (step3.debtStatus === "yes" && step3.debtAmount > 0) ||
      (step3.debtStatus === "planning" && step3.debtAmount >= 0);

    const insuranceValid =
      step3.insurance === "no" || step3.insurance === "yes";

    if (
      step3.income > 0 &&
      step3.expenses > 0 &&
      step3.needs > 0 &&
      step3.wants > 0 &&
      hasEmergencyFundValid &&
      debtStatusValid &&
      insuranceValid
    ) {
      setCurrentStep(4);
      setErrorMessage(null);
    } else {
      setErrorMessage("Vui lòng điền/chọn đầy đủ thông tin!");
    }
  };

  //Trở về step trước
  const handleBack = () => {
    setCurrentStep(2);
  };

  // Xử lý chọn trạng thái quỹ dự phòng
  const handleEmergencyFundChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newValue = e.target.value;
    setFormData({
      step3: {
        ...step3,
        hasEmergencyFund: newValue,
        emergencyFund:
          newValue === "no" || newValue === "" ? 0 : step3.emergencyFund,
      },
    });
  };

  // Xử lý chọn trạng thái nợ
  const handleDebtStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setFormData({
      step3: {
        ...step3,
        debtStatus: newValue,
        debtAmount: newValue === "no" || newValue === "" ? 0 : step3.debtAmount,
      },
    });
  };

  // Đóng modal thông báo
  const closeModal = () => {
    setErrorMessage(null);
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-xl mx-auto px-25 py-6 bg-white shadow-md">
          <h2 className="text-2xl text-center mb-6">Bước 3:</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Thu nhập & Chi phí */}

            <p className="text-lg font-bold text-gray-700">
              Tôi muốn biết làm thế nào để đạt mục tiêu tài chính mà tôi đã
              chọn. <br />
              Bật mí nhé, thu nhập mỗi tháng hiện nay của tôi khoảng
              <input
                type="text"
                value={formatNumber(step3.income)}
                onChange={(e) =>
                  setFormData({
                    step3: { ...step3, income: parseNumber(e.target.value) },
                  })
                }
                style={{
                  width: getInputWidth(formatNumber(step3.income)),
                }}
                className="inline-block border-b text-lg font-bold text-pink-400 border-gray-400 focus:border-pink-500 outline-none text-center bg-transparent"
                placeholder="0"
              />{" "}
              và chi phí chi tiêu của tôi khoảng{" "}
              <input
                type="text"
                value={formatNumber(step3.expenses)}
                onChange={(e) =>
                  setFormData({
                    step3: {
                      ...step3,
                      expenses: parseNumber(e.target.value),
                    },
                  })
                }
                style={{
                  width: getInputWidth(formatNumber(step3.expenses)),
                }}
                className="inline-block border-b text-lg font-bold text-pink-400 border-gray-400 focus:border-pink-500 outline-none text-center"
                placeholder="0"
              />
              .
            </p>

            <p className="text-lg font-bold text-gray-700">
              Trong đó, các chi tiêu CẦN THIẾT đã lên đến{" "}
              <input
                type="text"
                value={formatNumber(step3.needs)}
                onChange={(e) =>
                  setFormData({
                    step3: { ...step3, needs: parseNumber(e.target.value) },
                  })
                }
                style={{
                  width: getInputWidth(formatNumber(step3.needs)),
                }}
                className="inline-block border-b text-lg font-bold text-pink-400 border-gray-400 focus:border-pink-500 outline-none text-center"
                placeholder="0"
              />
              . Ngược lại, các khoản chi MUỐN của tôi thường rơi vào khoảng{" "}
              <input
                type="text"
                value={formatNumber(step3.wants)}
                onChange={(e) =>
                  setFormData({
                    step3: { ...step3, wants: parseNumber(e.target.value) },
                  })
                }
                style={{
                  width: getInputWidth(formatNumber(step3.wants)),
                }}
                className="inline-block border-b text-lg font-bold text-pink-400 border-gray-400 focus:border-pink-500 outline-none text-center"
                placeholder="0"
              />
              .
            </p>
            <ul className="list-disc list-inside text-lg font-bold text-gray-700 space-y-2">
              <li>
                Tôi{" "}
                <select
                  value={step3.hasEmergencyFund || ""} // Mặc định là rỗng
                  onChange={handleEmergencyFundChange}
                  className="inline-block border-b text-lg font-bold border-gray-400 focus:border-pink-500 outline-none text-center bg-transparent appearance-none"
                >
                  <option className="text-lg font-bold" value="" disabled>
                    Chưa/Đã
                  </option>
                  {EMERGENCY_FUND_OPTIONS.map((option) => (
                    <option
                      className="text-lg font-bold"
                      key={option?.value}
                      value={option?.value}
                    >
                      {option?.label}
                    </option>
                  ))}
                </select>{" "}
                có quỹ dự phòng
                {step3.hasEmergencyFund === "yes" && (
                  <>
                    {" "}
                    và số tiền trong quỹ là{" "}
                    <input
                      type="text"
                      value={formatNumber(step3.emergencyFund)}
                      onChange={(e) =>
                        setFormData({
                          step3: {
                            ...step3,
                            emergencyFund: parseNumber(e.target.value),
                          },
                        })
                      }
                      style={{
                        width: getInputWidth(formatNumber(step3.emergencyFund)),
                      }}
                      className="inline-block border-b text-lg font-bold text-pink-400 border-gray-400 focus:border-pink-500 outline-none text-center"
                      placeholder="0"
                    />
                  </>
                )}
              </li>
              <li>
                Tôi{" "}
                <select
                  value={step3.debtStatus || ""} // Mặc định là rỗng
                  onChange={handleDebtStatusChange}
                  className="inline-block border-b text-lg font-bold border-gray-400 focus:border-pink-500 outline-none text-center bg-transparent appearance-none"
                >
                  <option className="text-lg font-bold" value="" disabled>
                    Có/Không có
                  </option>
                  {DEBT_OPTIONS.map((option) => (
                    <option
                      className="text-lg font-bold"
                      key={option?.value}
                      value={option?.value}
                    >
                      {option?.label}
                    </option>
                  ))}
                </select>{" "}
                các khoản nợ
                {step3.debtStatus === "yes" ||
                step3.debtStatus === "planning" ? (
                  <>
                    . Số tiền nợ mà tôi cần trả là{" "}
                    <input
                      type="text"
                      value={formatNumber(step3.debtAmount)}
                      onChange={(e) =>
                        setFormData({
                          step3: {
                            ...step3,
                            debtAmount: parseNumber(e.target.value),
                          },
                        })
                      }
                      style={{
                        width: getInputWidth(formatNumber(step3.debtAmount)),
                      }}
                      className="debt-input inline-block border-b text-lg font-bold border-gray-400 focus:border-red-500 outline-none text-center"
                      placeholder="0"
                    />
                  </>
                ) : (
                  <>
                    . Số tiền nợ mà tôi cần trả là{" "}
                    <input
                      type="text"
                      value="0"
                      disabled
                      style={{ width: "3ch" }}
                      className="inline-block border-b text-lg font-bold text-gray-400 border-gray-300 outline-none text-center opacity-70"
                    />
                  </>
                )}
              </li>
              <li>
                Tôi{" "}
                <select
                  value={step3.insurance || ""} // Mặc định là rỗng
                  onChange={(e) =>
                    setFormData({
                      step3: { ...step3, insurance: e.target.value },
                    })
                  }
                  className="inline-block border-b text-lg font-bold border-gray-400 focus:border-pink-500 outline-none text-center bg-transparent appearance-none"
                >
                  <option className="text-lg font-bold" value="" disabled>
                    Chưa/Có
                  </option>
                  {INSURANCE_STATUS.map((option) => (
                    <option
                      className="text-lg font-bold"
                      key={option?.value}
                      value={option?.value}
                    >
                      {option?.label}
                    </option>
                  ))}
                </select>{" "}
                sở hữu bảo hiểm y tế, phòng trừ rủi ro và đóng hàng tháng.
              </li>
            </ul>
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
                Tiếp theo
                <FaArrowRight className="w-4 h-4 ml-2" />
              </button>
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
