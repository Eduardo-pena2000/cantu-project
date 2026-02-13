"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib";
import { notificationDto } from "@/dtos";
import { SocketContext } from "@/context/SocketProvider";
import { safeUrlEncode } from "@/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

export function Notifications() {
  const { socket } = React.useContext(SocketContext) ?? {};
  const [notifications, setNotifications] = React.useState([]);

  const router = useRouter();

  const activeNotifications = notifications.filter((notification) => !notification.isRead);

  function handleClick(notification) {
    if (notification?.metadata?.assignment_activitie_id) {
      router.push(
        `/assignment/details/${safeUrlEncode(notification?.metadata?.assignment_activitie_id)}`
      );
      socket.emit("read-notification", { id: notification.id });
    }
  }

  React.useEffect(() => {
    function onNotifications(notifications) {
      const updatedNotifications = notifications.map((notification) =>
        notificationDto(notification)
      );
      setNotifications(updatedNotifications);
    }

    function onRecent(notification) {
      toast(notification.title, {
        classNames: {
          description: "!text-muted-foreground",
        },
        description: notification.description,
        action: {
          label: "Ver detalles",
          onClick: () => handleClick(notification),
        },
      });
    }

    socket?.on("notifications", onNotifications);
    socket?.on("recent-notification", onRecent);

    return () => {
      socket?.off("notifications", onNotifications);
      socket?.off("recent-notification", onRecent);
    };
  }, [socket]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 relative">
          <Bell className="!h-5 !w-5" />
          {activeNotifications.length > 0 && (
            <span className="bg-destructive text-accent text-xs font-semibold h-5 w-5 rounded-full flex justify-center items-center absolute top-0 right-0 -translate-y-1/3 translate-x-1/4">
              {activeNotifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[40rem] w-2xs sm:w-[24rem]">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} onClick={() => handleClick(notification)}>
              <div className={cn(notification.isRead && "opacity-50")}>
                <span className="text-muted-foreground font-semibold">{notification.title}</span>
                <p>{notification.description}</p>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bell />
              </EmptyMedia>
              <EmptyTitle>No hay notificaciones</EmptyTitle>
              <EmptyDescription>
                Ya estás al día. Las nuevas notificaciones aparecerán aquí.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
