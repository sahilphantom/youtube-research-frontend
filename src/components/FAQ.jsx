"use client"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { useState, useRef } from "react"
import { Plus, Minus } from "lucide-react"

export default function FAQ() {
  const [openItems, setOpenItems] = useState(new Set([1])) // First item open by default
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const faqData = [
    {
      id: 1,
      question: "サービスの利用開始方法を教えてください。",
      answer:
        "サイト上で会員登録を行い、決済していただくことで、すぐにご利用を開始いただけます。登録後、マイページから各種機能をご確認ください。",
    },
    {
      id: 2,
      question: "無料トライアルはありますか？",
      answer:
        "現在、無料トライアル期間は設けておりません。ご契約後すぐに有料プランとしてサービスをご利用いただけます。",
    },
    {
      id: 3,
      question: "月額課金について",
      answer: "初回決済後、以降は毎月同日に自動課金されます。ご利用料金はマイページにてご確認いただけます。",
    },
    {
      id: 4,
      question: "解約について",
      answer:
        "解約したい場合はご連絡ください。前払いとなっておりますので、解約後は次回の更新日まで利用が可能です。その後自動課金が停止されます。",
    },
    {
      id: 5,
      question: "複数のアカウントを使い分けることはできますか？",
      answer: "現在検討中の機能です。詳細については今後のアップデートをお待ちください。",
    },
    {
      id: 6,
      question: "サポート対応時間を教えてください。",
      answer:
        "原則として、平日10:00〜17:00（土日祝除く）にお問い合わせ対応を行っております。内容によっては回答にお時間をいただく場合がございます。",
    },
  ]

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div ref={ref} className="py-20 max-w-7xl mx-auto px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
        {/* Left Side - Title */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:sticky lg:top-20 lg:self-start"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 dark:text-neutral-100 leading-tight"
          >
            よくある質問
          </motion.h2>
        </motion.div>

        {/* Right Side - FAQ Items */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="space-y-6"
        >
          {faqData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.6,
                delay: 0.5 + index * 0.1,
                ease: "easeOut",
              }}
            >
              <FAQItem item={item} isOpen={openItems.has(item.id)} onToggle={() => toggleItem(item.id)} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

const FAQItem = ({ item, isOpen, onToggle }) => {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6">
      <motion.button
        onClick={onToggle}
        className="w-full text-left flex items-start justify-between gap-4 group focus:outline-none"
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
      >
        <motion.h3
          className="text-lg md:text-xl font-medium text-neutral-800 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 flex-1"
          layout
        >
          {item.question}
        </motion.h3>

        <motion.div
          className="flex-shrink-0 mt-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
            {isOpen ? (
              <Minus className="w-6 h-6 text-indigo-600 dark:text-blue-400" />
            ) : (
              <Plus className="w-6 h-6 text-indigo-600 dark:text-blue-400" />
            )}
          </motion.div>
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
              opacity: { duration: 0.3 },
            }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="pt-4 pr-10"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-neutral-600 dark:text-neutral-400 leading-relaxed"
              >
                {item.answer}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
