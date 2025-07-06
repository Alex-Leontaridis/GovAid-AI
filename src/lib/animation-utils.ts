// Animation variants for consistent animations across the app
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

export const staggerContainer = (delay: number = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: delay,
      delayChildren: 0.2
    }
  }
});

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

// Hover animations
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

export const hoverLift = {
  y: -5,
  transition: { duration: 0.2 }
};

export const hoverRotate = {
  rotate: 5,
  transition: { duration: 0.2 }
};

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }
};

// Loading animations
export const spinAnimation = {
  animate: { rotate: 360 },
  transition: { duration: 1, repeat: Infinity, ease: "linear" }
};

export const pulseAnimation = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  }
};

export const bounceAnimation = {
  animate: {
    y: [0, -10, 0],
  },
  transition: {
    duration: 0.6,
    repeat: Infinity,
    ease: "easeInOut",
  }
};

// Floating animation for background elements
export const floatingAnimation = {
  animate: {
    y: [0, -20, 0],
    opacity: [0.2, 0.5, 0.2],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  }
};

// Card hover effects
export const cardHover = {
  whileHover: {
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.2 }
  }
};

// Button animations
export const buttonTap = {
  whileTap: { scale: 0.95 },
  whileHover: { scale: 1.02 },
  transition: { duration: 0.2 }
};

// Text reveal animation
export const textReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

// Slide in from different directions
export const slideInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

export const slideInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

// Parallax effect
export const parallaxEffect = (speed: number = 0.5) => ({
  animate: {
    y: [0, -50 * speed],
  },
  transition: {
    duration: 0.8,
    ease: "easeOut"
  }
});

// Utility function to create staggered animations
export const createStaggeredAnimation = (delay: number = 0.1) => ({
  container: staggerContainer(delay),
  item: staggerItem
});

// Utility function to create fade in with custom delay
export const createFadeInAnimation = (delay: number = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
}); 