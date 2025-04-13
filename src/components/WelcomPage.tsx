import Image from "next/image";

const WelcomePage = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="min-h-screen bg-custom-peach flex items-center justify-center p-4">
      <div className="bg-white shadow-lg max-w-xl w-full p-6 flex flex-col items-center">
        {/* Header*/}
        <div className="w-full flex justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="Money with Mina Logo"
            width={70}
            height={70}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Main Title */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8 w-full">
          Xin chào bạn, chúng mình cùng làm quen với nhau nào?
        </h1>

        {/* Illustration Section Image */}
        <div className="w-full flex justify-center mb-8">
          <Image
            src="/images/image-healthy-check.png"
            alt="Health Check Illustration"
            width={200}
            height={200}
          />
        </div>

        {/* Process Steps */}
        <div className="w-full flex justify-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 process-step rounded-full flex items-center justify-center text-gray-800 font-bold">
              1
            </div>
            <div className="w-12 h-1 arrow-right"></div>
            <div className="w-10 h-10 process-step rounded-full flex items-center justify-center text-gray-800 font-bold">
              2
            </div>
            <div className="w-12 h-1 arrow-right"></div>
            <div className="w-10 h-10 process-step rounded-full flex items-center justify-center text-gray-800 font-bold">
              3
            </div>
            <div className="w-12 h-1 arrow-right"></div>
            <div className="w-10 h-10 process-step rounded-full flex items-center justify-center text-gray-800 font-bold">
              4
            </div>
          </div>
        </div>

        {/* Start Button*/}
        <div className="w-full flex justify-center mb-8">
          <button
            onClick={onStart}
            className="px-6 py-3 hover:bg-pink-600 transition font-bold"
          >
            Bắt đầu khám sức khỏe tài chính
          </button>
        </div>

        {/* Note Section */}
        <div className="w-full text-center text-gray-700 text-sm">
          <p>
            <span className="font-semibold">Lưu ý:</span> Bạn sẽ nhận kết quả
            chỉ sau 4 bước điền thông tin. Kết quả bao gồm nhận xét tình hình
            tài chính của bạn, và mục tiêu đạt tự do tài chính của bạn có khả
            thi hay không.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
