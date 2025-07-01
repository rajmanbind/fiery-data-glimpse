
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: '#C04E2B' }}>
          Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users Card */}
          {usersLoading ? (
            <LoadingCard title="Users" />
          ) : usersError ? (
            <ErrorCard title="Users" error={usersError} />
          ) : (
            <Card className="bg-white border-2" style={{ borderColor: '#C04E2B' }}>
              <CardHeader>
                <CardTitle style={{ color: '#C04E2B' }}>Users ({users?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {users?.slice(0, 5).map((user: any) => (
                    <div key={user.id} className="p-2 rounded" style={{ backgroundColor: '#C04E2B15' }}>
                      <p className="font-medium" style={{ color: '#C04E2B' }}>{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts Card */}
          {postsLoading ? (
            <LoadingCard title="Posts" />
          ) : postsError ? (
            <ErrorCard title="Posts" error={postsError} />
          ) : (
            <Card className="bg-white border-2" style={{ borderColor: '#C04E2B' }}>
              <CardHeader>
                <CardTitle style={{ color: '#C04E2B' }}>Posts ({posts?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {posts?.slice(0, 5).map((post: any) => (
                    <div key={post.id} className="p-2 rounded" style={{ backgroundColor: '#C04E2B15' }}>
                      <p className="font-medium text-sm" style={{ color: '#C04E2B' }}>{post.title}</p>
                      <p className="text-xs text-gray-600 truncate">{post.body}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments Card */}
          {commentsLoading ? (
            <LoadingCard title="Comments" />
          ) : commentsError ? (
            <ErrorCard title="Comments" error={commentsError} />
          ) : (
            <Card className="bg-white border-2" style={{ borderColor: '#C04E2B' }}>
              <CardHeader>
                <CardTitle style={{ color: '#C04E2B' }}>Comments ({comments?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {comments?.slice(0, 5).map((comment: any) => (
                    <div key={comment.id} className="p-2 rounded" style={{ backgroundColor: '#C04E2B15' }}>
                      <p className="font-medium text-sm" style={{ color: '#C04E2B' }}>{comment.name}</p>
                      <p className="text-xs text-gray-600">{comment.email}</p>
                      <p className="text-xs text-gray-500 truncate">{comment.body}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
