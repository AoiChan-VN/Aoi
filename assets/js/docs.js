async function renderDocs(){
  const data = await scanContent();
  const docs = data.filter(x=>x.type==='doc');

  document.getElementById('app').innerHTML = docs.map(d=>`
    <div class="card fade-in">
      <a href="#/doc/${d.slug}">${d.title}</a>
    </div>`).join('');
}

async function renderDoc(slug){
  const md = await fetch(`content/docs/${slug}.md`).then(r=>r.text());
  document.getElementById('app').innerHTML = `<div class="fade-in">${parseMarkdown(md)}</div>`;
}
