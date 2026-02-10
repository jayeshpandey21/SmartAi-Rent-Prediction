import { motion } from 'framer-motion'
import { useRef } from 'react'

const techCategories = [
  {
    category: "Frontend",
    technologies: [
      { name: "React.js", icon: "⚛️", description: "UI Library", color: "#61DAFB" },
      { name: "Tailwind CSS", icon: "🎨", description: "Styling", color: "#38B2AC" },
      { name: "Three.js", icon: "🎮", description: "3D Graphics", color: "#000000" },
      { name: "Framer Motion", icon: "✨", description: "Animations", color: "#0055FF" }
    ]
  },
  {
    category: "Backend",
    technologies: [
      { name: "Node.js", icon: "🟢", description: "Runtime", color: "#339933" },
      { name: "Express.js", icon: "🚂", description: "Framework", color: "#353830" },
      { name: "MongoDB", icon: "🍃", description: "Database", color: "#47A248" }
    ]
  },
  {
    category: "AI / ML",
    technologies: [
      { name: "Python", icon: "🐍", description: "Language", color: "#3776AB" },
      { name: "FastAPI", icon: "⚡", description: "API Framework", color: "#009688" },
      { name: "Pandas", icon: "🐼", description: "Data Analysis", color: "#150458" },
      { name: "Scikit-learn", icon: "🔬", description: "ML Library", color: "#F7931E" }
    ]
  }
]

export default function TechStack() {
  const sectionRef = useRef(null)

  return (
    <section ref={sectionRef} className="section bg-dark-950 relative">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Technology</span> Stack
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Built with modern, scalable technologies ensuring high performance, 
            security, and an exceptional user experience.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {techCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              className="glass-card rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {category.category}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {category.technologies.map((tech, techIndex) => (
                  <motion.div
                    key={techIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: categoryIndex * 0.2 + techIndex * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group relative p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-primary-500/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {tech.icon}
                      </div>
                      <h4 className="font-semibold text-white mb-1">{tech.name}</h4>
                      <p className="text-xs text-gray-500">{tech.description}</p>
                    </div>
                    
                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Additional tech badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          {["NumPy", "REST APIs", "JWT", "WebGL", "Git", "Docker"].map((tech, index) => (
            <span
              key={index}
              className="px-6 py-3 rounded-full glass text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
