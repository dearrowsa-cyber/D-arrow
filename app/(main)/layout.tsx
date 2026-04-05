import { Metadata } from 'next';
import ClientLayout from '@/components/ClientLayout';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/components/LanguageProvider';

// We can probably move some SEO metadata here from root layout if it's main-site specific, 
// but for now we just wrap the components.
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ClientLayout>
          {children}
        </ClientLayout>
      </LanguageProvider>
    </ThemeProvider>
  );
}
