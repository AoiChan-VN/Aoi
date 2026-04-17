window.addEventListener("load", ()=>{
  document.getElementById("loader").style.display="none";
  loadComponent("header","components/header.html");
  loadComponent("footer","components/footer.html");
  renderRoute();
});

async function loadComponent(id,file){
  const res=await fetch(file);
  document.getElementById(id).innerHTML=await res.text();
}

// Home
async function homePage(){
  const res=await fetch("assets/data/posts.json");
  const data=await res.json();

  const html=`
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
  </div>`;

  document.getElementById("app").innerHTML=html;
  applyLang();
}

function openPost(file){
  navigate("/post",{file});
}

// Post
async function postPage(){
  const file = history.state?.file;
  if(!file) return navigate("/");

  const res = await fetch(`assets/posts/${file}`);
  const md = await res.text();
  const html = markdownToHTML(md);

  document.getElementById("app").innerHTML = `
    <div class="markdown">${html}</div>
  `;
}

// Theme
function toggleTheme(){
  document.body.classList.toggle("light");
  localStorage.setItem("theme",document.body.classList.contains("light")?"light":"dark");
}
if(localStorage.getItem("theme")==="light") document.body.classList.add("light");
