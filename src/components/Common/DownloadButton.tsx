import * as htmlToImage from "html-to-image";
import { FaArrowDown } from "react-icons/fa";
import { useState, useCallback, useRef } from "react";

interface DownloadButtonProps {
  fileName: string;
  targetIds: string[];
  format: "image";
}

interface ImageObject {
  dataUrl: string;
  filename: string;
  tabIndex: number;
}

export default function DownloadButton({
  fileName,
  targetIds,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const downloadRef = useRef<boolean>(false);
  const modalOpenRef = useRef<boolean>(false);

  const downloadImage = useCallback(
    async (dataUrl: string, filename: string): Promise<void> => {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      link.href = "";
    },
    []
  );

  const showMobileImages = useCallback(
    async (images: ImageObject[], isIOS: boolean): Promise<void> => {
      if (modalOpenRef.current) return;
      modalOpenRef.current = true;

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.background = "#fff";
      container.style.overflow = "auto";
      container.style.zIndex = "1000";
      container.style.padding = "15px";
      container.style.boxSizing = "border-box";

      container.innerHTML = `
      <style>
        .image-container { margin-bottom: 30px; border-bottom: 1px solid #ddd; padding-bottom: 20px; }
        .image-container:last-child { border-bottom: none; }
        img { max-width: 100%; border: 1px solid #eee; margin-top: 15px; }
        .instructions { 
          margin: 20px auto; 
          padding: 15px; 
          background: #f5f5f5;
          border-radius: 8px;
          max-width: 400px;
          line-height: 1.5;
          font-family: Arial, sans-serif;
        }
        .step { margin-bottom: 10px; text-align: left; }
        h3, h4 { font-family: Arial, sans-serif; text-align: center; }
        .close-btn {
          position: sticky;
          top: 10px;
          right: 10px;
          float: right;
          padding: 8px 16px;
          background: #ddd;
          border-radius: 4px;
          cursor: pointer;
        }
        ${
          isIOS
            ? `
          .ios-steps { display: block; }
          .android-steps { display: none; }
        `
            : `
          .ios-steps { display: none; }
          .android-steps { display: block; }
        `
        }
      </style>
      <div class="close-btn">Đóng</div>
      <h3>Kết quả tài chính của bạn</h3>
      <div class="instructions">
        <h4>Cách lưu ảnh:</h4>
        <div class="ios-steps">
          <div class="step">1. Nhấn và giữ vào ảnh</div>
          <div class="step">2. Chọn "Save Image" hoặc "Add to Photos"</div>
        </div>
        <div class="android-steps">
          <div class="step">1. Nhấn và giữ vào ảnh</div>
          <div class="step">2. Chọn "Download image" hoặc "Save image"</div>
        </div>
      </div>
      ${images
        .map(
          (img) => `
        <div class="image-container">
          <h4>Nội dung ${img.tabIndex}</h4>
          <img src="${img.dataUrl}" alt="Kết quả tài chính phần ${img.tabIndex}">
        </div>
      `
        )
        .join("")}
    `;

      document.body.appendChild(container);

      const closeBtn = container.querySelector(".close-btn");
      closeBtn?.addEventListener("click", () => {
        document.body.removeChild(container);
        images.forEach((img) => (img.dataUrl = ""));
        images.length = 0;
        modalOpenRef.current = false;
      });
    },
    []
  );

  const handleDownload = useCallback(async () => {
    if (isDownloading || downloadRef.current || modalOpenRef.current) return;
    downloadRef.current = true;
    setIsDownloading(true);
    setProgress(0);

    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      const allImages: ImageObject[] = [];

      for (let i = 0; i < targetIds.length; i++) {
        const targetId = targetIds[i];
        const element = document.getElementById(targetId);
        if (!element) continue;

        // Kiểm tra kích thước phần tử
        if (element.offsetWidth * element.offsetHeight > 4096 * 4096) {
          console.warn("Phần tử quá lớn, có thể gây lỗi trên mobile");
          alert("Nội dung quá lớn để tải. Vui lòng thử trên desktop.");
          continue;
        }

        setProgress(Math.round((i / targetIds.length) * 50));

        // Lưu và áp dụng style tạm thời
        const computedStyle = window.getComputedStyle(element);
        const originalStyle = {
          visibility: computedStyle.visibility,
          position: computedStyle.position,
          display: computedStyle.display,
          top: computedStyle.top,
          left: computedStyle.left,
          zIndex: computedStyle.zIndex,
        };

        Object.assign(element.style, {
          visibility: "visible",
          position: "relative",
          display: "block",
          top: "0",
          left: "0",
          zIndex: "1",
        });

        await new Promise((resolve) => setTimeout(resolve, 100));

        try {
          const options = {
            quality: isMobile ? 0.8 : 0.95, // Giảm chất lượng trên mobile
            backgroundColor: "#ffffff",
            cacheBust: true, // Tránh cache
            filter: (node: Node) =>
              node.nodeName !== "IFRAME" &&
              !(
                node instanceof Element && node.classList?.contains("no-export")
              ),
            width: element.offsetWidth,
            height: element.offsetHeight,
            style: {
              transform: "none", // Loại bỏ transform để tránh lỗi render
            },
          };

          const dataUrl = await htmlToImage.toPng(element, options);
          allImages.push({
            dataUrl,
            filename: `${fileName}_part${i + 1}.png`,
            tabIndex: i + 1,
          });

          setProgress(Math.round(((i + 0.5) / targetIds.length) * 100));

          if (!isMobile) {
            await downloadImage(dataUrl, `${fileName}_part${i + 1}.png`);
          }
        } catch (error) {
          console.error(`Lỗi chụp "${targetId}":`, error);
          alert(`Không thể tạo ảnh cho phần "${i + 1}". Vui lòng thử lại.`);
        } finally {
          // Khôi phục style
          Object.assign(element.style, originalStyle);
        }

        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      if (isMobile && allImages.length > 0) {
        await showMobileImages(allImages, isIOS);
      }
    } catch (error) {
      console.error("Lỗi tải xuống:", error);
      alert("Đã xảy ra lỗi khi tải xuống. Vui lòng thử lại.");
    } finally {
      setIsDownloading(false);
      downloadRef.current = false;
      setProgress(0);
    }
  }, [isDownloading, fileName, targetIds, downloadImage, showMobileImages]);

  return (
    <div className="flex justify-center">
      <div
        className="link-feedback-card p-0 inline-block mt-5"
        style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
      >
        <button
          onClick={handleDownload}
          className={`font-bold text-lg flex items-center rounded-md transition px-4 py-2 ${
            isDownloading
              ? "opacity-50 cursor-not-allowed"
              : "hover:tab-2-number"
          }`}
          disabled={isDownloading}
          aria-label="Tải xuống ảnh"
        >
          {isDownloading ? (
            <>
              <span>
                Đang tải xuống {progress > 0 ? `${progress}%` : "..."}
              </span>
              <div className="ml-2 h-4 w-4 rounded-full border-2 border-t-2 border-gray-300 border-t-blue-600 animate-spin"></div>
            </>
          ) : (
            <>
              Tải xuống
              <FaArrowDown className="ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
