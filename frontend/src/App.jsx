import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import SurgeToast from './components/SurgeToast';
import Dashboard from './pages/Dashboard';
import Appliances from './pages/Appliances';
import History from './pages/History';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="h-screen bg-darkBg text-white flex items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white dark:bg-[#0c1f15] transition-colors duration-300">
      <Sidebar />
      <SurgeToast />
      <div className="flex-1 flex flex-col min-w-0 bg-[#9CD49E] transition-colors duration-300 pt-14 md:pt-0 h-full overflow-hidden">
        <main className="flex-1 overflow-hidden relative text-gray-900 dark:text-gray-100 h-full">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/appliances" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Appliances />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <DashboardLayout>
              <History />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Reports />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
