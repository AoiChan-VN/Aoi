export const parseMarkdown = (md) => {
    const rules = [
        [/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>'],
        [/`([^`]+)`/g, '<code>$1</code>'],
        [/^### (.*)$/gim, '<h3>$1</h3>'],
        [/^## (.*)$/gim, '<h2>$1</h2>'],
        [/^# (.*)$/gim, '<h1>$1</h1>'],
        [/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>'],
        [/\*\*(.*?)\*\*/g, '<strong>$1</strong>'],
        [/\*(.*?)\*/g, '<em>$1</em>'],
        [/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">'],
        [/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>'],
        [/^> (.*)$/gim, '<blockquote>$1</blockquote>'],
        [/^\- (.*)$/gim, '<ul><li>$1</li></ul>']
    ];

    let html = rules.reduce((acc, [reg, repl]) => acc.replace(reg, repl), md);
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    return html.split(/\n{2,}/).map(block => 
        /^\s*<[a-z1-6]/i.test(block.trim()) ? block : `<p>${block.trim()}</p>`
    ).join('');
};
 
