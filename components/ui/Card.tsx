import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ glow = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 ${
        glow ? "shadow-lg shadow-green-500/10 border-green-500/20" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
