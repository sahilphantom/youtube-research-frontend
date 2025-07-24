"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Search, MessageSquare, TrendingUp } from "lucide-react"

// cn utility function
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ")
}

export default function Feature() {
  const features = [
    {
      title: "トレンド動画サーチ",
      subtitle: "「あの動画、なぜバズった？」が見えてくる。",
      description:
        "今、何が伸びてる？が一目でわかる。カテゴリやキーワードを指定して、話題の動画だけを自動抽出。再生数、いいね数、コメント数などの指標も一括でチェックでき、リサーチにかかる時間を大幅に短縮。",
      icon: <Search className="w-6 h-6" />,
    },
    {
      title: "コメントAI解析",
      subtitle: "「コメント欄は、最強のマーケティング資料。」",
      description:
        "視聴者の「本音」をAIが翻訳。気になる動画のコメントをAIで分析し、視聴者の属性・感情・関心ごとを可視化。ターゲットユーザーがどんな内容に反応しているかを明確に。",
      icon: <MessageSquare className="w-6 h-6" />,
    },
    {
      title: "伸びる動画レーダー",
      subtitle: "「まだ話題になってない「バズ候補」、見つけ放題。」",
      description:
        "未来のバズ動画を先読み。再生数・投稿日・登録者数などをもとに、「再生数が急伸している注目動画」だけを自動で抽出。再生数／登録者比などで絞り込みも可能。",
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ]

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">機能概要</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10">
        {features.map((feature, index) => (
          <FeatureItem key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  )
}

const FeatureItem = ({ title, subtitle, description, icon, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        ease: "easeOut",
      }}
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        index === 0 && "lg:border-l dark:border-neutral-800",
        "lg:border-b dark:border-neutral-800",
      )}
    >
      <motion.div
        className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />

      <motion.div
        className="mb-4 relative z-10 px-10 text-indigo-600"
        initial={{ scale: 0, rotate: -180 }}
        animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
        transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        {icon}
      </motion.div>

      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <motion.div
          className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-indigo-500 transition-all duration-200 origin-center"
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
        />
        <motion.span
          className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100"
          initial={{ x: -20, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
        >
          {index + 1}. {title}
        </motion.span>
      </div>

      <motion.p
        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4 relative z-10 px-10"
        initial={{ x: -20, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
      >
        {subtitle}
      </motion.p>

      <motion.p
        className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10 leading-relaxed"
        initial={{ x: -20, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 + 0.6 }}
      >
        {description}
      </motion.p>
    </motion.div>
  )
}
