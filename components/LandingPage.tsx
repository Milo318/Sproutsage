
import React from 'react';
import { AppTab } from '../types';

interface LandingPageProps {
  onNavigate: (tab: AppTab) => void;
  plantCount: number;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, plantCount }) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-emerald-800/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-lime-300 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold">AI-Powered Plant Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Your Plants Deserve
              <span className="block text-lime-200">Expert Care</span>
            </h1>

            <p className="text-lg sm:text-xl text-emerald-100 mb-10 max-w-xl mx-auto leading-relaxed">
              Snap a photo. Get instant identification, personalized care plans, disease diagnosis, and a smart watering schedule. All powered by advanced AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => onNavigate(AppTab.IDENTIFY)}
                className="group bg-white text-emerald-700 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-black/10 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <i className="fa-solid fa-camera text-xl"></i>
                Identify a Plant
                <i className="fa-solid fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
              </button>
              <button
                onClick={() => onNavigate(AppTab.DIAGNOSE)}
                className="group bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <i className="fa-solid fa-stethoscope text-xl"></i>
                Diagnose a Problem
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-sm text-emerald-100/80">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-shield-check text-lime-300"></i>
                <span>10,000+ Plants Identified</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-bolt text-lime-300"></i>
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-leaf text-lime-300"></i>
                <span>Expert-Level Advice</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Everything Your Garden Needs
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            From identification to daily care, SproutSage handles every aspect of plant parenthood.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: 'fa-camera',
              color: 'emerald',
              title: 'Instant Identification',
              desc: 'Snap a photo and get the plant name, species, and full care guide in seconds. Works with leaves, flowers, and fruits.',
            },
            {
              icon: 'fa-stethoscope',
              color: 'rose',
              title: 'Disease Diagnosis',
              desc: 'Spot something wrong? Upload a photo of yellowing leaves, spots, or pests and get a treatment plan with organic and chemical options.',
            },
            {
              icon: 'fa-droplet',
              color: 'blue',
              title: 'Smart Watering Reminders',
              desc: 'Never forget to water again. SproutSage tracks each plant\'s schedule and alerts you when it\'s time to hydrate.',
            },
            {
              icon: 'fa-book-open',
              color: 'amber',
              title: 'Garden Journal',
              desc: 'Log growth milestones, watering events, issues, and observations. Build a timeline of your garden\'s journey.',
            },
            {
              icon: 'fa-comment-dots',
              color: 'violet',
              title: 'Expert AI Chat',
              desc: 'Ask any gardening question and get answers grounded in real-time web research and expert horticultural knowledge.',
            },
            {
              icon: 'fa-paw',
              color: 'orange',
              title: 'Pet & Child Safety',
              desc: 'Every plant ID includes toxicity warnings so you know exactly what\'s safe for your family and furry friends.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                feature.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                feature.color === 'rose' ? 'bg-rose-50 text-rose-600' :
                feature.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                feature.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                feature.color === 'violet' ? 'bg-violet-50 text-violet-600' :
                'bg-orange-50 text-orange-600'
              }`}>
                <i className={`fa-solid ${feature.icon} text-xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-b from-white to-emerald-50/30 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              As Easy as 1-2-3
            </h2>
            <p className="text-gray-500 text-lg">No green thumb required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: 'fa-camera', title: 'Snap a Photo', desc: 'Take a picture of any plant or problem area with your camera.' },
              { step: '2', icon: 'fa-wand-magic-sparkles', title: 'AI Analyzes', desc: 'Our AI instantly identifies the plant or diagnoses the issue.' },
              { step: '3', icon: 'fa-check-double', title: 'Get Expert Care', desc: 'Receive a complete care plan with watering, light, soil, and more.' },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-emerald-200"></div>
                )}
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-emerald-600 text-white rounded-3xl shadow-xl shadow-emerald-200 mb-6 z-10">
                  <i className={`fa-solid ${item.icon} text-2xl`}></i>
                </div>
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Step {item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative bg-gradient-to-br from-emerald-600 to-teal-600 rounded-[2.5rem] p-10 sm:p-16 text-center text-white overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full"></div>
          </div>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Grow Smarter?</h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-md mx-auto">
              {plantCount > 0
                ? `You already have ${plantCount} plant${plantCount !== 1 ? 's' : ''} in your garden. Let's keep growing!`
                : 'Start your digital garden today. It\'s free, fast, and powered by the most advanced AI available.'}
            </p>
            <button
              onClick={() => onNavigate(AppTab.IDENTIFY)}
              className="bg-white text-emerald-700 px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-black/10 hover:shadow-xl hover:scale-[1.02] transition-all inline-flex items-center gap-3"
            >
              <i className="fa-solid fa-seedling"></i>
              {plantCount > 0 ? 'Identify Another Plant' : 'Get Started Free'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-leaf text-white text-sm"></i>
            </div>
            <span className="font-bold text-gray-900">SproutSage</span>
          </div>
          <p className="text-sm text-gray-400">AI-powered plant care & identification</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
