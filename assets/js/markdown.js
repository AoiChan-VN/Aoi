function parseMarkdown(md){
  return md
    .replace(/^### (.*$)/gim,'<h3>$1</h3>')
    .replace(/^## (.*$)/gim,'<h2>$1</h2>')
    .replace(/^# (.*$)/gim,'<h1>$1</h1>')
    .replace(/```([\s\S]*?)```/gim,'<pre><code>$1</code></pre>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim,'<img src="$2" alt="$1" loading="lazy">')
    .replace(/\*\*(.*?)\*\*/gim,'<b>$1</b>')
    .replace(/\*(.*?)\*/gim,'<i>$1</i>')
    .replace(/\n/g,'<br>');
}
