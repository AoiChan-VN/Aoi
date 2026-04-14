import './style.css'

// UI
document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>◡🥀 AoiChan 🥀◡</h1>
    <p>Simple. Clean. No bug 😏</p>
  </div>
`

// ===== SETTINGS =====
const panel = document.getElementById("panel")
const overlay = document.getElementById("overlay")
const btn = document.getElementById("btn")

btn.onclick = () => {
  panel.classList.toggle("show")
  overlay.classList.toggle("show")
}

// click nền → đóng
overlay.onclick = () => {
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
