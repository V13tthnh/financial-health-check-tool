import Image from "next/image";
import economicGrowth from "@/public/images/economic-growth.png";
import { FINANCIAL_GOALS } from "@/lib/Constants";
import {
  getSavingsFeedback,
  getEmergencyFundFeedback,
  getDebtFeedback,
  getInsuranceFeedback,
  getBudgetRuleFeedback,
  calculateFinancialSituation,
} from "@/lib/FinancialCalculations";
import FeedbackCard from "./FeedbackCard";

import LinkCarousel from "../Common/LinkCarousel";

// FormData Interface
interface FormData {
  step1: { age: number };
  step2: string[];
  step3: {
    income: number;
    expenses: number;
    emergencyFund: number;
    debtStatus: "yes" | "no" | "planning" | undefined;
    insurance: "yes" | "no" | undefined;
    needs: number;
    wants: number;
    hasEmergencyFund: string
  };
  step4: { retirementAge: number };
}

interface Link {
  url: string;
  text: string;
}

const links: Link[] = [
  {
    url: "https://moneywithmina.com/podcast-9-truoc-khi-dau-tu-ban-can-chuan-bi-dieu-gi/",
    text: "Trước khi đầu tư, bạn nên làm gì?",
  },
  {
    url: "https://moneywithmina.com/podcast-8-cach-toi-lap-ngan-sach-quan-ly-tai-chinh/",
    text: "Cách tôi lập ngân sách quản lý tài chính",
  },
  {
    url: "https://moneywithmina.com/podcast-5-cach-tang-dong-thu-nhap-phu-ngoai-luong-cung/",
    text: "Cách tăng dòng thu nhập phụ ngoài lương chính",
  },
  {
    url: "https://moneywithmina.com/podcast-4-tang-thu-nhap-giup-ban-rut-ngan-thoi-gian-dat-duoc-muc-tieu-an-tam-tai-chinh/",
    text: "Tăng thu nhập giúp bạn rút ngắn thời gian đạt mục tiêu tài chính",
  },
  {
    url: "https://moneywithmina.com/5-cach-tang-thu-nhap-don-gian-tu-so-thich-ca-nhan/",
    text: "5 cách tăng thu nhập đơn giản từ sở thích cá nhân",
  },
];

// Tab1Content Props
interface Tab1ContentProps {
  formData: FormData;
}

// Tab1Content Component
export default function Tab1Content({ formData }: Tab1ContentProps) {
  const { step1, step2, step3 } = formData;

  const goals = step2
    .map((value) => FINANCIAL_GOALS.find((g) => g.value === value)?.label)
    .join(", ");

  const savingsRateNum = parseFloat(
    calculateFinancialSituation({
      income: step3.income,
      expenses: step3.expenses,
      emergencyFund: step3.emergencyFund,
      retirementAge: formData.step4.retirementAge,
      currentAge: step1.age,
      monthlySpendingGoal: step3.expenses,
    }).savingsRate
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="financial-goals-feedback mb-6 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="w-3/10 flex items-center justify-center h-full">
              <Image
                src={economicGrowth}
                alt="Economic Growth"
                width={450}
                height={450}
                objectFit="contain"
              />
            </div>
            <div className="w-7/10 mt-10 mb-3">
              <h3 className="font-bold text-xl mb-2">
                Hiện tại mục tiêu tài chính của bạn là:
              </h3>
              <p className="font-bold text-2xl">{goals}</p>
              <div className="w-full flex justify-center mt-3 mb-5">
              <LinkCarousel items={links} />
              </div>
            </div>
          </div>
        </div>
        <hr className="stick my-4 border-gray-300" />
        <FeedbackCard feedback={getSavingsFeedback(savingsRateNum)} />
        <hr className="stick my-4 border-gray-300" />
        <FeedbackCard
          feedback={getEmergencyFundFeedback(step3.emergencyFund, step3.income, step3.hasEmergencyFund)}
        />
      </div>
      <div>
        <FeedbackCard feedback={getDebtFeedback(step3.debtStatus)} />
        <hr className="stick my-4 border-gray-300" />
        <FeedbackCard feedback={getInsuranceFeedback(step3.insurance)} />
        <hr className="stick my-4 border-gray-300" />
        <FeedbackCard
          feedback={getBudgetRuleFeedback(
            step3.income,
            step3.needs,
            step3.wants,
            step3.expenses
          )}
        />
      </div>
    </div>
  );
}
