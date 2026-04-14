import './style.css'

const canvas = document.getElementById("sakura")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let petals = []

for (let i = 0; i < 40; i++) {
  petals.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 4 + 2,
    d: Math.random() * 2
  })
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "pink"

  petals.forEach(p => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  })

  update()
}

function update() {
  petals.forEach(p => {
    p.y += p.d
    p.x += Math.sin(p.y * 0.01)

    if (p.y > canvas.height) {
      p.y = 0
      p.x = Math.random() * canvas.width
    }
  })
}

setInterval(draw, 30)

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>◡🥀 AoiChan 🥀◡</h1>
    <p class="subtitle">Dev • Creator • Dreamer</p>

    <div class="card">
      <h2>🚀 About</h2>
      <p>Code không chỉ để chạy, mà để đẹp ✨</p>
    </div>

    <div class="card">
      <h2>📦 Projects</h2>
      <ul>
        <li>Aoi Plugin</li>
        <li>Cultivation System</li>
        <li>Automation Tools</li>
      </ul>
    </div>
  </div>
` 
