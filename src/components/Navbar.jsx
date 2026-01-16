import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Bell, Menu } from 'lucide-react';

export default function Navbar({ onMenuToggle, isMobile }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (localStorage.theme === 'dark') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  return (
    <div className="flex items-center justify-between h-[49px] px-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center gap-2">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onMenuToggle}>
            <Menu className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
