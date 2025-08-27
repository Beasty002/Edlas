import {
  Home,
  MessageSquare,
  User,
  PlusCircle,
  ChevronRight,
  BookAIcon,
  SchoolIcon,
  BookOpenIcon,
  Navigation2,
  ArrowUpDown,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import NavUser from "./NavUser";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  {
    title: "Students",
    icon: User,
    items: [
      { title: "All Students", url: "/students", icon: User },
      {
        title: "New Enrollment",
        url: "/students/newEnrollment",
        icon: PlusCircle,
      },
      {
        title: "Placement",
        url: "/students/placement",
        icon: ArrowUpDown,
      },
    ],
  },
  {
    title: "Academics",
    icon: BookOpenIcon,
    items: [
      { title: "Classes", url: "/classes", icon: SchoolIcon },
      { title: "Subjects", url: "/subjects", icon: BookOpenIcon },
    ],
  },
  { title: "AI chat", url: "/ai", icon: MessageSquare },
];

const data = {
  name: "beasty",
  email: "beasty@gmail.com",
  avatar: "/avatars/shadcn.jpg",
};

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) =>
                item.items ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={location.pathname.startsWith("/students")}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((sub) => (
                            <SidebarMenuSubItem key={sub.title}>
                              <SidebarMenuButton
                                asChild
                                isActive={location.pathname === sub.url}
                              >
                                <Link to={sub.url}>
                                  {sub.icon && <sub.icon size={16} />}
                                  <span>{sub.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                    >
                      <Link to={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data} />
      </SidebarFooter>
    </Sidebar>
  );
}
