function initRouter() {
  window.addEventListener("hashchange", render);
  render();
}

function render() {
  const app = document.getElementById("app");
  const route = location.hash.slice(2);

  if (route === "projects") {
    app.innerHTML = "<h2>Projects</h2>";
  } else if (route === "docs") {
    app.innerHTML = "<h2>Docs</h2>";
  } else if (route === "blog") {
    loadPosts();
  } else {
    app.innerHTML = "<h2>Welcome</h2>";
  }
} 
