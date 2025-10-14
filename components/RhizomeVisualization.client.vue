<template>
  <div class="rhizome-visualization">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvasRef = ref(null)
let animationFrameId = null
let resizeHandler = null
let pointerEnterHandler = null
let pointerMoveHandler = null
let pointerLeaveHandler = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const opts = {
    range: 180,
  baseConnections: 1,
  addedConnections: 2,
  baseSize: 3.2,
    minSize: 1,
    dataToConnectionSize: 0.4,
    sizeMultiplier: 0.85,
    allowedDist: 35,
    baseDist: 35,
  addedDist: 20,
    connectionAttempts: 100,
  dataToConnections: 0.045,
    baseSpeed: 0.04,
    addedSpeed: 0.05,
    baseGlowSpeed: 0.4,
    addedGlowSpeed: 0.4,
    rotVelX: 0.003,
    rotVelY: 0.002,
    repaintColor: '#111',
    connectionColor: 'hsla(280,60%,light%,alp)',
    rhizomeColor: 'hsla(160,60%,light%,alp)',
    dataColor: 'hsla(40,80%,light%,alp)',
    wireframeWidth: 0.1,
    wireframeColor: '#88f',
    depth: 250,
    focalLength: 250,
    vanishPoint: { x: 0, y: 0 },
  initialNodes: 5,
  lateralConnectionChance: 0.08,
  lateralConnectionRange: 80,
  mouseRepelForce: 0.7,
    mouseRepelRadius: 120,
    nodeFriction: 0.92
  }

  let w = 0
  let h = 0
  const setCanvasSize = () => {
    const container = canvas.parentElement
    const width = container?.clientWidth || window.innerWidth
    const height = Math.min(460, Math.max(320, window.innerHeight * 0.5))
    w = canvas.width = width
    h = canvas.height = height
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    opts.vanishPoint.x = w / 2
    opts.vanishPoint.y = h / 2
  }

  setCanvasSize()

  let squareRange = opts.range * opts.range
  let squareAllowed = opts.allowedDist * opts.allowedDist
  let mostDistant = opts.depth + opts.range
  let sinX = 0
  let sinY = 0
  let cosX = 1
  let cosY = 1
  let rotX = 0
  let rotY = 0
  const mouse = {
    x: w / 2,
    y: h / 2,
    world3D: { x: 0, y: 0, z: 0 }
  }
  let pointerActive = false
  let connections = []
  let toDevelop = []
  let data = []
  let all = []
  let tick = 0
  let animating = false
  const Tau = Math.PI * 2

  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#ccc'
  ctx.font = '26px Merriweather, serif'
  const label = 'Calculating Rhizome'
  ctx.fillText(label, w / 2 - ctx.measureText(label).width / 2, h / 2 - 10)

  function Connection(x, y, z, size) {
    this.x = x
    this.y = y
    this.z = z
    this.originalX = x
    this.originalY = y
    this.originalZ = z
    this.vx = 0
    this.vy = 0
    this.vz = 0
    this.size = size
    this.screen = {}
    this.links = []
    this.lateralLinks = []
    this.allConnections = []
    this.probabilities = []
    this.isEnd = false
    this.glowSpeed = opts.baseGlowSpeed + opts.addedGlowSpeed * Math.random()
  }

  Connection.prototype.link = function () {
    if (this.size < opts.minSize) {
      this.isEnd = true
      return
    }

    const links = []
    const connectionsNum = (opts.baseConnections + Math.random() * opts.addedConnections) | 0
    let attempt = opts.connectionAttempts
    const pos = {}

    while (links.length < connectionsNum && --attempt > 0) {
      const alpha = Math.random() * Math.PI
      const beta = Math.random() * Tau
      const len = opts.baseDist + opts.addedDist * Math.random()

      const cosA = Math.cos(alpha)
      const sinA = Math.sin(alpha)
      const cosB = Math.cos(beta)
      const sinB = Math.sin(beta)

      pos.x = this.x + len * cosA * sinB
      pos.y = this.y + len * sinA * sinB
      pos.z = this.z + len * cosB

      if (pos.x * pos.x + pos.y * pos.y + pos.z * pos.z < squareRange) {
        let passedExisting = true
        let passedBuffered = true

        for (let i = 0; i < connections.length; ++i) {
          if (squareDist(pos, connections[i]) < squareAllowed) {
            passedExisting = false
            break
          }
        }

        if (passedExisting) {
          for (let i = 0; i < links.length; ++i) {
            if (squareDist(pos, links[i]) < squareAllowed) {
              passedBuffered = false
              break
            }
          }
        }

        if (passedExisting && passedBuffered) {
          links.push({ x: pos.x, y: pos.y, z: pos.z })
        }
      }
    }

    if (links.length === 0) {
      this.isEnd = true
    } else {
      for (let i = 0; i < links.length; ++i) {
        const pos = links[i]
        const connection = new Connection(pos.x, pos.y, pos.z, this.size * opts.sizeMultiplier)
        this.links[i] = connection
        all.push(connection)
        connections.push(connection)
      }

      for (let i = 0; i < this.links.length; ++i) {
        toDevelop.push(this.links[i])
      }
    }
  }

  Connection.prototype.step = function () {
    this.setScreen()
    this.screen.color = opts.connectionColor
      .replace('light', 30 + ((tick * this.glowSpeed) % 30))
      .replace('alp', 0.2 + (1 - this.screen.z / mostDistant) * 0.8)

    for (let i = 0; i < this.links.length; ++i) {
      ctx.moveTo(this.screen.x, this.screen.y)
      ctx.lineTo(this.links[i].screen.x, this.links[i].screen.y)
    }

    if (this.lateralLinks && this.lateralLinks.length) {
      ctx.strokeStyle = opts.rhizomeColor
        .replace('light', 40 + ((tick * this.glowSpeed * 0.7) % 20))
        .replace('alp', 0.15 + (1 - this.screen.z / mostDistant) * 0.5)

      for (let i = 0; i < this.lateralLinks.length; ++i) {
        ctx.beginPath()
        ctx.lineWidth = opts.wireframeWidth * 1.5
        ctx.moveTo(this.screen.x, this.screen.y)
        ctx.lineTo(this.lateralLinks[i].screen.x, this.lateralLinks[i].screen.y)
        ctx.stroke()
      }
    }

    this.allConnections = [...this.links]
    if (this.lateralLinks && this.lateralLinks.length) {
      this.allConnections = [...this.allConnections, ...this.lateralLinks]
    }
  }

  Connection.prototype.draw = function () {
    ctx.fillStyle = this.screen.color
    ctx.beginPath()
    ctx.arc(this.screen.x, this.screen.y, this.screen.scale * this.size, 0, Tau)
    ctx.fill()
  }

  function Data(connection) {
    this.glowSpeed = opts.baseGlowSpeed + opts.addedGlowSpeed * Math.random()
    this.speed = opts.baseSpeed + opts.addedSpeed * Math.random()
    this.screen = {}
    this.setConnection(connection)
  }

  Data.prototype.reset = function () {
    let attempts = 0
    let startNode
    do {
      startNode = connections[Math.floor(Math.random() * connections.length)]
      attempts++
    } while (
      attempts < 100 && (!startNode || !startNode.allConnections || startNode.allConnections.length === 0)
    )

    if (startNode && startNode.allConnections && startNode.allConnections.length > 0) {
      this.setConnection(startNode)
    }
    this.ended = 2
  }

  Data.prototype.step = function () {
    this.proportion += this.speed

    if (this.proportion < 1) {
      this.x = this.ox + this.dx * this.proportion
      this.y = this.oy + this.dy * this.proportion
      this.z = this.oz + this.dz * this.proportion
      this.size = (this.os + this.ds * this.proportion) * opts.dataToConnectionSize
    } else {
      this.setConnection(this.nextConnection)
    }

    this.screen.lastX = this.screen.x
    this.screen.lastY = this.screen.y
    this.setScreen()
    this.screen.color = opts.dataColor
      .replace('light', 40 + ((tick * this.glowSpeed) % 50))
      .replace('alp', 0.2 + (1 - this.screen.z / mostDistant) * 0.6)
  }

  Data.prototype.draw = function () {
    if (this.ended) {
      return --this.ended
    }

    ctx.beginPath()
    ctx.strokeStyle = this.screen.color
    ctx.lineWidth = this.size * this.screen.scale
    ctx.moveTo(this.screen.lastX, this.screen.lastY)
    ctx.lineTo(this.screen.x, this.screen.y)
    ctx.stroke()
  }

  Data.prototype.setConnection = function (connection) {
    if (!connection || connection.isEnd || !connection.allConnections || connection.allConnections.length === 0) {
      this.reset()
      return
    }

    this.connection = connection
    const availableConnections = connection.allConnections
    this.nextConnection = availableConnections[Math.floor(Math.random() * availableConnections.length)]

    this.ox = connection.x
    this.oy = connection.y
    this.oz = connection.z
    this.os = connection.size

    this.nx = this.nextConnection.x
    this.ny = this.nextConnection.y
    this.nz = this.nextConnection.z
    this.ns = this.nextConnection.size

    this.dx = this.nx - this.ox
    this.dy = this.ny - this.oy
    this.dz = this.nz - this.oz
    this.ds = this.ns - this.os

    this.proportion = 0
  }

  Connection.prototype.setScreen = Data.prototype.setScreen = function () {
    let x = this.x
    let y = this.y
    let z = this.z

    const Y = y
    y = y * cosX - z * sinX
    z = z * cosX + Y * sinX

    const Z = z
    z = z * cosY - x * sinY
    x = x * cosY + Z * sinY

    this.screen.z = z
    z += opts.depth

    this.screen.scale = opts.focalLength / z
    this.screen.x = opts.vanishPoint.x + x * this.screen.scale
    this.screen.y = opts.vanishPoint.y + y * this.screen.scale
  }

  function squareDist(a, b) {
    const x = b.x - a.x
    const y = b.y - a.y
    const z = b.z - a.z
    return x * x + y * y + z * z
  }

  function addLateralConnections() {
    for (let i = 0; i < connections.length; i++) {
      for (let j = i + 1; j < connections.length; j++) {
        if (Math.random() < opts.lateralConnectionChance) {
          const dist = squareDist(connections[i], connections[j])
          if (
            dist < opts.lateralConnectionRange * opts.lateralConnectionRange &&
            dist > squareAllowed
          ) {
            if (!connections[i].lateralLinks) connections[i].lateralLinks = []
            if (!connections[j].lateralLinks) connections[j].lateralLinks = []
            connections[i].lateralLinks.push(connections[j])
            connections[j].lateralLinks.push(connections[i])
          }
        }
      }
    }
  }

  function applyMouseForces() {
    const mouseWorldX = (mouse.x - opts.vanishPoint.x) / opts.focalLength * opts.depth
    const mouseWorldY = (mouse.y - opts.vanishPoint.y) / opts.focalLength * opts.depth
    const mouseWorldZ = 0

    const rotatedMouse = {
      x: mouseWorldX * cosY - mouseWorldZ * sinY,
      y: mouseWorldY * cosX + mouseWorldZ * sinX,
      z: mouseWorldZ * cosX - mouseWorldY * sinX
    }

    for (let i = 0; i < connections.length; i++) {
      const node = connections[i]
      const dx = node.x - rotatedMouse.x
      const dy = node.y - rotatedMouse.y
      const dz = node.z - rotatedMouse.z
      const distSq = dx * dx + dy * dy + dz * dz
      const dist = Math.sqrt(distSq)

      if (dist < opts.mouseRepelRadius && dist > 0) {
        const force = opts.mouseRepelForce * (1 - dist / opts.mouseRepelRadius)
        node.vx += (dx / dist) * force
        node.vy += (dy / dist) * force
        node.vz += (dz / dist) * force
      }

      node.x += node.vx
      node.y += node.vy
      node.z += node.vz

      node.vx *= opts.nodeFriction
      node.vy *= opts.nodeFriction
      node.vz *= opts.nodeFriction

      const backForce = 0.02
      node.vx += (node.originalX - node.x) * backForce
      node.vy += (node.originalY - node.y) * backForce
      node.vz += (node.originalZ - node.z) * backForce
    }
  }

  function init() {
    connections = []
    toDevelop = []
    data = []
    all = []

    for (let i = 0; i < opts.initialNodes; i++) {
      const angle = (i / opts.initialNodes) * Tau
      const radius = 50 + Math.random() * 30
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const z = (Math.random() - 0.5) * 50

      const connection = new Connection(x, y, z, opts.baseSize)
      connections.push(connection)
      all.push(connection)
      toDevelop.push(connection)
    }

    while (toDevelop.length > 0) {
      toDevelop[0].link()
      toDevelop.shift()
    }

    addLateralConnections()

    if (!animating) {
      animating = true
      anim()
    }
  }

  function anim() {
    if (!animating) return
    animationFrameId = window.requestAnimationFrame(anim)

    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = opts.repaintColor
    ctx.fillRect(0, 0, w, h)

    tick += 1

    const mouseOffsetX = (mouse.x - opts.vanishPoint.x) / opts.vanishPoint.x
    const mouseOffsetY = (mouse.y - opts.vanishPoint.y) / opts.vanishPoint.y

    const targetRotY = mouseOffsetX * 1.5
    const targetRotX = mouseOffsetY * 1.5

    rotY += (targetRotY - rotY) * 0.05
    rotX += (targetRotX - rotX) * 0.05

    cosX = Math.cos(rotX)
    sinX = Math.sin(rotX)
    cosY = Math.cos(rotY)
    sinY = Math.sin(rotY)

    applyMouseForces()

    if (data.length < connections.length * opts.dataToConnections) {
      const validNodes = connections.filter((c) => c.allConnections && c.allConnections.length > 0)
      if (validNodes.length > 0) {
        const startNode = validNodes[Math.floor(Math.random() * validNodes.length)]
        const datum = new Data(startNode)
        data.push(datum)
        all.push(datum)
      }
    }

    ctx.globalCompositeOperation = 'lighter'
    ctx.beginPath()
    ctx.lineWidth = opts.wireframeWidth
    ctx.strokeStyle = opts.wireframeColor
    all.forEach((item) => item.step())
    ctx.stroke()

    ctx.globalCompositeOperation = 'source-over'
    all.sort((a, b) => b.screen.z - a.screen.z)
    all.forEach((item) => item.draw())
  }

  function handleResize() {
    setCanvasSize()
    mostDistant = opts.depth + opts.range
    mouse.x = opts.vanishPoint.x
    mouse.y = opts.vanishPoint.y
  }

  function updateMousePosition(clientX, clientY) {
    if (!pointerActive) return
    const rect = canvas.getBoundingClientRect()
    mouse.x = clientX - rect.left
    mouse.y = clientY - rect.top
  }

  resizeHandler = () => handleResize()
  pointerEnterHandler = (event) => {
    pointerActive = true
    updateMousePosition(event.clientX, event.clientY)
  }
  pointerMoveHandler = (event) => updateMousePosition(event.clientX, event.clientY)
  pointerLeaveHandler = () => {
    pointerActive = false
    mouse.x = opts.vanishPoint.x
    mouse.y = opts.vanishPoint.y
  }

  window.addEventListener('resize', resizeHandler)
  canvas.addEventListener('pointerenter', pointerEnterHandler)
  canvas.addEventListener('pointerdown', pointerEnterHandler)
  canvas.addEventListener('pointermove', pointerMoveHandler)
  canvas.addEventListener('pointerleave', pointerLeaveHandler)
  canvas.addEventListener('pointerup', pointerLeaveHandler)
  canvas.addEventListener('pointercancel', pointerLeaveHandler)

  init()
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', resizeHandler)
  const canvas = canvasRef.value
  if (canvas) {
    canvas.removeEventListener('pointerenter', pointerEnterHandler)
    canvas.removeEventListener('pointerdown', pointerEnterHandler)
    canvas.removeEventListener('pointerenter', pointerEnterHandler)
    canvas.removeEventListener('pointermove', pointerMoveHandler)
    canvas.removeEventListener('pointerleave', pointerLeaveHandler)
    canvas.removeEventListener('pointerup', pointerLeaveHandler)
    canvas.removeEventListener('pointercancel', pointerLeaveHandler)
  }
})
</script>

<style scoped>
.rhizome-visualization {
  position: relative;
  width: 100%;
  height: clamp(320px, 55vh, 460px);
  border-radius: 14px;
  overflow: hidden;
  background: radial-gradient(circle at 30% 20%, #1a2340, #0d101b 65%);
  box-shadow: inset 0 0 40px rgba(12, 18, 34, 0.6), 0 18px 40px rgba(13, 21, 40, 0.22);
  margin: 32px 0 48px;
}

.rhizome-visualization canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
