'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import FAQSection from '@/components/help/FAQSection';
import SupportForm from '@/components/help/SupportForm';
import TransactionGuidance from '@/components/help/TransactionGuidance';

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<'faqs' | 'support' | 'guidance'>('faqs');

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Help Center
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Find answers to common questions, get support for transaction issues, or contact our team for personalized assistance.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'faqs'
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
            }`}
            aria-label="View frequently asked questions"
          >
            FAQs
          </button>
          <button
            onClick={() => setActiveTab('guidance')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'guidance'
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
            }`}
            aria-label="View transaction guidance"
          >
            Transaction Help
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'support'
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
            }`}
            aria-label="Contact support team"
          >
            Contact Support
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {activeTab === 'faqs' && <FAQSection />}
          {activeTab === 'support' && <SupportForm />}
          {activeTab === 'guidance' && <TransactionGuidance />}
        </div>

        {/* Quick Links */}
        <div className="mt-16 text-center">
          <Card className="inline-block">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">Still need help?</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="secondary"
                  onClick={() => setActiveTab('support')}
                >
                  Email Support
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => window.open('https://docs.neurowealth.com', '_blank')}
                >
                  Documentation
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
