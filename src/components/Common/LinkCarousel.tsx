import { useState } from "react";

interface CarouselProps {
  items: { url: string; text: string }[];
}

export default function LinkCarousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full flex justify-center mt-3 ">
      <div className="w-full max-w-md">
        {/* Container for current item */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {items.map((item, index) => (
              <div key={index} className="min-w-full flex justify-center">
                <div
                  className="financial-goals-feedback-button rounded-lg px-1 py-1 text-center w-full mr-3 ml-3"
                  style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                >
                  <a
                    href={item.url}
                    className="text-base font-semibold text-black block"
                  >
                    {item.text}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <ul className="flex justify-center mt-2 space-x-2">
          {items.map((_, index) => (
            <li
              key={index}
              className={`w-2 h-2 rounded-full cursor-pointer ${
                index === currentIndex ? "tab-2-content-button" : "bg-gray-400"
              }`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
