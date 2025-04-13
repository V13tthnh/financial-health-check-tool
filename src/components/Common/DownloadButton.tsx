import * as domtoimage from "dom-to-image";
import { FaArrowDown } from "react-icons/fa";
import { useState } from "react";

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

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setProgress(0);

    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

      // Create an array to store all image data URLs
      const allImages: ImageObject[] = [];

      // Process each element
      for (let i = 0; i < targetIds.length; i++) {
        const targetId = targetIds[i];
        const element = document.getElementById(targetId);
        if (!element) continue;

        // Update progress
        setProgress(Math.round((i / targetIds.length) * 50));

        // Store original styles
        const originalStyle = {
          visibility: element.style.visibility || "visible",
          position: element.style.position || "relative",
          display: element.style.display || "block",
          top: element.style.top || "auto",
          left: element.style.left || "auto",
          zIndex: element.style.zIndex || "auto",
        };

        // Make element visible for screenshot
        element.style.visibility = "visible";
        element.style.position = "relative";
        element.style.display = "block";
        element.style.top = "0";
        element.style.left = "0";
        element.style.zIndex = "1";

        // Wait for rendering to complete
        await new Promise((resolve) => setTimeout(resolve, 200));

        try {
          // Options for dom-to-image
          const options = {
            quality: 0.95,
            bgcolor: "#ffffff",
            style: {
              transform: "none",
            },
            filter: (node: Node) => {
              return (
                node.nodeName !== "IFRAME" &&
                !(
                  node instanceof Element &&
                  node.classList?.contains("no-export")
                )
              );
            },
            width: element.offsetWidth,
            height: element.offsetHeight,
          };

          // Create PNG using dom-to-image
          const dataUrl = await domtoimage.toPng(element, options);

          // Add to images array
          allImages.push({
            dataUrl,
            filename: `${fileName}_part${i + 1}.png`,
            tabIndex: i + 1,
          });

          // Update progress
          setProgress(Math.round(((i + 0.5) / targetIds.length) * 100));

          // For desktop, download immediately
          if (!isMobile) {
            await downloadImage(dataUrl, `${fileName}_part${i + 1}.png`);
          }
        } catch (error) {
          console.error(`Lỗi khi tạo ảnh cho phần tử "${targetId}":`, error);

          // Try fallback method with simpler configuration
          try {
            console.log("Thử phương pháp dự phòng với dom-to-image...");

            // Simpler options
            const fallbackOptions = {
              bgcolor: "#ffffff",
              style: {
                transform: "none",
              },
              imagePlaceholder:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
            };

            // Try with JPEG instead of PNG
            const dataUrl = await domtoimage.toPng(element, fallbackOptions);

            // Add to images array
            allImages.push({
              dataUrl,
              filename: `${fileName}_part${i + 1}.jpg`,
              tabIndex: i + 1,
            });

            // For desktop, download immediately
            if (!isMobile) {
              await downloadImage(dataUrl, `${fileName}_part${i + 1}.jpg`);
            }
          } catch (fallbackError) {
            console.error("Phương pháp dự phòng cũng thất bại:", fallbackError);

            // Final method: SVG
            try {
              console.log("Thử phương pháp cuối cùng với SVG...");
              const dataUrl = await domtoimage.toSvg(element);

              // Add to images array
              allImages.push({
                dataUrl,
                filename: `${fileName}_part${i + 1}.svg`,
                tabIndex: i + 1,
              });

              // For desktop, download immediately
              if (!isMobile) {
                await downloadImage(dataUrl, `${fileName}_part${i + 1}.svg`);
              }
            } catch (svgError) {
              console.error("Tất cả các phương pháp đều thất bại:", svgError);
              alert(
                `Không thể tạo ảnh cho phần "${i + 1}". Vui lòng thử lại sau.`
              );
            }
          }
        }

        // Restore original styles
        element.style.visibility = originalStyle.visibility;
        element.style.position = originalStyle.position;
        element.style.display = originalStyle.display;
        element.style.top = originalStyle.top;
        element.style.left = originalStyle.left;
        element.style.zIndex = originalStyle.zIndex;

        // Free memory between captures
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // For mobile devices, show all images in one page
      if (isMobile && allImages.length > 0) {
        await showMobileImagesPage(allImages, isIOS);
      }
    } catch (error) {
      console.error("Lỗi khi tạo bản tải xuống:", error);
      alert("Đã xảy ra lỗi khi tải xuống. Vui lòng thử lại.");
    } finally {
      // Đảm bảo trạng thái luôn được reset sau khi xử lý xong
      setTimeout(() => {
        setIsDownloading(false);
        setProgress(0);
      }, 300);
    }
  };

  // Helper function to download with mobile support
  const downloadImage = async (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to show a page with all images for mobile devices
  const showMobileImagesPage = async (
    images: ImageObject[],
    isIOS: boolean
  ) => {
    try {
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Kết quả tài chính</title>
            <style>
              body { margin: 0; padding: 15px; font-family: Arial, sans-serif; text-align: center; }
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
              }
              .step { margin-bottom: 10px; text-align: left; }
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
          </head>
          <body>
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
          </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        throw new Error("Không thể mở cửa sổ mới");
      }
    } catch (error) {
      console.warn("Không thể mở cửa sổ mới, thử phương pháp thay thế:", error);

      // Fallback: try to open first image and instruct user to go back for others
      try {
        if (images.length > 0) {
          const alertMsg = `Chúng tôi sẽ hiển thị ${images.length} hình ảnh lần lượt. Vui lòng lưu từng hình ảnh trước khi tiếp tục.`;
          alert(alertMsg);

          // Only open the first image, user can come back for others
          window.open(images[0].dataUrl, "_blank");
        }
      } catch (secondError) {
        console.error("Không thể mở hình ảnh:", secondError);
        alert(
          "Không thể hiển thị hình ảnh. Vui lòng thử trên thiết bị desktop."
        );
      }
    }

    // Thêm một khoảng thời gian chờ trước khi đánh dấu quá trình là hoàn tất
    return new Promise((resolve) => setTimeout(resolve, 500));
  };

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
  );
}
