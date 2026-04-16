function router() {
  const path = location.hash.slice(1) || "/";

  if (path.startsWith("/post/")) {
    const slug = path.split("/")[2];
    CURRENT = slug;
    loadPost(slug);
    renderPosts();
  }
}

window.addEventListener("hashchange", router);
