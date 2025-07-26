import React, { useState, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Play, TrendingUp, MessageSquare, Target, Zap, ArrowRight, Sparkles, Eye, BarChart3 } from "lucide-react"

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)
  const controls = useAnimation()
  const ref = React.useRef(null)
  const isInView = useInView(ref)

  useEffect(() => {
    setIsVisible(true)
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  // Floating elements data
  const floatingElements = [
    { icon: TrendingUp, color: "text-green-400", size: "w-8 h-8", delay: 0, position: "top-20 left-[10%]" },
    { icon: MessageSquare, color: "text-blue-400", size: "w-6 h-6", delay: 0.5, position: "top-32 right-[15%]" },
    { icon: Eye, color: "text-purple-400", size: "w-7 h-7", delay: 1, position: "bottom-40 left-[20%]" },
    { icon: BarChart3, color: "text-indigo-400", size: "w-6 h-6", delay: 1.5, position: "bottom-32 right-[10%]" },
    { icon: Zap, color: "text-yellow-400", size: "w-8 h-8", delay: 2, position: "top-40 left-[80%]" },
    { icon: Target, color: "text-red-400", size: "w-7 h-7", delay: 2.5, position: "bottom-20 right-[70%]" },
  ]

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
       

        {/* Enhanced Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg shadow-indigo-500/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -120, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 12 + 8,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Enhanced Floating Icons */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.position} ${element.color} ${element.size} hidden lg:block`}
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: `${element.delay}s` }}
        >
          <motion.div
            className="p-4 bg-transparent rounded-2xl border border-white/30 shadow-2xl shadow-purple-500/20"
            whileHover={{ scale: 1.3, rotate: 15 }}
            transition={{ duration: 0.3 }}
          >
            <element.icon className={`${element.size} drop-shadow-lg`} />
          </motion.div>
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div
        ref={ref}
        className="relative z-10 text-center px-6 sm:px-8  max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Enhanced Badge */}
        <motion.div
          className="inline-flex items-center px-4 py-2 mb-10 bg-purple-100 border border-purple-200 rounded-full text-sm font-medium text-purple-800"
          variants={textVariants}
          whileHover={{ scale: 1.05, y: -2 }}
        >
          <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
          YouTube分析の未来
          <ArrowRight className="w-4 h-4 ml-2" />
        </motion.div>

        {/* Enhanced Main Catchphrase */}
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-8xl font-black mb-6 leading-tight text-black"
          variants={textVariants}
        >
          <span className="block">
            <motion.span
              className="inline-block text-gray-900"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            >
              成長する動画を、
            </motion.span>
          </span>
          <motion.span
            className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            丸裸にする。
          </motion.span>
        </motion.h1>

        {/* Enhanced Sub Catchphrase */}
        <motion.p
          className="text-xl sm:text-2xl lg:text-3xl mb-12 text-gray-800 font-light leading-relaxed max-w-4xl mx-auto"
          variants={textVariants}
        >
          <motion.span
            className="inline-block mr-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            トレンドチェック、
          </motion.span>
          <motion.span
            className="inline-block mr-2 text-indigo-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            コメント分析、
          </motion.span>
          <motion.span
            className="inline-block mr-2 text-purple-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            成長予測。
          </motion.span>
          <br />
          <motion.span
            className="inline-block bg-gradient-to-r from-gray-600 to-gray-600 bg-clip-text text-transparent font-semibold drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            バイラル化の種を3秒で収穫する。
          </motion.span>
        </motion.p>

        {/* Enhanced CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16"
          variants={textVariants}
        >
          <motion.button
            className="group relative inline-flex items-center px-4 py-3 lg:px-6 lg:py-3 text-lg lg:text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center">
              <Play className="w-5 h-5 mr-2 fill-current" />
              今すぐ始める
            </span>
            <div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"
            />
          </motion.button>
        </motion.div>

        {/* Enhanced Stats */}
        <motion.div className="grid grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto" variants={containerVariants}>
          {[
            { number: "99.9%", label: "分析精度", color: "text-blue-600" },
            { number: "3秒", label: "平均分析時間", color: "text-indigo-600" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-transparent rounded-2xl"
              variants={textVariants}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <motion.div
                className={`text-4xl lg:text-5xl font-bold ${stat.color} mb-2`}
                variants={pulseVariants}
                animate="animate"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-700 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <motion.div
            className="w-1 h-3 bg-gray-600 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Hero