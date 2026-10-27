import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Склеивает CSS-классы и убирает конфликты (так делают все компоненты shadcn)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
