let LANG = "en";
let DICT = {};

async function initLang(){
  LANG = getSetting("lang", "en");
  DICT = await fetch(`assets/i18n/${LANG}.json`).then(r=>r.json());
}

function t(key){
  return DICT[key] || key;
}
