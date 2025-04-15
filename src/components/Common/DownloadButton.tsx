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

export default function DownloadButton({
  fileName,
  targetIds,
}: DownloadButtonProps) {
  const [downloadState, setDownloadState] = useState({
    isDownloading: false,
    progress: 0,
    isModalOpen: false,
  });
  const isMounted = useRef(true);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const downloadImage = useCallback(
    async (dataUrl: string, filename: string): Promise<void> => {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    []
  );

  const captureElement = useCallback(
    async (element: HTMLElement, isMobile: boolean): Promise<string> => {
      if (!element) return "";

      const originalStyles = {
        visibility: element.style.visibility,
        position: element.style.position,
        display: element.style.display,
        top: element.style.top,
        left: element.style.left,
        zIndex: element.style.zIndex,
      };

      try {
        Object.assign(element.style, {
          visibility: "visible",
          position: "relative",
          display: "block",
          top: "0",
          left: "0",
          zIndex: "1",
        });

        const problematicElements = element.querySelectorAll(
          "iframe, canvas, video"
        );
        problematicElements.forEach((el) => {
          (el as HTMLElement).style.visibility = "hidden";
        });

        const options = {
          quality: isMobile ? 0.8 : 0.95,
          backgroundColor: "#ffffff",
          cacheBust: true,
          filter: (node: Node) => {
            return (
              node.nodeName !== "IFRAME" &&
              !(
                node instanceof Element && node.classList?.contains("no-export")
              )
            );
          },
          width: element.offsetWidth,
          height: element.offsetHeight,
          style: {
            transform: "none",
          },
        };

        return await new Promise((resolve, reject) => {
          const timeout = setTimeout(
            () => {
              reject(new Error("Capture element timeout"));
            },
            isMobile ? 15000 : 5000
          );

          htmlToImage
            .toPng(element, options)
            .then((dataUrl) => {
              clearTimeout(timeout);
              resolve(dataUrl);
            })
            .catch((error) => {
              clearTimeout(timeout);
              reject(error);
            });
        });
      } finally {
        Object.assign(element.style, originalStyles);
        const problematicElements = element.querySelectorAll(
          "iframe, canvas, video"
        );
        problematicElements.forEach((el) => {
          (el as HTMLElement).style.visibility = "";
        });
      }
    },
    []
  );

  const closeModal = useCallback(() => {
    if (modalRef.current && modalRef.current.parentNode) {
      document.body.removeChild(modalRef.current);
      modalRef.current = null;
    }
    setDownloadState((prev) => ({ ...prev, isModalOpen: false }));
  }, []);

  const showMobileImages = useCallback(
    async (images: ImageObject[], isIOS: boolean): Promise<void> => {
      if (downloadState.isModalOpen || modalRef.current) return;

      setDownloadState((prev) => ({ ...prev, isModalOpen: true }));

      const container = document.createElement("div");
      modalRef.current = container;

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

      // Log to verify the number of images
      console.log("Rendering images in modal:", images.length, images);

      container.innerHTML = `
        <style>
          ${MODAL_STYLES}
          ${
            isIOS
              ? ".ios-steps { display: block; } .android-steps { display: none; }"
              : ".ios-steps { display: none; } .android-steps { display: block; }"
          }
        </style>
        <div class="close-btn" id="modal-close-btn">Đóng</div>
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
        <div id="images-container"></div>
      `;

      document.body.appendChild(container);

      const closeBtn = container.querySelector("#modal-close-btn");
      closeBtn?.addEventListener("click", closeModal);

      const imagesContainer = container.querySelector("#images-container");
      if (imagesContainer) {
        // Clear any existing content to avoid duplicates
        imagesContainer.innerHTML = "";

        // Iterate through all images and append them
        images.forEach((img) => {
          console.log(`Appending image ${img.tabIndex}:`, img.dataUrl); // Debug log
          const imageDiv = document.createElement("div");
          imageDiv.className = "image-container";
          imageDiv.innerHTML = `
            <h4>Nội dung ${img.tabIndex}</h4>
            <img src="${img.dataUrl}" alt="Kết quả tài chính phần ${img.tabIndex}">
          `;
          imagesContainer.appendChild(imageDiv);
        });

        // Force a reflow to ensure DOM updates
        imagesContainer.scrollTop = imagesContainer.scrollTop;
      } else {
        console.error("Images container not found in modal");
      }
    },
    [downloadState.isModalOpen, closeModal]
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && downloadState.isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [downloadState.isModalOpen, closeModal]);

  const handleDownload = useCallback(async () => {
    if (downloadState.isDownloading || downloadState.isModalOpen) return;

    setDownloadState((prev) => ({ ...prev, isDownloading: true, progress: 0 }));

    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      const allImages: ImageObject[] = [];

      for (let i = 0; i < targetIds.length; i++) {
        const targetId = targetIds[i];
        const element = document.getElementById(targetId);

        if (!element) {
          console.warn(`Không tìm thấy phần tử với ID: ${targetId}`);
          continue;
        }

        setDownloadState((prev) => ({
          ...prev,
          progress: Math.round(((i + 0.5) / targetIds.length) * 50),
        }));

        try {
          const dataUrl = await captureElement(element, isMobile);

          if (!dataUrl || dataUrl.length < 1000) {
            throw new Error("Không thể tạo ảnh hợp lệ");
          }

          const imageObj = {
            dataUrl,
            filename: `${fileName}_part${i + 1}.png`,
            tabIndex: i + 1,
          };
          allImages.push(imageObj);

          if (!isMobile) {
            await downloadImage(dataUrl, imageObj.filename);
          }

          setDownloadState((prev) => ({
            ...prev,
            progress: Math.round(((i + 1) / targetIds.length) * 100),
          }));
        } catch (error) {
          console.error(`Lỗi chụp "${targetId}":`, error);
          if (
            window.confirm(
              `Không thể tạo ảnh cho phần "${i + 1}". Vui lòng thử lại.`
            )
          ) {
            continue;
          }
          break;
        }
      }

      console.log("Images to display:", allImages);

      if (isMobile && allImages.length > 0) {
        await showMobileImages(allImages, isIOS);
      } else if (allImages.length === 0) {
        throw new Error("Không thể tạo bất kỳ hình ảnh nào");
      }
    } catch (error) {
      console.error("Lỗi tải xuống:", error);
      window.alert("Đã xảy ra lỗi khi tải xuống. Vui lòng thử lại.");
    } finally {
      // Luôn đặt lại trạng thái, bất kể thành công hay thất bại
      setDownloadState((prev) => ({
        ...prev,
        isDownloading: false,
        progress: 0,
        isModalOpen: prev.isModalOpen, // Giữ nguyên trạng thái modal
      }));
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

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (modalRef.current && modalRef.current.parentNode) {
        document.body.removeChild(modalRef.current);
      }
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
                Đang tải xuống{" "}
                {downloadState.progress > 0
                  ? `${downloadState.progress}%`
                  : "..."}
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
