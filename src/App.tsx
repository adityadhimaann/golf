import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from './pages/public/LandingPage'
import { PricingPage } from './pages/public/PricingPage'
import { CharityDirectoryPage } from './pages/public/CharityDirectoryPage'
import { CharityProfilePage } from './pages/public/CharityProfilePage'
import { LoginPage } from './pages/auth/LoginPage'
import { SignUpPage } from './pages/auth/SignUpPage'

import { PublicLayout } from './layouts/PublicLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import { AdminLayout } from './layouts/AdminLayout'

import { OverviewTab } from './pages/dashboard/OverviewTab'
import { MyScoresTab } from './pages/dashboard/MyScoresTab'
import { MyDrawsTab } from './pages/dashboard/MyDrawsTab'
import { CharityTab } from './pages/dashboard/CharityTab'
import { WinningsTab } from './pages/dashboard/WinningsTab'
import { ProfileTab } from './pages/dashboard/ProfileTab'

import { AdminOverviewTab } from './pages/admin/AdminOverviewTab'
import { UserManagementTab } from './pages/admin/UserManagementTab'
import { DrawManagementTab } from './pages/admin/DrawManagementTab'
import { CharityManagementTab } from './pages/admin/CharityManagementTab'
import { WinnersManagementTab } from './pages/admin/WinnersManagementTab'
import { ReportsTab } from './pages/admin/ReportsTab'

// Simple mock protected route
const RequireAuth = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  const isAuthenticated = !!token
  const isAdmin = user.role === 'admin'

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />

  return children
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/charities" element={<CharityDirectoryPage />} />
          <Route path="/charity/:id" element={<CharityProfilePage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* User Dashboard Routes */}
        <Route path="/dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
          <Route index element={<OverviewTab />} />
          <Route path="scores" element={<MyScoresTab />} />
          <Route path="draws" element={<MyDrawsTab />} />
          <Route path="charity" element={<CharityTab />} />
          <Route path="winnings" element={<WinningsTab />} />
          <Route path="profile" element={<ProfileTab />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<RequireAuth requireAdmin><AdminLayout /></RequireAuth>}>
          <Route index element={<AdminOverviewTab />} />
          <Route path="users" element={<UserManagementTab />} />
          <Route path="draws" element={<DrawManagementTab />} />
          <Route path="charities" element={<CharityManagementTab />} />
          <Route path="winners" element={<WinnersManagementTab />} />
          <Route path="reports" element={<ReportsTab />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
