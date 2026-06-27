'use client';

import { useMemo, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import react-quill-new with SSR disabled to avoid 'document is not defined' errors
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image'
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  dir?: 'rtl' | 'ltr';
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, dir = 'ltr', placeholder = 'Write your content here...' }: RichTextEditorProps) {
  const quillRef = useRef<any>(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', data.url);
          }
        } else {
          alert(data.error || 'فشل في رفع الصورة');
        }
      } catch (e) {
        alert('حدث خطأ أثناء الرفع');
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  return (
    <div className={`rich-text-container ${dir === 'rtl' ? 'rtl-editor' : ''}`} dir={dir}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      <style jsx global>{`
        .rich-text-container .quill {
          background-color: #1a1f3a;
          border-radius: 8px;
          border: 1px solid #374151;
          color: #E6E6EA;
          display: flex;
          flex-direction: column;
        }
        .rich-text-container .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #374151 !important;
          background-color: #14162E;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .rich-text-container .ql-container {
          border: none !important;
          min-height: 250px;
          font-family: inherit;
          font-size: 16px;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .rich-text-container .ql-editor {
          min-height: 250px;
        }
        .rich-text-container .ql-editor.ql-blank::before {
          color: #9CA3AF;
          font-style: normal;
        }
        
        /* Quill Icons & Active States */
        .rich-text-container .ql-stroke {
          stroke: #9CA3AF;
        }
        .rich-text-container .ql-fill {
          fill: #9CA3AF;
        }
        .rich-text-container .ql-picker {
          color: #9CA3AF;
        }
        
        .rich-text-container button.ql-active .ql-stroke,
        .rich-text-container button:hover .ql-stroke,
        .rich-text-container .ql-picker.ql-expanded .ql-stroke {
          stroke: #FF4D6D !important;
        }
        
        .rich-text-container button.ql-active .ql-fill,
        .rich-text-container button:hover .ql-fill,
        .rich-text-container .ql-picker.ql-expanded .ql-fill {
          fill: #FF4D6D !important;
        }
        
        .rich-text-container .ql-picker.ql-expanded,
        .rich-text-container .ql-picker:hover {
          color: #FF4D6D !important;
        }
        
        .rich-text-container .ql-picker-options {
          background-color: #14162E !important;
          border: 1px solid #374151 !important;
          color: #E6E6EA !important;
        }
        .rich-text-container .ql-picker-item:hover,
        .rich-text-container .ql-picker-item.ql-selected {
          color: #FF4D6D !important;
        }
        
        .rtl-editor .ql-editor {
          text-align: right;
          direction: rtl;
        }
        
        /* Fix for Bold in Arabic (overrides global.css which sets it to 400 or inverses it) */
        .rtl-editor .ql-editor p {
          font-weight: 400 !important;
        }
        .rich-text-container .ql-editor strong,
        .rich-text-container .ql-editor b {
          font-weight: 900 !important;
        }
        
        /* Tooltip styling for Dark Mode */
        .rich-text-container .ql-tooltip {
          background-color: #14162E !important;
          border: 1px solid #374151 !important;
          color: #E6E6EA !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5) !important;
          border-radius: 8px !important;
          z-index: 50 !important;
        }
        .rich-text-container .ql-tooltip input[type="text"] {
          background-color: #1a1f3a !important;
          border: 1px solid #374151 !important;
          color: #E6E6EA !important;
          outline: none !important;
          border-radius: 4px;
          padding: 4px 8px;
        }
        .rich-text-container .ql-tooltip input[type="text"]:focus {
          border-color: #FF5A5F !important;
        }
        .rich-text-container .ql-tooltip::before {
          color: #9CA3AF !important;
        }
        .rich-text-container .ql-tooltip a {
          color: #FF5A5F !important;
        }
        .rich-text-container .ql-tooltip a.ql-action::after {
          border-right: 0px !important;
          padding-right: 0px !important;
        }
        .rich-text-container .ql-tooltip a.ql-remove::before {
          color: #FF5A5F !important;
        }
        
        /* Light Mode Styling for Editor */
        :global(.admin-layout.light-mode) .rich-text-container .quill {
          background-color: #FFFFFF;
          border: 1px solid rgba(255, 77, 109, 0.2);
          color: #111827;
        }
        :global(.admin-layout.light-mode) .rich-text-container .ql-toolbar {
          background-color: #F9FAFB;
          border-bottom: 1px solid rgba(255, 77, 109, 0.2) !important;
        }
        :global(.admin-layout.light-mode) .rich-text-container .ql-editor.ql-blank::before {
          color: #6B7280;
        }
        :global(.admin-layout.light-mode) .rich-text-container .ql-stroke {
          stroke: #6B7280;
        }
        :global(.admin-layout.light-mode) .rich-text-container .ql-fill {
          fill: #6B7280;
        }
        :global(.admin-layout.light-mode) .rich-text-container .ql-picker {
          color: #6B7280;
        }
        :global(.admin-layout.light-mode) .rich-text-container .ql-picker-options {
          background-color: #FFFFFF !important;
          border: 1px solid rgba(255, 77, 109, 0.2) !important;
          color: #111827 !important;
        }
        :global(.admin-layout.light-mode) .rich-text-container .ql-tooltip {
          background-color: #FFFFFF !important;
          border: 1px solid rgba(255, 77, 109, 0.2) !important;
          color: #111827 !important;
        }
        :global(.admin-layout.light-mode) .rich-text-container .ql-tooltip input[type="text"] {
          background-color: #F9FAFB !important;
          border: 1px solid rgba(255, 77, 109, 0.2) !important;
          color: #111827 !important;
        }
      `}</style>
    </div>
  );
}
