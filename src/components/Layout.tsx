
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Close the mobile sidebar when changing routes
  useEffect(() => {
    if (isMobile) {
      setIsSheetOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {isMobile ? (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar currentPath={location.pathname} />
          </SheetContent>
        </Sheet>
      ) : (
        <Sidebar currentPath={location.pathname} />
      )}
      <main className="flex-1 overflow-auto">
        <div className={`container mx-auto py-6 ${isMobile ? 'px-4 pt-14' : 'px-4'}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
