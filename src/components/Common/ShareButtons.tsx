import Image from "next/image";
import { useEffect } from "react";

interface ShareButtonsProps {
  shareUrl: string;
  shareText: string;
}

export default function ShareButtons({
  shareUrl,
  shareText,
}: ShareButtonsProps) {
  // Cập nhật thẻ OG khi component được tải
  useEffect(() => {
    // Đảm bảo thẻ OG được cập nhật khi component mount
    if (typeof document !== "undefined") {
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute("content", shareText);
      }

      // Cập nhật thẻ title nếu cần
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute("content", "Money With Mina - Tự Do Tài Chính");
      }

      // Cập nhật thẻ og:url
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute("content", shareUrl);
      }
    }
  }, [shareText, shareUrl]);

  const handleFacebookShare = () => {
    // Sử dụng cú pháp chính xác của Facebook
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}&quote=${encodeURIComponent(shareText)}`;

    // Mở cửa sổ chia sẻ với kích thước phù hợp
    window.open(
      facebookUrl,
      "facebook-share-dialog",
      "width=626,height=436,scrollbars=yes"
    );
  };

  const handleZaloShare = () => {
    const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(zaloUrl, "_blank", "width=600,height=400");
  };

  const handleMessengerShare = () => {
    // Sử dụng phương thức chia sẻ Messenger đơn giản hơn nếu không có App ID
    const messengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
      shareUrl
    )}&redirect_uri=${encodeURIComponent(shareUrl)}`;
    window.open(messengerUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="text-center mb-5">
      <p className="text-lg font-bold text-black mb-2">Chia sẻ ngay</p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleFacebookShare}
          className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center hover:bg-pink-300 transition relative overflow-hidden"
          aria-label="Chia sẻ lên Facebook"
        >
          <Image
            src="/images/icon-facebook.png"
            alt="Facebook Logo"
            fill
            sizes="48px"
            style={{ objectFit: "cover" }}
            unoptimized={true}
          />
        </button>
        <button
          onClick={handleZaloShare}
          className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center hover:bg-pink-300 transition relative overflow-hidden"
          aria-label="Chia sẻ qua Zalo"
        >
          <Image
            src="/images/icon-zalo.png"
            alt="Zalo Logo"
            fill
            sizes="48px"
            style={{ objectFit: "cover" }}
            unoptimized={true}
          />
        </button>
        <button
          onClick={handleMessengerShare}
          className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center hover:bg-pink-300 transition relative overflow-hidden"
          aria-label="Chia sẻ qua Messenger"
        >
          <Image
            src="/images/icon-messenger.png"
            alt="Messenger Logo"
            fill
            sizes="48px"
            style={{ objectFit: "cover" }}
            unoptimized={true}
          />
        </button>
      </div>
    </div>
  );
}
