function router() {
  const path = location.hash.slice(1) || "/";

  if (path === "/") {
    document.getElementById("app").innerHTML = "<h2>Welcome</h2>";
  }

  if (path.startsWith("/post/")) {
    const slug = path.split("/")[2];
    loadPost(slug);
  }
}

window.addEventListener("hashchange", router);
