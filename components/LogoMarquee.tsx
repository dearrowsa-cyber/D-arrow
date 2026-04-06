'use client';

import Image from 'next/image';

const LogoMarquee = () => {
  // Removed connect2.png to avoid visual duplicates as requested
  const logos = [
    { src: '/beedco-main.png', alt: 'Beedco' },
    { src: '/connects1.png', alt: 'Connects 1' },
    { src: '/pro1.png', alt: 'Partner 1' },
    { src: '/connects2.png', alt: 'Connects 2' },
    { src: '/pro2.png', alt: 'Partner 2' },
    { src: '/connects3.png', alt: 'Connects 3' },
    { src: '/pro3.png', alt: 'Partner 3' },
    { src: '/connects4.png', alt: 'Connects 4' },
  ];

  return (
    <div className="w-full overflow-hidden py-10 relative bg-transparent">
      {/* Edge Fade effect for a seamless look without a sharp cutoff */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0B0D1F] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0B0D1F] to-transparent z-10 pointer-events-none"></div>
      
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          /* gap is 3rem = 48px. so we translate left by 100% of one track + the gap */
          100% { transform: translateX(calc(-100% - 3rem)); }
        }

        .marquee-wrapper {
          display: flex;
          overflow: hidden;
          gap: 3rem;
          user-select: none;
        }

        .marquee-track {
          display: flex;
          gap: 3rem;
          flex-shrink: 0;
          min-width: 100%;
          justify-content: space-around;
          animation: scroll 40s linear infinite;
        }

        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }

        .marquee-logo-card {
          width: 180px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          border-radius: 12px;
          padding: 14px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .marquee-logo-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 8px 25px rgba(255, 154, 60, 0.4);
          border: 1px solid rgba(255, 154, 60, 0.5);
        }
      `}</style>
      
      <div className="marquee-wrapper" dir="ltr">
        {/* We use 3 parallel tracks to guarantee absolute seamless loop on ANY screen size */}
        
        {/* Track 1 */}
        <div className="marquee-track">
          {logos.map((logo, i) => (
            <div key={`set1-${i}`} className="marquee-logo-card group">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={150}
                height={70}
                className="w-full h-full object-contain grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* Track 2 */}
        <div className="marquee-track" aria-hidden="true">
          {logos.map((logo, i) => (
            <div key={`set2-${i}`} className="marquee-logo-card group">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={150}
                height={70}
                className="w-full h-full object-contain grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* Track 3 */}
        <div className="marquee-track" aria-hidden="true">
          {logos.map((logo, i) => (
            <div key={`set3-${i}`} className="marquee-logo-card group">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={150}
                height={70}
                className="w-full h-full object-contain grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoMarquee;
