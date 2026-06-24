import { useEffect, useRef } from 'react'
import type { ThemeId } from '../themes/themes'

// Phase definitions — days mapped to degrees
// 28 day cycle = 360 degrees
// Menstrual: days 1-5   = 64°
// Follicular: days 6-13 = 103°
// Ovulation: day 14     = 13°
// Luteal: days 15-28    = 180°

interface PhaseConfig {
  start: number
  end: number
  col: string
  highlight: string
  label: string
}

const PHASE_ANGLES: PhaseConfig[] = [
  { start: -90, end:  -26, col: '',  highlight: '', label: 'Menstrual'  },
  { start: -26, end:   77, col: '',  highlight: '', label: 'Follicular' },
  { start:  77, end:   90, col: '',  highlight: '', label: 'Ovulation'  },
  { start:  90, end:  270, col: '',  highlight: '', label: 'Luteal'     },
]

// Theme-specific phase colours
const THEME_PHASE_COLORS: Record<ThemeId, {phases: string[], highlights: string[]}> = {
  frozen: {
    phases:     ['#1A4A7A', '#2A6A9A', '#A8D8FF', '#0F3A5A'],
    highlights: ['#3A6A9A', '#4A8ABA', '#C8E8FF', '#1A5A7A'],
  },
  tiana: {
    phases:     ['#3D7A2A', '#5A8A3A', '#D4A843', '#2A6A42'],
    highlights: ['#5AA840', '#7DC95E', '#F0C860', '#3A9A60'],
  },
  rapunzel: {
    phases:     ['#6A2A8A', '#8A4AAA', '#FFD700', '#4A1A6A'],
    highlights: ['#8A4AAA', '#AA6ACA', '#FFE740', '#6A3A8A'],
  },
  cinderella: {
    phases:     ['#5A4A1A', '#8A742A', '#FFD764', '#3A3010'],
    highlights: ['#7A6A2A', '#AAA44A', '#FFE884', '#5A5020'],
  },
}

function toRad(deg: number) { return deg * Math.PI / 180 }

export function useCycleRing(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  themeId: ThemeId,
  currentDay: number,
  totalDays: number
) {
  const rafRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const CX = W / 2
    const CY = H / 2
    const OUTER = W * 0.45
    const INNER = W * 0.29
    const MID   = (OUTER + INNER) / 2

    const colors    = THEME_PHASE_COLORS[themeId]
    const phases    = PHASE_ANGLES.map((p, i) => ({
      ...p,
      col:       colors.phases[i],
      highlight: colors.highlights[i],
    }))

    const currentAngle = -90 + (currentDay / totalDays) * 360

    function draw() {
      ctx!.clearRect(0, 0, W, H)

      // ---- DROP SHADOW beneath ring ----
      ctx!.save()
      ctx!.translate(CX, CY)
      const shadowGrad = ctx!.createRadialGradient(0, 10, INNER - 12, 0, 10, OUTER + 12)
      shadowGrad.addColorStop(0, 'transparent')
      shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0.0)')
      shadowGrad.addColorStop(0.8, 'rgba(0,0,0,0.4)')
      shadowGrad.addColorStop(1, 'transparent')
      ctx!.beginPath()
      ctx!.arc(0, 10, OUTER + 10, 0, Math.PI * 2)
      ctx!.arc(0, 10, INNER - 10, 0, Math.PI * 2, true)
      ctx!.fillStyle = shadowGrad
      ctx!.fill()
      ctx!.restore()

      // ---- PHASE ARCS ----
      phases.forEach(ph => {
        const s = toRad(ph.start)
        const e = toRad(ph.end)

        // Top highlight edge
        ctx!.save()
        ctx!.translate(CX, CY)
        ctx!.beginPath()
        ctx!.arc(0, 0, OUTER, s, e)
        ctx!.arc(0, 0, OUTER - 5, e, s, true)
        ctx!.closePath()
        ctx!.fillStyle = ph.highlight
        ctx!.globalAlpha = 0.45
        ctx!.fill()
        ctx!.restore()

        // Main face with radial gradient (3D curve)
        ctx!.save()
        ctx!.translate(CX, CY)
        ctx!.beginPath()
        ctx!.arc(0, 0, OUTER - 5, s, e)
        ctx!.arc(0, 0, INNER + 5, e, s, true)
        ctx!.closePath()
        const grad = ctx!.createRadialGradient(0, -12, INNER, 0, -12, OUTER)
        grad.addColorStop(0, ph.highlight)
        grad.addColorStop(0.45, ph.col)
        grad.addColorStop(1, 'rgba(0,0,0,0.35)')
        ctx!.fillStyle = grad
        ctx!.globalAlpha = 0.95
        ctx!.fill()
        ctx!.restore()

        // Bottom inner shadow
        ctx!.save()
        ctx!.translate(CX, CY)
        ctx!.beginPath()
        ctx!.arc(0, 0, INNER + 10, s, e)
        ctx!.arc(0, 0, INNER, e, s, true)
        ctx!.closePath()
        ctx!.fillStyle = 'rgba(0,0,0,0.45)'
        ctx!.globalAlpha = 0.55
        ctx!.fill()
        ctx!.restore()

        // Phase separator gap
        ctx!.save()
        ctx!.translate(CX, CY)
        ctx!.beginPath()
        ctx!.moveTo(Math.cos(s) * (INNER - 2), Math.sin(s) * (INNER - 2))
        ctx!.lineTo(Math.cos(s) * (OUTER + 2), Math.sin(s) * (OUTER + 2))
        ctx!.strokeStyle = 'rgba(0,0,0,0.85)'
        ctx!.lineWidth = 3
        ctx!.stroke()
        ctx!.restore()
      })

      // ---- INNER BEVEL ----
      ctx!.save()
      ctx!.translate(CX, CY)
      ctx!.beginPath()
      ctx!.arc(0, 0, INNER + 1, 0, Math.PI * 2)
      ctx!.arc(0, 0, INNER - 7, 0, Math.PI * 2, true)
      const innerGrad = ctx!.createRadialGradient(0, -20, INNER - 8, 0, 10, INNER + 2)
      innerGrad.addColorStop(0, `${colors.highlights[1]}55`)
      innerGrad.addColorStop(1, 'rgba(0,0,0,0.65)')
      ctx!.fillStyle = innerGrad
      ctx!.globalAlpha = 1
      ctx!.fill()
      ctx!.restore()

      // ---- CURRENT POSITION DOT ----
      const ca = toRad(currentAngle)
      const dx = Math.cos(ca) * MID
      const dy = Math.sin(ca) * MID
      ctx!.save()
      ctx!.translate(CX, CY)
      // Glow
      ctx!.shadowColor = colors.highlights[1]
      ctx!.shadowBlur  = 14
      ctx!.beginPath()
      ctx!.arc(dx, dy, 7, 0, Math.PI * 2)
      ctx!.fillStyle = colors.highlights[1]
      ctx!.globalAlpha = 1
      ctx!.fill()
      ctx!.shadowBlur = 0
      // Inner white dot
      ctx!.beginPath()
      ctx!.arc(dx, dy, 3, 0, Math.PI * 2)
      ctx!.fillStyle = '#ffffff'
      ctx!.globalAlpha = 0.9
      ctx!.fill()
      ctx!.restore()

      // ---- OUTER RIM GLOW ----
      ctx!.save()
      ctx!.translate(CX, CY)
      ctx!.beginPath()
      ctx!.arc(0, 0, OUTER + 3, 0, Math.PI * 2)
      ctx!.arc(0, 0, OUTER, 0, Math.PI * 2, true)
      const rimGrad = ctx!.createLinearGradient(-OUTER, -OUTER, OUTER, OUTER)
      rimGrad.addColorStop(0, `${colors.highlights[1]}44`)
      rimGrad.addColorStop(0.5, `${colors.highlights[1]}11`)
      rimGrad.addColorStop(1, `${colors.highlights[1]}33`)
      ctx!.fillStyle = rimGrad
      ctx!.globalAlpha = 0.8
      ctx!.fill()
      ctx!.restore()
    }

    draw()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [canvasRef, themeId, currentDay, totalDays])
}