import { useState } from 'react';
import { Link, Share2, Zap, QrCode, Shield } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortLink, setShortLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          expires_in_minutes: 0, // No expiration
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
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-gray-900">Shorty</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Home</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">About</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Login</a>
              <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors font-medium">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-4xl w-full space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Shorten Your Long Links
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Paste your long URL below to create a shortened link and generate
              a QR code instantly.
            </p>
          </div>

          {/* URL Shortener Form */}
          <form onSubmit={handleShorten} className="w-full max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-xl shadow-lg p-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your long link here (e.g., https://very-long-website.com/article/2023/somet..."
                className="flex-1 px-6 py-4 text-gray-700 placeholder-gray-400 focus:outline-none rounded-lg"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-secondary transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Link className="w-5 h-5" />
                <span>{loading ? 'Shortening...' : 'Shorten'}</span>
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Result Card */}
          {shortLink && (
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* QR Code */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-20 h-20 text-gray-400" />
                  </div>
                </div>

                {/* Link Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                      Short Link
                    </p>
                    <div className="flex items-center space-x-2">
                      <a
                        href={shortLink.short_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-semibold text-primary hover:underline"
                      >
                        shorty.link/{shortLink.short_code}
                      </a>
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Original:</span>{' '}
                      <span className="truncate inline-block max-w-md">{url}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy Link</span>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600">Instant redirection for your users.</p>
            </div>

            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">QR Generation</h3>
              <p className="text-gray-600">Auto-generated QR codes.</p>
            </div>

            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Secure Links</h3>
              <p className="text-gray-600">HTTPS encryption enabled.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          © 2023 Shorty Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
