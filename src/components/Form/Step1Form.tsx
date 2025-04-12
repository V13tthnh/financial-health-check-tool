import Image from "next/image";
import { useFormContext } from "../../lib/context/FormContext";
import { PROVINCES, JOB_GROUPS } from "../../lib/Constants";
import { useEffect, useRef, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import ErrorModal from "../ErrorModal/ErrorModal";
import conversationIllustration from "@/public/images/conversation-illustration.png";

export default function Step1Form() {
  const { formData, setFormData, setCurrentStep } = useFormContext();
  const { step1 } = formData;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs để đo độ rộng của các input
  const fullNameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLSelectElement>(null);
  const jobGroupRef = useRef<HTMLSelectElement>(null);
  const customJobRef = useRef<HTMLInputElement>(null);

  // Hàm điều chỉnh độ rộng cho input
  const adjustInputWidth = (
    inputRef: React.RefObject<HTMLInputElement | null>,
    value: string
  ) => {
    if (!inputRef.current) return;

    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.whiteSpace = "pre";
    span.style.fontSize = "1.125rem"; // Khớp với font của input (text-lg = 1.125rem)
    span.style.fontFamily = "Inter, Arial, Helvetica, sans-serif"; // Khớp với font của body
    span.textContent = value || inputRef.current.placeholder || "";
    document.body.appendChild(span);
    const width = span.offsetWidth + 20; // Thêm padding để tránh che nội dung
    inputRef.current.style.width = `${Math.max(width, 80)}px`; // Độ rộng tối thiểu 80px
    document.body.removeChild(span);
  };

  // Hàm điều chỉnh độ rộng cho select
  const adjustSelectWidth = (
    selectRef: React.RefObject<HTMLSelectElement | null>,
    value: string
  ) => {
    if (!selectRef.current) return;

    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.whiteSpace = "pre";
    span.style.fontSize = "1.125rem";
    span.style.fontFamily = "Inter, Arial, Helvetica, sans-serif";

    const longestOption = Array.from(selectRef.current.options)
      .map((option) => option.text)
      .reduce((a, b) => (a.length > b.length ? a : b), "");
    span.textContent =
      value || longestOption || selectRef.current.options[0]?.text || "";
    document.body.appendChild(span);

    const width = span.offsetWidth + 80;
    selectRef.current.style.width = `${Math.max(width, 150)}px`;
    document.body.removeChild(span);
  };

  // Điều chỉnh độ rộng khi giá trị thay đổi
  useEffect(() => {
    adjustInputWidth(fullNameRef, step1.fullName || "");
  }, [step1.fullName]);

  useEffect(() => {
    adjustInputWidth(ageRef, step1.age?.toString() || "");
  }, [step1.age]);

  useEffect(() => {
    adjustSelectWidth(cityRef, step1.city || "");
  }, [step1.city]);

  useEffect(() => {
    adjustSelectWidth(jobGroupRef, step1.jobGroup || "");
  }, [step1.jobGroup]);

  useEffect(() => {
    adjustInputWidth(customJobRef, step1.customJob || "");
  }, [step1.customJob]);

  // Xử lý dữ liệu và chuyển sang bước kế tiếp
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(Number(step1.age)) || step1.age <= 0) {
      setErrorMessage("Vui lòng điền số tuổi phù hợp!");
      return;
    }

    if (step1.jobGroup == "other" && !step1.customJob) {
      setErrorMessage("Vui lòng điền thông tin công việc khác!");
      return;
    }

    if (!step1.fullName || !step1.city || !step1.jobGroup) {
      setErrorMessage("Vui lòng điền/chọn đầy đủ thông tin!");
    } else {
      setCurrentStep(2);
      setErrorMessage(null);
    }
  };

  // Đóng modal thông báo lỗi
  const closeModal = () => {
    setErrorMessage(null);
  };

  return (
    <>
      <div className="min-h-screen bg-custom-peach flex items-center justify-center p-4">
        <div className="bg-white shadow-lg max-w-md w-full p-6 flex flex-col items-center">
          <h2 className="text-2xl text-center mb-6">Bước 1</h2>
          <form onSubmit={handleSubmit}>
            <div className="text-center text-gray-800 mb-6">
              <p className="text-lg font-bold">
                Xin chào! Tên tôi là{" "}
                <input
                  type="text"
                  value={step1.fullName || ""}
                  onChange={(e) => {
                    setFormData({
                      step1: { ...step1, fullName: e.target.value },
                    });
                    adjustInputWidth(fullNameRef, e.target.value);
                  }}
                  ref={fullNameRef}
                  className="inline-block text-lg font-bold border-b-2  border-gray-300 focus:border-pink-500 outline-none text-center bg-transparent"
                  placeholder="Họ tên"
                />
                ,{" "}
                <input
                  type="number"
                  value={step1.age || ""}
                  onChange={(e) => {
                    setFormData({
                      step1: { ...step1, age: Number(e.target.value) },
                    });
                    adjustInputWidth(ageRef, e.target.value);
                  }}
                  ref={ageRef}
                  className="inline-block border-b-2  border-gray-300 focus:border-pink-500 outline-none text-center bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Tuổi"
                  style={{ appearance: "textfield" }}
                />
                tuổi. <br />
                Tôi đang sinh sống và làm việc tại{" "}
                <select
                  value={step1.city || ""}
                  onChange={(e) => {
                    setFormData({ step1: { ...step1, city: e.target.value } });
                    adjustSelectWidth(cityRef, e.target.value);
                  }}
                  ref={cityRef}
                  className="inline-block border-b-2  border-gray-300 focus:border-pink-500 outline-none text-center bg-transparent appearance-none pr-1"
                >
                  <option className="text-lg font-bold" value="" disabled>
                    Chọn thành phố
                  </option>
                  {PROVINCES.map((province) => (
                    <option
                      className="text-lg font-bold"
                      key={province}
                      value={province}
                    >
                      {province}
                    </option>
                  ))}
                </select>
                . Công việc hiện tại là{" "}
                <select
                  value={step1.jobGroup || ""}
                  onChange={(e) => {
                    setFormData({
                      step1: { ...step1, jobGroup: e.target.value },
                    });
                    adjustSelectWidth(jobGroupRef, e.target.value);
                  }}
                  ref={jobGroupRef}
                  className="inline-block border-b-2  border-gray-300 focus:border-pink-500 outline-none text-center bg-transparent appearance-none pr-1"
                >
                  <option className="text-lg font-bold" value="" disabled>
                    Chọn công việc
                  </option>
                  {JOB_GROUPS.map((job) => (
                    <option
                      className="text-lg font-bold"
                      key={job.value}
                      value={job.value}
                    >
                      {job.label}
                    </option>
                  ))}
                </select>
                {step1.jobGroup === "other" && (
                  <>
                    {" "}
                    <input
                      type="text"
                      value={step1.customJob || ""}
                      onChange={(e) => {
                        setFormData({
                          step1: { ...step1, customJob: e.target.value },
                        });
                        adjustInputWidth(customJobRef, e.target.value);
                      }}
                      ref={customJobRef}
                      className="inline-block border-b-2  border-gray-300 focus:border-pink-500 outline-none text-center bg-transparent"
                      placeholder="Công việc khác"
                    />
                  </>
                )}
                .
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 bg-pink-200 text-gray-800 hover:bg-pink-300 transition font-semibold flex items-center"
              >
                Tiếp theo
                <FaArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </form>
          {/* Ảnh dưới của step 1 */}
          <div className="mb-6 mt-2">
            <Image
              src={conversationIllustration}
              alt="Conversation Illustration"
              width={300}
              height={300}
              className="mx-auto"
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
