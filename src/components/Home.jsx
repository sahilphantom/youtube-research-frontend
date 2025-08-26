import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SubscriptionStatus from './SubscriptionStatus';
import Hero from './Hero';
import FAQ from './FAQ';
import HowToUse from './HowToUse';
import Tools from './Tools';
import { Contact } from './Contact';
import Blog from './Blog';

// Link component - adjust based on your routing solution
const Link = ({ href, children, className, ...props }) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
);

export default function Home() {
  const { token, isSubscribed } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <Hero />

        {/* Newly designed div with Japanese content */}
      <motion.div
        className="max-w-4xl mx-auto mt-8 mb-16 p-10 bg-purple-50 rounded-xl shadow-lg text-center border border-purple-200"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-indigo-800">VizzTube（ヴィズチューブ）とは？</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
         このツールは、YouTubeの動画やチャンネル、検索ワードに対して詳細なデータ分析を行い、
バズっている理由・傾向を数値から読み解けるリサーチツールです。
動画URLやチャンネルURLを入れるだけで、再生数や評価、投稿時間帯、人気のタグなどを自動取得。
気になるジャンルの競合調査や、ヒット傾向の可視化が、誰でも簡単にできます。
さらにCSV出力にも対応しており、外部分析ツールとの連携もスムーズです。
        </p>
      </motion.div>

      
     
      <HowToUse />

      <Tools />
      <Blog />
      <FAQ />

      {/* Content Section */}
      {/* <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {token && <SubscriptionStatus />} */}

        {/* {!token && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Ready to unlock powerful insights?
            </h3>
            <p className="text-blue-700">
              Please log in to access our comprehensive YouTube research tools.
            </p>
          </div>
        )} */}

        {/* {token && !isSubscribed && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Upgrade to Premium
            </h3>
            <p className="text-yellow-700">
              Subscribe to unlock all research features and advanced analytics.
            </p>
          </div>
        )}

        {token && isSubscribed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Welcome back! 🎉
            </h3>
            <p className="text-green-700">
              You have full access to all features. Start analyzing and discover the next viral hit!
            </p>
          </div>
        )} */}

    
        {/* Contact Section */}
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-indigo-800">お問い合わせ</h1>
            <p className="text-lg text-gray-700">
              ご質問、サポート、または単にご挨拶でも、お気軽にお問い合わせください。ご連絡をお待ちしております。
            </p>
           
          </motion.div>
          <Contact />
        </div>
      </div>
    
  );
}