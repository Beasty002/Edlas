import { useContext } from "react";
import {
  Home,
  MessageSquare,
  User,
  PlusCircle,
  ChevronRight,
  SchoolIcon,
  BookOpenIcon,
  Users,
  FileDigit,
  Library,
  UserPlus,
  BookMarked,
  UserCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
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
import { AuthContext } from "@/context/AuthContext";
import { rolePermissions } from "@/data/staticData";

const allMenuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/",
    icon: Home
  },
  {
    id: "students",
    title: "Students",
    icon: User,
    items: [
      { title: "All Students", url: "/students", icon: Users, roles: ["staff", "superadmin"] },
      { title: "New Enrollment", url: "/students/newEnrollment", icon: PlusCircle, roles: ["superadmin"] },
      { title: "Placement", url: "/students/placement", icon: UserCheck, roles: ["superadmin"] },
    ],
  },
  {
    id: "staffs",
    title: "Staff Management",
    icon: Users,
    items: [
      { title: "All Staff", url: "/staffs", icon: Users, roles: ["superadmin"] },
      { title: "Add Staff", url: "/staffs/add", icon: UserPlus, roles: ["superadmin"] },
    ],
  },
  {
    id: "academics",
    title: "Academics",
    icon: BookOpenIcon,
    items: [
      { title: "Classes", url: "/classes", icon: SchoolIcon, roles: ["superadmin"] },
      { title: "Subjects", url: "/subject-master", icon: BookMarked, roles: ["superadmin"] },
      { title: "Class Courses", url: "/subjects", icon: Library, roles: ["superadmin"] },
      { title: "Teacher Assignments", url: "/teacher-assignments", icon: UserCheck, roles: ["superadmin"] },
      { title: "Markings", url: "/marks", icon: FileDigit, roles: ["staff", "superadmin"] },
    ],
  },
  {
    id: "results",
    title: "My Results",
    url: "/my-results",
    icon: FileDigit,
  },
  {
    id: "ai",
    title: "AI Chat",
    url: "/ai",
    icon: MessageSquare
  },
];

const filterMenuByRole = (menu, userType) => {
  const permissions = rolePermissions[userType]?.sidebar || [];

  return menu
    .filter(item => permissions.includes(item.id))
    .map(item => {
      if (item.items) {
        const filteredItems = item.items.filter(
          sub => !sub.roles || sub.roles.includes(userType)
        );
        if (filteredItems.length === 0) return null;
        return { ...item, items: filteredItems };
      }
      return item;
    })
    .filter(Boolean);
};

export function AppSidebar() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const userType = user?.user_type || "student";
  const menuItems = filterMenuByRole(allMenuItems, userType);

  const userData = {
    name: user?.full_name || "User",
    email: user?.email || "",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-b px-4 py-3">
        <span className="font-bold text-lg">Edlas</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) =>
                item.items ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.items.some(sub => location.pathname.startsWith(sub.url))}
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
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
