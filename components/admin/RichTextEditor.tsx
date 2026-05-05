'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import react-quill-new with SSR disabled to avoid 'document is not defined' errors
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

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
          /* Removed overflow: hidden so tooltip is not clipped */
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
        /* Tooltip styling for Dark Mode */
        .rich-text-container .ql-tooltip {
          background-color: #14162E !important;
          border: 1px solid #374151 !important;
          color: #E6E6EA !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5) !important;
          border-radius: 8px !important;
          z-index: 50 !important;
          left: 15px !important; /* Ensure it stays in view */
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
      `}</style>
    </div>
  );
}
