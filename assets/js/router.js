function router() {
  const path = location.hash.slice(1) || "/";

  if (path.startsWith("/post/")) {
    const slug = path.split("/")[2];
    CURRENT = slug;
    loadPost(slug);
    renderPosts();
  } else {
    document.getElementById("app").innerHTML = "<h2>Welcome</h2>";
  }
}

window.addEventListener("hashchange", router);
