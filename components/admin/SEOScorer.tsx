'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { Activity, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface SEOScorerProps {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export default function SEOScorer({ title, excerpt, content, tags }: SEOScorerProps) {
  const { language: _lang } = useLanguage();
  // Ensure we use 'ar' or 'en' for logic
  const lang = _lang === 'ar' ? 'ar' : 'en';

  const [score, setScore] = useState(0);
  const [checks, setChecks] = useState<{ id: string, text: string, status: 'pass' | 'warn' | 'fail' }[]>([]);

  useEffect(() => {
    analyzeSEO();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, excerpt, content, tags]);

  const analyzeSEO = () => {
    let currentScore = 0;
    const newChecks: typeof checks = [];

    const plainTextContent = content ? content.replace(/<[^>]+>/g, '') : '';
    const wordCount = plainTextContent.split(/\s+/).filter(w => w.length > 0).length;

    // 1. Title Length
    if (!title) {
      newChecks.push({ id: 't1', text: lang === 'ar' ? 'العنوان مفقود' : 'Title is missing', status: 'fail' });
    } else if (title.length < 15) {
      newChecks.push({ id: 't1', text: lang === 'ar' ? 'العنوان قصير جداً' : 'Title is too short', status: 'warn' });
      currentScore += 5;
    } else if (title.length > 60) {
      newChecks.push({ id: 't1', text: lang === 'ar' ? 'العنوان طويل جداً (أكثر من 60 حرف)' : 'Title is too long (> 60 chars)', status: 'warn' });
      currentScore += 10;
    } else {
      newChecks.push({ id: 't1', text: lang === 'ar' ? 'طول العنوان ممتاز' : 'Title length is excellent', status: 'pass' });
      currentScore += 20;
    }

    // 2. Excerpt / Meta Description
    if (!excerpt) {
      newChecks.push({ id: 'e1', text: lang === 'ar' ? 'وصف الميتا مفقود' : 'Meta description is missing', status: 'fail' });
    } else if (excerpt.length < 50) {
      newChecks.push({ id: 'e1', text: lang === 'ar' ? 'وصف الميتا قصير جداً' : 'Meta description is too short', status: 'warn' });
      currentScore += 5;
    } else if (excerpt.length > 160) {
      newChecks.push({ id: 'e1', text: lang === 'ar' ? 'وصف الميتا طويل جداً (أكثر من 160 حرف)' : 'Meta description is too long (> 160 chars)', status: 'warn' });
      currentScore += 10;
    } else {
      newChecks.push({ id: 'e1', text: lang === 'ar' ? 'طول وصف الميتا ممتاز' : 'Meta description length is excellent', status: 'pass' });
      currentScore += 20;
    }

    // 3. Word Count
    if (wordCount === 0) {
      newChecks.push({ id: 'w1', text: lang === 'ar' ? 'المحتوى فارغ' : 'Content is empty', status: 'fail' });
    } else if (wordCount < 300) {
      newChecks.push({ id: 'w1', text: lang === 'ar' ? `المحتوى قصير جداً (${wordCount} كلمة). يُنصح بـ 300 كلمة على الأقل` : `Content is too short (${wordCount} words). Minimum 300 recommended`, status: 'warn' });
      currentScore += 5;
    } else if (wordCount > 1000) {
      newChecks.push({ id: 'w1', text: lang === 'ar' ? `طول المحتوى ممتاز وعميق (${wordCount} كلمة)` : `Content length is excellent and in-depth (${wordCount} words)`, status: 'pass' });
      currentScore += 30;
    } else {
      newChecks.push({ id: 'w1', text: lang === 'ar' ? `طول المحتوى جيد (${wordCount} كلمة)` : `Content length is good (${wordCount} words)`, status: 'pass' });
      currentScore += 20;
    }

    // 4. Content Formatting (H2, H3, Links)
    const hasH2 = /<h2/i.test(content);
    const hasLinks = /<a/i.test(content);
    
    if (content.length > 0) {
      if (hasH2) {
        newChecks.push({ id: 'f1', text: lang === 'ar' ? 'تم استخدام عناوين فرعية H2' : 'H2 Subheadings used', status: 'pass' });
        currentScore += 10;
      } else {
        newChecks.push({ id: 'f1', text: lang === 'ar' ? 'لم يتم استخدام أي عناوين فرعية H2' : 'No H2 Subheadings used', status: 'warn' });
      }

      if (hasLinks) {
        newChecks.push({ id: 'f2', text: lang === 'ar' ? 'يحتوي المقال على روابط' : 'Article contains links', status: 'pass' });
        currentScore += 10;
      } else {
        newChecks.push({ id: 'f2', text: lang === 'ar' ? 'المقال لا يحتوي على أي روابط خارجية/داخلية' : 'Article has no internal/external links', status: 'warn' });
      }
    }

    // 5. Tags / Keywords
    if (tags.length === 0) {
      newChecks.push({ id: 'tg1', text: lang === 'ar' ? 'لم يتم إضافة أي وسوم' : 'No tags added', status: 'fail' });
    } else if (tags.length < 3) {
      newChecks.push({ id: 'tg1', text: lang === 'ar' ? 'تم إضافة عدد قليل من الوسوم' : 'Very few tags added', status: 'warn' });
      currentScore += 5;
    } else {
      newChecks.push({ id: 'tg1', text: lang === 'ar' ? 'عدد الوسوم ممتاز' : 'Tags count is excellent', status: 'pass' });
      currentScore += 10;
    }

    setChecks(newChecks);
    setScore(Math.min(100, currentScore));
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-[#10B981]';
    if (score >= 50) return 'text-[#FF9A3C]';
    return 'text-[#EF4444]';
  };

  const getScoreRing = () => {
    if (score >= 80) return 'border-[#10B981]';
    if (score >= 50) return 'border-[#FF9A3C]';
    return 'border-[#EF4444]';
  };

  return (
    <div className="admin-card mb-4 mt-6">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
        <Activity size={18} className="text-[#FF4D6D]" />
        <h4 className="text-[#E6E6EA] font-bold m-0 text-sm">
          {lang === 'ar' ? 'تقييم السيو اللحظي' : 'Live SEO Score'}
        </h4>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className={`w-16 h-16 rounded-full border-4 ${getScoreRing()} flex items-center justify-center bg-[#0a0e27]`}>
          <span className={`text-xl font-bold ${getScoreColor()}`}>{score}</span>
        </div>
        <div>
          <p className="text-sm text-gray-300 font-medium m-0 mb-1">
            {score >= 80 ? (lang === 'ar' ? 'ممتاز! المقال جاهز لتصدر البحث' : 'Excellent! Ready to rank') : 
             score >= 50 ? (lang === 'ar' ? 'جيد، لكن يحتاج لبعض التحسين' : 'Good, but needs improvement') : 
             (lang === 'ar' ? 'ضعيف، يرجى مراجعة الملاحظات أسفله' : 'Poor, please review notes below')}
          </p>
          <div className="w-40 h-2 bg-gray-800 rounded-full overflow-hidden mt-2">
            <div 
              className={`h-full transition-all duration-500 ${score >= 80 ? 'bg-[#10B981]' : score >= 50 ? 'bg-[#FF9A3C]' : 'bg-[#EF4444]'}`} 
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      <ul className="space-y-3 m-0 p-0 list-none">
        {checks.map((check) => (
          <li key={check.id} className="flex items-start gap-3 text-sm">
            {check.status === 'pass' && <CheckCircle2 size={16} className="text-[#10B981] flex-shrink-0 mt-0.5" />}
            {check.status === 'warn' && <AlertTriangle size={16} className="text-[#FF9A3C] flex-shrink-0 mt-0.5" />}
            {check.status === 'fail' && <XCircle size={16} className="text-[#EF4444] flex-shrink-0 mt-0.5" />}
            <span className={check.status === 'fail' ? 'text-gray-300' : 'text-gray-400'}>
              {check.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
