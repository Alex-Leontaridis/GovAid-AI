"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface HeroAction {
  text: string;
  href: string;
  icon?: React.ReactNode | string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

interface HeroProps {
  badge?: {
    text: string;
    action: {
      text: string;
      href: string;
    };
  };
  title: string | React.ReactNode;
  description: string;
  actions: HeroAction[];
  image?: {
    light: string;
    dark: string;
    alt: string;
  };
}

export function HeroSection({
  badge,
  title,
  description,
  actions,
  image,
}: HeroProps) {
  return (
    <section
      className={cn(
        "bg-background text-foreground",
        "py-6 sm:py-12 md:py-16 px-4",
        "fade-bottom overflow-hidden pb-0 relative"
      )}
    >
      {/* Background floating elements */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-3 h-3 bg-primary/30 rounded-full"
          animate={{
            y: [0, 15, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-1 h-1 bg-primary/40 rounded-full"
          animate={{
            y: [0, -10, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </motion.div>

      <div className="mx-auto flex max-w-container flex-col gap-8 pt-4 sm:gap-16">
        <motion.div 
          className="flex flex-col items-center gap-6 text-center sm:gap-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
        >
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Badge variant="outline" className="gap-2">
                <span className="text-muted-foreground">{badge.text}</span>
                <a href={badge.action.href} className="flex items-center gap-1">
                  {badge.action.text}
                  <ArrowRightIcon className="h-3 w-3" />
                </a>
              </Badge>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1 
            className="relative z-10 inline-block bg-gradient-to-r from-[hsl(194,83%,20%)] to-[hsl(194,83%,40%)] bg-clip-text text-4xl font-semibold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {title}
          </motion.h1>

          {/* Description */}
          <motion.p 
            className="text-md relative z-10 max-w-[550px] font-medium text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {description}
          </motion.p>

          {/* Actions */}
          <motion.div 
            className="relative z-10 flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1 + index * 0.1,
                  ease: [0.4, 0.0, 0.2, 1]
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant={action.variant} size="lg" asChild>
                  <a href={action.href} className="flex items-center gap-2">
                    {action.icon === "github" ? <Github className="h-5 w-5" /> : action.icon}
                    {action.text}
                  </a>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
