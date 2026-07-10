import { DEFAULT_EMPTY, DEFAULT_ERROR } from "@/constants/states";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import dark_illustration from "@/public/images/dark-illustration.svg";
import light_illustration from "@/public/images/light_illustration.svg";
import dark_error_illustration from "@/public/images/dark-error_illustration.svg";
import light_error_illustration from "@/public/images/light_error_illustration.svg";

interface Props<T> {
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  data: T[] | null | undefined;
  empty: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
  render: (items: T[]) => React.ReactNode;
}

interface StateSkeletonProps {
  image: {
    light: StaticImageData;
    dark: StaticImageData;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

const StateSkeleton = ({ image, title, message, button }: StateSkeletonProps) => (
  <div className="mt-16 flex w-full flex-col items-center justify-center text-center sm:mt-36">
    <Image src={image.light} alt={image.alt} width={270} height={200} className="block object-contain dark:hidden" />
    <Image src={image.dark} alt={image.alt} width={270} height={200} className="hidden object-contain dark:block" />
    <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
    <p className="body-regular text-dark500_light700 mt-3.5 max-w-md">{message}</p>
    {button && (
      <Link
        href={button.href}
        className="paragraph-medium text-light-900 primary-gradient mt-5 flex min-h-[46px] items-center justify-center rounded-lg px-4 py-3"
      >
        {button.text}
      </Link>
    )}
  </div>
);

const DataRenderer = <T,>({ success, error, data, empty = DEFAULT_EMPTY, render }: Props<T>) => {
  if (!success) {
    return (
      <StateSkeleton
        image={{
          light: light_error_illustration,
          dark: dark_error_illustration,
          alt: "error state illustration",
        }}
        title={typeof error?.message === "string" ? error.message : DEFAULT_ERROR.title}
        message={error?.details ? JSON.stringify(error?.details, null, 2) : DEFAULT_ERROR.message}
        button={DEFAULT_ERROR.button}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <StateSkeleton
        image={{
          light: light_illustration,
          dark: dark_illustration,
          alt: "empty state illustration",
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );
  }

  return <>{render(data)}</>;
};

export default DataRenderer;
