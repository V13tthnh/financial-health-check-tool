import React from "react";

interface RealEstateAdviceProps {
  futureValue: number;
  formatCurrency: (number: number) => string;
}

export default function RealEstateAdvice({
  futureValue,
  formatCurrency,
}: RealEstateAdviceProps) {
  return (
    <h3 className="font-bold text-lg mb-3">
      Nếu muốn sở hữu một bất động sản, ví dụ sau 10 năm nếu bạn tiết kiệm 20%
      dòng thu của mình với lợi nhuận 8%/năm, bạn sẽ có số vốn {" "}
      <span className="font-bold tab-2-number">{formatCurrency(futureValue)}</span>{" "}
      để góp cho căn hộ đầu tiên của mình
    </h3>
  );
}