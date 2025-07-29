import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  Image as ImageIcon,
  List,
  ListOrdered,
  Heading,
  Quote,
  Code,
  Undo,
  Redo,
  Save
} from 'lucide-react';

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const BlogEditor = ({ content, onChange }: BlogEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Blog yazınızı buraya yazın...',
      }),
    ],
    content: content,
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Resim URL\'i girin:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Link URL\'i girin:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleSave = () => {
    onChange(editor.getHTML());
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-900">
      <div className="flex gap-2 mb-4 flex-wrap border-b border-gray-700 pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-700' : ''}
        >
          <Heading size={24} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-700' : ''}
        >
          <Heading size={20} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-700' : ''}
        >
          <Bold size={20} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-700' : ''}
        >
          <Italic size={20} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-700' : ''}
        >
          <List size={20} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-700' : ''}
        >
          <ListOrdered size={20} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'bg-gray-700' : ''}
        >
          <Code size={20} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-gray-700' : ''}
        >
          <Quote size={20} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={editor.isActive('link') ? 'bg-gray-700' : ''}
        >
          <LinkIcon size={20} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={addImage}
        >
          <ImageIcon size={20} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo size={20} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo size={20} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="ml-auto"
        >
          <Save size={20} className="mr-2" />
          İçeriği Güncelle
        </Button>
      </div>
      <EditorContent 
        editor={editor} 
        className="prose prose-invert max-w-none min-h-[300px]" 
      />
    </div>
  );
};

export default BlogEditor; 