import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import React from "react";

interface FeatureItem {
  title: string;
  description: string;
}

interface FeatureProps {
  title: string;
  badge: string;
  description: string;
  features: FeatureItem[];
}

function Feature({ title, badge, description, features }: FeatureProps) {
  return (
    <motion.div 
      className="border rounded-lg p-6 h-full bg-white shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div 
        className="flex gap-6 flex-col h-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2
            }
          }
        }}
      >
        <motion.div 
          className="flex gap-3 flex-col"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Badge variant="outline">{badge}</Badge>
          </motion.div>
          <motion.div 
            className="flex gap-2 flex-col"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <h2 className="text-xl lg:text-2xl tracking-tighter font-regular">
              {title}
            </h2>
            <p className="text-sm leading-relaxed tracking-tight text-muted-foreground">
              {description}
            </p>
          </motion.div>
        </motion.div>
        <motion.div 
          className="flex flex-col gap-4"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
        >
          {features.map((feature, idx) => (
            <motion.div 
              className="flex flex-row gap-4 items-start" 
              key={idx}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 }
              }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.4 + idx * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
              >
                <Check className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
              </motion.div>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-sm">{feature.title}</p>
                <p className="text-muted-foreground text-xs">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export { Feature };