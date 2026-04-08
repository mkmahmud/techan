import { Skeleton } from "@/components/ui/skeleton";

export function TaskRowSkeleton() {
    return (
        <tr className="border-b border-border/70 align-top">
            <td className="px-4 py-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-2 h-3 w-64" />
                <Skeleton className="mt-1 h-3 w-48" />
            </td>

            <td className="px-4 py-4">
                <Skeleton className="h-6 w-24 rounded-full" />
            </td>

            <td className="px-4 py-4">
                <Skeleton className="h-4 w-32" />
            </td>

            <td className="px-4 py-4">
                <Skeleton className="h-4 w-28" />
            </td>

            <td className="px-4 py-4">
                <div className="flex min-w-[220px] flex-col gap-2">
                    <Skeleton className="h-9 w-full rounded-md" />

                    <div className="flex gap-2">
                        <Skeleton className="h-9 flex-1 rounded-md" />
                        <Skeleton className="h-9 w-16 rounded-md" />
                    </div>
                </div>
            </td>
        </tr>
    );
}