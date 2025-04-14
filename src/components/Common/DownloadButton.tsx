import * as domtoimage from "dom-to-image";
import { FaArrowDown } from "react-icons/fa";
import { useState, useRef } from "react";
import ErrorModal from "../ErrorModal/ErrorModal";
interface DownloadButtonProps {
  fileName: string;
  targetIds: string[];
  format: "image";
}

// Định nghĩa interface cho đối tượng hình ảnh
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
  const processingRef = useRef(false);
  // State cho ErrorModal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // State cho thông báo thành công
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const resetState = () => {
    setIsDownloading(false);
    setProgress(0);
    processingRef.current = false;
  };

  // Hiển thị modal lỗi
  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  // Hiển thị modal thành công
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
  };

  // Hàm riêng để xử lý mỗi phần tử
  const processElement = async (targetId: string, index: number) => {
    const element = document.getElementById(targetId);
    if (!element) return null;

    // Lưu trữ style ban đầu
    const originalStyle = {
      visibility: element.style.visibility,
      position: element.style.position,
      display: element.style.display,
      top: element.style.top,
      left: element.style.left,
      zIndex: element.style.zIndex,
    };

    try {
      // Áp dụng style cho việc chụp ảnh
      element.style.visibility = "visible";
      element.style.position = "relative";
      element.style.display = "block";
      element.style.top = "0";
      element.style.left = "0";
      element.style.zIndex = "1";

      // Chờ để DOM render hoàn tất
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Cấu hình cho dom-to-image
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const options = {
        quality: isMobile ? 0.85 : 0.95,
        bgcolor: "#ffffff",
        style: {
          transform: "none",
        },
        filter: (node: Node) => {
          return (
            node.nodeName !== "IFRAME" &&
            !(node instanceof Element && node.classList?.contains("no-export"))
          );
        },
        width: Math.min(element.offsetWidth, isMobile ? 1200 : 3000),
        height: Math.min(element.offsetHeight, isMobile ? 1600 : 5000),
      };

      try {
        // Tạo PNG với cấu hình tối ưu
        const dataUrl = await domtoimage.toPng(element, options);
        return {
          dataUrl,
          filename: `${fileName}_part${index + 1}.png`,
          tabIndex: index + 1,
        };
      } catch (error) {
        console.error(`Lỗi khi tạo ảnh:`, error);

        // Thử với JPEG nhẹ hơn
        try {
          const fallbackOptions = {
            bgcolor: "#ffffff",
            style: { transform: "none" },
            width: Math.min(element.offsetWidth, isMobile ? 800 : 2000),
            height: Math.min(element.offsetHeight, isMobile ? 1200 : 3000),
          };

          const dataUrl = await domtoimage.toPng(element, fallbackOptions);
          return {
            dataUrl,
            filename: `${fileName}_part${index + 1}.jpg`,
            tabIndex: index + 1,
          };
        } catch (fallbackError) {
          console.error("Phương pháp JPEG thất bại:", fallbackError);

          // Phương pháp cuối cùng: SVG
          try {
            const dataUrl = await domtoimage.toSvg(element);
            return {
              dataUrl,
              filename: `${fileName}_part${index + 1}.svg`,
              tabIndex: index + 1,
            };
          } catch (svgError) {
            console.error("Tất cả các phương pháp đều thất bại:", svgError);
            return null;
          }
        }
      }
    } finally {
      // Khôi phục style ban đầu
      element.style.visibility = originalStyle.visibility || "";
      element.style.position = originalStyle.position || "";
      element.style.display = originalStyle.display || "";
      element.style.top = originalStyle.top || "";
      element.style.left = originalStyle.left || "";
      element.style.zIndex = originalStyle.zIndex || "";
    }
  };

  // Hàm tải xuống ảnh - tách biệt logic
  const downloadImage = (dataUrl: string, filename: string): Promise<void> => {
    return new Promise((resolve) => {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cho phép thời gian để trình duyệt bắt đầu tải xuống
      setTimeout(() => {
        document.body.removeChild(link);
        // Giải phóng bộ nhớ cho URL đối tượng nếu có
        if (dataUrl.startsWith("blob:")) {
          URL.revokeObjectURL(dataUrl);
        }
        resolve();
      }, 200);
    });
  };

  // Hiển thị ảnh trên thiết bị di động
  const showMobileImagesPage = async (
    images: ImageObject[],
    isIOS: boolean
  ): Promise<void> => {
    if (images.length === 0) {
      showError("Không có hình ảnh nào được tạo.");
      return;
    }

    try {
      // Tạo HTML cho cửa sổ mới
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tool money with Mina</title>
          <style>
            body { margin: 0; padding: 15px; font-family: Arial, sans-serif; text-align: center; }
            .image-container { margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 20px; }
            .image-container:last-child { border-bottom: none; }
            img { max-width: 100%; border: 1px solid #eee; margin-top: 15px; }
            .instructions { 
              margin: 20px auto; 
              padding: 15px; 
              background: #f5f5f5;
              border-radius: 8px;
              max-width: 400px;
              line-height: 1.5;
            }
            .step { margin-bottom: 10px; text-align: left; }
            ${
              isIOS
                ? `.ios-steps { display: block; } .android-steps { display: none; }`
                : `.ios-steps { display: none; } .android-steps { display: block; }`
            }
          </style>
        </head>
        <body>
          <div class="instructions">
            <h4>How to save image:</h4>
            <div class="ios-steps">
              <div class="step">1. Press and hold on the image</div>
              <div class="step">2. Choose "Save Image" or "Add to Photos"</div>
            </div>
            <div class="android-steps">
              <div class="step">1. Press and hold on the image</div>
              <div class="step">2. Choose "Download image" or "Save image"</div>
            </div>
          </div>
          ${images
            .map(
              (img) => `
            <div class="image-container">
              <h4>Image ${img.tabIndex}</h4>
              <img src="${img.dataUrl}" alt="Kết quả tài chính phần ${img.tabIndex}">
            </div>
          `
            )
            .join("")}
        </body>
        </html>
      `;

      // Sử dụng data URL thay vì mở cửa sổ mới để tránh chặn popup
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, "_blank");

      if (!newWindow) {
        showError(
          "Trình duyệt đã chặn cửa sổ popup. Vui lòng cho phép popup và thử lại."
        );
      }

      // Giải phóng URL sau một khoảng thời gian
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Không thể hiển thị trang hình ảnh:", error);

      // Phương pháp dự phòng: mở từng ảnh một
      if (images.length > 0) {
        showError(
          `Không thể hiển thị tất cả ảnh cùng lúc. Đang mở ảnh đầu tiên. Vui lòng lưu lại.`
        );
        const newWindow = window.open(images[0].dataUrl, "_blank");
        if (!newWindow) {
          showError(
            "Trình duyệt đã chặn cửa sổ popup. Vui lòng cho phép popup và thử lại."
          );
        }
      }
    }
  };

  const handleDownload = async () => {
    // Kiểm tra xem có đang trong quá trình tải xuống không
    if (isDownloading || processingRef.current) {
      return;
    }

    // Đánh dấu đang xử lý ở cả state và ref để tránh nhấn nhiều lần
    setIsDownloading(true);
    processingRef.current = true;
    setProgress(0);

    try {
      // Xác định loại thiết bị
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

      // Mảng lưu trữ kết quả hình ảnh
      const allImages: ImageObject[] = [];

      // Xử lý từng phần tử
      for (let i = 0; i < targetIds.length; i++) {
        // Cập nhật tiến trình
        setProgress(Math.round((i / targetIds.length) * 50));

        const imageObj = await processElement(targetIds[i], i);
        if (imageObj) {
          allImages.push(imageObj);

          // Cập nhật tiến trình
          setProgress(Math.round(((i + 0.5) / targetIds.length) * 100));

          // Tải xuống ngay lập tức nếu là desktop
          if (!isMobile) {
            await downloadImage(imageObj.dataUrl, imageObj.filename);
            // Thêm độ trễ giữa các lần tải xuống
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        } else {
          console.warn(`Không thể xử lý phần tử ${targetIds[i]}`);
        }

        // Thêm độ trễ để giải phóng bộ nhớ và CPU
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Xử lý cho thiết bị di động
      if (isMobile && allImages.length > 0) {
        await showMobileImagesPage(allImages, isIOS);
      }

      // Hiển thị thông báo thành công
      if (allImages.length > 0) {
        setProgress(100);
        setTimeout(() => {
          showSuccess("Tải xuống hoàn tất!");
        }, 500);
      } else {
        showError("Không có hình ảnh nào được tạo. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo bản tải xuống:", error);
      showError("Đã xảy ra lỗi khi tải xuống. Vui lòng thử lại.");
    } finally {
      // Đảm bảo reset trạng thái dù có lỗi hay không
      setTimeout(resetState, 500);
    }
  };

  return (
    <>
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
                  Đang tải xuống {progress > 0 ? `${progress}%` : ""}...
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

      {/* Modal lỗi */}
      {showErrorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}

      {/* Modal thành công */}
      {showSuccessModal && (
        <ErrorModal
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </>
  );
}
