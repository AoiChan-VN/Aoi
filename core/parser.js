export function parseMarkdown(md) {
    let html = md;

    // Code block
    html = html.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`);
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers (Hỗ trợ từ h1 đến h3)
    html = html.replace(/^### (.*)$/gim, '<h3>$1</h3>')
               .replace(/^## (.*)$/gim, '<h2>$1</h2>')
               .replace(/^# (.*)$/gim, '<h1>$1</h1>');

    // Bold / Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
               .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               .replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Links & Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
               .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Blockquote
    html = html.replace(/^> (.*)$/gim, '<blockquote>$1</blockquote>');
    
    // Lists (Tối ưu hóa hiển thị)
    html = html.replace(/^\- (.*)$/gim, '<ul><li>$1</li></ul>').replace(/<\/ul>\s*<ul>/g, '');

    // Xử lý Paragraph: Chỉ bọc thẻ <p> cho những dòng chưa có thẻ HTML bao quanh
    return html.split(/\n{2,}/).map(block => {
        // Nếu block đã bắt đầu bằng một thẻ HTML (như <div>, <h1>, <ul>), trả về luôn
        if (/^\s*<[a-z1-6]/i.test(block.trim())) return block;
        return `<p>${block.trim()}</p>`;
    }).join('');
}
