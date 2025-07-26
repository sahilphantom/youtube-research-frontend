import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { UserPlus, CreditCard, BarChart3, Search, Video, HelpCircle, CheckCircle2 } from "lucide-react"

export default function HowToUse() {
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

  const steps = [
    {
      number: "01",
      title: "アカウント登録とログイン",
      description: "トップページから「新規登録」ボタンをクリックしてください。メールアドレスとパスワードを入力し、アカウントを作成します。登録後、ログインページからログインしてください。",
      icon: UserPlus,
    },
    {
      number: "02",
      title: "サブスクリプションの開始",
      description: "ログイン後、プランの選択ページが表示されます。「Startプラン」または「Basicプラン」を選び、Stripe決済にてサブスクリプションを開始してください。お支払いが完了すると、ツールへのアクセスが可能になります。",
      icon: CreditCard,
    },
    {
      number: "03",
      title: "各ツールの使い方",
      description: "動画検索、チャンネル分析、動画詳細分析など、YouTubeマーケティングに必要な機能をご利用いただけます。",
      icon: BarChart3,
    },
  ]

  const features = [
    { 
      icon: Search, 
      title: "動画検索", 
      description: "キーワードを入力し、関連するYouTube動画を一覧で取得。動画のタイトル、再生数、いいね数などが表示されます。"
    },
    { 
      icon: BarChart3, 
      title: "チャンネル分析", 
      description: "チャンネルIDを入力することで、そのチャンネルの登録者数や投稿頻度などを分析できます。"
    },
    { 
      icon: Video, 
      title: "動画詳細分析", 
      description: "個別の動画の統計情報を取得し、詳細なパフォーマンスを確認できます。"
    },
    { 
      icon: HelpCircle, 
      title: "サポート", 
      description: "ヘッダーの「FAQ」または「お問い合わせ」から、よくある質問やサポートにアクセスできます。"
    },
  ]

  return (
    <section ref={ref} className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center space-y-12 sm:space-y-14 md:space-y-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
            <div className="text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wide">
              How It Works
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight px-2">
              使い方ガイド - YouTubeリサーチツール
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
              当サービスは、YouTubeチャンネルの分析や動画の検索、パフォーマンスの可視化などを通して、マーケティングやコンテンツ戦略をサポートするためのツールです。
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center space-y-4 sm:space-y-6 px-2"
              >
                {/* Number Circle */}
                <div className="flex justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-lg sm:text-xl font-bold text-white">{step.number}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Features Section */}
          <motion.div variants={itemVariants} className="mt-16 sm:mt-20 md:mt-24 space-y-8 sm:space-y-10 md:space-y-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 px-2">
              各ツールの詳細機能
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center space-y-3 sm:space-y-4 p-4 sm:p-5 md:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center justify-center flex-wrap">
                      <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 sm:mr-2 flex-shrink-0" />
                      <span>{feature.title}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}