import React from "react";

interface InvestmentOptionsProps {
  contributions: number[];
  formatCurrency: (number: number) => string;
}

export default function InvestmentOptions({
  contributions,
  formatCurrency,
}: InvestmentOptionsProps) {
  return (
    <div className="p-4 rounded-md mb-4 border font-semibold border-gray-400">
      <p className="mb-3">
        Với 5%, bạn cần góp{" "}
        <span className="font-bold">{formatCurrency(contributions[0])}</span> /
        tháng. Vd: mở sổ tiết kiệm tại ngân hàng…
      </p>
      <p className="mb-3">
        Với 8%, bạn cần góp{" "}
        <span className="font-bold">{formatCurrency(contributions[1])}</span> /
        tháng. Vd: mua bảo hiểm nhân thọ, trái phiếu chính phủ….
      </p>
      <p>
        Với 10%, bạn cần góp{" "}
        <span className="font-bold">{formatCurrency(contributions[2])}</span> /
        tháng. Vd: chứng chỉ quỹ, cổ phiếu….
      </p>
    </div>
  );
}