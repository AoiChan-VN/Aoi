let THEMES = [];

async function loadTheme() {
  const res = await fetch("config.json");
  const config = await res.json();

  THEMES = config.themes;

  const select = document.getElementById("theme-switch");

  THEMES.forEach((t, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = t.name;
    select.appendChild(opt);
  });

  const saved = localStorage.getItem("theme") || 0;
  select.value = saved;

  applyTheme(THEMES[saved]);

  select.onchange = () => {
    localStorage.setItem("theme", select.value);
    applyTheme(THEMES[select.value]);
  };
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
