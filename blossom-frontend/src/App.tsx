import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore, useAuthStore } from './store/index'
import { initParticles, resizeParticles, destroyParticles } from './animations/particles'
import AuthPage from './pages/Auth/index'
import Dashboard from './pages/Dashboard/index'
import ResetPassword from './pages/Auth/ResetPassword'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/app" replace />
  return <>{children}</>
}

export default function App() {
  const { themeId } = useThemeStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId)
    initParticles(themeId)
    const onResize = () => resizeParticles()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      destroyParticles()
    }
  }, [themeId])

  return (
    <>
      <canvas id="blossom-particles" aria-hidden="true" />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          {/* These two routes work WITHOUT being logged in
              because the user clicks them from their email */}
          <Route path="/verify-email"   element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}