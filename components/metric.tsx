import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  imgUrl?: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles?: string;
  imgStyles?: string;
  author?: boolean;
}

const Metric = ({ imgUrl, alt, value, title, href, textStyles, imgStyles, author }: Props) => {
  const renderMetricContent = (
    <>
      {imgUrl && (
        <Image src={imgUrl} alt={alt} width={16} height={16} className={cn("rounded-full object-contain", imgStyles)} />
      )}
      <p className={cn("flex items-center gap-1", textStyles)}>
        {value}
        <span className={cn("small-regular line-clamp-1", author ? "max-sm:hidden" : "")}>{title}</span>
      </p>
    </>
  );

  return href ? (
    <Link href={href} className="flex-center gap-1">
      {renderMetricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{renderMetricContent}</div>
  );
};

export default Metric;
