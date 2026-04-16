async function loadPost(slug) {
  const res = await fetch(`content/posts/${slug}.md`);
  const text = await res.text();

  const html = text
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
    .replace(/\n/g, '<br>');

  document.getElementById("app").innerHTML = html;
} 
