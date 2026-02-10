import { motion } from 'framer-motion'
import { useRef } from 'react'

const useCases = [
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "For Property Owners",
    features: [
      "Automated rent collection and tracking",
      "AI-powered rent pricing suggestions",
      "Real-time property performance analytics",
      "Smart tenant matching and screening",
      "Maintenance request management"
    ],
    color: "from-primary-500 to-cyan-500"
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: "For Tenants",
    features: [
      "Easy online rent payment options",
      "Instant maintenance request submission",
      "Digital lease agreement access",
      "AI chatbot for instant support",
      "Payment history and receipts"
    ],
    color: "from-accent-500 to-pink-500"
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "For Real Estate Companies",
    features: [
      "Multi-property portfolio management",
      "Centralized dashboard for all properties",
      "Advanced fraud detection systems",
      "Market trend analysis and predictions",
      "Automated compliance reporting"
    ],
    color: "from-orange-500 to-red-500"
  }
]

export default function UseCases() {
  const sectionRef = useRef(null)

  return (
    <section ref={sectionRef} className="section bg-dark-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Use Cases</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            SmartRent AI adapts to various roles in the rental ecosystem, 
            providing tailored solutions for every stakeholder.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="glass-card rounded-3xl p-8 card-hover relative overflow-hidden group"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${useCase.color}`} />
              
              {/* Icon */}
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${useCase.color} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                {useCase.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-6">{useCase.title}</h3>
              
              {/* Features list */}
              <ul className="space-y-4">
                {useCase.features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.2 + featureIndex * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-400">{feature}</span>
                  </motion.li>
                ))}
              </ul>
              
              {/* Hover overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
