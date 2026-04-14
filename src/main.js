import './style.css'

// UI
document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1 id="title">◡🥀 AoiChan 🥀◡</h1>
    <p class="subtitle">Dev • Creator • Dreamer</p>

    <div class="card">
      <h2>🚀 About</h2>
      <p>Website cá nhân + dashboard.</p>
    </div>
  </div>
`

// SETTINGS SYSTEM
window.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById("settings")
  const overlay = document.getElementById("overlay")
  const btn = document.getElementById("settingsBtn")
  const closeBtn = document.getElementById("closeBtn")

  // force reset trạng thái
  panel.classList.remove("open")
  overlay.classList.remove("show")

  // open
  btn.addEventListener("click", () => {
    panel.classList.add("open")
    overlay.classList.add("show")
  })

  // close
  function close() {
    panel.classList.remove("open")
    overlay.classList.remove("show")
  }

  closeBtn.addEventListener("click", close)
  overlay.addEventListener("click", close)

  // THEME
  const themeSelect = document.getElementById("themeSelect")
  themeSelect.onchange = e => {
    document.body.className = e.target.value
    localStorage.setItem("theme", e.target.value)
  }

  // SCALE
  const scaleRange = document.getElementById("scaleRange")
  scaleRange.oninput = e => {
    const scale = e.target.value
    document.body.style.transform = `scale(${scale})`
    document.body.style.transformOrigin = "top center"
    localStorage.setItem("scale", scale)
  }

  // HOME
  document.getElementById("homeBtn").onclick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // LOAD
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
})
