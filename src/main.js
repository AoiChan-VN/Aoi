const btn = document.getElementById("settingsBtn")
const panel = document.getElementById("settings")
const overlay = document.getElementById("overlay")
const closeBtn = document.getElementById("closeBtn")

// Mở
btn.onclick = () => {
  panel.classList.add("open")
  overlay.classList.add("show")
}

// Đóng
closeBtn.onclick = close
overlay.onclick = close

function close() {
  panel.classList.remove("open")
  overlay.classList.remove("show")
}

// SETTINGS

document.getElementById("themeSelect").onchange = e => {
  document.body.className = e.target.value
  localStorage.setItem("theme", e.target.value)
}

document.getElementById("scaleRange").oninput = e => {
  const scale = e.target.value
  document.body.style.transform = `scale(${scale})`
  document.body.style.transformOrigin = "top center"
  localStorage.setItem("scale", scale)
}

document.getElementById("homeBtn").onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

document.getElementById("langSelect").onchange = e => {
  const lang = e.target.value
  localStorage.setItem("lang", lang)

  document.getElementById("title").innerText =
    lang === "en" ? "AoiChan" : "◡🥀 AoiChan 🥀◡"
}

// LOAD
window.onload = () => {
  const theme = localStorage.getItem("theme")
  const scale = localStorage.getItem("scale")

  if (theme) document.body.className = theme
  if (scale) {
    document.body.style.transform = `scale(${scale})`
    document.body.style.transformOrigin = "top center"
  }
}
