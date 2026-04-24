export function parseMarkdown(md) {
let html = md;

// Escape HTML
html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// Code block ``` ```
html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
});

// Inline code `
html = html.replace(/`([^`]+)`/g, (match, code) => {
    return `<code>${code}</code>`;
});

// Headers
html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

// Bold & Italic
html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

// Links [text](url)
html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
});

// Images ![alt](src)
html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`;
});

// Blockquote
html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

// Unordered list
html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');

// Ordered list
html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

// Paragraph
html = html.replace(/\n{2,}/g, '</p><p>');
html = `<p>${html}</p>`;

// Cleanup empty tags
html = html.replace(/<p><\/p>/g, '');

return html;

}
 
