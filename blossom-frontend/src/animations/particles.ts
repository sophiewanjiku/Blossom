import type { ThemeId } from '../themes/themes'

// ============================================================
// PARTICLE ENGINE
// Draws animated particles on a canvas behind the whole app.
// Each theme has a different shape and movement behaviour.
//
// HOW IT WORKS:
// 1. We create an array of particle objects (position, speed etc)
// 2. requestAnimationFrame calls animate() ~60 times per second
// 3. Each frame: clear canvas, update each particle's position,
//    draw it at the new position
// This creates the illusion of movement.
// ============================================================

interface Particle {
  x: number
  y: number
  vx: number        // velocity x (horizontal speed)
  vy: number        // velocity y (vertical speed)
  size: number
  alpha: number     // opacity 0–1
  rotation: number
  rotationSpeed: number
  pulse: number     // for firefly glow effect
  pulseSpeed: number
}

let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let animFrameId: number | null = null
let currentTheme: ThemeId = 'frozen'

// Read the current accent colour from CSS variables
function getAccentColor(): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--acc1')
    .trim()
}

// Create one new particle
// randomY = true means scatter it anywhere on screen (startup)
// randomY = false means spawn it at the edge (ongoing)
function makeParticle(randomY = false): Particle {
  const w = canvas!.width
  const h = canvas!.height
  const floatsUp = currentTheme === 'rapunzel' // lanterns rise

  return {
    x: Math.random() * w,
    y: randomY
      ? Math.random() * h
      : floatsUp ? h + 20 : -20,  // start below or above screen
    vx: (Math.random() - 0.5) * 0.6,
    vy: floatsUp
      ? -(0.3 + Math.random() * 0.5)   // negative = upward
      :  (0.4 + Math.random() * 0.8),  // positive = downward
    size: currentTheme === 'rapunzel'
      ? 8 + Math.random() * 10   // lanterns are bigger
      : 2 + Math.random() * 3,
    alpha: 0.3 + Math.random() * 0.55,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.025,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  }
}

// --- SHAPE DRAWING FUNCTIONS ---
// Each one draws a single particle at its current position

function drawSnowflake(p: Particle) {
  if (!ctx) return
  ctx.save()
  ctx.globalAlpha = p.alpha
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.strokeStyle = getAccentColor()
  ctx.lineWidth = 0.8

  // Draw 6 arms, rotated 60° each time
  for (let i = 0; i < 6; i++) {
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, p.size)
    // Small branches on each arm
    ctx.moveTo(0, p.size * 0.5)
    ctx.lineTo(p.size * 0.3, p.size * 0.7)
    ctx.moveTo(0, p.size * 0.5)
    ctx.lineTo(-p.size * 0.3, p.size * 0.7)
    ctx.stroke()
    ctx.rotate(Math.PI / 3)
  }
  ctx.restore()
}

function drawFirefly(p: Particle) {
  if (!ctx) return
  // sin(pulse) makes the firefly glow pulse in and out
  const glow = 0.5 + 0.5 * Math.sin(p.pulse)
  ctx.save()
  ctx.globalAlpha = p.alpha * glow
  ctx.shadowColor = getAccentColor()
  ctx.shadowBlur = 10  // the glow around the dot
  ctx.fillStyle = getAccentColor()
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawLantern(p: Particle) {
  if (!ctx) return
  const glow = 0.7 + 0.3 * Math.sin(p.pulse)
  ctx.save()
  ctx.globalAlpha = p.alpha * glow
  ctx.fillStyle = getAccentColor()
  // Lantern body — an oval
  ctx.beginPath()
  ctx.ellipse(p.x, p.y, p.size * 0.6, p.size, 0, 0, Math.PI * 2)
  ctx.fill()
  // String above it
  ctx.strokeStyle = getAccentColor()
  ctx.lineWidth = 0.5
  ctx.globalAlpha = p.alpha * 0.4
  ctx.beginPath()
  ctx.moveTo(p.x, p.y - p.size)
  ctx.lineTo(p.x, p.y - p.size - 10)
  ctx.stroke()
  ctx.restore()
}

function drawSparkle(p: Particle) {
  if (!ctx) return
  ctx.save()
  ctx.globalAlpha = p.alpha
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.fillStyle = getAccentColor()
  const r = p.size * 0.5
  // 4-pointed star shape
  ctx.beginPath()
  ctx.moveTo(0, -r * 2)
  ctx.lineTo(r * 0.4, -r * 0.4)
  ctx.lineTo(r * 2, 0)
  ctx.lineTo(r * 0.4, r * 0.4)
  ctx.lineTo(0, r * 2)
  ctx.lineTo(-r * 0.4, r * 0.4)
  ctx.lineTo(-r * 2, 0)
  ctx.lineTo(-r * 0.4, -r * 0.4)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// Map theme → draw function
const DRAW_FN = {
  frozen:     drawSnowflake,
  tiana:      drawFirefly,
  rapunzel:   drawLantern,
  cinderella: drawSparkle,
}

// The main loop — runs ~60 times per second
function animate() {
  if (!ctx || !canvas) return
  animFrameId = requestAnimationFrame(animate)

  // Clear the previous frame
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const floatsUp = currentTheme === 'rapunzel'
  const draw = DRAW_FN[currentTheme]

  particles = particles.map((p) => {
    // Update position
    const next = {
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      rotation: p.rotation + p.rotationSpeed,
      pulse: p.pulse + p.pulseSpeed,
    }

    // If particle went off screen — recycle it
    const offscreen = floatsUp
      ? next.y < -30
      : next.y > canvas!.height + 30

    if (offscreen || next.x < -30 || next.x > canvas!.width + 30) {
      return makeParticle(false) // spawn a fresh one at the edge
    }

    draw(next)
    return next
  })
}

// --- PUBLIC API ---

export function initParticles(themeId: ThemeId) {
  // Stop any existing animation
  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }

  currentTheme = themeId

  canvas = document.getElementById('blossom-particles') as HTMLCanvasElement
  if (!canvas) return
  ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // Spawn initial particles scattered randomly across screen
  const count = themeId === 'rapunzel' ? 18 : 45
  particles = Array.from({ length: count }, () => makeParticle(true))

  animate()
}

export function resizeParticles() {
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  // Re-scatter after resize
  const count = currentTheme === 'rapunzel' ? 18 : 45
  particles = Array.from({ length: count }, () => makeParticle(true))
}

export function destroyParticles() {
  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
}