"use client";

import { useEffect, useState } from "react";

const images = [
  "/Basketball Athlete Picture.jpg",
  "/Athlete 1.jpg",
  "/Athlete 2.jpg", 
  "/Athlete 3.jpg",
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[500px] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[750px] relative overflow-hidden rounded-lg">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Athlete ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}