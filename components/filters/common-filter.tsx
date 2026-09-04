'use client'

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem
} from "@/components/ui/select"
import { removeKeysFromQuery, urlQueryForm } from "@/lib/url";

interface Props {
    filters: {
        name: string;
        value: string;
    }[];
    otherClasses?: string;
    containerClasses?: string;
}

const CommonFilter = ({ filters, otherClasses = "", containerClasses = "" }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paramsFilter = searchParams.get("filter");

    const handleUpdateFilter = (value: string | null) => {
        const newUrl = value
            ? urlQueryForm({
                params: searchParams.toString(),
                key: "filter",
                value,
            })
            : removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: ["filter"],
            });

        router.push(newUrl, { scroll: false });
    };

    return (
        <div className={cn("relative", containerClasses)}>
            <Select onValueChange={handleUpdateFilter} defaultValue={paramsFilter || undefined}>
                <SelectTrigger className={cn(otherClasses, "body-regular w-full  no-focus light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5")}
                    aria-label="Filter Opitons"
                >

                    <div className="line-clamp-1 flex-1 text-left">
                        <SelectValue placeholder={"Select Filter"} />
                    </div>
                </SelectTrigger>

                <SelectContent>

                    {
                        filters.map((filter) => (
                            <SelectItem key={filter.value} value={filter.value}>
                                {filter.name}
                            </SelectItem>
                        ))
                    }
                </SelectContent>

            </Select>
        </div>
    )
}

export default CommonFilter;
