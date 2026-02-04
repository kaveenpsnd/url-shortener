import { useState } from 'react';
import { Link, Share2, Zap, QrCode, Shield, Copy } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortLink, setShortLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_url: url,
          expires_in_minutes: 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }

      const data = await response.json();
      setShortLink(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortLink) {
      navigator.clipboard.writeText(shortLink.short_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc] relative overflow-hidden">
      {/* Ambient Background Gradient */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Dot Pattern Background */}
      <div className="fixed inset-0 z-0" style={{
        backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}></div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1440px' }}>
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <img src="/logo.png" alt="Shorty" className="h-8 w-auto" />
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium text-sm">Home</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium text-sm">About</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium text-sm">Login</a>
                <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full space-y-12" style={{ maxWidth: '1440px' }}>
            {/* Hero Section */}
            <div className="text-center space-y-6 pt-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight leading-tight">
                Shorten Your Long Links
              </h1>
              <p className="text-lg text-blue-600 max-w-2xl mx-auto">
                Paste your long URL below to create a shortened link and generate<br />
                a QR code instantly.
              </p>
            </div>

            {/* URL Shortener Form */}
            <form onSubmit={handleShorten} className="w-full max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste your long link here (e.g., https://very-long-website.com/article/2023/somet..."
                  className="flex-1 px-6 py-4 text-gray-700 placeholder-gray-400 focus:outline-none rounded-xl bg-transparent text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                >
                  <Link className="w-4 h-4" />
                  <span>{loading ? 'Shortening...' : 'Shorten'}</span>
                </button>
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Result Card */}
            {shortLink && (
              <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mt-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* QR Code with Polaroid Style */}
                  <div className="flex-shrink-0">
                    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-gray-100">
                      <div className="w-28 h-28 bg-gray-50 rounded flex items-center justify-center border border-gray-200">
                        <QrCode className="w-16 h-16 text-gray-900" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>

                  {/* Link Info */}
                  <div className="flex-1 space-y-4 min-w-0">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2 letterspacing">
                        Short Link
                      </p>
                      <div className="flex items-center space-x-2 mb-2">
                        <a
                          href={shortLink.short_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xl font-semibold text-blue-600 hover:underline truncate"
                        >
                          shorty.link/{shortLink.short_code}
                        </a>
                        <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        <span className="font-medium">Original:</span>{' '}
                        <span className="text-gray-600">{url}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg transition-colors font-medium text-sm"
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                      <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900">Lightning Fast</h3>
                <p className="text-sm text-blue-600">Instant redirection for your users.</p>
              </div>

              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900">QR Generation</h3>
                <p className="text-sm text-blue-600">Auto-generated QR codes.</p>
              </div>

              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900">Secure Links</h3>
                <p className="text-sm text-blue-600">HTTPS encryption enabled.</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-6 mt-auto">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm" style={{ maxWidth: '1440px' }}>
            © 2023 Shorty Inc. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
