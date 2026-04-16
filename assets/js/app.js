(async () => {
  const lang = localStorage.getItem("lang") || "vi";

  await loadLang(lang);
  await loadTheme();

  router();

  const langSwitch = document.getElementById("lang-switch");

  ["vi", "en"].forEach(l => {
    const opt = document.createElement("option");
    opt.value = l;
    opt.textContent = l;
    langSwitch.appendChild(opt);
  });

  langSwitch.value = lang;

  langSwitch.onchange = async () => {
    await loadLang(langSwitch.value);
    router();
  };
})(); 
