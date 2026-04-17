const translations = {
  en: { welcome: "Xin chào các đạo hữu" },
  vi: { welcome: "Welcome" }
};

function initLang() {
  const select = document.getElementById("lang-switch");
  select.value = localStorage.getItem("lang") || "vi";

  select.addEventListener("change", () => {
    localStorage.setItem("lang", select.value);
    render();
  });
}
 
