import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Apply from './pages/Apply';
import Underwriter from './pages/Underwriter';
import Fairness from './pages/Fairness';
import Login from './pages/Login';
import PrivacySecurity from './pages/PrivacySecurity';
import TrustBridgeAssistant from './components/assistant/TrustBridgeAssistant';

// Helper to scroll to top whenever navigation occurs
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function MainLayout() {
  const location = useLocation();
  const cockpitPaths = [
    '/underwriter',
    '/behavioral-signals',
    '/risk-intelligence',
    '/explainability',
    '/verification',
    '/simulation',
    '/portfolio',
    '/audit',
    '/research'
  ];
  const isCockpit = cockpitPaths.some(p => location.pathname.startsWith(p));
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-[#090d16] text-[#f1f5f9] font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <ScrollToTop />
      
      {/* Sticky Global FinTech Navigation on public pages */}
      {!isCockpit && !isAuthPage && <Navbar />}

      {/* Multi-Page Route Content */}
      <div className={`flex-grow flex flex-col ${isCockpit ? 'h-screen overflow-hidden' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/fairness" element={<Fairness />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/privacy-security" element={<PrivacySecurity />} />

          {/* Protected Enterprise Cockpit Routes (Underwriter & Admin Only) */}
          <Route
            path="/underwriter"
            element={
              <ProtectedRoute allowedRoles={['underwriter', 'admin']}>
                <Underwriter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/behavioral-signals"
            element={
              <ProtectedRoute allowedRoles={['underwriter', 'admin']}>
                <Underwriter defaultTab="behavioral-signals" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/risk-intelligence"
            element={
              <ProtectedRoute allowedRoles={['underwriter', 'admin']}>
                <Underwriter defaultTab="early-warnings" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explainability"
            element={
              <ProtectedRoute allowedRoles={['underwriter', 'admin']}>
                <Underwriter defaultTab="explainability" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explainability/counterfactual"
            element={
              <ProtectedRoute allowedRoles={['underwriter', 'admin']}>
                <Underwriter defaultTab="counterfactual" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verification"
            element={
              <ProtectedRoute allowedRoles={['underwriter', 'admin']}>
                <Underwriter defaultTab="verification" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verification/fraud"
            element={
              <ProtectedRoute allowedRoles={['underwriter', 'admin']}>
                <Underwriter defaultTab="fraud-checks" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulation"
            element={
              <ProtectedRoute allowedRoles={['underwriter', 'admin']}>
                <Underwriter defaultTab="simulation" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute allowedRoles={['underwriter', 'admin']}>
                <Underwriter defaultTab="portfolio" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit"
            element={
              <ProtectedRoute allowedRoles={['underwriter', 'admin']}>
                <Underwriter defaultTab="audit" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/research"
            element={
              <ProtectedRoute allowedRoles={['underwriter', 'admin']}>
                <Underwriter defaultTab="research" />
              </ProtectedRoute>
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>

      {/* Floating TrustBridge Assistant on public / borrower views */}
      {!isCockpit && !isAuthPage && <TrustBridgeAssistant />}

      {/* Global FinTech Footer on public pages */}
      {!isCockpit && !isAuthPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}