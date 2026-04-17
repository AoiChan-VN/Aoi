const LANG = localStorage.getItem("lang") || "en";

const dict = {
  en: { intro: "Developer • Creator • Builder" },
  vi: { intro: "Lập trình viên • Nhà sáng tạo" }
};

function applyLang(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    el.textContent = dict[LANG][el.dataset.i18n] || "";
  });
}

function setLang(l){
  localStorage.setItem("lang",l);
  location.reload();
}
