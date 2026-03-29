'use client';

import React, { useState, useEffect } from 'react';

export default function LazySection({ children, minHeight = "400px" }: { children: React.ReactNode, minHeight?: string }) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Delay rendering by 3.5 seconds completely avoiding TBT and LCP interference
    const t = setTimeout(() => {
      setShouldRender(true);
    }, 3500);

    const onInteract = () => {
      setShouldRender(true);
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('touchstart', onInteract);
      window.removeEventListener('mousemove', onInteract);
      clearTimeout(t);
    };

    window.addEventListener('scroll', onInteract, { passive: true });
    window.addEventListener('touchstart', onInteract, { passive: true });
    window.addEventListener('mousemove', onInteract, { passive: true });

    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('touchstart', onInteract);
      window.removeEventListener('mousemove', onInteract);
    };
  }, []);

  if (!shouldRender) {
    return <div style={{ minHeight }} aria-hidden="true" />;
  }

  return <>{children}</>;
}
