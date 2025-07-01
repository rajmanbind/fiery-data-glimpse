import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import Header from "./Header";
import PaginationComponent from "./PaginationComponent";
import { supabase } from "@/supabase";

// Mock API functions - replace these with your actual API endpoints
const fetchChefsData = async () => {
  // const response = await fetch('https://jsonplaceholder.typicode.com/users');
  // return response.json();
  const { data, error } = await supabase.from("become-chef").select("*");
  return data;
};

// let { data: become-chef, error } = await supabase
//   .from('become-chef')
//   .select('*')
//   .range(0, 9)

const fetchUsersData = async () => {
  // const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  // return response.json();
  const { data, error } = await supabase.from("eat-food").select("*");
  return data;
};

const fetchcontactUsData = async () => {
  // const response = await fetch("https://jsonplaceholder.typicode.com/contactUs");
  // return response.json();
    const { data, error } = await supabase.from("contact-us").select("*");
  return data;
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<
    "chefs" | "users" | "contactUs"
  >("chefs");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: chefs,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["chefs"],
    queryFn: fetchChefsData,
  });

  const {
    data: users,
    isLoading: postsLoading,
    error: postsError,
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
        return { data: chefs, loading: usersLoading, error: usersError };
      case "users":
        return { data: users, loading: postsLoading, error: postsError };
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
  const totalItems = data?.length || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data?.slice(startIndex, endIndex) || [];

  const LoadingCard = ({ title }: { title: string }) => (
    <Card className="bg-white border-2" style={{ borderColor: "#C04E2B" }}>
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
      <Card className="bg-white border-2" style={{ borderColor: "#C04E2B" }}>
        <CardHeader>
          <CardTitle style={{ color: "#C04E2B" }}>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} (
            {totalItems})
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                      <div className="flex items-center gap-2">
                        {item.cuisine
                          ? item.cuisine.map((cuisine, index) => (
                              <div
                                className="px-2 py-1 bg-white rounded-md border border-gray-200"
                                key={index}
                              >
                                {cuisine}
                              </div>
                            ))
                          : ""}
                      </div>
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
                 
                  </div>
                )}
              </div>
            ))}
          </div>

          <PaginationComponent
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        <SidebarInset className="flex-1">
          <Header />
          <div className="p-6">
            <div className="max-w-4xl mx-auto">{renderDataCard()}</div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
