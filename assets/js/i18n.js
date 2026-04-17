const translations = {
  en: { welcome: "Welcome" },
  vi: { welcome: "Xin chào" }
};

function initLang() {
  const select = document.getElementById("lang-switch");
  select.value = localStorage.getItem("lang") || "en";

  select.addEventListener("change", () => {
    localStorage.setItem("lang", select.value);
    render();
  });
}
 
