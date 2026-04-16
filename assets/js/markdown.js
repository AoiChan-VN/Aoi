const mdCache = {};

async function loadPost(slug) {
  if (mdCache[slug]) {
    render(mdCache[slug]);
    return;
  }

  const res = await fetch(`content/posts/${slug}.md`);
  let text = await res.text();

  const html = parseMarkdown(text);

  mdCache[slug] = html;
  render(html);
}

function render(html) {
  document.getElementById("app").innerHTML = html;
}

function parseMarkdown(md) {
  return md
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*?)\*/gim, '<i>$1</i>')
    .replace(/\n/g, '<br>');
}
