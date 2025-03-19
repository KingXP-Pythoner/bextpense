import { FileChartLineIcon } from "@/components/shared/icons/file-chart-line";
import { HandCoinsIcon } from "@/components/shared/icons/hand-coins";
import { SettingsGearIcon } from "@/components/shared/icons/settings-gear";
import { TrendingDownIcon } from "@/components/shared/icons/trending-down";

export const appSidebarData = {
	user: {
		name: "Bextpense Tracker",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Income",
			url: "#",
			icon: HandCoinsIcon,
		},
		{
			title: "Expenses",
			url: "#",
			icon: TrendingDownIcon,
		},
		{
			title: "Reports",
			url: "#",
			icon: FileChartLineIcon,
		},
		{
			title: "Settings",
			url: "#",
			icon: SettingsGearIcon,
		},
	],
};
