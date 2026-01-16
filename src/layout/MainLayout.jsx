import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <AppSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-[999] transition-opacity duration-300',
          sidebarOpen && isMobile ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
        onClick={closeSidebarOnMobile}
      />

      <div
        className={cn(
          'h-screen overflow-hidden transition-all duration-300 ease-in-out p-2',
          sidebarOpen ? 'ml-[280px]' : 'ml-[68px]',
          'max-md:ml-0 max-md:p-0'
        )}
      >
        <div className="flex h-full w-full flex-col rounded-xl shadow-sm bg-card overflow-hidden max-md:rounded-none">
          <Navbar onMenuToggle={toggleSidebar} isMobile={isMobile} />
          <div className="flex-1 overflow-auto p-4 custom-scrollbar">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
