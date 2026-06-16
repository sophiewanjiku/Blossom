import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore } from './store/index'
import { initParticles, resizeParticles, destroyParticles } from './animations/particles'
import Welcome from './pages/Welcome'
import AuthPage from './pages/Auth/index'
import AuthPage from './pages/Auth/index'
import Dashboard from './pages/Dashboard/index'

export default function App() {
  const { themeId } = useThemeStore()

  useEffect(() => {
    // Apply theme CSS variables
    document.documentElement.setAttribute('data-theme', themeId)

    // Start the particle animation
    initParticles(themeId)

    // Handle window resize
    const onResize = () => resizeParticles()
    window.addEventListener('resize', onResize)

    // Cleanup when component unmounts or theme changes
    return () => {
      window.removeEventListener('resize', onResize)
      destroyParticles()
    }
  }, [themeId]) // runs again every time themeId changes

  return (
    <>
      {/* The particle canvas sits behind everything */}
      <canvas id="blossom-particles" aria-hidden="true" />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/app/*" element={<Dashboard />} />
          <Route path="/"        element={<AuthPage />} />
          <Route path="/app/*"   element={<Dashboard />} />
        
        </Routes>
      </BrowserRouter>
    </>
  )
}