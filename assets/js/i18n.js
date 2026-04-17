const translations = {
  en: {
    intro: "Developer • Creator • Builder"
  },
  vi: {
    intro: "Lập trình viên • Nhà sáng tạo"
  }
};

const setLang = (lang) => {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.innerText = translations[lang][el.dataset.i18n];
  });
  localStorage.setItem("lang", lang);
};

setLang(localStorage.getItem("lang") || "en");
