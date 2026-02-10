import { motion } from 'framer-motion'
import { useRef } from 'react'

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Property Manager",
    company: "Urban Living Estates",
    avatar: "SJ",
    content: "SmartRent AI transformed how we manage our 200+ property portfolio. The AI predictions for rent pricing increased our revenue by 23% in just 6 months. The automated maintenance tracking alone saved us 15 hours per week.",
    rating: 5,
    gradient: "from-primary-500 to-cyan-500"
  },
  {
    name: "Michael Chen",
    role: "Real Estate Investor",
    company: "Chen Investments",
    avatar: "MC",
    content: "As an investor with properties across 3 cities, I needed a unified dashboard. SmartRent AI provides exactly that plus intelligent tenant screening that reduced our vacancy period from 45 to just 18 days on average.",
    rating: 5,
    gradient: "from-accent-500 to-pink-500"
  },
  {
    name: "Emily Rodriguez",
    role: "Tenant",
    company: "Renting since 2020",
    avatar: "ER",
    content: "Paying rent was always a hassle until I started using SmartRent. The app makes payments instant, I can submit maintenance requests with photos, and the AI chatbot answers my questions instantly. Highly recommended!",
    rating: 5,
    gradient: "from-orange-500 to-red-500"
  },
  {
    name: "David Kim",
    role: "Property Owner",
    company: "Solo Landlord",
    avatar: "DK",
    content: "I was skeptical about AI for rental management, but the fraud detection feature alone justified the investment. It flagged a suspicious application that turned out to be a documented fraud case. SmartRent pays for itself.",
    rating: 5,
    gradient: "from-green-500 to-emerald-500"
  }
]

export default function Testimonials() {
  const sectionRef = useRef(null)

  return (
    <section ref={sectionRef} className="section bg-dark-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Our <span className="gradient-text">Users Say</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join thousands of satisfied property owners, tenants, and real estate professionals 
            who trust SmartRent AI for their rental management needs.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="glass-card rounded-3xl p-8 card-hover relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-6xl text-primary-500/10 font-serif">
                "
              </div>
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              {/* Content */}
              <p className="text-gray-300 leading-relaxed mb-6 relative z-10">
                {testimonial.content}
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="text-xs text-primary-400">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "10K+", label: "Active Users" },
            { value: "50K+", label: "Properties Managed" },
            { value: "$2B+", label: "Transactions Processed" },
            { value: "98%", label: "Customer Satisfaction" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
