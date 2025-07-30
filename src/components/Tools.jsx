import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Search, BarChart3, Video, CheckCircle2, ArrowRight, BarChart4 } from "lucide-react"
import { Link } from "react-router-dom"

export default function Tools() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const tools = [
    {
      id: 1,
      icon: Search,
      title: "動画検索",
      description:
        "キーワードと条件で、狙い通りの動画を絞り込む",
      features: [
        "特定のキーワードやカテゴリを入力するだけで、関連する動画を一括で検索可能です。",
        "さらに、投稿された日付や再生数、評価の高い順、ロング動画かショート動画かといった条件を自由に組み合わせることで、自分が探しているちょうどいい動画をピンポイントで見つけ出せます。",
        "たとえば、「登録者数1万〜5万のチャンネルが出した、再生数が登録者数の5倍以上のショート動画」など、実戦的なフィルター検索が可能です。",
        "動画企画のヒントを探したいときにも、競合の強みを探りたいときにも、この機能が大きな武器になります。",
      ],
      gradient: "from-indigo-500 to-purple-600",
      bgGradient: "from-indigo-50 to-purple-50",
    },
    {
      id: 2,
      icon: BarChart4,
      title: "チャンネル分析",
      description:
        "チャンネルURLからのパフォーマンス分析",
      features: [
        "YouTubeチャンネルのURLを入力すると、そのチャンネルの登録者数や動画本数、1本あたりの平均再生数、平均の動画尺など、運営スタイルや投稿戦略を読み取れるデータが一覧で表示されます。",
        "さらに、投稿時間帯の傾向やよく使われるタグの傾向も分析されるため、どんなジャンルで、どのようなスタイルで、どのタイミングに投稿すると伸びやすいのかが直感的に見えてきます。",
        "特に、期間を指定して人気動画のトップ10を表示したり、チャンネルの平均再生数を大きく上回るヒット動画だけを抽出する機能は、トレンドの把握や企画の参考に大きく役立ちます。",
       
      ],
      gradient: "from-purple-500 to-indigo-600",
      bgGradient: "from-purple-50 to-indigo-50",
    },
    {
      id: 3,
      icon: Video,
      title: "動画分析",
      description:
        "動画URLからの詳細情報取得",
      features: [
        "気になるYouTube動画のURLを入力するだけで、その動画の再生回数や高評価数、コメント数、投稿日時といった基本的なデータを自動で取得できます。",
        "これにより、「なぜこの動画が伸びたのか？」「どれくらい反応があったのか？」といった疑問に、数字を通して明確なヒントを得ることができます。競合分析や、自分の動画の振り返りにも最適です。",
      ],
      gradient: "from-indigo-600 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
    },
  ]

  return (
    <section
      ref={ref}
      className="py-10 px-4 sm:px-6 lg:px-8  relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center space-y-16 sm:space-y-20 md:space-y-24"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200">
              <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Tools Overview
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                 ツール紹介
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              当サービスでは、以下の3つの強力なツールをご利用いただけます。
              <span className="block mt-2">
                YouTubeのリサーチや分析を、誰でも簡単に・
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                  効率的に行える
                </span>
                よう設計されています。
              </span>
            </p>
          </motion.div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                className="group relative"
              >
                <div className="relative p-8 rounded-3xl bg-white border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
                  {/* Background Gradient on Hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Content */}
                  <div className="relative space-y-6 sm:space-y-8 h-full flex flex-col">
                    {/* Fixed Icon Display */}
                    <div className="flex justify-center">
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${tool.gradient} shadow-lg`}>
                          <tool.icon className="w-10 h-10  text-white" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4 sm:space-y-6 flex-grow">
                      <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-indigo-900 group-hover:to-purple-900 transition-all duration-300">
                        {tool.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {tool.description}
                      </p>

                      {/* Features List */}
                      <div className="space-y-3 text-left">
                        {tool.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${tool.gradient} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <motion.div variants={itemVariants} className="mt-20 sm:mt-24">
            <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl shadow-2xl p-8 sm:p-12 max-w-4xl mx-auto border border-indigo-100">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-3xl" />

              <div className="relative">
                <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent">
                    すべてのツールを今すぐ体験
                  </span>
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  これらの強力なツールを使って、YouTubeマーケティングを次のレベルに引き上げましょう。
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                    プロフェッショナルな分析機能
                  </span>
                  で、競合調査や戦略立案を効率化できます。
                </p>
                <Link
                to="/login"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  無料で始める
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full blur-xl" />
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-purple-200/30 to-indigo-200/30 rounded-full blur-xl" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}