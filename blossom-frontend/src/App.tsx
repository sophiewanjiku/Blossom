import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore } from './store/index'
import { initParticles, resizeParticles, destroyParticles } from './animations/particles'
import AuthPage from './pages/Auth/index'
import Dashboard from './pages/Dashboard/index'

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
          <Route path="/"          element={<AuthPage />} />
          <Route path="/app/*"     element={<Dashboard />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}