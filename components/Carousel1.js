'use client';

import React from 'react';

const MyCarousel = () => {
  return (
    <div className="relative w-full h-[50vh] overflow-hidden mb-20 mt-20">

      {/* Background Image */}
      <picture>
        <source
          media="(min-width: 768px)"
          srcSet="https://res.cloudinary.com/dziggyzpb/image/upload/v1762207621/0d7224d200dc9355d10a30ebe4a8ade4_gintwv.jpg"
        />
        <img
          src="https://res.cloudinary.com/dziggyzpb/image/upload/v1762207621/0d7224d200dc9355d10a30ebe4a8ade4_gintwv.jpg"
          alt="Sunny-Day Sale Background"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </picture>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Center Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
        <h1 className="text-4xl lg:text-5xl font-bold uppercase animate-slideInLeft">
          Stay Fresh. Stay Healthy.
        </h1>

        <p className="text-[14px] mt-4 animate-slideInLeft delay-200 max-[1000px]">
          Discover what real freshness tastes like — handpicked fruits and vegetables
          delivered directly from farmers to your doorstep.
        </p>

        <a
          href="/shop"
          className="mt-8 px-10 py-3 bg-white text-black font-semibold transition-all duration-300 transform hover:scale-105"
        >
          Shop Now
        </a>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideInLeft {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideInLeft {
          animation: slideInLeft 1s ease-out forwards;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default MyCarousel;
