import * as htmlToImage from "html-to-image";
import { FaArrowDown } from "react-icons/fa";
import { useState, useCallback, useRef, useEffect } from "react";

interface DownloadButtonProps {
  fileName: string;
  targetIds: string[];
}

interface ImageObject {
  dataUrl: string;
  filename: string;
  tabIndex: number;
}

// Tách phần CSS thành biến riêng
const MODAL_STYLES = `
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
`;

export default function DownloadButton({ fileName, targetIds }: DownloadButtonProps) {
  const [downloadState, setDownloadState] = useState({
    isDownloading: false,
    progress: 0,
    isModalOpen: false
  });
  const isMounted = useRef(true);

  // Hàm thực hiện tải xuống hình ảnh cho desktop
  const downloadImage = useCallback(async (dataUrl: string, filename: string): Promise<void> => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Logic tạo hình ảnh
  const captureElement = useCallback(async (element: HTMLElement, isMobile: boolean): Promise<string> => {
    // Lưu style ban đầu
    //const computedStyle = window.getComputedStyle(element);
    const originalStyles = {
      visibility: element.style.visibility,
      position: element.style.position,
      display: element.style.display,
      top: element.style.top,
      left: element.style.left,
      zIndex: element.style.zIndex,
    };

    // Style tạm thời
    Object.assign(element.style, {
      visibility: "visible",
      position: "relative",
      display: "block",
      top: "0",
      left: "0",
      zIndex: "1",
    });

    try {
      const options = {
        quality: isMobile ? 0.8 : 0.95,
        backgroundColor: "#ffffff",
        cacheBust: true,
        filter: (node: Node) =>
          node.nodeName !== "IFRAME" &&
          !(node instanceof Element && node.classList?.contains("no-export")),
        width: element.offsetWidth,
        height: element.offsetHeight,
        style: {
          transform: "none",
        },
      };

      return await htmlToImage.toPng(element, options);
    } finally {
      // Khôi phục style ban đầu
      Object.assign(element.style, originalStyles);
    }
  }, []);

  // Hàm thực hiện logic hiển thị modal trên mobile
  const showMobileImages = useCallback(async (images: ImageObject[], isIOS: boolean): Promise<void> => {
    if (downloadState.isModalOpen) return;
    
    setDownloadState(prev => ({ ...prev, isModalOpen: true }));

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

    // Nội dung HTML và CSS hiển thị
    container.innerHTML = `
      <style>
        ${MODAL_STYLES}
        ${isIOS ? '.ios-steps { display: block; } .android-steps { display: none; }' : 
                '.ios-steps { display: none; } .android-steps { display: block; }'}
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

    // Xử lý đóng modal
    const closeBtn = container.querySelector(".close-btn");
    closeBtn?.addEventListener("click", () => {
      document.body.removeChild(container);
      images.forEach((img) => (img.dataUrl = ""));
      setDownloadState(prev => ({ ...prev, isModalOpen: false }));
    });
  }, [downloadState.isModalOpen]);

  // Xử lý tải xuống
  const handleDownload = useCallback(async () => {
    if (downloadState.isDownloading || downloadState.isModalOpen) return;
    
    setDownloadState(prev => ({ ...prev, isDownloading: true, progress: 0 }));

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
          // Sử dụng window.confirm thay vì alert
          if (window.confirm("Nội dung quá lớn để tải. Vui lòng thử trên desktop.")) {
            continue;
          }
          break;
        }

        // Cập nhật tiến độ
        setDownloadState(prev => ({
          ...prev,
          progress: Math.round(((i + 0.5) / targetIds.length) * 50)
        }));

        try {
          // Tạo ảnh
          const dataUrl = await captureElement(element, isMobile);
          
          // Thêm vào danh sách ảnh
          const imageObj = {
            dataUrl,
            filename: `${fileName}_part${i + 1}.png`,
            tabIndex: i + 1,
          };
          allImages.push(imageObj);

          // Tải xuống trực tiếp trên desktop
          if (!isMobile) {
            await downloadImage(dataUrl, imageObj.filename);
          }

          // Cập nhật tiến độ
          setDownloadState(prev => ({
            ...prev,
            progress: Math.round(((i + 1) / targetIds.length) * 100)
          }));
        } catch (error) {
          console.error(`Lỗi chụp "${targetId}":`, error);
          if (window.confirm(`Không thể tạo ảnh cho phần "${i + 1}". Vui lòng thử lại.`)) {
            continue;
          }
          break;
        }
      }

      // Hiển thị modal trên mobile
      if (isMobile && allImages.length > 0) {
        await showMobileImages(allImages, isIOS);
      }
    } catch (error) {
      console.error("Lỗi tải xuống:", error);
      window.confirm("Đã xảy ra lỗi khi tải xuống. Vui lòng thử lại.");
    } finally {
      if (isMounted.current) {
        setDownloadState(prev => ({ ...prev, isDownloading: false, progress: 0 }));
      }
    }
  }, [
    downloadState.isDownloading,
    downloadState.isModalOpen,
    fileName,
    targetIds,
    captureElement,
    downloadImage,
    showMobileImages,
  ]);

  // Xử lý unmount component
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div className="flex justify-center">
      <div
        className="link-feedback-card p-0 inline-block mt-5"
        style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
      >
        <button
          onClick={handleDownload}
          className={`font-bold text-lg flex items-center rounded-md transition px-4 py-2 ${
            downloadState.isDownloading
              ? "opacity-50 cursor-not-allowed"
              : "hover:tab-2-number"
          }`}
          disabled={downloadState.isDownloading}
          aria-label="Tải xuống ảnh"
        >
          {downloadState.isDownloading ? (
            <>
              <span>
                Đang tải xuống {downloadState.progress > 0 ? `${downloadState.progress}%` : "..."}
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