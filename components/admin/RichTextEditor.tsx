'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import react-quill with SSR disabled to avoid 'document is not defined' errors
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  dir?: 'rtl' | 'ltr';
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, dir = 'ltr', placeholder = 'Write your content here...' }: RichTextEditorProps) {
  
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className={`rich-text-container ${dir === 'rtl' ? 'rtl-editor' : ''}`} dir={dir}>
      <ReactQuill
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
          overflow: hidden;
        }
        .rich-text-container .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #374151 !important;
          background-color: #14162E;
        }
        .rich-text-container .ql-container {
          border: none !important;
          min-height: 250px;
          font-family: inherit;
          font-size: 16px;
        }
        .rich-text-container .ql-editor {
          min-height: 250px;
        }
        .rich-text-container .ql-editor.ql-blank::before {
          color: #9CA3AF;
          font-style: normal;
        }
        .rich-text-container .ql-stroke {
          stroke: #9CA3AF !important;
        }
        .rich-text-container .ql-fill {
          fill: #9CA3AF !important;
        }
        .rich-text-container .ql-picker {
          color: #9CA3AF !important;
        }
        .rtl-editor .ql-editor {
          text-align: right;
          direction: rtl;
        }
      `}</style>
    </div>
  );
}
