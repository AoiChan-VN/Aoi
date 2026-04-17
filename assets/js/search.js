document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("search").addEventListener("input",async e=>{
    const q = e.target.value.toLowerCase();
    const data = await scanContent();

    const result = data.filter(x=>x.title.toLowerCase().includes(q));

    document.getElementById('app').innerHTML = result.map(r=>`
      <div class="card">
        <a href="#/${r.type}/${r.slug}">${r.title}</a>
      </div>`).join('');
  });
});
