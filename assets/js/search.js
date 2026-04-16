function searchPosts(query) {
  query = query.toLowerCase().trim();

  if (!query) {
    renderPosts();
    return;
  }

  const results = POSTS.filter(p =>
    p.title.toLowerCase().includes(query)
  );

  const sidebar = document.getElementById("sidebar");

  if (results.length === 0) {
    sidebar.innerHTML = "❌ No result";
    return;
  }

  sidebar.innerHTML = results.map(p => `
    <div class="post-item" onclick="goPost('${p.slug}')">
      🔎 ${p.title}
    </div>
  `).join("");
}
