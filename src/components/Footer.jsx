import React from 'react';
import { Youtube, Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative flex-col bg-white border-t border-gray-200 text-black overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1000ms'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500 rounded-full blur-2xl animate-pulse" style={{animationDelay: '500ms'}}></div>
      </div>

    
      <div 
        className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 z-10"
        style={{
          animation: 'fadeInUp 0.8s ease-out'
        }}
      >
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div 
              className="flex items-center space-x-3 mb-6 transition-all duration-300 hover:scale-105"
              style={{
                animation: 'fadeInUp 0.6s ease-out 0.2s both'
              }}
            >
              <div className="relative">
                <div 
                  className="absolute inset-0 bg-red-500/30 rounded-full"
                  style={{
                    animation: 'pulse 2s infinite'
                  }}
                />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                VizzTube
              </h3>
            </div>
            <p 
              className="text-gray-600 text-sm leading-relaxed mb-6"
              style={{
                animation: 'fadeInUp 0.6s ease-out 0.4s both'
              }}
            >
              強力な分析と洞察でYouTube体験を変革しましょう。VizzTubeを信頼する数千人のクリエイターに参加してください。
            </p>
          </div>

          {/* Links Section */}
          <div
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.3s both'
            }}
          >
            <h4 className="font-semibold text-lg mb-6 text-black">クイックリンク</h4>
            <ul className="space-y-3">
              {[
                { href: "#", label: 'ホーム' },
                { href: "#", label: '機能' },
                { href: "#", label: 'ツール' },
                { href: "#", label: '使用方法' },
                { href: "#", label: '料金' }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-600 hover:text-black transition-all duration-300 text-sm inline-flex items-center group hover:translate-x-1"
                  >
                    <span className="group-hover:text-indigo-600 transition-colors duration-300">
                      {link.label}
                    </span>
                    <div className="w-0 h-px bg-indigo-400 ml-2 group-hover:w-4 transition-all duration-300"></div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.4s both'
            }}
          >
            <h4 className="font-semibold text-lg mb-6 text-black">法的事項</h4>
            <ul className="space-y-3">
              {[
                { href: "#", label: '利用規約' },
                { href: "#", label: 'プライバシーポリシー' },
                { href: "#", label: '商業条件' },
                { href: "#", label: 'クッキーポリシー' }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-600 hover:text-black transition-all duration-300 text-sm inline-flex items-center group hover:translate-x-1"
                  >
                    <span className="group-hover:text-indigo-600 transition-colors duration-300">
                      {link.label}
                    </span>
                    <div className="w-0 h-px bg-indigo-400 ml-2 group-hover:w-4 transition-all duration-300"></div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.5s both'
            }}
          >
            <h4 className="font-semibold text-lg mb-6 text-black">サポート</h4>
            <ul className="space-y-3">
              {[
                { href: "#", label: 'お問い合わせ' },
                { href: "#", label: 'よくある質問' },
                { href: "#", label: 'ヘルプセンター' },
                { href: "#", label: 'フィードバック' }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-600 hover:text-black transition-all duration-300 text-sm inline-flex items-center group hover:translate-x-1"
                  >
                    <span className="group-hover:text-indigo-600 transition-colors duration-300">
                      {link.label}
                    </span>
                    <div className="w-0 h-px bg-indigo-400 ml-2 group-hover:w-4 transition-all duration-300"></div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div 
          className="border-t border-gray-300/50 mb-8 transform scale-x-0 origin-left"
          style={{
            animation: 'scaleX 0.8s ease-out 0.6s both'
          }}
        ></div>

        {/* Bottom Section */}
        <div 
          className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0"
          style={{
            animation: 'fadeInUp 0.6s ease-out 0.7s both'
          }}
        >
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>© {new Date().getFullYear()} VizzTube. </span>
            <Heart 
              className="h-4 w-4 text-red-500 fill-current"
              style={{
                animation: 'heartbeat 1s infinite'
              }}
            />
            <span>で作られました Sahil</span>
          </div>
        </div>
           {/* Large Watermark Text at Bottom - Like DevStudio */}
      <div className=" bottom-0 left-0 right-0 mt-12 flex items-end justify-center pointer-events-none z-0 overflow-hidden">
        <div className="text-gray-500/20 font-bold text-[5rem]  sm:text-[8rem] md:text-[10rem] lg:text-[14rem] xl:text-[18rem] 2xl:text-[18rem] select-none leading-none whitespace-nowrap ">
          VizzTube
        </div>
      </div>

      </div>

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg backdrop-blur-sm z-50 transform scale-0 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
        style={{
          animation: 'scaleIn 0.3s ease-out 1s both'
        }}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleX {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
      `}</style>
    </footer>
  ); 
};

export default Footer;