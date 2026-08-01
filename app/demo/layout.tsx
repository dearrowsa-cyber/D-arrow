import type { ReactNode } from 'react';

// Demo pages have their OWN self-contained layout
// They must NOT use the main site ClientLayout (which causes hydration issues)
export default function DemoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
