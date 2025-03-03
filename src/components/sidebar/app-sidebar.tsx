"use client";

import * as React from "react";
import { Command, Loader2, MessageCirclePlus } from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: chats, isPending } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const resp = await client.api.chat.$get();
      const data = await resp.json();

      if ("error" in data) {
        throw new Error(data.error);
      }

      return data;
    },
  });

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">yapAI</span>
                  <span className="text-muted-foreground truncate text-xs">
                    yap all you want with AI
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <MessageCirclePlus />
                <span>New Chat</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isPending ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : (
          chats && <NavMain chats={chats.history} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
