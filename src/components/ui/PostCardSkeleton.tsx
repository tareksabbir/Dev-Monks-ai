import { motion } from "framer-motion";

export function PostCardSkeleton() {
  return (
    <div className="bg-card border border-card-border flex flex-col justify-between h-45">
      <div className="p-6 pb-8">
        <div className="mb-4 flex items-center justify-between">
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-5 border border-foreground/10 rounded-full bg-foreground/5"
          />
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
            className="w-10 h-4 bg-foreground/5 rounded"
          />
        </div>
        <div className="space-y-3">
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="w-full h-6 bg-foreground/10 rounded"
          />
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
            className="w-[80%] h-6 bg-foreground/10 rounded"
          />
        </div>
      </div>

      <div className="flex items-stretch border-t border-card-border h-10 bg-secondary/40">
        <div className="w-28 border-r border-card-border flex items-center px-4">
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="w-16 h-3 bg-foreground/5 rounded"
          />
        </div>
        <div className="flex-[1.5] border-r border-card-border flex items-center px-4">
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
            className="w-24 h-3 bg-foreground/5 rounded"
          />
        </div>
        <div className="w-10 flex items-center justify-center">
          <motion.div
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.7,
            }}
            className="w-4 h-4 rounded-full bg-foreground/10"
          />
        </div>
      </div>
    </div>
  );
}
