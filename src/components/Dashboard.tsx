
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppSidebar from './AppSidebar';
import Header from './Header';
import PaginationComponent from './PaginationComponent';

// Mock API functions - replace these with your actual API endpoints
const fetchUsersData = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  return response.json();
};

const fetchPostsData = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  return response.json();
};

const fetchCommentsData = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/comments');
  return response.json();
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<'users' | 'posts' | 'comments'>('users');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsersData,
  });

  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPostsData,
  });

  const { data: comments, isLoading: commentsLoading, error: commentsError } = useQuery({
    queryKey: ['comments'],
    queryFn: fetchCommentsData,
  });

  const handleSectionChange = (section: 'users' | 'posts' | 'comments') => {
    setActiveSection(section);
    setCurrentPage(1);
  };

  const getCurrentData = () => {
    switch (activeSection) {
      case 'users':
        return { data: users, loading: usersLoading, error: usersError };
      case 'posts':
        return { data: posts, loading: postsLoading, error: postsError };
      case 'comments':
        return { data: comments, loading: commentsLoading, error: commentsError };
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
    <Card className="bg-white border-2" style={{ borderColor: '#C04E2B' }}>
      <CardHeader>
        <CardTitle style={{ color: '#C04E2B' }}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#C04E2B' }} />
      </CardContent>
    </Card>
  );

  const ErrorCard = ({ title, error }: { title: string; error: any }) => (
    <Card className="bg-white border-2" style={{ borderColor: '#C04E2B' }}>
      <CardHeader>
        <CardTitle style={{ color: '#C04E2B' }}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-500">Error loading data: {error?.message}</p>
      </CardContent>
    </Card>
  );

  const renderDataCard = () => {
    if (loading) {
      return <LoadingCard title={activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} />;
    }

    if (error) {
      return <ErrorCard title={activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} error={error} />;
    }

    return (
      <div className="flex flex-col h-full">
        <Card className="bg-white border-2 flex-1 flex flex-col" style={{ borderColor: '#C04E2B' }}>
          <CardHeader className="flex-shrink-0">
            <CardTitle style={{ color: '#C04E2B' }}>
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} ({totalItems})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3">
                {paginatedData.map((item: any) => (
                  <div key={item.id} className="p-3 rounded border" style={{ backgroundColor: '#C04E2B15', borderColor: '#C04E2B30' }}>
                    {activeSection === 'users' && (
                      <>
                        <p className="font-medium" style={{ color: '#C04E2B' }}>{item.name}</p>
                        <p className="text-sm text-gray-600">{item.email}</p>
                        <p className="text-sm text-gray-500">{item.phone}</p>
                      </>
                    )}
                    {activeSection === 'posts' && (
                      <>
                        <p className="font-medium text-sm" style={{ color: '#C04E2B' }}>{item.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{item.body}</p>
                      </>
                    )}
                    {activeSection === 'comments' && (
                      <>
                        <p className="font-medium text-sm" style={{ color: '#C04E2B' }}>{item.name}</p>
                        <p className="text-xs text-gray-600">{item.email}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.body}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex-shrink-0 pt-4">
              <PaginationComponent
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
        <SidebarInset className="flex-1 flex flex-col">
          <div className="fixed top-0 right-0 left-60 z-10">
            <Header />
          </div>
          <div className="flex-1 pt-16 p-6 min-h-0">
            <div className="max-w-4xl mx-auto h-full">
              {renderDataCard()}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
