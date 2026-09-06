import Image from "next/image";
import Link from "next/link";

interface ProfileProps {
  imgUrl: string;
  href?: string;
  title: string;
}

const ProfileLink = ({ imgUrl, href, title }: ProfileProps) => {
  return (
    <div className="flex-center gap-1">
      <Image src={imgUrl} alt={title} width={20} height={20} />
      {href ? (
        <Link href={href} target="_blank" rel="noopener noreferrer" className="paragraph-medium text-blue-500">
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
