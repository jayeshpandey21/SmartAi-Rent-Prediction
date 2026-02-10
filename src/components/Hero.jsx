import { motion } from 'framer-motion'
import { useRef, useEffect, Suspense, lazy } from 'react'
import Lenis from 'lenis'

const Hero3D = lazy(() => import('./Hero3D'))

export default function Hero() {
  const sectionRef = useRef(null)

  // Smooth scroll setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <section ref={sectionRef} className="min-h-screen relative overflow-hidden bg-dark-950">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none opacity-20" />
      
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>
      
      <div className="container-custom min-h-screen flex items-center py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary-400"
            >
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              AI-Powered Rental Management
            </motion.div>
            
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="text-white">Smarter Rentals.</span>
              <br />
              <span className="gradient-text">Smarter Living.</span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-400 leading-relaxed max-w-xl"
            >
              An AI-powered rental management platform that automates tenant management, 
              rent prediction, maintenance tracking, and fraud detection using machine learning.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass rounded-full font-semibold text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Demo
              </motion.button>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center gap-8 pt-4"
            >
              {[
                { value: "10K+", label: "Properties" },
                { value: "50K+", label: "Users" },
                { value: "98%", label: "Accuracy" }
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* 3D Scene */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-[500px] lg:h-[700px] relative"
          >
            {/* Decorative ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[500px] h-[500px] rounded-full border border-primary-500/20 animate-[spin_20s_linear_infinite]" />
              <div className="absolute w-[400px] h-[400px] rounded-full border border-accent-500/20 animate-[spin_15s_linear_infinite_reverse]" />
            </div>
            
            {/* 3D Canvas */}
            <div className="relative z-10 w-full h-full">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}>
                <Hero3D />
              </Suspense>
            </div>
            
            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute top-1/4 -right-4 glass-card rounded-2xl p-4 animate-float"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rent Collected</p>
                  <p className="text-sm font-semibold text-white">+$12,450</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute bottom-1/4 -left-4 glass-card rounded-2xl p-4 animate-float animation-delay-2000"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">AI Prediction</p>
                  <p className="text-sm font-semibold text-white">+23% ROI</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-500">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-primary-500"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
