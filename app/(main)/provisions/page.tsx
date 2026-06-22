'use client';

import { useLanguage } from '@/components/LanguageProvider';
import Portfolio from '@/components/Portfolio';

export default function ProvisionsPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="pt-24 min-h-screen">
      <section className="px-2 md:px-2">
        <Portfolio />
      </section>
    </div>
  );
}
