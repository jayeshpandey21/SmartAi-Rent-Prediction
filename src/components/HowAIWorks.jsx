import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const steps = [
  {
    step: "01",
    title: "Data Collection",
    description: "Gathering historical rental data, property details, market trends, tenant information, and maintenance records from multiple sources.",
    technologies: ["Python", "Pandas", "APIs", "Web Scraping"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    )
  },
  {
    step: "02",
    title: "Data Preprocessing",
    description: "Cleaning, normalizing, and transforming raw data into structured formats suitable for machine learning model training.",
    technologies: ["NumPy", "Pandas", "Scikit-learn", "Data Cleaning"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    step: "03",
    title: "ML Model Training",
    description: "Training regression and classification models using algorithms like Random Forest, XGBoost, and Neural Networks on prepared datasets.",
    technologies: ["Scikit-learn", "TensorFlow", "XGBoost", "Python"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    step: "04",
    title: "Prediction & Insights",
    description: "Deploying trained models via FastAPI to generate real-time rent predictions, fraud alerts, and actionable insights.",
    technologies: ["FastAPI", "REST APIs", "JSON", "Real-time"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    step: "05",
    title: "Continuous Learning",
    description: "Implementing feedback loops where model performance is monitored and improved using new data and user feedback.",
    technologies: ["MLOps", "Model Monitoring", "A/B Testing", "Data Pipeline"],
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  }
]

export default function HowAIWorks() {
  const sectionRef = useRef(null)
  const timelineRef = useRef(null)

  useEffect(() => {
    // Register ScrollTrigger inside useEffect to avoid SSR issues
    gsap.registerPlugin(ScrollTrigger)
    
    const section = sectionRef.current
    if (!section) return

    gsap.fromTo(
      '.ai-step',
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }, [])

  return (
    <section ref={sectionRef} className="section bg-dark-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How <span className="gradient-text">SmartRent AI</span> Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our AI-powered system follows a comprehensive machine learning pipeline 
            to deliver accurate predictions and intelligent automation.
          </p>
        </motion.div>
        
        <div ref={timelineRef} className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-accent-500 to-primary-500 hidden md:block" />
          
          <div className="space-y-8">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                className="ai-step flex flex-col md:flex-row gap-6 items-start relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                {/* Step number & icon */}
                <div className="flex items-center gap-4 md:w-32 flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/25 relative z-10">
                    {item.step}
                  </div>
                </div>
                
                {/* Content card */}
                <div className="glass-card rounded-2xl p-8 flex-1 card-hover ml-0 md:ml-4 w-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-primary-400 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-gray-400 mb-4 leading-relaxed">{item.description}</p>
                      
                      {/* Tech stack tags */}
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary-500/10 to-accent-500/10 text-primary-300 border border-primary-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
