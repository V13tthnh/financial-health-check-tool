import { useState } from "react";
import Image from "next/image";
import Tab1Content from "./Tab1Content";
import Tab2Content from "./Tab2Content";
import { useFormContext } from "@/lib/context/FormContext";
import financialPlanning from "@/public/images/Notes-cuate.png";

interface FormData {
  step1: { fullName: string; age: number };
  step2: string[];
  step3: {
    income: number;
    expenses: number;
    emergencyFund: number;
    debtStatus: "yes" | "no" | "planning" | undefined;
    insurance: "yes" | "no" | undefined;
    needs: number;
    wants: number;
    hasEmergencyFund: string;
  };
  step4: { retirementAge: number };
}

export default function CurrentFinancialSituation() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const { formData } = useFormContext() as { formData: FormData };
  const currentYear = new Date().getFullYear();

  return (
    <div className="result-background min-h-screen bg-pink-100 flex flex-col items-center">
      {/* Header */}
      <div className="result-header w-full bg-pink-200 py-6 px-4 mb-6">
        <div className="max-w-6xl mx-auto grid grid-cols-12 items-center gap-4">
          <div className="col-span-12 md:col-span-7 text-center md:text-left">
            <div className="text-3xl md:text-5xl font-bold text-white">
              Cảm ơn {formData.step1.fullName} đã chia sẻ những thông tin bổ
              ích.
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 flex justify-center md:justify-end">
            <div className="relative h-50 w-full max-w-[300px] md:h-48 md:max-w-[400px]">
              <Image
                src={financialPlanning}
                alt="Financial Planning Illustration"
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl px-4 mb-6">
        {/* Tab Buttons */}
        <div className="w-full flex gap-4">
          <button
            className={`button-tab-1 ${
              activeTab === 1 ? "active" : "inactive"
            }`}
            onClick={() => setActiveTab(1)}
          >
            Kết quả 1:
            <br /> Hoàn cảnh tài chính hiện tại
          </button>
          <button
            className={`button-tab-2 ${
              activeTab === 2 ? "active" : "inactive"
            }`}
            onClick={() => setActiveTab(2)}
          >
            Kết quả 2:
            <br /> Đường lên đỉnh Tự Do Tài chính
          </button>
        </div>

        {/* Content Tabs */}
        <div className="w-full bg-white p-6 rounded-lg shadow-md relative">
          <div
            className="vertical-stick absolute inset-y-0 left-1/2 w-px bg-gray-300 hidden md:block"
            style={{
              transform: "translateX(-50%)",
              height: "100%",
            }}
          ></div>

          {/* Tab 1 */}
          <div
            id="tab1-content"
            style={{
              display: activeTab === 1 ? "block" : "none", // Sử dụng display thay vì visibility
            }}
          >
            <Tab1Content formData={formData} />
          </div>

          {/* Tab 2 */}
          <div
            id="tab2-content"
            style={{
              display: activeTab === 2 ? "block" : "none", // Sử dụng display thay vì visibility
            }}
          >
            <Tab2Content formData={formData} currentYear={currentYear} />
          </div>
        </div>
      </div>
    </div>
  );
}
