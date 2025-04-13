import { JSX } from "react";
import LinkCarousel from "../Common/LinkCarousel";

interface Feedback {
  status: string;
  message: string;
  type?: "savings" | "emergencyFund" | "debt" | "insurance" | "budget";
  iconType?: "veryGood" | "good" | "ok" | "notGood";
  link?: {
    links?: Array<{ url: string; text: string }>;
    url?: string;
    text?: string;
  };
  bgColor: string;
}

interface FeedbackCardProps {
  feedback: Feedback;
}

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
  const iconMap: { [key: string]: JSX.Element } = {
    veryGood: (
      <svg width="72" height="72" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="#d6f0d6"
          stroke="#000000"
          strokeWidth="2"
        />
        <path
          d="M35,45 Q50,65 65,45"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />
        <circle cx="35" cy="35" r="5" fill="currentColor" />
        <circle cx="65" cy="35" r="5" fill="currentColor" />
      </svg>
    ),
    good: (
      <svg width="72" height="72" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="#ffffcc"
          stroke="#000000"
          strokeWidth="2"
        />
        <path
          d="M35,60 Q50,70 65,60"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />
        <circle cx="35" cy="40" r="5" fill="currentColor" />
        <circle cx="65" cy="40" r="5" fill="currentColor" />
      </svg>
    ),
    ok: (
      <svg width="72" height="72" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="#ffcccc"
          stroke="#000000"
          strokeWidth="2"
        />
        <line
          x1="35"
          y1="60"
          x2="65"
          y2="60"
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle cx="35" cy="40" r="5" fill="currentColor" />
        <circle cx="65" cy="40" r="5" fill="currentColor" />
      </svg>
    ),
    notGood: (
      <svg width="72" height="72" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="#ffcccc"
          stroke="#000000"
          strokeWidth="2"
        />
        <path
          d="M35,65 Q50,55 65,65"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />
        <circle cx="35" cy="40" r="5" fill="currentColor" />
        <circle cx="65" cy="40" r="5" fill="currentColor" />
      </svg>
    ),
  };

  // Validate iconType
  if (!feedback.iconType || !iconMap[feedback.iconType]) {
    console.warn(
      `Invalid or missing iconType: ${feedback.iconType}, defaulting to 'ok'`
    );
  }

  return (
    <div className="flex my-6">
      <div className="flex w-full">
        <div className="w-3/10 flex flex-col items-center justify-center h-full">
          <div
            className="p-4 flex flex-col items-center justify-center rounded-lg"
            style={{ backgroundColor: feedback.bgColor }}
          >
            {iconMap[feedback.iconType || "ok"]}
            <p className="text-center text-sm font-bold text-black mt-2">
              {feedback.status}
            </p>
          </div>
        </div>
        <div className="w-7/10">
          <p
            className="text-lg font-semibold"
            dangerouslySetInnerHTML={{ __html: feedback.message }}
          />
          {feedback.link && (
            <div className="w-full mt-3">
              {feedback.link.links && feedback.link.links.length > 0 ? (
                <LinkCarousel items={feedback.link.links} />
              ) : (
                // Link đơn
                <div className="flex justify-center">
                  <div
                    className="link-feedback-card rounded-lg px-3 py-1 text-center w-full bg-pink-100"
                    style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                  >
                    <a
                      href={feedback.link.url}
                      className="text-base font-semibold block text-black"
                    >
                      {feedback.link.text}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
