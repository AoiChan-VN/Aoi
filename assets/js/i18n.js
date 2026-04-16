let LANG = {};

async function loadLang(lang) {
  const res = await fetch(`assets/lang/${lang}.json`);
  LANG = await res.json();
  localStorage.setItem("lang", lang);
}

function t(key) {
  return LANG[key] || key;
} 
