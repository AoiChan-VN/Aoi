async function renderBlog(){
  const app = document.getElementById("app");
  const posts = await fetch('assets/data/posts.json').then(r=>r.json());

  app.innerHTML = posts.map(p=>`
    <div class="card">
      <h3>${p.title}</h3>
      <a href="#/post/${p.file.replace('.md','')}">Read</a>
    </div>
  `).join('');
}

async function renderPost(slug){
  const app = document.getElementById("app");

  const cached = getCache(slug);
  if(cached){
    app.innerHTML = cached;
    return;
  }

  const md = await fetch(`content/posts/${slug}.md`).then(r=>r.text());
  const html = parseMarkdown(md);

  setCache(slug, html);
  app.innerHTML = html;
} 
