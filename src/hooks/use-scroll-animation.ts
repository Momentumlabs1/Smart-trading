import { useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/**
 * Hook for scroll-triggered animations that work on mobile
 * Animations trigger when element enters viewport and reverse when leaving
 */
export const useScrollAnimation = (options?: {
  threshold?: number;
  once?: boolean;
  margin?: string;
}) => {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  
  const isInView = useInView(ref, {
    amount: options?.threshold ?? 0.2,
    once: options?.once ?? false,
  });

  return {
    ref,
    isInView,
    prefersReducedMotion,
    // Animation variants that reverse on scroll
    animateProps: prefersReducedMotion
      ? { opacity: 1, y: 0, scale: 1 }
      : {
          opacity: isInView ? 1 : 0,
          y: isInView ? 0 : 20,
        },
    scaleProps: prefersReducedMotion
      ? { opacity: 1, scale: 1 }
      : {
          opacity: isInView ? 1 : 0,
          scale: isInView ? 1 : 0.95,
        },
  };
};

/**
 * Animation variants for scroll-triggered animations
 */
export const scrollVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export const scaleVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};