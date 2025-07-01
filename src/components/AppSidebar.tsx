
import { Users, FileText, MessageSquare } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  activeSection: 'users' | 'posts' | 'comments';
  onSectionChange: (section: 'users' | 'posts' | 'comments') => void;
}

const AppSidebar = ({ activeSection, onSectionChange }: AppSidebarProps) => {
  const menuItems = [
    { id: 'users', title: 'Users', icon: Users },
    { id: 'posts', title: 'Posts', icon: FileText },
    { id: 'comments', title: 'Comments', icon: MessageSquare },
  ];

  return (
    <Sidebar className="w-60">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel style={{ color: '#C04E2B' }}>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id as 'users' | 'posts' | 'comments')}
                    className={`w-full justify-start ${
                      activeSection === item.id 
                        ? 'bg-[#C04E2B15] text-[#C04E2B] font-medium' 
                        : 'hover:bg-[#C04E2B10]'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
