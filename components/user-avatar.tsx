import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

interface Props {
  id: string;
  name: string;
  imageSrc?: string;
  className?: string;
}

const UserAvatar = async ({ id, name, imageSrc, className = "h-9 w-9" }: Props) => {
  const intials = name
    ?.split(" ")
    .map((text) => text[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar className={className}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name}
            width={36}
            height={36}
            quality={100}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <AvatarFallback className="primary-gradient text-xl font-bold text-white">{intials}</AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
