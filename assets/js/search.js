function searchPosts(query) {
  query = query.toLowerCase();

  const results = POSTS.filter(p =>
    p.title.toLowerCase().includes(query) ||
    (p.tags && p.tags.join(" ").includes(query))
  );

  renderSearch(results);
}

function renderSearch(list) {
  const sidebar = document.getElementById("sidebar");

  sidebar.innerHTML = list.map(p => `
    <div class="post-item" onclick="goPost('${p.slug}')">
      🔎 ${p.title}
    </div>
  `).join("");
} 
