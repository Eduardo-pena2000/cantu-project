import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col min-[448px]:flex-row justify-between items-center gap-4">
        <Skeleton className="w-full min-[448px]:max-w-md h-9" />
        <Skeleton className="w-full min-[448px]:max-w-[130px] h-9" />
      </div>

      <div className="border rounded-md py-2 space-y-2">
        <Skeleton className="shadow h-10 rounded-md mx-2" />
        <Separator />
        <Skeleton className="shadow h-10 rounded-md mx-2" />
        <Separator />
        <Skeleton className="shadow h-10 rounded-md mx-2" />
        <Separator />
        <Skeleton className="shadow h-10 rounded-md mx-2" />
        <Separator />
        <Skeleton className="shadow h-10 rounded-md mx-2" />
        <Separator />
        <Skeleton className="shadow h-10 rounded-md mx-2" />
        <Separator />
        <Skeleton className="shadow h-10 rounded-md mx-2" />
        <Separator />
        <Skeleton className="shadow h-10 rounded-md mx-2" />
        <Separator />
        <Skeleton className="shadow h-10 rounded-md mx-2" />
      </div>
    </div>
  );
}
