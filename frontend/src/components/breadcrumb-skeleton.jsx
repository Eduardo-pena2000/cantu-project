import { Fragment } from "react";

import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

export function BreadcrumbSkeleton({ itemsCount = 1 }) {
  const items = Array.from({ length: itemsCount }, (_, i) => i + 1);

  return (
    <Breadcrumb className="h-5">
      <BreadcrumbList>
        {items.map((x) => {
          if (x === items.length) {
            return <Skeleton key={x} className="h-3 w-14 rounded-xs" />;
          }

          return (
            <Fragment key={x}>
              <Skeleton key={x} className="h-3 w-14 rounded-xs" />
              <BreadcrumbSeparator />
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
