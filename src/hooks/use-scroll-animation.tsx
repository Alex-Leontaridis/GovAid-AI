import { useInView } from "framer-motion";
import { useRef } from "react";

interface UseScrollAnimationOptions {
  once?: boolean;
  margin?: string;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: options.once !== false,
    margin: options.margin || "0px 0px -100px 0px" as any
  });

  return { ref, isInView };
}

export function useStaggerAnimation(delay: number = 0.1) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
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
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  return { containerVariants, itemVariants };
}

export function useParallaxAnimation(speed: number = 0.5) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    margin: "-100px 0px -100px 0px" as any
  });

  const parallaxVariants = {
    hidden: { y: 0 },
    visible: {
      y: isInView ? -50 * speed : 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return { ref, parallaxVariants, isInView };
}

export function useFadeInAnimation(delay: number = 0) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-50px 0px -50px 0px" as any
  });

  const fadeInVariants = {
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
  };

  return { ref, fadeInVariants, isInView };
}

export function useSlideInAnimation(direction: "left" | "right" | "up" | "down" = "up", delay: number = 0) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-50px 0px -50px 0px" as any
  });

  const getInitialPosition = () => {
    switch (direction) {
      case "left": return { x: -50, y: 0 };
      case "right": return { x: 50, y: 0 };
      case "up": return { x: 0, y: 30 };
      case "down": return { x: 0, y: -30 };
      default: return { x: 0, y: 30 };
    }
  };

  const slideInVariants = {
    hidden: { 
      opacity: 0, 
      ...getInitialPosition()
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  return { ref, slideInVariants, isInView };
} 