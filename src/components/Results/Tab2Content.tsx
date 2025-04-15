import {
  calculateFinancialSituation,
  calculateInvestmentOptions,
  calculateSavingsRate,
  getFinancialAdvice,
  calculateRealEstateFutureValue,
} from "@/lib/FinancialCalculations";
import LinkCarousel from "../Common/LinkCarousel";
import FinancialSummary from "./FinancialSummary";
import InvestmentOptions from "./InvestmentOptions";
import RealEstateAdvice from "./RealEstateAdvice";
import ShareButtons from "../Common/ShareButtons";
import DownloadButton from "../Common/DownloadButton";
import Logo from "../Common/Logo";
import Image from "next/image";

interface FormData {
  step1: { age: number };
  step3: {
    income: number;
    expenses: number;
    emergencyFund: number;
  };
  step4: { retirementAge: number };
}

interface Tab2ContentProps {
  formData: FormData;
  currentYear: number;
}

interface Link {
  url: string;
  text: string;
}

const links: Link[] = [
  {
    url: "https://moneywithmina.com/2023-gen-z-lieu-co-the-tu-do-tai-chinh-tai-sao-khong/",
    text: "GenZ, liệu có thể tự do tài chính?",
  },
  {
    url: "https://moneywithmina.com/an-tam-tai-chinh-nhu-the-nao-voi-muc-luong-10-trieu-thang/",
    text: "An tâm tài chính Khi ở mức lương 10 triệu tháng",
  },
  {
    url: "https://moneywithmina.com/fire-uoc-mo-cuc-truoc-suong-sau-cua-nguoi-tre/",
    text: "Ước mơ cực trước sướng sau của người trẻ",
  },
  {
    url: "https://moneywithmina.com/nhung-dieu-ban-can-biet-sau-cac-quang-cao-lai-suat-thap-khi-vay-mua-nha/",
    text: "Lãi suất thấp khi vay mua nhà. Điều bạn cần biết",
  },
];

const formatVietnameseCurrency = (number: number): string => {
  if (number === undefined || number === null) {
    return "";
  }
  if (number >= 1000000000) {
    return `${(number / 1000000000).toFixed(
      number % 1000000000 === 0 ? 0 : 1
    )} (tỷ)`;
  }
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(
      number % 1000000 === 0 ? 0 : 1
    )} (triệu)`;
  }
  return number.toLocaleString("vi-VN");
};

export default function Tab2Content({
  formData,
  currentYear,
}: Tab2ContentProps) {
  const { step1, step3, step4 } = formData;

  const financialData = {
    income: step3.income,
    expenses: step3.expenses,
    emergencyFund: step3.emergencyFund,
    retirementAge: step4.retirementAge,
    currentAge: step1.age,
    monthlySpendingGoal: step3.expenses,
  };

  const { yearsToRetirement, fiNumber } =
    calculateFinancialSituation(financialData);
  const contributions = calculateInvestmentOptions(fiNumber, yearsToRetirement);
  const savingsRate = calculateSavingsRate(financialData);
  const adviceText = getFinancialAdvice(yearsToRetirement, savingsRate);
  const futureValueOfRealEstate = calculateRealEstateFutureValue(financialData);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Tôi muốn đạt tự do tài chính trong ${yearsToRetirement} năm với số tiền ${formatVietnameseCurrency(
    fiNumber
  )}! Cùng khám phá với Money With Mina!`;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Cột trái */}
        <div className="content-column">
          <FinancialSummary
            yearsToRetirement={yearsToRetirement}
            fiNumber={fiNumber}
            currentYear={currentYear}
            expenses={step3.expenses}
            adviceText={adviceText}
            formatCurrency={formatVietnameseCurrency}
          />
          <div className="flex justify-center">
            <LinkCarousel items={links} />
          </div>
          <hr className="stick my-4 " />
          <h3 className="font-bold text-lg mb-3">
            Ví dụ với từng kênh đầu tư đem lại lợi nhuận hàng năm khác nhau:
          </h3>
          <InvestmentOptions
            contributions={contributions}
            formatCurrency={formatVietnameseCurrency}
          />
          <div className="ml-5">
            <small className="text-black">
              * Bạn cần tham khảo các kênh đầu tư trên thị trường, tỷ lệ sinh
              lời trên chỉ có tính chất tham khảo <br />
              ** Nếu bạn không có đủ thu nhập để góp mỗi tháng, bạn có thể quay
              lại điều chỉnh thời hạn đạt mục tiêu FI cho hợp lý hơn, bạn nhé!
            </small>
          </div>
        </div>
        <div
          className="vertical-stick absolute inset-y-0 left-1/2 w-px bg-gray-300 hidden md:block"
          style={{
            transform: "translateX(-50%)",
            height: "85%",
          }}
        ></div>
        {/* Cột phải */}
        <div className="content-column">
          <div className="mb-10">
            <RealEstateAdvice
              futureValue={futureValueOfRealEstate}
              formatCurrency={formatVietnameseCurrency}
            />
            <p className="text-black font-semibold text-lg mb-3">
              Hãy cùng Money With Mina thiết kế hành trình quản lý tài chính và
              cùng thực chiến cùng bạn
            </p>
            <div className="flex justify-center">
              <div
                className="bg-pink-100 p-2 rounded-md inline-block mb-2 link-feedback-card"
                style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
              >
                <a
                  className="font-bold text-lg"
                  href="https://moneywithmina.com/khoa-hoc/"
                >
                  KHOÁ HỌC 100 NGÀY
                </a>
              </div>
            </div>
            <hr className="stick my-4" />
            <ShareButtons shareUrl={shareUrl} shareText={shareText} />
            <DownloadButton
              fileName="Tab2Content"
              targetIds={["tab1-content", "tab2-content"]}
            />
            <Logo />
          </div>
        </div>

        {/* Wrapper cho hình ảnh với overflow hidden */}
        <div className="result-image-container">
          <div className="result-image-wrapper">
            <Image
              src="/images/hinh-ket-qua-2.png"
              alt="Hình kết quả 2"
              fill
              style={{
                objectFit: "contain",
                objectPosition: "bottom right",
              }}
              priority={true}
              unoptimized={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
