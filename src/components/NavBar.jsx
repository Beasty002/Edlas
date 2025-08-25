import { useEffect, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Bell, LogOut } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";

export default function Navbar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (localStorage.theme === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  return (
    <div className="flex items-center justify-between h-16 px-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="font-bold text-lg text-gray-800 dark:text-gray-100">
        <SidebarTrigger />
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
