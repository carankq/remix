/**
 * Simple server-side markdown to HTML converter
 * Handles common markdown syntax
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Headers (### h3, ## h2, # h1)
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold **text** or __text__
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  
  // Italic *text* or _text_
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Images ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  
  // Code blocks ```code```
  html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
  
  // Inline code `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Unordered lists
  html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
  html = html.replace(/^- (.+)$/gim, '<li>$1</li>');
  
  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*<\/li>)/gs, (match) => {
    return `<ul>${match}</ul>`;
  });
  
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');
  
  // Blockquotes
  html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>');
  
  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr />');
  html = html.replace(/^\*\*\*$/gim, '<hr />');
  
  // Line breaks (double newline = paragraph)
  html = html.split('\n\n').map(para => {
    if (!para.trim()) return '';
    // Don't wrap if already wrapped in block element
    if (para.match(/^<(h[1-6]|ul|ol|blockquote|pre|hr)/)) {
      return para;
    }
    return `<p>${para}</p>`;
  }).join('\n');
  
  // Single line breaks
  html = html.replace(/\n/g, '<br />');
  
  return html;
}

