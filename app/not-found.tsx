import Link from 'next/link';

export default function NotFound() {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-dark-navy to-secondary-dark">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4">404</h1>
            <p className="text-2xl text-soft-white mb-8">Page Not Found</p>
            <Link 
              href="/" 
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] text-white rounded-lg font-semibold transition-all hover:shadow-lg"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
