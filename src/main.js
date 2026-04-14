import './style.css'

// UI
document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>◡🥀 AoiChan 🥀◡</h1>
    <p>Simple. Clean. No bug 😏</p>
  </div>
`

// ===== SETTINGS (SIÊU NGẮN) =====
const panel = document.getElementById("panel")
const overlay = document.getElementById("overlay")

document.getElementById("btn").onclick = () => {
  panel.classList.add("show")
  overlay.classList.add("show")
}

document.getElementById("close").onclick = close
overlay.onclick = close

function close() {
  panel.classList.remove("show")
  overlay.classList.remove("show")
}

// THEME
const theme = document.getElementById("theme")

theme.onchange = e => {
  document.body.className = e.target.value
  localStorage.setItem("theme", e.target.value)
}

// LOAD
const saved = localStorage.getItem("theme")
if (saved) {
  document.body.className = saved
  theme.value = saved
}

// HOME
document.getElementById("home").onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}
