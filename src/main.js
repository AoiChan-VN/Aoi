import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1 id="title">◡🥀 AoiChan 🥀◡</h1>
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

// ⚙️ SETTINGS LOGIC

window.toggleSettings = function () {
  const panel = document.getElementById("settings")
  panel.style.display =
    panel.style.display === "block" ? "block" : "block"
}

window.setTheme = function (theme) {
  document.body.className = theme
  localStorage.setItem("theme", theme)
}

window.setScale = function (scale) {
  document.body.style.transform = `scale(${scale})`
  document.body.style.transformOrigin = "top center"
  localStorage.setItem("scale", scale)
}

window.setLang = function (lang) {
  localStorage.setItem("lang", lang)

  const title = document.getElementById("title")

  if (lang === "en") {
    title.innerText = "AoiChan"
  } else {
    title.innerText = "◡🥀 AoiChan 🥀◡"
  }
}

window.goHome = function () {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

// LOAD SAVED SETTINGS
window.onload = () => {
  const theme = localStorage.getItem("theme")
  const scale = localStorage.getItem("scale")

  if (theme) document.body.className = theme
  if (scale) {
    document.body.style.transform = `scale(${scale})`
    document.body.style.transformOrigin = "top center"
  }
}
