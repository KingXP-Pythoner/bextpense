"use client";

import * as React from "react";
import { Command } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/shared/ui/sidebar";
import Link from "next/link";
import { appSidebarData } from "@/constants/app-sidebar-data";
import { ModeToggle } from "@/components/theme-toggle";

const AppSidebarNavigation = ({
	...props
}: React.ComponentProps<typeof Sidebar>) => {
	return (
		<Sidebar collapsible="icon" variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" className="-ml-2" asChild>
							<Link href="/app">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Command className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										Bextpense Tracker
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>
					{appSidebarData.navMain.map((item) => {
						const Icon = item.icon;
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton tooltip={item.title} asChild>
								<Link href={item.url}>
									<Icon className="size-4 p-0 shrink-0" />
										{item.title}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter></SidebarFooter>
		</Sidebar>
	);
};

export const AppSidebar = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<AppSidebarNavigation />
			<SidebarInset className="overflow-hidden">
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4 w-full">
						<SidebarTrigger className="-ml-1" />
						<div className="w-full flex justify-end">
						<ModeToggle />
						</div>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
						{children}
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}; 