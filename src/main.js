import './style.css'

// UI
document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>◡🥀 AoiChan 🥀◡</h1>
    <p>Mobile Control UI 😏</p>
  </div>
`

const sheet = document.getElementById("sheet")
const btn = document.getElementById("btn")

// toggle sheet
btn.onclick = () => {
  sheet.classList.toggle("show")
}

// THEME
const toggle = document.getElementById("themeToggle")

toggle.onchange = () => {
  const light = toggle.checked
  document.body.className = light ? "light" : ""
  localStorage.setItem("theme", light ? "light" : "dark")
}

// LOAD
const saved = localStorage.getItem("theme")

if (saved === "light") {
  document.body.className = "light"
  toggle.checked = true
}
