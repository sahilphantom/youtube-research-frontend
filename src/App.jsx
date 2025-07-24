import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import VideoAnalysis from './components/VideoAnalysis'
import ChannelAnalysis from './components/ChannelAnalysis'
import VideoSearch from './components/VideoSearch'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Pricing from './components/Pricing'
import SuccessPage from './components/SuccessPage'
import CancelledPage from './components/CancelledPage'
import AccountPage from './components/AccountPage'
import AdminUsers from './components/AdminUsers'
import NotFound from './components/NotFound'
import Unauthorized from './components/Unauthorized'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider } from './context/AuthContext'
import Footer from './components/Footer'
import Feature from './components/Feature'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<Pricing />} />
              <Route path="/feature" element={<Feature />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes - require authentication */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />
            <Route path="/subscription-success" element={<PrivateRoute><SuccessPage /></PrivateRoute>} />
            <Route path="/subscription-cancelled" element={<PrivateRoute><CancelledPage /></PrivateRoute>} />

            {/* Protected routes - require subscription */}
            <Route 
              path="/video-analysis" 
              element={
                <PrivateRoute requireSubscription>
                  <VideoAnalysis />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/channel-analysis" 
              element={
                <PrivateRoute requireSubscription>
                  <ChannelAnalysis />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/video-search" 
              element={
                <PrivateRoute requireSubscription>
                  <VideoSearch />
                </PrivateRoute>
              } 
            />

            {/* Admin routes */}
            <Route 
              path="/admin/users" 
              element={
                <PrivateRoute requireAdmin>
                  <AdminUsers />
                </PrivateRoute>
              } 
            />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
          <Footer />
      </div>
    </AuthProvider>
  )
}

export default App 