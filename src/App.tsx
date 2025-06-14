
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { RealtimeProvider } from '@/components/RealtimeProvider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import { AppRoutes } from '@/components/AppRoutes';
import { queryClient } from '@/config/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RealtimeProvider>
          <Router>
            <AppRoutes />
          </Router>
          <Toaster />
        </RealtimeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
