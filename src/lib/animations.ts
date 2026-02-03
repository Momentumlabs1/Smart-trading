// Framer Motion Animation Variants for Smart Trading
// ===================================================

import type { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

export const floatAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
    }
  }
};

export const navbarVariants: Variants = {
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 }
  },
  hidden: {
    y: -100,
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const mobileMenuVariants: Variants = {
  closed: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.3 }
  },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  }
};

export const cardHover: Variants = {
  rest: {
    y: 0,
    transition: { duration: 0.3 }
  },
  hover: {
    y: -8,
    transition: { duration: 0.3 }
  }
};

export const buttonHover: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

// Counter animation helper
export const counterAnimation: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 }
  }
};

// Text reveal animation (word by word)
export const textRevealContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const textRevealWord: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};
