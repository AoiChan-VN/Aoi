export function parseMarkdown(md) {
let html = md;

// Escape HTML
html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// Code block
html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
});

// Inline code
html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

// Headers
html = html.replace(/^### (.*)$/gim, '<h3>$1</h3>');
html = html.replace(/^## (.*)$/gim, '<h2>$1</h2>');
html = html.replace(/^# (.*)$/gim, '<h1>$1</h1>');

// Bold / Italic
html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

// Links
html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
);

// Images + fallback
html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" loading="lazy" decoding="async" onerror="this.style.display=\'none\'">'
);

// Blockquote
html = html.replace(/^> (.*)$/gim, '<blockquote>$1</blockquote>');

// Lists
const lines = html.split('\n');
let result = [];
let inUL = false;

lines.forEach(line => {
    if (/^\- /.test(line)) {
        if (!inUL) {
            result.push('<ul>');
            inUL = true;
        }
        result.push(`<li>${line.replace(/^\- /, '')}</li>`);
    } else {
        if (inUL) {
            result.push('</ul>');
            inUL = false;
        }
        result.push(line);
    }
});

if (inUL) result.push('</ul>');

html = result.join('\n');

// Paragraph
html = html
    .split(/\n{2,}/)
    .map(block => {
        if (/^<\/?(h\d|ul|pre|blockquote)/.test(block)) return block;
        return `<p>${block.trim()}</p>`;
    })
    .join('');

return html;

}
