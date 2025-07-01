
import { SidebarTrigger } from '@/components/ui/sidebar';

const Header = () => {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6">
      <SidebarTrigger className="mr-4" />
      <h1 className="text-2xl font-bold" style={{ color: '#C04E2B' }}>
        Dashboard
      </h1>
    </header>
  );
};

export default Header;
