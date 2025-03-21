import { Metadata } from "next";
import { RootLayout } from "../../components/shared/root-layout";
import { AppSidebar } from "@/layouts";
import { CreateTransactionDialog } from "@/features/transactions";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
export const metadata: Metadata = {
	title: "Bextpense Tracker - Dashboard",
	description: "Dashboard for your Bextpense Tracker account",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<RootLayout>
			<NuqsAdapter>
			<AppSidebar>
				<div className="w-full flex justify-end max-w-6xl mx-auto">
					<CreateTransactionDialog />
				</div>
				{children}
				</AppSidebar>
				</NuqsAdapter>
		</RootLayout>
	);
};

export default DashboardLayout;
