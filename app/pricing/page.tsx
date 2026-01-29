"use client";

import { Check, LinkIcon } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600">
              Shortzy
            </span>
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
            Try Free
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-gray-900 mb-6">
            Simple Pricing That Makes Sense
          </h1>
          <p className="text-2xl text-gray-600">
            3x cheaper than bit.ly. 100x better.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
            <div className="text-sm font-bold text-gray-600 mb-4">FREE</div>
            <div className="text-5xl font-black text-gray-900 mb-2">$0</div>
            <div className="text-gray-600 mb-8">/forever</div>
            
            <ul className="space-y-4 mb-8">
              <Feature text="5 links per day" />
              <Feature text="QR codes included" />
              <Feature text="Basic analytics" />
              <Feature text="30-day link expiration" />
              <Feature text="Shortzy subdomain" />
            </ul>

            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-bold text-center hover:bg-gray-200 transition-colors"
            >
              Start Free
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-3xl p-8 text-white transform scale-105 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold">PRO</div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                MOST POPULAR
              </div>
            </div>
            <div className="text-5xl font-black mb-2">$9</div>
            <div className="opacity-90 mb-8">/month</div>
            
            <ul className="space-y-4 mb-8">
              <Feature text="Unlimited links" light />
              <Feature text="Custom branded domains" light />
              <Feature text="Advanced analytics" light />
              <Feature text="Never-expiring links" light />
              <Feature text="Password protection" light />
              <Feature text="Link editing" light />
              <Feature text="Priority support" light />
            </ul>

            <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-black hover:scale-105 transition-transform">
              Start Free Trial →
            </button>
            <p className="text-xs opacity-75 text-center mt-3">No credit card required</p>
          </div>

          {/* Business */}
          <div className="bg-white rounded-3xl p-8 border-2 border-indigo-200">
            <div className="text-sm font-bold text-gray-600 mb-4">BUSINESS</div>
            <div className="text-5xl font-black text-gray-900 mb-2">$29</div>
            <div className="text-gray-600 mb-8">/month</div>
            
            <ul className="space-y-4 mb-8">
              <Feature text="Everything in Pro" />
              <Feature text="Team accounts (5 users)" />
              <Feature text="White-label QR codes" />
              <Feature text="API access (10K calls/mo)" />
              <Feature text="Custom link slugs" />
              <Feature text="Bulk upload (CSV)" />
              <Feature text="Dedicated support" />
            </ul>

            <button className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-3 rounded-xl font-black hover:scale-105 transition-transform">
              Start Free Trial →
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-24 bg-white rounded-3xl p-12 border border-gray-200">
          <h2 className="text-3xl font-black text-center mb-12">vs. Competitors</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 font-bold text-gray-900">Feature</th>
                  <th className="text-center py-4 font-bold text-indigo-600">Shortzy</th>
                  <th className="text-center py-4 font-bold text-gray-400">bit.ly</th>
                  <th className="text-center py-4 font-bold text-gray-400">Rebrandly</th>
                </tr>
              </thead>
              <tbody>
                <ComparisonRow feature="Price" shortzy="$9/mo" bitly="$29/mo" rebrandly="$24/mo" />
                <ComparisonRow feature="Custom domains" shortzy="✓" bitly="✓" rebrandly="✓" />
                <ComparisonRow feature="QR codes" shortzy="✓ Free" bitly="✗ Paid" rebrandly="✓" />
                <ComparisonRow feature="Link analytics" shortzy="✓ Advanced" bitly="✓ Basic" rebrandly="✓" />
                <ComparisonRow feature="API access" shortzy="$29/mo" bitly="Enterprise" rebrandly="$99/mo" />
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-24">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <FAQ
              question="How does the free tier work?"
              answer="You can shorten 5 links per day, forever. No credit card, no expiration. Perfect for personal use or testing."
            />
            <FAQ
              question="What's a custom branded domain?"
              answer="Instead of sh.zy/abc123, you can use yourbrand.link/anything. Builds trust and looks professional."
            />
            <FAQ
              question="Can I cancel anytime?"
              answer="Yes. Cancel from your dashboard, effective immediately. No questions asked."
            />
            <FAQ
              question="Do links expire?"
              answer="Free tier: 30 days. Pro/Business: Never. We keep your links active as long as you're subscribed."
            />
            <FAQ
              question="Is there an API?"
              answer="Yes! Business tier includes 10,000 API calls per month. Perfect for automation and integrations."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ text, light }: { text: string; light?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <Check className={`w-5 h-5 flex-shrink-0 ${light ? 'text-white' : 'text-green-600'}`} />
      <span className={light ? 'text-white' : 'text-gray-700'}>{text}</span>
    </li>
  );
}

function ComparisonRow({ feature, shortzy, bitly, rebrandly }: { feature: string; shortzy: string; bitly: string; rebrandly: string }) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-4 text-gray-900">{feature}</td>
      <td className="py-4 text-center font-bold text-indigo-600">{shortzy}</td>
      <td className="py-4 text-center text-gray-400">{bitly}</td>
      <td className="py-4 text-center text-gray-400">{rebrandly}</td>
    </tr>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-bold text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}
