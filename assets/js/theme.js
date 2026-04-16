async function loadTheme() {
  const res = await fetch("config.json");
  const config = await res.json();

  const select = document.getElementById("theme-switch");

  config.themes.forEach((t, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = t.name;
    select.appendChild(opt);
  });

  select.onchange = () => applyTheme(config.themes[select.value]);

  applyTheme(config.themes[0]);
}

function applyTheme(theme) {
  const bg = document.getElementById("bg-container");
  bg.innerHTML = "";

  if (theme.type === "video") {
    bg.innerHTML = `<video autoplay muted loop src="${theme.file}"></video>`;
  } else {
    bg.innerHTML = `<img src="${theme.file}">`;
  }
}
