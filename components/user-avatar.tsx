import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  name: string;
  imageSrc?: string | null;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = async ({ id, name, imageSrc, fallbackClassName, className = "h-9 w-9" }: Props) => {
  const intials = name
    ?.split(" ")
    .map((text) => text[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar className={cn("relative", className)}>
        {imageSrc ? (
          <Image src={imageSrc} alt={name} fill quality={100} className="h-full w-full rounded-full object-cover" />
        ) : (
          <AvatarFallback
            className={cn("primary-gradient primary-text-gradient text-xl font-medium", fallbackClassName)}
          >
            {intials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
