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
      const originalStyles: Record<
        string,
        {
          visibility: string;
          position: string;
          display: string;
          top: string;
          left: string;
          zIndex: string;
        }
      > = {};

      // Lưu trữ style ban đầu và đảm bảo hiển thị
      targetIds.forEach((targetId) => {
        const element = document.getElementById(targetId);
        if (element) {
          originalStyles[targetId] = {
            visibility: element.style.visibility || "visible",
            position: element.style.position || "relative",
            display: element.style.display || "block",
            top: element.style.top || "auto",
            left: element.style.left || "auto",
            zIndex: element.style.zIndex || "auto",
          };
          // Đặt style để hiển thị rõ ràng
          element.style.visibility = "visible";
          element.style.position = "relative";
          element.style.display = "block";
          element.style.top = "0";
          element.style.left = "0";
          element.style.zIndex = "1";
        }
      });

      // Chụp ảnh song song
      const imagePromises = targetIds.map(async (targetId) => {
        const element = document.getElementById(targetId);
        if (!element) {
          console.error(`Element with ID "${targetId}" not found.`);
          return null;
        }

        // Đợi DOM render hoàn tất
        await new Promise((resolve) => setTimeout(resolve, 100));

        try {
          const blob = await domtoimage.toBlob(element, {
            bgcolor: "#ffffff",
            useCORS: true,
            cacheBust: true, // Tránh cache ảnh
          });
          return blob;
        } catch (error) {
          console.error(
            `Failed to create Blob for element "${targetId}":`,
            error
          );
          return null;
        }
      });

      const blobs = await Promise.all(imagePromises);

      // Khôi phục style ngay lập tức
      targetIds.forEach((targetId) => {
        const element = document.getElementById(targetId);
        if (element) {
          element.style.visibility = originalStyles[targetId].visibility;
          element.style.position = originalStyles[targetId].position;
          element.style.display = originalStyles[targetId].display;
          element.style.top = originalStyles[targetId].top;
          element.style.left = originalStyles[targetId].left;
          element.style.zIndex = originalStyles[targetId].zIndex;
        }
      });

      // Tải xuống các ảnh hợp lệ
      blobs.forEach((blob: Blob | null, index: number) => {
        if (blob) {
          const link = document.createElement("a");
          const url = URL.createObjectURL(blob);
          link.href = url;
          link.download = `${fileName}_part${index + 1}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      });

      if (blobs.some((blob: Blob | null) => !blob)) {
        alert("Có lỗi xảy ra khi tạo một số ảnh. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo bản tải xuống:", error);
      alert("Đã xảy ra lỗi khi tải xuống. Vui lòng thử lại.");
    } finally {
      setIsDownloading(false);
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
          onTouchStart={handleDownload} 
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
