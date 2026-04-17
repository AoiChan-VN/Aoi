let LANG = 'en';
let DICT = {};

async function initLang(){
  LANG = localStorage.getItem('lang') || 'en';
  DICT = await fetch(`assets/i18n/${LANG}.json`).then(r=>r.json());

  const select = document.getElementById('lang-switch');
  select.innerHTML = `
    <option value="en">EN</option>
    <option value="vi">VI</option>
  `;

  select.value = LANG;
  select.onchange = async ()=>{
    localStorage.setItem('lang', select.value);
    location.reload();
  };
}

function t(key){
  return DICT[key] || key;
}
