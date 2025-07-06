import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  asChild?: boolean;
  href?: string;
}

export function AnimatedButton({
  children,
  variant = "default",
  size = "default",
  className,
  asChild = false,
  href,
  ...props
}: AnimatedButtonProps) {
  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <Button
        variant={variant}
        size={size}
        className={cn("transition-all duration-200", className)}
        asChild={asChild}
        {...props}
      >
        {href ? (
          <a href={href} className="flex items-center gap-2">
            {children}
          </a>
        ) : (
          children
        )}
      </Button>
    </motion.div>
  );

  return buttonContent;
}

export function AnimatedIconButton({
  children,
  className,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <Button
        size="icon"
        className={cn("transition-all duration-200", className)}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}

export function AnimatedCard({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("bg-white rounded-lg shadow-sm", className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
} 