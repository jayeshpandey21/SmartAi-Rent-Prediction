import { motion } from 'framer-motion'
import { useRef } from 'react'

const futureScopes = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Blockchain Integration",
    description: "Smart contracts for tamper-proof rental agreements, transparent transactions, and automated lease enforcement on blockchain networks.",
    tags: ["Ethereum", "Solidity", "Web3", "Smart Contracts"]
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: "AI Chatbot Assistant",
    description: "24/7 intelligent chatbot using NLP for tenant queries, maintenance requests, and instant support in multiple languages.",
    tags: ["NLP", "LLM", "BERT", "DialogFlow"]
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: "Smart City Integration",
    description: "Integration with municipal databases, public transport APIs, and city infrastructure for enhanced property value assessment.",
    tags: ["IoT", "APIs", "City Data", "GIS"]
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    title: "IoT Maintenance Tracking",
    description: "Smart sensors for real-time monitoring of property conditions, predictive maintenance alerts, and energy optimization.",
    tags: ["IoT", "Sensors", "MQTT", "Edge Computing"]
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Advanced Deep Learning",
    description: "Computer vision for automated property inspections, image-based damage assessment, and virtual tours.",
    tags: ["CNN", "TensorFlow", "Image Processing", "YOLO"]
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Advanced Security",
    description: "Biometric authentication, facial recognition access control, and AI-powered security threat detection.",
    tags: ["Biometrics", "Face ID", "Security AI", "Zero Trust"]
  }
]

export default function FutureScope() {
  const sectionRef = useRef(null)

  return (
    <section ref={sectionRef} className="section bg-dark-950 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 to-dark-950 pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Future Scope</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            As part of our MCA Major Project, we're laying groundwork for advanced 
            features that will define the next generation of rental management.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {futureScopes.map((scope, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card rounded-2xl p-8 card-hover group relative"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500/20 to-primary-500/20 flex items-center justify-center mb-5 text-accent-400 group-hover:text-accent-300 group-hover:scale-110 transition-all duration-300">
                {scope.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-300 transition-colors">
                {scope.title}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                {scope.description}
              </p>
              
              {/* Tech tags */}
              <div className="flex flex-wrap gap-2">
                {scope.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 rounded-md text-xs font-medium bg-dark-800 text-gray-400 border border-dark-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Arrow indicator */}
              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <svg className="w-6 h-6 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* MCA Project Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-8 rounded-3xl glass-card text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">MCA Major + Minor Project</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            This project demonstrates the practical application of AI/ML concepts, 
            full-stack development, and modern software engineering principles as part of 
            the Master of Computer Applications curriculum.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
