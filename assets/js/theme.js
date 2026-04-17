function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const current = localStorage.getItem("theme");

  if (current === "light") document.body.classList.add("light");

  btn.onclick = () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
  };
} 
