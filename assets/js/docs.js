async function renderDocs(){
  const files = await fetch('assets/data/posts.json').then(r=>r.json());

  document.getElementById("app").innerHTML = files.map(f=>`
    <div class="card">
      <a href="#/doc/${f.file.replace('.md','')}">${f.title}</a>
    </div>`).join('');
}

async function renderDoc(slug){
  const md = await fetch(`content/docs/${slug}.md`).then(r=>r.text());
  document.getElementById("app").innerHTML = parseMarkdown(md);
}
 
