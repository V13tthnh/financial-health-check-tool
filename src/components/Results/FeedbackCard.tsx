import { JSX } from "react";
import LinkCarousel from "../Common/LinkCarousel";
import Image from "next/image";

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
      <Image
        src="/images/icon-rat-tot.png"
        alt="Rất tốt"
        width={72}
        height={72}
        style={{ objectFit: "contain" }}
        unoptimized={true}
        priority={true}
      />
    ),
    good: (
      <Image
        src="/images/icon-tot.png"
        alt="Tốt"
        width={72}
        height={72}
        style={{ objectFit: "contain" }}
        unoptimized={true}
        priority={true}
      />
    ),
    ok: (
      <Image
        src="/images/icon-tam-on.png"
        alt="Tạm ổn"
        width={72}
        height={72}
        style={{ objectFit: "contain" }}
        unoptimized={true}
        priority={true}
      />
    ),
    notGood: (
      <Image
        src="/images/icon-chua-tot.png"
        alt="Chưa tốt"
        width={72}
        height={72}
        style={{ objectFit: "contain" }}
        unoptimized={true}
        priority={true}
      />
    ),
  };

  // Validate iconType
  if (!feedback.iconType || !iconMap[feedback.iconType]) {
    console.warn(
      `Invalid or missing iconType: ${feedback.iconType}, defaulting to 'ok'`
    );
  }

  return (
    <div className="feedback-card my-6 mb-10 mt-10">
      <div className="flex flex-col md:flex-row w-full">
        <div className="icon-container flex flex-col items-center justify-center md:w-3/10">
          <div
            className="p-4 flex flex-col items-center justify-center rounded-lg"
            style={{ backgroundColor: feedback.bgColor }}
          >
            {iconMap[feedback.iconType || "ok"]}
            <p className="text-center text-lg font-bold text-black mt-2">
              {feedback.status}
            </p>
          </div>
        </div>
        <div className="content-container md:w-7/10 mt-4 md:mt-0">
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
