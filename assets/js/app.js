const loader = document.getElementById("loader");

window.addEventListener("load", () => {
  loader.style.display = "none";
});

// Theme toggle
const toggleTheme = () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
};

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

// Load components
const loadComponent = async (id, file) => {
  const res = await fetch(file);
  document.getElementById(id).innerHTML = await res.text();
};

loadComponent("header", "components/header.html");
loadComponent("footer", "components/footer.html");

// Load projects
fetch("assets/data/posts.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("projects");
    data.forEach(p => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<h3>${p.title}</h3><p>${p.desc}</p>`;
      container.appendChild(div);
    });
  }); 
