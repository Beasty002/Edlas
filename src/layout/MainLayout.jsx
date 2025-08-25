import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/NavBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className={"overflow-hidden"}>
        <Navbar />
        <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900 h-[calc(100dvh-64px)]">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
