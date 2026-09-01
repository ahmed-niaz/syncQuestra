import { UserType } from "@/types/global";
import UserAvatar from "../user-avatar";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";


const UserCards = ({ _id, name, image, username }: UserType) => {
    return (
        <div className="shadow-light100_darknone w-full xs:w-57.5 ">
            <article className="background-light700_dark300 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8" >
                <UserAvatar id={_id} name={name} imageSrc={image} className="size-25 rounded-full object-cover" fallbackClassName="text-3xl tracking-widest" />
                <Link href={ROUTES.PROFILE(_id)}>
                    <div className="mt-4 text-center">
                        <h3 className="h3-bold text-dark200_light900 line-clamp-1">{name}</h3>
                        <p className="body-regular text-dark500_light500 mt-2">@{username}</p>
                    </div>
                </Link>
            </article>

        </div>
    )
}

export default UserCards;