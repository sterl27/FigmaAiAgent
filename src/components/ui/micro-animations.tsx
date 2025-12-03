'use client';

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface MicroAnimationProps {
  children: ReactNode;
  type: AnimationType;
  trigger?: boolean;
  className?: string;
  delay?: number;
  duration?: number;
  onComplete?: () => void;
  intensity?: 'subtle' | 'normal' | 'strong';
  repeat?: boolean | number;
}

export type AnimationType = 
  // Interaction animations
  | 'ripple' | 'pulse' | 'glow' | 'scale' | 'bounce'
  // Feedback animations
  | 'shake' | 'flash' | 'heartbeat' | 'breathe'
  // Transition animations
  | 'fadeIn' | 'slideUp' | 'scaleIn' | 'elastic'
  // Advanced animations
  | 'colorShift' | 'morphShape' | 'wobble' | 'swing'
  // Musaix-specific animations
  | 'musicPulse' | 'waveform' | 'vinylSpin' | 'frequencyBars';

const animationVariants = {
  ripple: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: [0.8, 1.1, 1], 
      opacity: [0, 0.8, 1] 
    },
    exit: { scale: 0.9, opacity: 0 }
  },
  pulse: {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.05, 1]
    }
  },
  glow: {
    initial: { 
      boxShadow: "0 0 0 rgba(147, 51, 234, 0)" 
    },
    animate: { 
      boxShadow: [
        "0 0 0 rgba(147, 51, 234, 0)",
        "0 0 20px rgba(147, 51, 234, 0.5)",
        "0 0 0 rgba(147, 51, 234, 0)"
      ]
    }
  },
  scale: {
    initial: { scale: 1 },
    animate: { scale: 1.05 },
    exit: { scale: 1 }
  },
  bounce: {
    initial: { y: 0 },
    animate: { 
      y: [0, -10, 0]
    }
  },
  shake: {
    initial: { x: 0 },
    animate: { 
      x: [-2, 2, -2, 2, 0]
    }
  },
  flash: {
    initial: { opacity: 1 },
    animate: { 
      opacity: [1, 0.3, 1]
    }
  },
  heartbeat: {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.1, 1, 1.1, 1]
    }
  },
  breathe: {
    initial: { scale: 1, opacity: 0.8 },
    animate: { 
      scale: [1, 1.02, 1],
      opacity: [0.8, 1, 0.8]
    }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  },
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  },
  elastic: {
    initial: { scale: 0 },
    animate: { 
      scale: 1
    }
  },
  colorShift: {
    initial: { backgroundColor: "rgb(59, 130, 246)" },
    animate: { 
      backgroundColor: [
        "rgb(59, 130, 246)",
        "rgb(147, 51, 234)",
        "rgb(236, 72, 153)",
        "rgb(59, 130, 246)"
      ]
    }
  },
  morphShape: {
    initial: { borderRadius: "0.5rem" },
    animate: { 
      borderRadius: ["0.5rem", "2rem", "0.5rem"]
    }
  },
  wobble: {
    initial: { rotate: 0 },
    animate: { 
      rotate: [0, -5, 5, -5, 0]
    }
  },
  swing: {
    initial: { rotate: 0 },
    animate: { 
      rotate: [0, 10, -10, 5, -5, 0]
    }
  },
  // Musaix-specific animations
  musicPulse: {
    initial: { scale: 1, filter: "brightness(1)" },
    animate: { 
      scale: [1, 1.08, 1],
      filter: [
        "brightness(1) hue-rotate(0deg)",
        "brightness(1.2) hue-rotate(15deg)",
        "brightness(1) hue-rotate(0deg)"
      ]
    }
  },
  waveform: {
    initial: { scaleY: 1 },
    animate: { 
      scaleY: [1, 0.3, 0.8, 0.6, 1.2, 0.4, 1]
    }
  },
  vinylSpin: {
    initial: { rotate: 0 },
    animate: { 
      rotate: 360
    }
  },
  frequencyBars: {
    initial: { scaleY: 0.2 },
    animate: { 
      scaleY: [0.2, 1, 0.5, 0.8, 0.3, 0.9, 0.2]
    }
  }
};

export function MicroAnimation({ 
  children, 
  type, 
  trigger = true, 
  className,
  delay = 0,
  duration,
  onComplete,
  intensity = 'normal',
  repeat = false
}: MicroAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsAnimating(true);
      if (onComplete) {
        const timer = setTimeout(onComplete, (duration || 1000) + delay);
        return () => clearTimeout(timer);
      }
    }
  }, [trigger, onComplete, duration, delay]);

  const variants = animationVariants[type];
  
  // Apply intensity scaling
  const intensityScale = intensity === 'subtle' ? 0.5 : intensity === 'strong' ? 1.5 : 1;
  
  const getTransition = (type: AnimationType) => {
    const repeatValue = repeat === true ? Infinity : typeof repeat === 'number' ? repeat : undefined;
    
    const baseTransition = {
      delay: delay / 1000,
      duration: duration ? duration / 1000 : undefined,
      repeat: repeatValue
    };

    switch (type) {
      case 'pulse':
      case 'glow':
      case 'breathe':
      case 'colorShift':
      case 'morphShape':
      case 'musicPulse':
      case 'waveform':
      case 'frequencyBars':
        return { ...baseTransition, repeat: repeatValue || Infinity, duration: 2 };
      case 'vinylSpin':
        return { ...baseTransition, repeat: repeatValue || Infinity, duration: 4, ease: "linear" as const };
      case 'bounce':
        return { ...baseTransition, type: "spring" as const, stiffness: 400 * intensityScale, damping: 10 };
      case 'shake':
        return { ...baseTransition, duration: 0.5 };
      case 'flash':
        return { ...baseTransition, duration: 0.3 };
      case 'heartbeat':
        return { ...baseTransition, duration: 1, ease: "easeInOut" as const };
      case 'elastic':
        return { ...baseTransition, type: "spring" as const, stiffness: 500 * intensityScale, damping: 25 };
      case 'wobble':
        return { ...baseTransition, duration: 0.5 };
      case 'swing':
        return { ...baseTransition, duration: 0.8 };
      default:
        return baseTransition;
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      {isAnimating && (
        <motion.div
          className={cn("inline-block", className)}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={getTransition(type)}
          onAnimationComplete={() => {
            if (!['pulse', 'glow', 'breathe', 'colorShift', 'morphShape'].includes(type)) {
              setIsAnimating(false);
            }
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function RippleEffect({ 
  children, 
  className,
  color = "rgba(147, 51, 234, 0.3)" 
}: { 
  children: ReactNode; 
  className?: string;
  color?: string;
}) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <div 
      className={cn("relative overflow-hidden cursor-pointer", className)}
      onClick={handleClick}
    >
      {children}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50,
            backgroundColor: color
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function AnimatedProgressBar({ 
  progress, 
  className,
  showPercentage = true 
}: { 
  progress: number; 
  className?: string;
  showPercentage?: boolean;
}) {
  return (
    <div className={cn("w-full bg-muted rounded-full h-2 relative overflow-hidden", className)}>
      <motion.div
        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full relative"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        />
      </motion.div>
      {showPercentage && (
        <motion.div
          className="absolute right-2 -top-6 text-xs font-medium text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Math.round(progress)}%
        </motion.div>
      )}
    </div>
  );
}

export function ContextualToast({ 
  type, 
  message, 
  isVisible, 
  onClose 
}: { 
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}) {
  const bgColors = {
    success: 'bg-green-500/90',
    error: 'bg-red-500/90',
    warning: 'bg-yellow-500/90',
    info: 'bg-blue-500/90'
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white font-medium shadow-lg backdrop-blur-sm",
            bgColors[type]
          )}
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 4, ease: "linear" }}
            className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
          />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
