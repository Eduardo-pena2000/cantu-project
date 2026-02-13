import { BreadcrumbSkeleton } from "@/components/breadcrumb-skeleton";
import { Title } from "@/components/title";
import { TableSkeleton } from "@/components/table-skeleton";

export default function Loading() {
  return (
    <>
      <BreadcrumbSkeleton itemsCount={2} />

      <Title>Tiendas</Title>

      <TableSkeleton />
    </>
  );
}
