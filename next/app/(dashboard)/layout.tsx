import { Metadata } from "next";
import { RootLayout } from "../../components/shared/root-layout";
import { AppSidebar } from "@/components/app-sidebar";
export const metadata: Metadata = {
  title: "Bextpense Tracker - Dashboard",
  description: "Dashboard for your Bextpense Tracker account",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <RootLayout><AppSidebar>{children}</AppSidebar></RootLayout>;
};

export default DashboardLayout;

