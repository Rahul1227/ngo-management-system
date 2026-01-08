import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserDashboard from './components/user/UserDashboard';
import DonationForm from './components/user/DonationForm';
import DonationHistory from './components/user/DonationHistory';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';

function App() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={logout} />
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
              <div className="text-center container-padding">
                <img 
                  src="/assets/images/logo.png" 
                  alt="Aarambh Logo" 
                  className="h-24 mx-auto mb-6"
                />
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
                  Welcome to Aarambh
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  An NSS Initiative - Supporting causes through transparent donation management
                </p>
                {!user && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/login" className="btn btn-primary">Login</a>
                    <a href="/register" className="btn btn-outline">Register</a>
                  </div>
                )}
                {user && (
                  <a 
                    href={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} 
                    className="btn btn-primary"
                  >
                    Go to Dashboard
                  </a>
                )}
              </div>
            </div>
          } />
          
          <Route path="/login" element={
            user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} /> : <Login />
          } />
          
          <Route path="/register" element={
            user ? <Navigate to="/user/dashboard" /> : <Register />
          } />

          {/* Protected User Routes */}
          <Route path="/user/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/user/donate" element={
            <ProtectedRoute>
              <DonationForm />
            </ProtectedRoute>
          } />
          
          <Route path="/user/history" element={
            <ProtectedRoute>
              <DonationHistory />
            </ProtectedRoute>
          } />

          {/* Protected Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;