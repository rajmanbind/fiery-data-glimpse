import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpDown, Loader2, Search } from 'lucide-react';
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppSidebar from './AppSidebar';
import Header from './Header';
import PaginationComponent from './PaginationComponent';
import { supabase } from '@/supabase';
import { useClickOutside } from '@/hooks/useClickOutSide';

const fetchChefsData = async () => {
  const { data, error } = await supabase.from("become-chef").select("*");
  return data;
};

// let { data: become-chef, error } = await supabase
//   .from('become-chef')
//   .select('*')
//   .range(0, 9)

const fetchUsersData = async () => {
  const { data, error } = await supabase.from("eat-food").select("*");
  return data;
};

const fetchcontactUsData = async () => {
    const { data, error } = await supabase.from("contact-us").select("*");
  return data;
};

const Dashboard = () => {

  const [activeSection, setActiveSection] = useState<"chefs" | "users" | "contactUs">("chefs");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsSortDropdownOpen(false));
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const {
    data: chefs,
    isLoading: chefsLoading,
    error: chefsError,
  } = useQuery({
    queryKey: ["chefs"],
    queryFn: fetchChefsData,
  });

  const {
    data: users,
    isLoading: usersLaoding,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsersData,
  });

  const {
    data: contactUs,
    isLoading: contactUsLoading,
    error: contactUsError,
  } = useQuery({
    queryKey: ["contactUs"],
    queryFn: fetchcontactUsData,
  });

  const handleSectionChange = (section: "chefs" | "users" | "contactUs") => {
    setActiveSection(section);
    setCurrentPage(1);
  };

  const getCurrentData = () => {
    switch (activeSection) {
      case "chefs":
        return { data: chefs, loading: chefsLoading, error: chefsError };
      case "users":
        return { data: users, loading: usersLaoding, error: usersError };
      case "contactUs":
        return {
          data: contactUs,
          loading: contactUsLoading,
          error: contactUsError,
        };
      default:
        return { data: [], loading: false, error: null };
    }
  };

  const { data, loading, error } = getCurrentData();



 // Process data with search and sort
  const processedData = useMemo(() => {
    if (!data) return [];

    let result = [...data];
    console.log(result)
    // Apply search filter
    if (searchQuery) {
      // console.log(searchQuery)
      const query = searchQuery.toLowerCase();
      // console.log(query)
      result = result.filter(item => 
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query) ||
        item.city?.toLowerCase().includes(query) ||
        (activeSection === "contactUs" && item.subject?.toLowerCase().includes(query))
      );
    }
     console.log(result)
    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    
    return result;
  }, [data, searchQuery, sortOrder, activeSection]);
  //   const totalItems = data?.length || 0;
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const paginatedData = data?.slice(startIndex, endIndex) || [];

  const totalItems = processedData.length;
  console.log(processedData)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = processedData.slice(startIndex, endIndex);

//  const renderHeaderControls = () => (
//     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
//       <CardTitle style={{ color: "#C04E2B" }}>
//         {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} ({totalItems})
//       </CardTitle>
      
//       <div className="flex items-center gap-2">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setCurrentPage(1); // Reset to first page when searching
//             }}
//             className="pl-10 pr-4 font-normal py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C04E2B]"
//           />
//         </div>
        
//         <button
//           onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
//           className="flex items-center gap-1 px-3 py-2 border rounded-lg hover:bg-gray-50"
//         >
//           <ArrowUpDown className="h-4 w-4" />
//           <span>{sortOrder === "asc" ? "Oldest" : "Newest"}</span>
//         </button>
//       </div>
//     </div>
//   );
 

const renderHeaderControls = () => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
    <CardTitle style={{ color: "#C04E2B" }}>
      {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} ({totalItems})
    </CardTitle>
    
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
          setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10 pr-4 font-normal text-xl py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C04E2B]"
        />
      </div>
      
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={(e) =>{e.stopPropagation(); setIsSortDropdownOpen(!isSortDropdownOpen)}}
          className="flex items-center gap-1 px-3 py-2 border rounded-lg hover:bg-gray-50 font-normal text-xl"
        >
          {/* <ArrowUpDown className="h-4 w-4" /> */}
          {/* <span>{sortOrder === "asc" ? "Ascending" : "Descending"}</span> */}
          filter
        </button>
        
        {isSortDropdownOpen && (
          <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg z-10 border">
            <div className="py-1">
             
              <button
                onClick={() => {
                  setSortOrder("desc");
                  setIsSortDropdownOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  sortOrder === "desc" ? "bg-[#C04E2B10] text-[#C04E2B]" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
              Ascending
              </button>
               <button
                onClick={() => {
                  setSortOrder("asc");
                  setIsSortDropdownOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  sortOrder === "asc" ? "bg-[#C04E2B10] text-[#C04E2B]" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Descending
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
const LoadingCard = ({ title }: { title: string }) => (
    <Card className="bg-white border-2 border-[#C04E2B]">
      <CardHeader>
        <CardTitle style={{ color: "#C04E2B" }}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-32">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "#C04E2B" }}
        />
      </CardContent>
    </Card>
  );

  const ErrorCard = ({ title, error }: { title: string; error: any }) => (
    <Card className="bg-white border-2" style={{ borderColor: "#C04E2B" }}>
      <CardHeader>
        <CardTitle style={{ color: "#C04E2B" }}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-500">Error loading data: {error?.message}</p>
      </CardContent>
    </Card>
  );
const formatRelativeTime = (dateString: string | Date): string => {
  // Handle both string and Date inputs
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return 'unknown time';
  }

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  // Find the largest unit that fits
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `${interval} ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }

  // For future dates or just now
  if (seconds < 0) {
    return 'in the future';
  }
  return 'just now';
};
  const renderDataCard = () => {
    if (loading) {
      return (
        <LoadingCard
          title={activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        />
      );
    }

    if (error) {
      return (
        <ErrorCard
          title={activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          error={error}
        />
      );
    }

    return (
      <Card className="bg-white border-none h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle style={{ color: "#C04E2B" }}>

             <CardHeader className="flex-shrink-0">
          {renderHeaderControls()}
        </CardHeader>
            {/* {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} (
            {totalItems}) */}
          </CardTitle>
        </CardHeader>
        <CardContent className=''>
          <div className="space-y-3">
            {paginatedData.map((item: any) => (
              <div
                key={item.id}
                className="p-3 rounded border overflow-hidden break-words"
                style={{
                  backgroundColor: "#C04E2B15",
                  borderColor: "#C04E2B30",
                }}
              >
                {activeSection === "chefs" && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong>Name:</strong>

                      <p className="font-medium" style={{ color: "#C04E2B" }}>
                        {item.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>Email:</strong>
                      <p className="text-sm text-gray-600">{item.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <strong>Address:</strong>
                      <div className="flex items-center gap-1">
                        <p className="text-sm text-gray-500">{item.phone},</p>
                        <p className="text-sm text-gray-500">{item.city},</p>
                        <p className="text-sm text-gray-500">{item.zipCode}</p>
                      </div>
                    </div>
                        <div className="flex items-center gap-2 mt-2">
                      <strong>Cuisine: </strong>
                      <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
                        {item.cuisine
                          ? item.cuisine.map((cuisine, index) => (
                              <div
                                key={index}
                                className="px-2 py-1 bg-white rounded-md border border-gray-200 whitespace-nowrap"
                              >
                                {cuisine}
                              </div>
                            ))
                          : ""}
                      </div>
                    </div>
                      <div className="flex items-center gap-2">
                      <strong>Created At:</strong>
                      <p className="text-sm text-gray-600">{formatRelativeTime(item.created_at)}</p>
                    </div>
                  </div>
                )}
                {activeSection === "users" && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong>Name:</strong>

                      <p className="font-medium" style={{ color: "#C04E2B" }}>
                        {item.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>Email:</strong>
                      <p className="text-sm text-gray-600">{item.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <strong>Address:</strong>
                      <div className="flex items-center gap-1">
                        <p className="text-sm text-gray-500">{item.phone},</p>
                        <p className="text-sm text-gray-500">{item.city},</p>
                        <p className="text-sm text-gray-500">{item.zipCode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <strong>Cuisine: </strong>
                      <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
                        {item.cuisine
                          ? item.cuisine.map((cuisine, index) => (
                              <div
                                key={index}
                                className="px-2 py-1 bg-white rounded-md border border-gray-200 whitespace-nowrap"
                              >
                                {cuisine}
                              </div>
                            ))
                          : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <strong>Dietary: </strong>
                      <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
                        {item.dietary
                          ? item.dietary.map((dietary, index) => (
                              <div
                                className="px-2 py-1 bg-white rounded-md border border-gray-200 whitespace-nowrap"
                                key={index}
                              >
                                {dietary}
                              </div>
                            ))
                          : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>Created At:</strong>
                      <p className="text-sm text-gray-600">{formatRelativeTime(item.created_at)}</p>
                    </div>
                  </div>
                )}
                {activeSection === "contactUs" && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong>Name:</strong>

                      <p className="font-medium" style={{ color: "#C04E2B" }}>
                        {item.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>Email:</strong>
                      <p className="text-sm text-gray-600">{item.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>Phone:</strong>
                      <p className="text-sm text-gray-600">{item.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>Subject:</strong>
                      <p className="text-sm text-gray-600">{item.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>Message:</strong>
                      <p className="text-sm text-gray-600">{item.message}</p>
                    </div>

                    {/* <div className="flex items-center gap-2">
                      <strong>Address:</strong>
                      <div className="flex items-center gap-1">
                        <p className="text-sm text-gray-500">{item.phone},</p>
                        <p className="text-sm text-gray-500">{item.city},</p>
                        <p className="text-sm text-gray-500">{item.zipCode}</p>
                      </div>
                    </div> */}
                 <div className="flex items-center gap-2">
                      <strong>Created At:</strong>
                      <p className="text-sm text-gray-600">{formatRelativeTime(item.created_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const { isMobile,open,openMobile } = useSidebar();
   const  isShowPagination=totalItems>itemsPerPage

   console.log({ isMobile,open,openMobile })
  return (
      <div className="min-h-screen flex w-full">
        <AppSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        <SidebarInset  className={`flex-1 flex flex-col ${
    isMobile || openMobile ? 'w-[100vw]' : 'w-[calc(100vw-240px)]'
  }`}>
            <Header  isMobile={isMobile} open={open} openMobile={openMobile} />
          <div className={`flex-1 pt-16 overflow-hidden scroll-container`} 
          
          
          
            style={{
    maxHeight: isShowPagination
      ? "calc(100vh - 73px)"
      : "calc(100vh - 33px)",
  }}
          >
            <div className="max-w-4xl mx-auto">{renderDataCard()}</div>
          </div>
              <PaginationComponent
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                isMobile={isMobile} 
                open={open} 
                openMobile={openMobile} 
              
              />
        </SidebarInset>
      </div>
  );
};

export default Dashboard;
