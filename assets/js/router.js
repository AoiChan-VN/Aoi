function router() {
  const app = document.getElementById("app");
  const path = location.hash.slice(1) || "/";

  if (path === "/") {
    app.innerHTML = `<h2>${t("home")}</h2>`;
  }

  if (path.startsWith("/post/")) {
    const slug = path.split("/")[2];
    loadPost(slug);
  }
}

window.addEventListener("hashchange", router); 
