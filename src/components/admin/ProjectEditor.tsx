import { useState, useEffect } from 'react';

interface ProjectEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const ProjectEditor = ({ content, onChange, placeholder = 'Proje açıklamasını buraya yazın...' }: ProjectEditorProps) => {
  const [markdownContent, setMarkdownContent] = useState(content);

  useEffect(() => {
    setMarkdownContent(content);
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setMarkdownContent(newContent);
    onChange(newContent);
  };

  return (
    <div className="border border-zinc-700 rounded-md">
      <textarea
        value={markdownContent}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-64 p-4 bg-zinc-800 border-0 text-white font-mono text-sm resize-none focus:outline-none focus:ring-0"
        style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
      />
      <div className="p-4 bg-zinc-900 border-t border-zinc-700 text-xs text-zinc-400">
        <p className="mb-2">Markdown desteği:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <span>**kalın** = <strong>kalın</strong></span>
          <span>*italik* = <em>italik</em></span>
          <span># Başlık 1</span>
          <span>## Başlık 2</span>
          <span>- Liste öğesi</span>
          <span>1. Numaralı liste</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor; 