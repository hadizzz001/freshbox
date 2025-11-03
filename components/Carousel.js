"use client";
import React, { useState, useEffect } from "react";

const MyCarousel = () => {
  const slides = [
    {
      img: "https://res.cloudinary.com/dziggyzpb/image/upload/v1762195097/62-home-3-1_rzgqi4.webp",
      title: "Your Weekly Box of Fresh Goodness",
      subtitle: "DISCOUNT AUTO-APPLIES AT CHECKOUT",
      buttonText: "Shop Now",
      hideText: false, // ✅ show for slide 1
    },
    {
      img: "https://res.cloudinary.com/dziggyzpb/image/upload/v1762195096/grocery-feature-1000x750_yoyupb.webp",
      hideText: true, // ✅ hide for slide 2
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] lg:h-[800px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.img}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Centered Text & Button (only if not hidden) */}
          {!slide.hideText && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold myGrayTit">
                {slide.title}
              </h1>
              <p className="text-lg md:text-2xl myGraySub">{slide.subtitle}</p>

              <a
                href="/shop"
                className="px-8 py-3 md:px-12 md:py-4 font-semibold transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: "#222", color: "#fff", borderRadius: 0 }}
              >
                {slide.buttonText}
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyCarousel;
