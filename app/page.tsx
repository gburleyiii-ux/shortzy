"use client";

import { useState } from "react";
import { Link as LinkIcon, QrCode, BarChart3, Shield, Zap, Copy, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shortenUrl = async () => {
    if (!url) return;
    
    setLoading(true);
    // Simulate API call (will be real backend in production)
    setTimeout(() => {
      const shortCode = Math.random().toString(36).substring(2, 8);
      setShortUrl(`sh.zy/${shortCode}`);
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://sh.zy/${shortCode}`);
      setLoading(false);
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://${shortUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600">
              Shortzy
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium">
              Pricing
            </Link>
            <Link href="/analytics" className="text-gray-600 hover:text-gray-900 font-medium">
              Analytics
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero + Tool */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <div className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
            ⚡ 50M+ links shortened
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Shorten Links.<br />
            Track Everything.
          </h1>
          
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-12">
            Create short, branded links with instant QR codes and powerful analytics. Free forever.
          </p>
        </div>

        {/* Shortener Tool */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {!shortUrl ? (
            <div className="space-y-6">
              <div className="flex gap-4">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste your long URL here..."
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && shortenUrl()}
                />
                <button
                  onClick={shortenUrl}
                  disabled={!url || loading}
                  className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-12 py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Shortening...' : 'Shorten'}
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Link expires in 30 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  <span>Free QR code included</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Basic analytics</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Short URL */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Your shortened link:</label>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border-2 border-indigo-200">
                  <LinkIcon className="w-6 h-6 text-indigo-600" />
                  <span className="flex-1 text-2xl font-bold text-indigo-600">
                    {shortUrl}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* QR Code */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">QR Code:</label>
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
                    {qrCode && <img src={qrCode} alt="QR Code" className="mx-auto" />}
                    <button className="mt-4 text-indigo-600 font-bold hover:underline">
                      Download QR Code
                    </button>
                  </div>
                </div>

                {/* Stats Preview */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Analytics:</label>
                  <div className="bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl p-6 text-white">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm opacity-90">Clicks</div>
                        <div className="text-4xl font-black">0</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-90">Countries</div>
                        <div className="text-4xl font-black">0</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <Link href="/pricing" className="text-sm font-bold hover:underline">
                        Upgrade for advanced analytics →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShortUrl("");
                  setQrCode("");
                  setUrl("");
                }}
                className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Shorten Another Link
              </button>
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            <span>Instant shortening</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <span>Spam detection</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-indigo-600" />
            <span>No signup required</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-5xl font-black text-center mb-16 text-gray-900">
          Why Shortzy?
        </h2>

        <div className="grid md:grid-cols-3 gap-12">
          <FeatureCard
            icon="🔗"
            title="Branded Short Links"
            description="Use your own custom domain. Make every link on-brand and trustworthy."
          />
          <FeatureCard
            icon="📊"
            title="Advanced Analytics"
            description="See clicks, locations, devices, referrers. Know your audience."
          />
          <FeatureCard
            icon="📱"
            title="QR Codes Included"
            description="Every link gets a scannable QR code. Perfect for print and events."
          />
          <FeatureCard
            icon="⚡"
            title="Lightning Fast"
            description="Shorten links in milliseconds. No delays, no waiting."
          />
          <FeatureCard
            icon="🔒"
            title="Password Protected"
            description="Add password protection to sensitive links. Enterprise-grade security."
          />
          <FeatureCard
            icon="⏰"
            title="Link Expiration"
            description="Set expiration dates for time-sensitive campaigns."
          />
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-black mb-4">Ready to level up?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get unlimited links, custom domains, and advanced analytics
          </p>
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-5xl font-black">$9</div>
              <div className="opacity-90">/month</div>
            </div>
            <div className="text-6xl font-black opacity-50">vs</div>
            <div className="text-center opacity-60">
              <div className="text-3xl font-bold line-through">$29</div>
              <div className="text-sm">bit.ly charges</div>
            </div>
          </div>
          <Link
            href="/pricing"
            className="inline-block bg-white text-indigo-600 px-12 py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform"
          >
            View All Plans <ArrowRight className="inline w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto px-6 py-24 prose prose-lg">
        <h2 className="text-3xl font-black text-gray-900">The Best URL Shortener & QR Code Generator</h2>
        <p className="text-gray-600">
          Shortzy is the fastest, most affordable way to create short links and QR codes online. Whether you're sharing links on social media, running marketing campaigns, or tracking click-through rates, Shortzy gives you the tools you need to succeed.
        </p>
        <h3 className="text-2xl font-bold text-gray-900">Free Link Shortener</h3>
        <p className="text-gray-600">
          Create up to 5 short links per day completely free. Every shortened URL includes a free QR code and basic click analytics. No credit card required, no hidden fees.
        </p>
        <h3 className="text-2xl font-bold text-gray-900">Custom Branded Links</h3>
        <p className="text-gray-600">
          Upgrade to Pro and use your own custom domain for all your short links. Build trust with your audience by keeping your brand front and center in every link you share.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>© 2026 Shortzy. Built to make link sharing simple and profitable.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/pricing" className="hover:text-indigo-600">Pricing</Link>
            <Link href="/privacy" className="hover:text-indigo-600">Privacy</Link>
            <Link href="/terms" className="hover:text-indigo-600">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
