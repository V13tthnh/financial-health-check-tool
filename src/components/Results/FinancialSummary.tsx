import React from "react";

interface FinancialSummaryProps {
  yearsToRetirement: number;
  fiNumber: number;
  currentYear: number;
  expenses: number;
  adviceText: string;
  formatCurrency: (number: number) => string;
}

export default function FinancialSummary({
  yearsToRetirement,
  fiNumber,
  currentYear,
  expenses,
  adviceText,
  formatCurrency,
}: FinancialSummaryProps) {
  return (
    <>
      <h3 className="font-bold text-lg mb-3">
        Bạn muốn đạt tự do tài chính (FI) trong{" "}
        <span className="font-bold tab-2-number">{yearsToRetirement} năm</span>{" "}
        với mức chi tiêu hàng tháng là{" "}
        <span className="font-bold tab-2-number">
          {formatCurrency(expenses)}
        </span>
        .
      </h3>
      <hr className="stick my-4 border-gray-300" />
      <h3 className="font-bold text-lg mb-3">
        Với thông tin này, con số tự do tài chính FI của bạn là{" "}
        <span className="font-bold tab-2-number">
          {formatCurrency(fiNumber)}
        </span>
        . Đây là số tiền bạn cần tích lũy được tại thời điểm{" "}
        <span className="font-bold tab-2-number">
          {currentYear + yearsToRetirement}
        </span>
        .
      </h3>
      <div className="p-4 rounded-md mb-4 border border-gray-400">
        <p className="font-semibold text-gray-800">{adviceText}</p>
      </div>
    </>
  );
}