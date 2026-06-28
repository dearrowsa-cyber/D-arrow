'use client';

import { useState } from 'react';
import { Sparkles, PenTool, Maximize2, Loader2, X } from 'lucide-react';

interface AIWriterAssistantProps {
  content: string;
  onContentChange: (newContent: string) => void;
  language: 'ar' | 'en';
}

export default function AIWriterAssistant({ content, onContentChange, language }: AIWriterAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<'generate_draft' | 'improve' | 'expand'>('generate_draft');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAIAction = async () => {
    if (!prompt && action === 'generate_draft') {
      setError(language === 'ar' ? 'يرجى إدخال فكرة أو عنوان للمقال' : 'Please enter a topic or title');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/ai/writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          prompt,
          context: action !== 'generate_draft' ? content : '',
          language
        })
      });
      
      const data = await res.json();
      
      if (data.success && data.content) {
        if (action === 'generate_draft') {
          // Replace content with draft
          onContentChange(data.content);
        } else {
          // Append or replace depending on context. For now, replace or add to bottom.
          // Better: just replace the whole content with the improved version
          onContentChange(data.content);
        }
        setIsOpen(false);
        setPrompt('');
      } else {
        setError(data.error || 'Failed to generate content');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white rounded-lg font-medium transition-all text-sm shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
          <Sparkles size={16} />
          {language === 'ar' ? 'المساعد الذكي (AI)' : 'AI Assistant'}
        </button>
      ) : (
        <div className="ai-writer-panel bg-white dark:bg-[#14162E] border border-gray-200 dark:border-[#8B5CF6]/30 rounded-xl p-4 shadow-xl relative">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 left-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            style={{ right: language === 'ar' ? 'auto' : '16px', left: language === 'ar' ? '16px' : 'auto' }}
          >
            <X size={18} />
          </button>
          
          <h4 className="text-[#8B5CF6] font-bold flex items-center gap-2 mb-4">
            <Sparkles size={18} />
            {language === 'ar' ? 'مساعد الكتابة بالذكاء الاصطناعي' : 'AI Writing Assistant'}
          </h4>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setAction('generate_draft')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${action === 'generate_draft' ? 'bg-[#8B5CF6] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10'}`}
            >
              <PenTool size={14} />
              {language === 'ar' ? 'كتابة مسودة مقال' : 'Generate Draft'}
            </button>
            <button
              onClick={() => setAction('improve')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${action === 'improve' ? 'bg-[#8B5CF6] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10'}`}
            >
              <Sparkles size={14} />
              {language === 'ar' ? 'تحسين صياغة المحتوى' : 'Improve Content'}
            </button>
            <button
              onClick={() => setAction('expand')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${action === 'expand' ? 'bg-[#8B5CF6] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10'}`}
            >
              <Maximize2 size={14} />
              {language === 'ar' ? 'توسيع وشرح أكثر' : 'Expand Content'}
            </button>
          </div>
          
          {action === 'generate_draft' && (
            <div className="mb-4">
              <label className="block text-sm text-gray-700 dark:text-gray-400 mb-2">
                {language === 'ar' ? 'عن ماذا تريد أن تكتب؟' : 'What do you want to write about?'}
              </label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: أفضل 5 استراتيجيات سيو في 2026...' : 'e.g. Top 5 SEO strategies in 2026...'}
                className="w-full bg-white dark:bg-[#0a0e27] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white text-sm outline-none focus:border-[#8B5CF6]"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          )}
          
          {(action === 'improve' || action === 'expand') && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-lg text-sm text-blue-800 dark:text-gray-400">
              {language === 'ar' 
                ? 'سيقوم الذكاء الاصطناعي بقراءة المحتوى الحالي في المحرر أسفله ومعالجته ثم استبداله بالنسخة المحسنة. يرجى التأكد من حفظ مسودة قبل ذلك إذا أردت.' 
                : 'The AI will read the current content in the editor below, process it, and replace it with the improved version. Please save a draft first if needed.'}
            </div>
          )}
          
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          
          <button
            onClick={handleAIAction}
            disabled={loading || (action === 'generate_draft' && !prompt)}
            className="w-full flex items-center justify-center gap-2 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading 
              ? (language === 'ar' ? 'جاري الكتابة...' : 'Generating...')
              : (language === 'ar' ? 'تنفيذ' : 'Execute')}
          </button>
        </div>
      )}
    </div>
  );
}
