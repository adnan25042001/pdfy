"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary";
}

export function AnimatedButton({
  children,
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const btn = buttonRef.current;

    const tl = gsap.timeline({ paused: true });
    tl.to(btn, { scale: 0.96, duration: 0.1 });
    tl.to(btn, { scale: 1, duration: 0.15 });

    const handleMouseDown = () => tl.play(0);
    const handleMouseUp = () => tl.reverse();

    btn.addEventListener("mousedown", handleMouseDown);
    btn.addEventListener("mouseup", handleMouseUp);
    btn.addEventListener("mouseleave", handleMouseUp);

    return () => {
      btn.removeEventListener("mousedown", handleMouseDown);
      btn.removeEventListener("mouseup", handleMouseUp);
      btn.removeEventListener("mouseleave", handleMouseUp);
    };
  }, []);

  const baseStyle = cn(
    "rounded-xl px-4 py-2 font-semibold transition-colors duration-200 flex items-center justify-center gap-2",
    {
      "bg-blue-600 text-white hover:bg-blue-700": variant === "primary",
      "bg-gray-100 text-gray-800 hover:bg-gray-200": variant === "secondary",
      "opacity-50 cursor-not-allowed": disabled,
    },
    className
  );

  return (
    <button
      ref={buttonRef}
      className={baseStyle}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
