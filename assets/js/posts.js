let POSTS = [];
let CURRENT = "";

async function loadPosts() {
  const res = await fetch("content/index.json");
  POSTS = await res.json();
  renderPosts();
}

function renderPosts() {
  const sidebar = document.getElementById("sidebar");

  sidebar.innerHTML = POSTS.map(p => `
    <div class="post-item ${CURRENT === p.slug ? "active" : ""}"
         onclick="goPost('${p.slug}')">
      📄 ${p.title}
    </div>
  `).join("");
}

function goPost(slug) {
  CURRENT = slug;
  location.hash = "/post/" + slug;
  renderPosts();
  closeMenu();
}
