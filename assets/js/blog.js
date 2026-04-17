async function renderBlog(){
  const data = await scanContent();
  const posts = data.filter(x=>x.type==='post');

  document.getElementById('app').innerHTML = posts.map(p=>`
    <div class="card fade-in">
      <h3>${p.title}</h3>
      <a href="#/post/${p.slug}">Read</a>
    </div>`).join('');
}

async function renderPost(slug){
  const md = await fetch(`content/posts/${slug}.md`).then(r=>r.text());
  document.getElementById('app').innerHTML = `<div class="fade-in">${parseMarkdown(md)}</div>`;
  setSEO(slug);
}
