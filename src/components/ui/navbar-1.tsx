import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="flex justify-center w-full py-6 px-4">
      <div className="flex items-center justify-between px-6 py-3 bg-white rounded-full shadow-lg w-full max-w-3xl relative z-10">
        <div className="flex items-center">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src="/assets/logo.png" 
              alt="GovAid AI" 
              className="h-12 w-auto"
            />
          </motion.div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary' 
                  : 'text-gray-900 hover:text-gray-600'
              }`}
            >
              Home
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link 
              to="/upload" 
              className={`text-sm font-medium transition-colors ${
                isActive('/upload') 
                  ? 'text-primary' 
                  : 'text-gray-900 hover:text-gray-600'
              }`}
            >
              Upload
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link 
              to="/history" 
              className={`text-sm font-medium transition-colors ${
                isActive('/history') 
                  ? 'text-primary' 
                  : 'text-gray-900 hover:text-gray-600'
              }`}
            >
              History
            </Link>
          </motion.div>
        </nav>

        {/* Desktop CTA Button */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <Link
            to="/upload"
            className="inline-flex items-center justify-center px-5 py-2 text-sm text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
          >
            Get Started
          </Link>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button className="md:hidden flex items-center" onClick={toggleMenu} whileTap={{ scale: 0.9 }}>
          <Menu className="h-6 w-6 text-gray-900" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 pt-24 px-6 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-gray-900" />
            </motion.button>
            <div className="flex flex-col space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Link 
                  to="/" 
                  className={`text-base font-medium ${
                    isActive('/') 
                      ? 'text-primary' 
                      : 'text-gray-900'
                  }`}
                  onClick={toggleMenu}
                >
                  Home
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Link 
                  to="/upload" 
                  className={`text-base font-medium ${
                    isActive('/upload') 
                      ? 'text-primary' 
                      : 'text-gray-900'
                  }`}
                  onClick={toggleMenu}
                >
                  Upload
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Link 
                  to="/history" 
                  className={`text-base font-medium ${
                    isActive('/history') 
                      ? 'text-primary' 
                      : 'text-gray-900'
                  }`}
                  onClick={toggleMenu}
                >
                  History
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6"
              >
                <Link
                  to="/upload"
                  className="inline-flex items-center justify-center w-full px-5 py-3 text-base text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
                  onClick={toggleMenu}
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Navbar1 }