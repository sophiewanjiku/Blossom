import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore, useAuthStore } from './store/index'
import { initParticles, resizeParticles, destroyParticles } from './animations/particles'
import AuthPage from './pages/Auth/index'
import Dashboard from './pages/Dashboard/index'

// ProtectedRoute — if not logged in, redirect to /
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

// PublicRoute — if already logged in, redirect to /app
// so user never sees the auth page again
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
          {/* Auth — logged-in users skip this entirely */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          {/* Dashboard — only accessible when logged in */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}