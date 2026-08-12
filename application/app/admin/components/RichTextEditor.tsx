import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  ImagePlus,
  FileUp,
  Loader2,
} from "lucide-react";
import { uploadImage, type StorageBucket } from "./ImageUploader";
import { useToast } from "./Toast";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  /** Storage bucket inline-inserted images upload to. Defaults to the Articles bucket. */
  bucket?: StorageBucket;
}

function ToolbarButton({
  active,
  disabled,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`inline-flex h-[32px] w-[32px] items-center justify-center rounded-[8px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ content, onChange, bucket = "article_covers" }: RichTextEditorProps) {
  const toast = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const wordInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [importingWord, setImportingWord] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, autolink: true },
      }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[240px] rounded-b-[10px] border border-t-0 border-input bg-input px-[16px] py-[14px] text-[14px] leading-[1.7] text-foreground outline-hidden [&_h1]:text-[19px] [&_h1]:font-medium [&_h2]:text-[17px] [&_h2]:font-medium [&_h3]:text-[15px] [&_h3]:font-medium [&_p]:mb-[12px] [&_ul]:mb-[12px] [&_ul]:list-disc [&_ul]:pl-[22px] [&_ol]:mb-[12px] [&_ol]:list-decimal [&_ol]:pl-[22px] [&_a]:text-accent [&_a]:underline [&_blockquote]:border-l-[2px] [&_blockquote]:border-border [&_blockquote]:pl-[14px] [&_blockquote]:text-muted-foreground [&_img]:my-[12px] [&_img]:max-w-full [&_img]:rounded-[8px]",
      },
    },
  });

  if (!editor) return null;

  const onImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadImage(bucket, file, { aspect: "contain", maxWidth: 1600 });
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const onWordFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImportingWord(true);
    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
      editor.commands.setContent(html);
      onChange(editor.getHTML());
      toast.success("Word document imported. Complex tables or nested lists may need manual cleanup.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not import that document.");
    } finally {
      setImportingWord(false);
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "https://");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-[2px] rounded-t-[10px] border border-input bg-card px-[8px] py-[6px]">
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-[15px] w-[15px]" />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-[15px] w-[15px]" />
        </ToolbarButton>
        <div className="mx-[4px] h-[20px] w-px bg-border" />
        <ToolbarButton
          label="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-[15px] w-[15px]" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-[15px] w-[15px]" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-[15px] w-[15px]" />
        </ToolbarButton>
        <div className="mx-[4px] h-[20px] w-px bg-border" />
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-[15px] w-[15px]" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-[15px] w-[15px]" />
        </ToolbarButton>
        <ToolbarButton label="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-[15px] w-[15px]" />
        </ToolbarButton>
        <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink}>
          <LinkIcon className="h-[15px] w-[15px]" />
        </ToolbarButton>
        <div className="mx-[4px] h-[20px] w-px bg-border" />
        <ToolbarButton label="Insert image" disabled={uploadingImage} onClick={() => imageInputRef.current?.click()}>
          {uploadingImage ? <Loader2 className="h-[15px] w-[15px] animate-spin" /> : <ImagePlus className="h-[15px] w-[15px]" />}
        </ToolbarButton>
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={onImageFileChange} />

        <button
          type="button"
          disabled={importingWord}
          onClick={() => wordInputRef.current?.click()}
          className="ml-auto inline-flex items-center gap-[6px] rounded-[8px] border border-border px-[10px] py-[6px] text-[12px]! font-medium text-foreground transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {importingWord ? <Loader2 className="h-[13px] w-[13px] animate-spin" /> : <FileUp className="h-[13px] w-[13px]" />}
          Import from Word
        </button>
        <input ref={wordInputRef} type="file" accept=".docx" className="hidden" onChange={onWordFileChange} />
      </div>
      <EditorContent editor={editor} />
      <p className="mt-[6px] text-[12px] text-muted-foreground">
        Importing a Word document replaces the current content. Complex tables or nested lists may need manual cleanup afterward.
      </p>
    </div>
  );
}
