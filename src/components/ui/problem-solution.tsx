import { Check, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import React from "react";

interface ProblemSolutionProps {
  problemTitle: string;
  problemDescription: string;
  problemFeatures: string[];
  solutionTitle: string;
  solutionDescription: string;
  solutionFeatures: string[];
}

function ProblemSolution({ 
  problemTitle, 
  problemDescription, 
  problemFeatures,
  solutionTitle, 
  solutionDescription, 
  solutionFeatures 
}: ProblemSolutionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Problem Card */}
      <motion.div 
        className="border-2 border-destructive/20 rounded-lg p-6 h-full bg-white shadow-sm hover:shadow-md transition-shadow"
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
              <Badge variant="outline" className="border-destructive/30 text-destructive">
                Problem
              </Badge>
            </motion.div>
            <motion.div 
              className="flex gap-2 flex-col"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <h2 className="text-xl lg:text-2xl tracking-tighter font-regular text-destructive">
                {problemTitle}
              </h2>
              <p className="text-sm leading-relaxed tracking-tight text-muted-foreground">
                {problemDescription}
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
            {problemFeatures.map((feature, idx) => (
              <motion.div 
                className="flex flex-row gap-4 items-center" 
                key={idx}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="flex items-center justify-center min-w-[24px]"
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
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                </motion.div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm">{feature}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Solution Card */}
      <motion.div 
        className="border-2 border-primary/20 rounded-lg p-6 h-full bg-white shadow-sm hover:shadow-md transition-shadow"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1], delay: 0.2 }}
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
                delayChildren: 0.4
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
              <Badge variant="outline" className="border-primary/30 text-primary">
                Solution
              </Badge>
            </motion.div>
            <motion.div 
              className="flex gap-2 flex-col"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <h2 className="text-xl lg:text-2xl tracking-tighter font-regular text-primary">
                {solutionTitle}
              </h2>
              <p className="text-sm leading-relaxed tracking-tight text-muted-foreground">
                {solutionDescription}
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
                  delayChildren: 0.5
                }
              }
            }}
          >
            {solutionFeatures.map((feature, idx) => (
              <motion.div 
                className="flex flex-row gap-4 items-center" 
                key={idx}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="flex items-center justify-center min-w-[24px]"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.6 + idx * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                </motion.div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm">{feature}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export { ProblemSolution }; 