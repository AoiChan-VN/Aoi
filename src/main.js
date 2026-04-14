import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1 id="title">◡🥀 AoiChan 🥀◡</h1>
    <p class="subtitle">Dev • Creator • Dreamer</p>

    <div class="card">
      <h2>🚀 About</h2>
      <p>Website cá nhân + dashboard điều khiển.</p>
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

// ===== UI CONTROL =====
const panel = document.getElementById("settings")
const overlay = document.getElementById("overlay")

document.getElementById("settingsBtn").onclick = () => {
  panel.classList.add("open")
  overlay.classList.add("show")
}

document.getElementById("closeBtn").onclick = closePanel
overlay.onclick = closePanel

function closePanel() {
  panel.classList.remove("open")
  overlay.classList.remove("show")
}

// ===== SETTINGS =====
const themeSelect = document.getElementById("themeSelect")
const scaleRange = document.getElementById("scaleRange")
const langSelect = document.getElementById("langSelect")

themeSelect.onchange = e => {
  document.body.className = e.target.value
  localStorage.setItem("theme", e.target.value)
}

scaleRange.oninput = e => {
  const scale = e.target.value
  document.body.style.transform = `scale(${scale})`
  document.body.style.transformOrigin = "top center"
  localStorage.setItem("scale", scale)
}

langSelect.onchange = e => {
  const lang = e.target.value
  localStorage.setItem("lang", lang)

  document.getElementById("title").innerText =
    lang === "en" ? "AoiChan" : "◡🥀 AoiChan 🥀◡"
}

document.getElementById("homeBtn").onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

// ===== LOAD =====
window.onload = () => {
  const theme = localStorage.getItem("theme")
  const scale = localStorage.getItem("scale")

  if (theme) {
    document.body.className = theme
    themeSelect.value = theme
  }

  if (scale) {
    document.body.style.transform = `scale(${scale})`
    scaleRange.value = scale
  }
}
