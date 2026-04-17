async function render(){
  const route = location.hash.slice(2);

  if(route.startsWith("post/")) return renderPost(route.split("/")[1]);
  if(route.startsWith("doc/")) return renderDoc(route.split("/")[1]);
  if(route === "blog") return renderBlog();
  if(route === "projects") return renderProjects();
  if(route === "docs") return renderDocs();

  document.getElementById("app").innerHTML = `<h2>${t('welcome')}</h2>`;
}

/* ========================= projects ========================= */
async function renderProjects(){
  const data = await fetch('assets/data/projects.json').then(r=>r.json());

  document.getElementById("app").innerHTML = `
    <div class="grid">
      ${data.map(p=>`
        <div class="card">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
        </div>`).join('')}
    </div>`;
}
