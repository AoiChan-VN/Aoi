/**
 * 🌊 AoiMarkdown Parser
 * Chuyển đổi MD sang HTML an toàn & nhanh chóng
 */
export function parseMarkdown(md) {
    if (!md) return '';
    
    let html = md
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') // Escape HTML cơ bản
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>') // Code block
        .replace(/`([^`]+)`/g, '<code>$1</code>') // Inline code
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        .replace(/^> (.*)$/gim, '<blockquote>$1</blockquote>')
        .replace(/^\- (.*)$/gim, '<ul><li>$1</li></ul>');

    // Gộp các thẻ UL liền kề
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // Bọc Paragraph cho các đoạn văn bản rời rạc
    return html.split(/\n{2,}/).map(block => {
        if (/^\s*<[a-z1-6]/i.test(block.trim())) return block;
        return `<p>${block.trim().replace(/\n/g, '<br>')}</p>`;
    }).join('');
}
 
