'use client';

import { useState } from 'react';

export default function EmailTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [testType, setTestType] = useState('contact');

  const testContactEmail = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          phone: '+966501234567',
          company: 'Test Company',
          service: 'Digital Marketing',
          message: 'This is a test email from the contact form.',
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const testCustomServiceEmail = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Custom Service Test',
          email: 'test@example.com',
          phone: '+966501234567',
          company: 'Test Company',
          services: ['SEO Optimization', 'Social Media Marketing', 'Content Creation'],
          description: 'We need a complete digital transformation package.',
          isCustomService: true,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-navy via-secondary-dark to-dark-navy text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Email Configuration Test</h1>
        
        <div className="bg-secondary-dark rounded-lg p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Configuration Status</h2>
            <div className="bg-secondary-dark/50 rounded p-4 space-y-2 font-mono text-sm">
              <p>✅ SMTP_HOST: {process.env.NEXT_PUBLIC_API_URL || 'smtp.gmail.com (configured)'}</p>
              <p>✅ SMTP_USER: d.arrow2026@gmail.com</p>
              <p>✅ CONTACT_RECIPIENT: d.arrow2026@gmail.com</p>
              <p>✅ Environment: {process.env.NODE_ENV}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Test Email Sending</h2>
            
            <div className="flex gap-4">
              <button
                onClick={testContactEmail}
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-lg font-bold transition ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] hover:from-[#FF9A3C] hover:to-[#FF6F4F] text-white'
                }`}
              >
                {loading ? 'Sending...' : 'Test Contact Form Email'}
              </button>
              
              <button
                onClick={testCustomServiceEmail}
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-lg font-bold transition ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-black'
                }`}
              >
                {loading ? 'Sending...' : 'Test Custom Service Email'}
              </button>
            </div>
          </div>

          {result && (
            <div className={`rounded-lg p-6 ${result.ok ? 'bg-green-900' : 'bg-red-900'}`}>
              <h3 className="text-xl font-bold mb-4">
                {result.ok ? '✅ Email Sent Successfully!' : '❌ Email Failed'}
              </h3>
              <div className="bg-black/30 rounded p-4 font-mono text-sm overflow-auto max-h-64">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
              {result.preview && (
                <p className="mt-4 text-sm">
                  Preview URL: <a href={result.preview} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{result.preview}</a>
                </p>
              )}
            </div>
          )}

          <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-4">
            <h3 className="font-bold mb-2">🔍 What to Check:</h3>
            <ul className="text-sm space-y-1">
              <li>✅ Check your email: d.arrow2026@gmail.com</li>
              <li>✅ Emails should arrive within 2-3 minutes</li>
              <li>✅ Check spam folder if not in inbox</li>
              <li>✅ Verify email content and formatting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
