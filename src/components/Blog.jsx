import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  // Articles data (same as in BlogPost.js)
  const articles = [
    {
      id: 1,
      title: "YouTubeで伸びる動画を見極める！競合リサーチのコツ",
      description: "YouTubeで伸びる動画の見つけ方をやさしく解説。VizzTubeを使った数字に基づく競合分析で、どんな動画を作ればいいかが分かります。",
      image: "/src/assets/blog.png",
    },
    {
      id: 2,
      title: "再生数が伸びない…YouTube伸び悩みチャンネルの原因と対策",
      description: "YouTubeで再生数が伸び悩む原因を徹底解説。VizzTubeを使った数字に基づく分析方法で、伸びないチャンネルを改善し再生数・登録者数を増やす具体策を紹介します。",
      image: "/src/assets/blog.png",
    },
     {
      id: 3,
      title: "キーワード選びで再生数が変わる！YouTubeで伸びる動画の見つけ方",
      description: "YouTubeで再生数を増やすにはキーワード選びが大切。VizzTubeを使った具体的な方法で、どんなキーワードが伸びやすいかをやさしく解説します。",
      image: "/src/assets/blog.png",
    },
     {
      id: 4,
      title: "VizzTubeでライバルチャンネルを分析！伸びる動画の共通点を見つける方法",
      description: "VizzTubeを使ってライバルチャンネルを分析し、伸びる動画の共通点を見つける方法をわかりやすく解説。数字をもとに改善して再生数を伸ばすコツを紹介します。",
      image: "/src/assets/blog.png",
    },
     {
      id: 5,
      title: "VizzTubeで動画比較！どの動画が伸びやすいか数字で判断する方法",
      description: "VizzTubeを使って複数の動画を比較し、どの動画が伸びやすいかを数字で判断する方法をわかりやすく解説。再生数や登録者数などの指標を使った具体例も紹介します。",
      image: "/src/assets/blog.png",
    },
     {
      id: 6,
      title: "VizzTubeでチャンネル全体を分析！伸びる動画の傾向を見つける方法",
      description: "VizzTubeを使ってチャンネル全体の数字を分析し、どんな動画が伸びやすいかを見つける方法をやさしく解説。登録者数や平均再生数を確認して改善に役立てます。",
      image: "/src/assets/blog.png",
    },
     {
      id: 7,
      title: "VizzTubeでキーワード検索！人気動画の傾向を数字で見つける方法",
      description: "VizzTubeでキーワードごとに動画を検索し、人気動画の傾向を数字で見つける方法をやさしく解説。視聴回数や登録者数との比率をもとに、次の動画作りに活かせます。",
      image: "/src/assets/blog.png",
    },
     {
      id: 8,
      title: "競合チャンネルの戦略を数字で丸裸にする！VizzTube活用法",
      description: "競合チャンネルを分析して戦略を学ぶ方法を紹介。平均再生数や登録者数との比率を数字で比較すれば、自分のチャンネル改善ポイントが見えてきます。",
      image: "/src/assets/blog.png",
    },
     {
      id: 9,
      title: "視聴回数と登録者数の関係を分析しよう｜YouTube成功のカギは比率にあり",
      description: "登録者数が多いのに再生されないチャンネル、逆に登録者が少なくてもバズるチャンネル。その違いを数字で分析して、チャンネル改善に役立てる方法を紹介します。",
      image: "/src/assets/blog.png",
    },
     {
      id: 10,
      title: "YouTubeリサーチを効率化するCSVダウンロードの使い方｜データで差をつける戦略",
      description: "VizzTubeのCSVダウンロード機能を使えば、YouTube動画のリサーチを効率化できます。スプレッドシートでの分析方法や、競合調査・企画立案への応用方法を解説します。",
      image: "/src/assets/blog.png",
    },
    // Add more articles...
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">VizzTube日記</h1>
        <p className="text-gray-600 text-lg">YouTube分析と成功戦略に関する最新の洞察</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map(article => (
          <Link 
            key={article.id} 
            to={`/blog/${article.id}`}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{article.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>
              <div className="flex items-center text-purple-600 font-medium">
                <span>続きを読む</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;