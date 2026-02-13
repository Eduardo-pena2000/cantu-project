import { Fragment } from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function CustomBreadcrumb({ links }) {
  if (links && links.length > 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {links.map((link, index) => {
            if (link.href) {
              return (
                <Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild className="max-w-[20ch] sm:max-w-[30ch] truncate">
                      <Link href={link.href}>{link.label}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </Fragment>
              );
            }

            return (
              <BreadcrumbItem key={index}>
                <BreadcrumbPage className="max-w-[20ch] sm:max-w-[30ch] truncate">
                  {link.label}
                </BreadcrumbPage>
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return null;
}
