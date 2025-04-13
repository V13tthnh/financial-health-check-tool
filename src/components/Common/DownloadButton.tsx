import domtoimage from "dom-to-image";
import { FaArrowDown } from "react-icons/fa";
import { useState } from "react";

interface DownloadButtonProps {
  fileName: string;
  targetIds: string[];
  format: "image";
}

export default function DownloadButton({
  fileName,
  targetIds,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      // Xử lý từng phần tử một thay vì song song
      for (let i = 0; i < targetIds.length; i++) {
        const targetId = targetIds[i];
        const element = document.getElementById(targetId);
        if (!element) continue;

        // Lưu trữ style ban đầu
        const originalStyle = {
          visibility: element.style.visibility || "visible",
          position: element.style.position || "relative",
          display: element.style.display || "block",
          top: element.style.top || "auto",
          left: element.style.left || "auto",
          zIndex: element.style.zIndex || "auto",
        };

        // Hiển thị phần tử
        element.style.visibility = "visible";
        element.style.position = "relative";
        element.style.display = "block";
        element.style.top = "0";
        element.style.left = "0";
        element.style.zIndex = "1";

        // Đợi đảm bảo render đã hoàn tất
        await new Promise((resolve) => setTimeout(resolve, 200));

        try {
          // Chụp ảnh một phần tử tại một thời điểm
          const dataUrl = await domtoimage.toPng(element, {
            bgcolor: "#ffffff",
            cacheBust: true,
            quality: 0.8, // Giảm chất lượng để giảm kích thước
          });

          // Tải xuống ngay sau khi chụp
          downloadImage(dataUrl, `${fileName}_part${i + 1}.png`);
        } catch (error) {
          console.error(
            `Failed to create image for element "${targetId}":`,
            error
          );
        }

        // Khôi phục style ban đầu
        element.style.visibility = originalStyle.visibility;
        element.style.position = originalStyle.position;
        element.style.display = originalStyle.display;
        element.style.top = originalStyle.top;
        element.style.left = originalStyle.left;
        element.style.zIndex = originalStyle.zIndex;
      }
    } catch (error) {
      console.error("Lỗi khi tạo bản tải xuống:", error);
      alert("Đã xảy ra lỗi khi tải xuống. Vui lòng thử lại.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Hàm hỗ trợ tải xuống với hỗ trợ cho mobile
  const downloadImage = (dataUrl: string, filename: string) => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // Giải pháp cho thiết bị di động
      const image = new Image();
      image.src = dataUrl;

      const newWindow = window.open("");
      if (newWindow) {
        newWindow.document.write(image.outerHTML);
        newWindow.document.title = filename;
        newWindow.document.close();
      } else {
        alert("Vui lòng cho phép cửa sổ popup để tải ảnh xuống");
      }
    } else {
      // Giải pháp cho desktop
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex justify-center">
      <div
        className="link-feedback-card p-0 inline-block mt-5"
        style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
      >
        <button
          onClick={handleDownload}
          className={`font-bold text-lg flex items-center rounded-md transition ${
            isDownloading
              ? "opacity-50 cursor-not-allowed"
              : "hover:tab-2-number"
          }`}
          disabled={isDownloading}
          aria-label="Tải xuống ảnh"
        >
          Tải về
          <FaArrowDown className="ml-2" />
        </button>
      </div>
    </div>
  );
}
