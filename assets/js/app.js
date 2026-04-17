window.addEventListener("load", async () => {
  document.getElementById("loader").style.display = "none";

  await loadComponent("header","components/header.html");
  await loadComponent("footer","components/footer.html");

  renderRoute();
});

async function loadComponent(id,file){
  const res = await fetch(file);
  document.getElementById(id).innerHTML = await res.text();
}

// HOME
async function homePage(){
  const data = await loadPostsAuto();

  document.getElementById("app").innerHTML = `
  <section class="hero">
    <h1>🌿🥀𝓐𝓸𝓲𝓒𝓱𝓪𝓷🥀🌿</h1>
    <p data-i18n="intro"></p>
  </section>

  <div class="grid">
    ${data.map(p=>`
      <div class="card" onclick="openPost('${p.file}')">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>
    `).join("")}
  </div>
  `;

  applyLang();
}

function openPost(file){
  navigate("/post",{file});
}

// POST
async function postPage(){
  const file = history.state?.file;
  if(!file) return navigate("/");

  const res = await fetch(`assets/posts/${file}`);
  const md = await res.text();

  document.getElementById("app").innerHTML =
    `<div class="markdown">${markdownToHTML(md)}</div>`;
}
