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
const toggle = document.getElementById("themeToggle")

// đổi theme
toggle.onchange = () => {
  const isLight = toggle.checked

  document.body.className = isLight ? "light" : ""
  localStorage.setItem("theme", isLight ? "light" : "dark")
}

// load lại
const saved = localStorage.getItem("theme")

if (saved === "light") {
  document.body.className = "light"
  toggle.checked = true
}

// HOME
document.getElementById("home").onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}
