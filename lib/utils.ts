import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { techMap } from "@/constants/techMap";
import { techDescriptionMap } from "@/constants/techDescription";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const devIconClassName = (techName: string) => {
  const normalizeTechName = techName.replace(/[ .]/g, "").toLocaleLowerCase();
  return techMap[normalizeTechName] ? `${techMap[normalizeTechName]} colored` : "devicon-devicon-plain";
};

export const getTechDescription = (techName: string) => {
  const normalizeTechName = techName.replace(/[ .]/g, "").toLocaleLowerCase();
  return (
    techDescriptionMap[normalizeTechName] ||
    `${techName} is a technology or tool widely used in software development, providing valuable features and capabilities.`
  );
};

export const getTimeStamp = (createdAt: Date): string => {
  const date = new Date(createdAt);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
};
