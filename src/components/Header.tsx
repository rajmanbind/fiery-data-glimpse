import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
const Header = ({ isMobile,open,openMobile }) => {
  // const { isMobile,open,openMobile } = useSidebar();
  // console.log(isMobile,open,openMobile);
  return (
    <div
      className={`fixed top-0 right-0 z-10 ${
        (isMobile || !open )? "left-0" : "left-60"
      }`}
    >
      <header
        className={`h-16 border-b border-gray-200 bg-white flex items-center px-6`}
      >
        <SidebarTrigger className="mr-4" />
        <h1 className="text-2xl font-bold text-[#C04E2B]">Dashboard</h1>
      </header>
    </div>
  );
};

export default Header;
