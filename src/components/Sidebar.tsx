
import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, PackageCheck, Quote, Users, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
}

const NavItem = ({ icon, label, path, active }: NavItemProps) => {
  return (
    <Link 
      to={path} 
      className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-md transition-colors",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

interface SidebarProps {
  currentPath: string;
}

const Sidebar = ({ currentPath }: SidebarProps) => {
  const navItems = [
    { icon: <Truck className="w-5 h-5" />, label: 'Shipments', path: '/shipments' },
    { icon: <Quote className="w-5 h-5" />, label: 'Quotes', path: '/quotes' },
    { icon: <Users className="w-5 h-5" />, label: 'Supplier Leads', path: '/supplier-leads' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Agent Comms', path: '/agent-comms' },
    { icon: <PackageCheck className="w-5 h-5" />, label: 'Contacts', path: '/contacts' },
  ];

  return (
    <div className="h-full w-64 bg-sidebar flex flex-col border-r border-border">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Alison Transport</h1>
      </div>
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem 
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={currentPath === item.path}
            />
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
