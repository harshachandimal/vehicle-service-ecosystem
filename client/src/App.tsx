import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import ProvidersPage from './pages/ProvidersPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import BusinessRegisterPage from './pages/auth/BusinessRegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'; 
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import CreateBookingPage from './pages/bookings/CreateBookingPage';
import ProviderDashboard from './pages/dashboard/provider/ProviderDashboard';
import ProviderBookingDetails from './pages/dashboard/provider/ProviderBookingDetails';
import MyServices from './pages/dashboard/provider/MyServices';
import ProfileSettings from './pages/dashboard/provider/ProfileSettings';
import OwnerDashboard from './pages/dashboard/owner/OwnerDashboard';
import MyVehicles from './pages/dashboard/owner/MyVehicles';
import VehicleDetails from './pages/dashboard/owner/VehicleDetails';
import ServiceHistory from './pages/dashboard/owner/ServiceHistory';
import BookingDetails from './pages/dashboard/owner/BookingDetails';

/**
 * Main application component with routing and authentication provider
 * @returns App component
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth routes - no navbar/footer */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/business" element={<BusinessRegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Dashboard routes - no navbar/footer, dashboard has its own sidebar */}
          <Route path="/dashboard/provider" element={<ProviderDashboard />} />
          <Route path="/dashboard/provider/bookings/:id" element={<ProviderBookingDetails />} />
          <Route path="/dashboard/provider/services" element={<MyServices />} />
          <Route path="/dashboard/provider/settings" element={<ProfileSettings />} />
          <Route path="/dashboard/owner" element={<OwnerDashboard />} />
          <Route path="/dashboard/owner/vehicles" element={<MyVehicles />} />
          <Route path="/dashboard/owner/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/dashboard/owner/history" element={<ServiceHistory />} />
          <Route path="/dashboard/owner/bookings/:id" element={<BookingDetails />} />

          {/* Main routes - with navbar/footer */}
          <Route path="/*" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/providers" element={<ProvidersPage />} />
                  <Route path="/providers/:id" element={<ProviderProfilePage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/book/:serviceId" element={<CreateBookingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<AboutPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
