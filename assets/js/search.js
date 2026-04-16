function searchPosts(query) {
  query = query.toLowerCase().trim();

  const sidebar = document.getElementById("sidebar");

  if (!query) {
    renderPosts();
    return;
  }

  const results = POSTS.filter(p =>
    p.title.toLowerCase().includes(query) ||
    (p.tags && p.tags.join(" ").toLowerCase().includes(query))
  );

  if (results.length === 0) {
    sidebar.innerHTML = `<div>❌ No result</div>`;
    return;
  }

  sidebar.innerHTML = results.map(p => `
    <div class="post-item" onclick="goPost('${p.slug}')">
      🔎 ${p.title}
    </div>
  `).join("");
}
