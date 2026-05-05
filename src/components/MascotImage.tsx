"use client";

import Image from "next/image";
import { useState } from "react";

interface MascotImageProps {
  size?: number;
  className?: string;
}

export function MascotImage({ size = 96, className = "" }: MascotImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        style={{ width: size, height: size, fontSize: size * 0.38 }}
        className={`rounded-full bg-brand-500 flex items-center justify-center text-white font-bold shrink-0 ${className}`}
      >
        R
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full overflow-hidden bg-brand-100 shrink-0 ${className}`}
    >
      <Image
        src="/mascot.png"
        alt="Rasik"
        width={size}
        height={size}
        className="object-cover object-[center_15%] w-full h-full"
        onError={() => setFailed(true)}
        priority
      />
    </div>
  );
}
