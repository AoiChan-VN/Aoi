let POSTS = [];

async function loadPosts() {
  const cache = localStorage.getItem("posts");

  if (cache) {
    POSTS = JSON.parse(cache);
    renderPosts();
  }

  const res = await fetch("content/index.json");
  POSTS = await res.json();

  localStorage.setItem("posts", JSON.stringify(POSTS));
  renderPosts();
}

function renderPosts() {
  const sidebar = document.getElementById("sidebar");

  sidebar.innerHTML = POSTS.map(p => `
    <div class="post-item" onclick="goPost('${p.slug}')">
      📄 ${p.title}
    </div>
  `).join("");
}

function goPost(slug) {
  location.hash = "/post/" + slug;
} 
