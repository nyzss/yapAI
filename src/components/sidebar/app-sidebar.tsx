"use client";

import * as React from "react";
import { Command, MessageCirclePlus } from "lucide-react";

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

const data = {
  navMain: [
    {
      title: "Chat History",
      url: "#",
      isActive: true,
      type: "folder",
      items: [
        {
          title: "Discussing AI Ethics",
          url: "#",
        },
        {
          title: "Understanding Quantum Computing",
          url: "#",
        },
        {
          title: "Exploring Space Technologies",
          url: "#",
        },
      ],
    },
    {
      title: "AI Conversations",
      url: "#",
      type: "folder",
      items: [
        {
          title: "Future of Machine Learning",
          url: "#",
        },
        {
          title: "AI in Everyday Life",
          url: "#",
        },
        {
          title: "Deep Learning Breakthroughs",
          url: "#",
        },
      ],
    },
    {
      title: "Tech Discussions",
      url: "#",
      type: "folder",
      items: [
        {
          title: "Latest in Web Development",
          url: "#",
        },
        {
          title: "Cybersecurity Trends",
          url: "#",
        },
        {
          title: "Blockchain Innovations",
          url: "#",
        },
        {
          title: "Cloud Computing Advances",
          url: "#",
        },
      ],
    },
    {
      title: "User Settings",
      url: "#",
      type: "chat",
      items: [
        {
          title: "Profile",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
        {
          title: "Privacy",
          url: "#",
        },
        {
          title: "Account",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const router = useRouter();

  // const createChatMutation = useMutation({
  //   mutationFn: async () => {
  //     const response = await client.api.chat.create.$post();

  //     const data = await response.json();

  //     if (data.error !== null) {
  //       throw new Error(data.error);
  //     }

  //     return data;
  //   },
  // });

  // const handleCreateChat = async () => {
  //   const data = await createChatMutation.mutateAsync();

  //   router.push(`/chat/${data.chat.id}`);
  // };

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
              <Link href="/chat">
                <MessageCirclePlus />
                <span>New Chat</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
