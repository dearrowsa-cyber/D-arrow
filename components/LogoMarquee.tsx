'use client';

import Image from 'next/image';

const LogoMarquee = () => {
  const logos = [
    { src: '/beedco-main.png', alt: 'Beedco' },
    { src: '/connects1.png', alt: 'Connects 1' },
    { src: '/connects2.png', alt: 'Connects 2' },
    { src: '/pro1.png', alt: 'Partner 1' },
    { src: '/connects3.png', alt: 'Connects 3' },
    { src: '/pro2.png', alt: 'Partner 2' },
    { src: '/connects4.png', alt: 'Connects 4' },
    { src: '/connect2.png', alt: 'Connect 2' },
    { src: '/pro3.png', alt: 'Partner 3' },
  ];

  return (
    <div className="w-full overflow-hidden py-10 relative">
      {/* Edge Fade effect for a seamless look without a sharp cutoff */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0B0D1F] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0B0D1F] to-transparent z-10 pointer-events-none"></div>
      
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-track {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          /* The width must be max-content so the 50% translation moves exactly one set of logos */
          width: max-content;
          animation: marqueeScroll 35s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        .marquee-logo-card {
          flex-shrink: 0;
          width: 170px;
          height: 85px;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Solid white background so colorful logos pop and look clean */
          background-color: #ffffff;
          border-radius: 12px;
          padding: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .marquee-logo-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 8px 25px rgba(255, 154, 60, 0.4);
          border: 1px solid rgba(255, 154, 60, 0.5);
        }
      `}</style>
      
      <div className="marquee-track">
        {/* Set 1 */}
        {logos.map((logo, i) => (
          <div key={`set1-${i}`} className="marquee-logo-card group">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={150}
              height={65}
              /* NO brightness/invert filters! Just the original colorful logo properly sized */
              className="w-full h-full object-contain grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
        
        {/* Set 2 (Required for infinite CSS marquee loop to work seamlessly) */}
        {logos.map((logo, i) => (
          <div key={`set2-${i}`} className="marquee-logo-card group">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={150}
              height={65}
              className="w-full h-full object-contain grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoMarquee;
