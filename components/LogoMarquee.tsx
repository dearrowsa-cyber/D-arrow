'use client';

import Image from 'next/image';

const LogoMarquee = () => {
  const logos = [
    { src: '/pro1.png', alt: 'مجلة السياحة العربية' },
    { src: '/connects4.png', alt: 'جمعية مثوى الأهلية' },
    { src: '/pro3.png', alt: 'New Age Maintenance Center' },
    { src: '/connects2.png', alt: 'شركة بيد BEEDCO' },
    { src: '/connects1.png', alt: 'ToPco' },
  ];

  return (
    <div style={{ width: '100%', overflow: 'hidden', padding: '2.5rem 0', position: 'relative' }}>
      {/* Left fade */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: '80px',
        background: 'linear-gradient(to right, #0B0D1F, transparent)',
        zIndex: 10, pointerEvents: 'none'
      }} />
      {/* Right fade */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, right: 0, width: '80px',
        background: 'linear-gradient(to left, #0B0D1F, transparent)',
        zIndex: 10, pointerEvents: 'none'
      }} />

      <style>{`
        @keyframes infiniteScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .logo-scroll-track {
          display: inline-flex;
          white-space: nowrap;
          animation: infiniteScroll 30s linear infinite;
        }
        .logo-scroll-track:hover {
          animation-play-state: paused;
        }
        .logo-card {
          flex-shrink: 0;
          width: 200px;
          height: 100px;
          margin: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border-radius: 14px;
          padding: 12px 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
        }
        .logo-card:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 8px 30px rgba(255, 154, 60, 0.35);
        }
      `}</style>

      <div dir="ltr" style={{ overflow: 'hidden' }}>
        <div className="logo-scroll-track">
          {/* Set 1 - original logos */}
          {logos.map((logo, i) => (
            <div key={`a-${i}`} className="logo-card">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={180}
                height={80}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          ))}
          {/* Set 2 - duplicate for seamless loop */}
          {logos.map((logo, i) => (
            <div key={`b-${i}`} className="logo-card">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={180}
                height={80}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoMarquee;
