import React from 'react';

/**
 * Parses markdown formatting (bold **, italics *, linebreaks \n, lists)
 * and renders clean, formatted HTML without showing raw * * asterisks.
 */
export default function FormattedText({ content, className = "" }) {
  if (!content) return null;

  // Split by double line breaks into paragraphs
  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className={`space-y-3 ${className}`}>
      {paragraphs.map((para, pIdx) => {
        // Check if paragraph is a bullet list or numbered list
        const lines = para.split('\n');

        return (
          <div key={pIdx} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const formattedLine = parseMarkdownLine(line);
              
              // Handle list items
              if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().startsWith('• ')) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-slate-400 font-bold select-none">•</span>
                    <span dangerouslySetInnerHTML={{ __html: parseMarkdownLine(line.replace(/^[-*•]\s*/, '')) }} />
                  </div>
                );
              }

              return (
                <p key={lIdx} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function parseMarkdownLine(text) {
  if (!text) return '';

  let parsed = text;

  // Replace bold **text** with <strong>text</strong>
  parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');

  // Replace italic *text* or _text_ with <em>text</em>
  parsed = parsed.replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>');

  // Replace inline code `text`
  parsed = parsed.replace(/`(.*?)`/g, '<code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');

  return parsed;
}
