export function parseMarkdown(md) {
    let html = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Code block & Inline code
    html = html.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`);
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers
    html = html.replace(/^### (.*)$/gim, '<h3>$1</h3>')
               .replace(/^## (.*)$/gim, '<h2>$1</h2>')
               .replace(/^# (.*)$/gim, '<h1>$1</h1>');

    // Bold / Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
               .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               .replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Links & Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" onerror="this.style.display=\'none\'">')
               .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Blockquote & Lists
    html = html.replace(/^> (.*)$/gim, '<blockquote>$1</blockquote>');
    
    // Tối ưu List để tránh lỗi ngắt dòng
    html = html.replace(/^\- (.*)$/gim, '<ul><li>$1</li></ul>').replace(/<\/ul>\s*<ul>/g, '');

    // Paragraph
    return html.split(/\n{2,}/).map(block => {
        if (/^<\/?(h\d|ul|pre|blockquote|img)/.test(block)) return block;
        return `<p>${block.trim()}</p>`;
    }).join('');
}
