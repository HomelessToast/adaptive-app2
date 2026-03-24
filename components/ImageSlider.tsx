"use client";

import { useEffect, useState } from "react";

const images = [
  { src: "/flavors/blue-raz.png", alt: "Blue Raz flavor creative" },
  { src: "/flavors/pina-colada.png", alt: "Pina Colada flavor creative" },
  { src: "/flavors/fruit-punch.png", alt: "Fruit Punch flavor creative" },
  { src: "/flavors/green-apple.png", alt: "Green Apple flavor creative" },
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
    <div className="w-full max-w-[480px] h-[400px] sm:h-[480px] md:h-[520px] lg:h-[560px] relative overflow-hidden rounded-lg">
      {images.map(({ src, alt }, index) => (
        <img
          key={index}
          src={src}
          alt={alt}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}