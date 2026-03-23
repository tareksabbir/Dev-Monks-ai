import { motion } from "framer-motion";

export function FeaturedPostSkeleton() {
  return (
    <div
      className="w-full flex justify-center px-6 pb-0"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--grid) 1px, transparent 1px), linear-gradient(to bottom, var(--grid) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 border border-foreground">
        <div className="flex flex-col justify-between p-8 min-h-60 bg-secondary">
          <div className="flex flex-col items-start gap-4">
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-20 h-5 border border-foreground/10 rounded-full bg-foreground/5"
            />
            <div className="space-y-3 w-full">
              <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.1,
                }}
                className="w-full h-10 bg-foreground/10 rounded"
              />
              <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
                className="w-[60%] h-10 bg-foreground/10 rounded"
              />
            </div>
          </div>
        </div>
        <div className="bg-secondary flex flex-col justify-between border-t md:border-t-0 md:border-l border-foreground min-h-60">
          <div className="flex-1 p-8">
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
              className="w-full h-24 bg-foreground/5 rounded"
            />
          </div>
          <div className="flex items-stretch border-t border-foreground/25 h-10">
            <div className="flex-1 px-4 flex items-center border-r border-foreground/25">
              <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-16 h-3 bg-foreground/5 rounded"
              />
            </div>
            <div className="flex-[1.5] px-4 flex items-center border-r border-foreground/25">
              <motion.div
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                className="w-24 h-3 bg-foreground/5 rounded"
              />
            </div>
            <div className="w-10 flex items-center justify-center">
              <motion.div
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="w-4 h-4 rounded-full bg-foreground/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
