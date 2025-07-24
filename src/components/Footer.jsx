import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Youtube, Twitter, Github, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const linkVariants = {
    rest: { x: 0 },
    hover: { 
      x: 4,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const socialVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <motion.div
        className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-1"
            variants={itemVariants}
          >
            <motion.div 
              className="flex items-center space-x-3 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <Youtube className="h-10 w-10 text-red-500" />
                <motion.div
                  className="absolute inset-0 bg-red-500/30 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                VizzTube
              </h3>
            </motion.div>
            <motion.p 
              className="text-gray-300 text-sm leading-relaxed mb-6"
              variants={itemVariants}
            >
              {t('footer.description') || 'Transform your YouTube experience with powerful analytics and insights. Join thousands of creators who trust VizzTube.'}
            </motion.p>
            
            {/* Social Links */}
            <motion.div 
              className="flex space-x-4"
              variants={itemVariants}
            >
              {[
                { icon: Twitter, href: "https://twitter.com", color: "hover:text-blue-400" },
                { icon: Github, href: "https://github.com", color: "hover:text-gray-300" },
                { icon: Linkedin, href: "https://linkedin.com", color: "hover:text-blue-500" },
                { icon: Mail, href: "mailto:contact@vizztube.com", color: "hover:text-green-400" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg bg-white/10 backdrop-blur-sm text-gray-400 transition-colors duration-300 ${social.color}`}
                  variants={socialVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Links Section */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-6 text-white">{t('footer.linksTitle') || 'Quick Links'}</h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: t('footer.home') || 'Home' },
                { to: "/feature", label: t('header.features') || 'Features' },
                { to: "/tools", label: t('header.tools') || 'Tools' },
                { to: "/howtouse", label: t('footer.howToUse') || 'How to Use' },
                { to: "/pricing", label: t('header.pricing') || 'Pricing' }
              ].map((link, index) => (
                <motion.li key={index}>
                  <motion.div
                    variants={linkVariants}
                    initial="rest"
                    whileHover="hover"
                  >
                    <Link 
                      to={link.to}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm inline-flex items-center group"
                    >
                      <span className="group-hover:text-indigo-300 transition-colors duration-300">
                        {link.label}
                      </span>
                      <motion.div
                        className="w-0 h-px bg-indigo-400 ml-2 group-hover:w-4 transition-all duration-300"
                        initial={{ width: 0 }}
                        whileHover={{ width: 16 }}
                      />
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Section */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-6 text-white">{t('footer.legalTitle') || 'Legal'}</h4>
            <ul className="space-y-3">
              {[
                { to: "/terms", label: t('footer.terms') || 'Terms of Service' },
                { to: "/privacy", label: t('footer.privacy') || 'Privacy Policy' },
                { to: "/commercial", label: t('footer.commercial') || 'Commercial Terms' },
                { to: "/cookies", label: 'Cookie Policy' }
              ].map((link, index) => (
                <motion.li key={index}>
                  <motion.div
                    variants={linkVariants}
                    initial="rest"
                    whileHover="hover"
                  >
                    <Link 
                      to={link.to}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm inline-flex items-center group"
                    >
                      <span className="group-hover:text-indigo-300 transition-colors duration-300">
                        {link.label}
                      </span>
                      <motion.div
                        className="w-0 h-px bg-indigo-400 ml-2 group-hover:w-4 transition-all duration-300"
                        initial={{ width: 0 }}
                        whileHover={{ width: 16 }}
                      />
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Section */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-6 text-white">Support</h4>
            <ul className="space-y-3">
              {[
                { to: "/contact", label: t('footer.contact') || 'Contact Us' },
                { to: "/faq", label: t('header.faq') || 'FAQ' },
                { to: "/help", label: 'Help Center' },
                { to: "/feedback", label: 'Feedback' }
              ].map((link, index) => (
                <motion.li key={index}>
                  <motion.div
                    variants={linkVariants}
                    initial="rest"
                    whileHover="hover"
                  >
                    <Link 
                      to={link.to}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm inline-flex items-center group"
                    >
                      <span className="group-hover:text-indigo-300 transition-colors duration-300">
                        {link.label}
                      </span>
                      <motion.div
                        className="w-0 h-px bg-indigo-400 ml-2 group-hover:w-4 transition-all duration-300"
                        initial={{ width: 0 }}
                        whileHover={{ width: 16 }}
                      />
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="border-t border-gray-700/50 mb-8"
          variants={itemVariants}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Bottom Section */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0"
          variants={itemVariants}
        >
          <motion.div 
            className="flex items-center space-x-2 text-sm text-gray-300"
            variants={itemVariants}
          >
            <span>© {new Date().getFullYear()} VizzTube. Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="h-4 w-4 text-red-500 fill-current" />
            </motion.div>
            <span>by Sahil</span>
          </motion.div>

        
        </motion.div>

       
      </motion.div>

      {/* Floating Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg backdrop-blur-sm z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>
    </footer>
  );
};

export default Footer;