interface FinancialData {
  income: number;
  expenses: number;
  emergencyFund: number;
  retirementAge: number;
  currentAge: number;
  monthlySpendingGoal: number;
}

interface Feedback {
  status: string;
  message: string;
  type?: "savings" | "emergencyFund" | "debt" | "insurance" | "budget";
  iconType?: "veryGood" | "good" | "ok" | "notGood";
  link?: { url: string; text: string };
  bgColor: string;
}

export function calculateFinancialSituation(data: FinancialData): {
  yearsToRetirement: number;
  savingsRate: string;
  fiNumber: number;
} {
  const yearsToRetirement = data.retirementAge - data.currentAge;
  const savingsRate = ((data.income - data.expenses) / data.income) * 100 || 0;
  const fiNumber = data.monthlySpendingGoal * 12 * 25; // Quy tắc 4%
  return { yearsToRetirement, savingsRate: savingsRate.toFixed(2), fiNumber };
}

export function calculateInvestmentOptions(
  fiNumber: number,
  years: number
): number[] {
  const rates = [0.05, 0.08, 0.1];
  const monthsPerYear = 12;
  const totalMonths = years * monthsPerYear;

  return rates.map((rate) => {
    const monthlyRate = rate / monthsPerYear;
    const monthlyContribution =
      (fiNumber * monthlyRate) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return Math.round(monthlyContribution);
  });
}

export function getSavingsFeedback(rate: number): Feedback {
  const link = {
    url: "https://moneywithmina.com/tai-chinh-danh-cho-nhom-lao-dong-pho-thong-tap-3/",
    text: "Tài chính cho nhóm lao động phổ thông",
  };
  if (rate >= 30)
    return {
      status: "Rất tốt",
      message:
        "Bạn đang tiết kiệm với tỷ lệ tuyệt vời. Tiếp tục duy trì kỷ luật với tỷ lệ tiết kiệm này để có thể hoàn thành mục tiêu nghỉ hưu sớm (FIRE) nhé!",
      bgColor: "rgb(209, 250, 229)", // Equivalent to bg-green-100
      type: "savings",
      iconType: "veryGood",
    };
  if (rate >= 20)
    return {  
      status: "Tốt",
      message:
        "Bạn đang tiết kiệm khá tốt. Chỉ cần kiên trì với kỷ luật thép, bạn sẽ tiến gần hơn với mục tiêu Độc lập tài chính của mình.",
      bgColor: "rgb(209, 250, 229)", // bg-green-100
      type: "savings",
      iconType: "good",
    };
  if (rate >= 10)
    return {
      status: "Tạm ổn",
      message:
        "Bạn đang tiết kiệm với tỷ lệ trung bình, bạn có thể tăng tỷ lệ tiết kiệm ít nhất 20% mỗi tháng, mục tiêu ĐLTC sẽ đến gần với bạn hơn, bạn nhé.",
      bgColor: "rgb(254, 243, 199)", // bg-yellow-100
      type: "savings",
      iconType: "ok",
      link,
    };
  if (rate > 5)
    return {
      status: "Chưa tốt",
      message:
        "Bạn đang tiết kiệm với tỷ lệ thấp, bạn có thể tăng tỷ lệ tiết kiệm ít nhất 20% mỗi tháng, mục tiêu ĐLTC sẽ đến gần với bạn hơn, bạn nhé.",
      bgColor: "#fa9496", // bg-orange-100
      type: "savings",
      iconType: "notGood",
      link,
    };
  return {
    status: "Chưa tốt",
    message:
      "Bạn chưa tiết kiệm được nhiều, bạn chỉ cần cố gắng thêm một chút thôi. Nếu bạn không tiết kiệm được ít nhất 5% mỗi tháng, đồng nghĩa bạn đang sống quá khả năng của mình. Bạn có thể tìm hiểu các cách thu nhập đa chiều để tăng dòng thu của mình nhé.",
    bgColor: "#fa9496", // bg-red-100
    type: "savings",
    iconType: "notGood",
    link,
  };
}

export function getEmergencyFundFeedback(
  fund: number,
  income: number,
  hasEmergencyFund: string
): Feedback {
  const threeMonths = income * 3;
  if (fund >= threeMonths && hasEmergencyFund === "yes")
    return {
      status: "Tốt",
      message:
        "Bạn đang có tối thiểu 3 tháng lương cho quỹ dự phòng của mình, chúc mừng bạn. Quỹ dự phòng sẽ giúp cho bạn giải quyết một vài sự cố trong cuộc sống như mất việc, hư xe, y tế sức khoẻ. Bạn nhớ lấp đầy quỹ trở lại đến lúc cần sử dụng quỹ nhé!",
      bgColor: "rgb(209, 250, 229)", // bg-green-100
      type: "emergencyFund",
      iconType: "good",
    };
  if (fund < threeMonths && hasEmergencyFund === "yes")
    return {
      status: "Tạm ổn",
      message:
        "Bạn chưa có tối thiểu 3 tháng lương cho quỹ dự phòng của mình, bạn cần phải dành dụm từ bây giờ nhé. Quỹ dự phòng sẽ giúp cho bạn vượt qua các sự cố bất ngờ như mất việc, hư xe, y tế sức khoẻ,...",
      bgColor: "rgb(254, 243, 199)", // bg-yellow-100
      type: "emergencyFund",
      iconType: "ok",
    };
  return {
    status: "Chưa tốt",
    message:
      "Bạn chưa có đủ quỹ dự phòng, vì thế để an tâm hơn bạn nên dành khoảng 03 - 06 tháng lương hiện tại cho quỹ. Đây là bước khởi đầu trước khi bạn mong muốn đầu tư tăng trưởng cho mục tiêu Tự Do Tài Chính của mình",
    bgColor: "#fa9496", // bg-red-100
    type: "emergencyFund",
    iconType: "notGood",
  };
}

export function getDebtFeedback(
  status: "yes" | "no" | "planning" | undefined
): Feedback {
  const link = {
    url: "https://moneywithmina.com/tai-chinh-danh-cho-nhom-lao-dong-pho-thong-tap-3/",
    text: "Quản lý nợ xấu",
  };
  if (status === "yes")
    return {
      status: "Chưa tốt",
      message: `Bạn vẫn còn có nợ, vì thế hãy giải quyết nợ một cách hiệu quả sau khi có quỹ dự phòng nhé.`,
      bgColor: "#fa9496", // bg-pink-100
      type: "debt",
      iconType: "notGood",
      link,
    };
  if (status === "planning")
    return {
      status: "Tạm ổn",
      message: `Bạn đang dự định muốn vay nợ, bạn có thể xem video tại link này cách giải quyết nợ và biết thêm về những loại nợ nên và không nên có <a href="${link.url}" class="text-blue-500 underline">${link.text}</a> để biết cách giải quyết nợ...`,
      bgColor: "rgb(254, 243, 199)", // bg-yellow-100
      type: "debt",
      iconType: "ok",
      link,
    };
  return {
    status: "Tốt",
    message: `Bạn hiện nay không có nợ, rất tốt! Nợ có thể sẽ đem đến áp lực tài chính nhưng cũng tạo kỷ luật cho bạn nếu bạn biết sử dụng nợ một cách hiệu quả, nhằm mục đích xây dựng tài sản cho mình trong tương lai. Trong video sau, bạn có thể xem những loại nợ không nên có Xem thêm về các loại nợ không nên có.`,
    bgColor: "rgb(209, 250, 229)", // bg-green-100
    type: "debt",
    iconType: "good",
    link,
  };
}

export function getInsuranceFeedback(
  status: "yes" | "no" | undefined
): Feedback {
  const link = {
    url: "https://moneywithmina.com/chuyen-gia-tai-chinh-chi-ra-4-truong-hop-can-tinh-toan-tham-gia-bao-hiem/",
    text: "Chuyên gia tài chính chỉ ra 4 trường hợp cần tuyệt đối tham gia bảo hiểm",
  };
  if (status === "yes")
    return {
      status: "Tốt",
      message:
        "Bạn đang góp tiền bảo hiểm hàng tháng, rất tốt! Nếu là bảo hiểm nhân thọ có kèm chi phí y tế và liên kết đầu tư, bạn cần xem lại các lợi ích chính như y tế nằm viện, bệnh hiểm nghèo, qua đời và đặc biệt chú ý mức lương hưu trí sau thời hạn góp của mình là bao nhiêu nhé.",
      bgColor: "rgb(209, 250, 229)", // bg-green-100
      type: "insurance",
      iconType: "good",
    };
  return {
    status: "Chưa tốt",
    message: `Bạn chưa mua bảo hiểm, việc này có thể ảnh hưởng đến mục tiêu Tự Do Tài Chính của bạn. Vì nếu có vấn đề xảy ra với sức khoẻ của bạn và gia đình, có thể bạn cần phải bán tài sản hoặc cắt lỗ đầu tư để lo phần tài chính. Cho những ai cần phải nghĩ đến bảo hiểm sức khoẻ.`,
    bgColor: "#fa9496", 
    type: "insurance",
    iconType: "notGood",
    link,
  };
}

export function getBudgetRuleFeedback(
  income: number,
  needs: number,
  wants: number,
  expenses: number
): Feedback {
  const needsPercentage = income ? (needs / income) * 100 : 0;
  const wantsPercentage = income ? (wants / income) * 100 : 0;
  const savingsPercentage = income ? ((income - expenses) / income) * 100 : 0;
  const isNeedsOk = needsPercentage <= 55 && needsPercentage >= 45;
  const isWantsOk = wantsPercentage <= 35 && wantsPercentage >= 25;
  const isSavingsOk = savingsPercentage >= 15;
  const link = {
    links: [
      {
        url: "https://moneywithmina.com/quan-ly-tai-chinh-co-nhat-thiet-phai-ghi-chep-lai-chi-tieu-hang-ngay-hay-thu-phuong-phap-zero-sum-budget/",
        text: "Quản lý tài chính với Zero-sum Budget",
      },
      {
        url: "https://moneywithmina.com/quan-ly-tai-chinh-co-nhat-thiet-phai-ghi-chep-lai-chi-tieu-hang-ngay-hay-thu-phuong-phap-zero-sum-budget/",
        text: "Cách ghi chép chi tiêu hiệu quả",
      },
      {
        url: "https://moneywithmina.com/khi-nao-nen-mua-tra-gop-va-khi-nao-nen-tra-dut/",
        text: "Khi nào nên mua trả góp?",
      },
    ],
  };

  if (isNeedsOk && isWantsOk && isSavingsOk) {
    return {
      status: "Tốt",
      message: "Bạn đã phân bổ chi tiêu theo quy tắc 50-30-20, rất tốt!",
      bgColor: "rgb(209, 250, 229)",
      type: "budget",
      iconType: "good",
    };
  }
  return {
    status: "Chưa tốt",
    message: `Chi phí bạn liệt kê cho thấy rằng bạn vẫn chưa rõ về quy tắc 50-30-20 (Cần-Muốn-Tiết Kiệm). Việc phân bổ chi tiêu sẽ không được tối ưu hiệu quả. Các bài viết sau có thể hướng dẫn bạn tốt hơn về chi tiêu và ngân sách của mình.`,
    bgColor: "#fa9496",
    type: "budget",
    iconType: "notGood",
    link,
  };
}

export const calculateSavingsRate = (financialData: FinancialData): number => {
  return financialData.income > 0
    ? ((financialData.income - financialData.expenses) / financialData.income) *
        100
    : 0;
};

export const getFinancialAdvice = (
  yearsToRetirement: number,
  savingsRate: number
): string => {
  let adviceText = "";

  if (yearsToRetirement < 5) {
    if (savingsRate < 20) {
      adviceText =
        "Bạn đang tiết kiệm với tỷ lệ trung bình dưới 20%/tháng, và kế hoạch khá ngắn dưới 5 năm để đạt TDTC. Bạn có thể phải đầu tư vào các kênh rủi ro hơn để dòng tiền tăng trưởng nhanh hơn. Vì thế bạn cần tăng thời hạn & tỷ lệ tiết kiệm để bạn có thể an tâm đạt con số FI, bạn nhé!";
    } else if (savingsRate > 20 && savingsRate <= 31) {
      adviceText =
        "Bạn đang tiết kiệm với tỷ lệ rất tốt trên 20%/tháng, nhưng kế hoạch khá ngắn dưới 5 năm để đạt TDTC. Bạn có thể phải đầu tư vào các kênh rủi ro hơn để dòng tiền tăng trưởng nhanh hơn. Vì thế bạn cần tăng thời hạn tiết kiệm để bạn có thể an tâm đạt con số FI, bạn nhé!";
    } else if (savingsRate > 31) {
      adviceText =
        "Bạn đang tiết kiệm với tỷ lệ tuyệt vời trên 30%/tháng, nhưng kế hoạch khá ngắn dưới 5 năm để đạt TDTC. Bạn có thể phải đầu tư vào các kênh rủi ro hơn để dòng tiền tăng trưởng nhanh hơn. Vì thế bạn cần tăng thời hạn tiết kiệm để bạn có thể an tâm đạt con số FI, bạn nhé.";
    }
  } else if (yearsToRetirement >= 5 && yearsToRetirement <= 10) {
    if (savingsRate < 20) {
      adviceText =
        "Bạn đang tiết kiệm với tỷ lệ trung bình dưới 20%/tháng, và kế hoạch ngắn dưới 10 năm để đạt TDTC. Bạn có thể phải đầu tư vào các kênh rủi ro hơn để dòng tiền tăng trưởng nhanh hơn. Vì thế bạn cần tăng thời hạn & tỷ lệ tiết kiệm để bạn có thể an tâm đạt con số FI, bạn nhé!";
    } else if (savingsRate >= 20 && savingsRate <= 31) {
      adviceText =
        "Bạn đang tiết kiệm với tỷ lệ rất tốt trên 20%/tháng, nhưng kế hoạch khá ngắn dưới 10 năm để đạt TDTC. Bạn có thể phải đầu tư vào các kênh rủi ro hơn để dòng tiền tăng trưởng nhanh hơn. Vì thế bạn cần tăng thời hạn tiết kiệm để bạn có thể an tâm đạt con số FI, bạn nhé!";
    } else if (savingsRate > 31) {
      adviceText =
        "Bạn đang tiết kiệm với tỷ lệ tuyệt vời trên 30%/tháng, nhưng kế hoạch khá ngắn dưới 10 năm để đạt TDTC. Bạn có thể phải đầu tư vào các kênh rủi ro hơn để dòng tiền tăng trưởng nhanh hơn. Vì thế bạn cần tăng thời hạn tiết kiệm để bạn có thể an tâm đạt con số FI, bạn nhé!";
    }
  } else if (yearsToRetirement > 10) {
    if (savingsRate < 20) {
      adviceText =
        "Bạn đang tiết kiệm với tỷ lệ trung bình dưới 20%/tháng, nhưng kế hoạch tốt trên 10 năm để đạt TDTC. Duy trì kỷ luật đầu tư lâu dài và ổn định để tiến gần với con số FI của mình. Đừng quên tăng thu giảm chi để hoàn thành mục tiêu FIRE (hưu sớm) nhé!";
    } else if (savingsRate >= 20 && savingsRate <= 31) {
      adviceText =
        "Bạn đang tiết kiệm với tỷ lệ rất tốt trên 20%/tháng, và kế hoạch dài hạn tốt trên 10 năm để đạt TDTC. Nếu bạn tăng tốc trong việc kiếm thêm thu nhập phụ và tăng tỷ lệ tiết kiệm đầu tư, có thể bạn sẽ trở thành FIRE (hưu sớm) đấy nhé!";
    } else if (savingsRate > 31) {
      adviceText =
        "Bạn đang tiết kiệm với tỷ lệ tuyệt vời trên 30%/tháng, và kế hoạch dài hạn tốt trên 10 năm để đạt TDTC. Nếu bạn tăng tốc trong việc kiếm thêm thu nhập phụ và tăng tỷ lệ tiết kiệm đầu tư, có thể bạn sẽ trở thành FIRE (hưu sớm) đấy nhé!";
    }
  }
  return adviceText;
};

export const calculateRealEstateFutureValue = (
  financialData: FinancialData
): number => {
  const monthlyIncome = financialData.income;
  const monthlySavingsRate = 0.2; // 20%
  const annualInterestRate = 0.08; // 8%
  const investmentYears = 10;
  const numberOfMonths = investmentYears * 12;
  const monthlyInterestRate = annualInterestRate / 12;
  const monthlyInvestment = monthlyIncome * monthlySavingsRate;

  return (
    monthlyInvestment *
    ((Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1) /
      monthlyInterestRate)
  );
};
