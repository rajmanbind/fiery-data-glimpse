
import Dashboard from '@/components/Dashboard';
import { SidebarProvider } from '@/components/ui/sidebar';
import { supabase } from '@/supabase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
   const [session, setSession] = useState(null)
   const navigate = useNavigate()
   
   useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
       navigate('/');
      }
      if (event === 'SIGNED_OUT') {
       navigate('/login');
      }
    });
console.log(subscription)
    return () => subscription.unsubscribe();
  }, []);
 

  return (
  <SidebarProvider>
    <Dashboard />;
  </SidebarProvider>
  )
};

export default Index;
