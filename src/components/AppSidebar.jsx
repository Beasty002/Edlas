import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  MoreVertical,
  User,
  Settings,
  LogOut,
  Home,
  MessageSquare,
  PlusCircle,
  SchoolIcon,
  BookOpenIcon,
  Users,
  FileDigit,
  Library,
  UserPlus,
  BookMarked,
  UserCheck,
  Bell,
  ClipboardList,
} from 'lucide-react';

import { AuthContext } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const allMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: Home,
    roles: ['superadmin', 'staff', 'student'],
  },
  {
    id: 'students',
    label: 'Students',
    icon: User,
    roles: ['superadmin', 'staff'],
    children: [
      { id: 'all-students', label: 'All Students', path: '/students', icon: Users, roles: ['staff', 'superadmin'] },
      { id: 'new-enrollment', label: 'New Enrollment', path: '/students/newEnrollment', icon: PlusCircle, roles: ['superadmin'] },
      { id: 'placement', label: 'Placement', path: '/students/placement', icon: UserCheck, roles: ['superadmin'] },
    ],
  },
  {
    id: 'staffs',
    label: 'Staff Management',
    icon: Users,
    roles: ['superadmin'],
    children: [
      { id: 'all-staff', label: 'All Staff', path: '/staffs', icon: Users, roles: ['superadmin'] },
      { id: 'add-staff', label: 'Add Staff', path: '/staffs/add', icon: UserPlus, roles: ['superadmin'] },
    ],
  },
  {
    id: 'academics',
    label: 'Academics',
    icon: BookOpenIcon,
    roles: ['superadmin', 'staff'],
    children: [
      { id: 'classes', label: 'Classes', path: '/classes', icon: SchoolIcon, roles: ['superadmin'] },
      { id: 'subjects', label: 'Subjects', path: '/subject-master', icon: BookMarked, roles: ['superadmin'] },
      { id: 'class-courses', label: 'Class Courses', path: '/subjects', icon: Library, roles: ['superadmin'] },
      { id: 'teacher-assignments', label: 'Teacher Assignments', path: '/teacher-assignments', icon: UserCheck, roles: ['superadmin'] },
      { id: 'markings', label: 'Markings', path: '/marks', icon: FileDigit, roles: ['staff', 'superadmin'] },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    icon: Bell,
    roles: ['superadmin'],
  },
  {
    id: 'classroom',
    label: 'My Classroom',
    path: '/classroom',
    icon: ClipboardList,
    roles: ['superadmin', 'staff', 'student'],
    rolePaths: {
      student: '/my-classroom',
      staff: '/classroom',
      superadmin: '/classroom',
    },
  },
  {
    id: 'results',
    label: 'My Results',
    path: '/my-results',
    icon: FileDigit,
    roles: ['student'],
  },
  {
    id: 'ai',
    label: 'AI Chat',
    path: '/ai',
    icon: MessageSquare,
    roles: ['superadmin', 'staff', 'student'],
  },
];

const filterMenuByRole = (menu, userType) => {
  return menu
    .filter((item) => !item.roles || item.roles.includes(userType))
    .map((item) => {
      if (item.children) {
        const filteredChildren = item.children.filter(
          (sub) => !sub.roles || sub.roles.includes(userType)
        );
        if (filteredChildren.length === 0) return null;
        return { ...item, children: filteredChildren };
      }
      if (item.rolePaths && item.rolePaths[userType]) {
        return { ...item, path: item.rolePaths[userType] };
      }
      return item;
    })
    .filter(Boolean);
};

const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || 'U';
};

export function AppSidebar({ isOpen, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [expandedMenus, setExpandedMenus] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userType = user?.user_type || 'student';
  const menuItems = filterMenuByRole(allMenuItems, userType);

  const firstName = user?.first_name || '';
  const lastName = user?.last_name || '';
  const fullName = user?.full_name || `${firstName} ${lastName}`.trim() || 'User';
  const email = user?.email || '';
  const initials = getInitials(firstName, lastName);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = useCallback(
    (path) => {
      return path && location.pathname === path;
    },
    [location.pathname]
  );

  const hasActiveChild = useCallback(
    (children) => {
      return children?.some(
        (child) => isActive(child.path) || (child.children && hasActiveChild(child.children))
      );
    },
    [isActive]
  );

  const toggleMenu = useCallback((id) => {
    setExpandedMenus((prev) => (prev[0] === id ? [] : [id]));
  }, []);

  const handleMenuClick = useCallback(
    (item) => {
      if (item.children?.length > 0) {
        if (!isOpen) {
          onToggle();
          setExpandedMenus([item.id]);
        } else {
          toggleMenu(item.id);
        }
      } else if (item.path) {
        navigate(item.path);
      }
    },
    [isOpen, onToggle, toggleMenu, navigate]
  );

  useEffect(() => {
    const expandParents = (items) => {
      items.forEach((item) => {
        if (item.children && hasActiveChild(item.children)) {
          setExpandedMenus((prev) => {
            if (!prev.includes(item.id)) {
              return [item.id];
            }
            return prev;
          });
        }
      });
    };
    expandParents(menuItems);
  }, [location.pathname]);

  const handleProfileAction = (action) => {
    setIsDropdownOpen(false);
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        break;
      case 'logout':
        logout();
        navigate('/login');
        break;
      default:
        break;
    }
  };

  const renderMenuItem = (item, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children?.length > 0;
    const isExpanded = expandedMenus.includes(item.id);
    const active = isActive(item.path);
    const parentActive = hasChildren && hasActiveChild(item.children);
    const isSubmenu = level > 0;

    return (
      <div key={item.id} className={isSubmenu ? '' : 'mb-0.5'}>
        <button
          className={cn(
            'flex items-center w-full rounded-lg transition-colors duration-200',
            isSubmenu
              ? 'gap-2.5 py-2 px-3 text-[13px] font-medium my-0.5'
              : 'justify-between py-2.5 px-3 text-sm font-medium',
            active
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
              : parentActive
                ? 'bg-blue-100/70 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400'
                : 'text-sidebar-foreground hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-500/15 dark:hover:text-blue-400'
          )}
          onClick={() => handleMenuClick(item)}
          title={!isOpen ? item.label : undefined}
        >
          <span className={cn('flex items-center', isSubmenu ? 'gap-2' : 'gap-3', !isOpen && 'justify-center w-full')}>
            {Icon && (
              <Icon
                size={isSubmenu ? 14 : 18}
                className={cn(
                  'shrink-0 transition-colors',
                  active || parentActive ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
                )}
              />
            )}
            {isOpen && <span className="truncate">{item.label}</span>}
          </span>
          {hasChildren && isOpen && !isSubmenu && (
            <ChevronRight
              size={16}
              className={cn(
                'shrink-0 text-muted-foreground transition-transform duration-200',
                isExpanded && 'rotate-90'
              )}
            />
          )}
        </button>

        {hasChildren && isOpen && (
          <div
            className={cn(
              'ml-5 pl-3 border-l border-sidebar-border overflow-hidden transition-[max-height,opacity] duration-300',
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            {item.children.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen flex flex-col z-50 bg-sidebar border-r border-sidebar-border transition-[width,transform] duration-300 ease-in-out',
        isOpen ? 'w-[280px]' : 'w-[68px]',
        'max-md:w-[280px] max-md:-translate-x-full',
        isOpen && 'max-md:translate-x-0 max-md:z-[1001]'
      )}
    >
      {/* Header */}
      <div className={cn('flex items-center h-14 min-h-[56px] px-4', !isOpen && 'justify-center px-2')}>
        {isOpen && (
          <a href="/" className="flex items-center overflow-hidden">
            <span className="text-lg font-bold text-foreground">Edlas</span>
          </a>
        )}
        <button
          className={cn(
            'flex items-center justify-center w-8 h-8 shrink-0 aspect-square rounded-lg',
            'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground',
            isOpen ? 'ml-auto' : ''
          )}
          onClick={onToggle}
        >
          {isOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto overflow-x-hidden border-t border-sidebar-border custom-scrollbar">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>

      {/* Footer - User Section */}
      <div className="p-2">
        <div
          ref={dropdownRef}
          className={cn(
            'relative flex items-center rounded-lg bg-secondary',
            isOpen ? 'justify-between p-2' : 'justify-center p-2'
          )}
        >
          <div
            className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div
              className="w-9 h-9 min-w-[36px] rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold uppercase"
              title={!isOpen ? fullName : undefined}
            >
              {initials}
            </div>
            {isOpen && (
              <div className="flex flex-col overflow-hidden min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">{fullName}</span>
                <span className="text-xs text-muted-foreground truncate">{email}</span>
              </div>
            )}
          </div>
          {isOpen && (
            <button
              className="flex items-center justify-center w-7 h-7 min-w-[28px] rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              title="User menu"
            >
              <MoreVertical size={18} />
            </button>
          )}

          {/* Profile Dropdown */}
          {isDropdownOpen && (
            <div className="absolute bottom-0 left-[calc(100%+12px)] min-w-[220px] bg-popover border border-border rounded-lg shadow-lg z-[1100] p-2 animate-in fade-in-0 zoom-in-95 max-md:bottom-[calc(100%+8px)] max-md:left-0 max-md:right-0 max-md:min-w-0">
              <div className="flex items-center gap-3 p-2 border-b border-border -mx-2 -mt-2 mb-1 rounded-t-lg">
                <div className="w-9 h-9 min-w-[36px] rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold uppercase">
                  {initials}
                </div>
                <div className="flex flex-col overflow-hidden min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">{fullName}</span>
                  <span className="text-xs text-muted-foreground truncate">{email}</span>
                </div>
              </div>
              <div className="py-1">
                <button
                  className="flex items-center gap-2.5 w-full px-2 py-1.5 text-sm text-foreground hover:bg-accent rounded transition-colors"
                  onClick={() => handleProfileAction('profile')}
                >
                  <User size={16} className="text-muted-foreground" />
                  <span>My Profile</span>
                </button>
                <button
                  className="flex items-center gap-2.5 w-full px-2 py-1.5 text-sm text-foreground hover:bg-accent rounded transition-colors"
                  onClick={() => handleProfileAction('settings')}
                >
                  <Settings size={16} className="text-muted-foreground" />
                  <span>Settings</span>
                </button>
              </div>
              <div className="h-px bg-border my-1"></div>
              <button
                className="flex items-center gap-2.5 w-full px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded transition-colors"
                onClick={() => handleProfileAction('logout')}
              >
                <LogOut size={16} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default AppSidebar;
