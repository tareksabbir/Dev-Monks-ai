import { motion } from "framer-motion";

export function PostCardSkeleton() {
  return (
    <div className="bg-[#fef9e8] border border-[#d8c8a8] flex flex-col justify-between h-[180px]">
      <div className="p-6 pb-8">
        <div className="mb-4 flex items-center justify-between">
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-5 border border-[#1a1a1a]/10 rounded-full bg-[#1a1a1a]/5"
          />
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="w-10 h-4 bg-[#1a1a1a]/5 rounded"
          />
        </div>
        <div className="space-y-3">
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="w-full h-6 bg-[#1a1a1a]/10 rounded"
          />
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="w-[80%] h-6 bg-[#1a1a1a]/10 rounded"
          />
        </div>
      </div>

      <div className="flex items-stretch border-t border-[#d8c8a8] h-10 bg-[#f9f3dd]/40">
        <div className="w-28 border-r border-[#d8c8a8] flex items-center px-4">
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="w-16 h-3 bg-[#1a1a1a]/5 rounded"
          />
        </div>
        <div className="flex-[1.5] border-r border-[#d8c8a8] flex items-center px-4">
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="w-24 h-3 bg-[#1a1a1a]/5 rounded"
          />
        </div>
        <div className="w-10 flex items-center justify-center">
          <motion.div
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
            className="w-4 h-4 rounded-full bg-[#1a1a1a]/10"
          />
        </div>
      </div>
    </div>
  );
}

export function FeaturedPostSkeleton() {
  return (
    <div className="w-full flex justify-center px-6 pb-0" style={{ backgroundImage: "linear-gradient(to right, rgba(180,160,120,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(180,160,120,0.35) 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 border border-[#1a1a1a]">
        <div className="flex flex-col justify-between p-8 min-h-60 bg-[#f9f3dd]">
          <div className="flex flex-col items-start gap-4">
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-5 border border-[#1a1a1a]/10 rounded-full bg-[#1a1a1a]/5"
            />
            <div className="space-y-3 w-full">
              <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                className="w-full h-10 bg-[#1a1a1a]/10 rounded"
              />
              <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="w-[60%] h-10 bg-[#1a1a1a]/10 rounded"
              />
            </div>
          </div>
        </div>
        <div className="bg-[#f9f3dd] flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#1a1a1a] min-h-60">
          <div className="flex-1 p-8">
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="w-full h-24 bg-[#1a1a1a]/5 rounded"
            />
          </div>
          <div className="flex items-stretch border-t border-[#1a1a1a]/25 h-10">
            <div className="flex-1 px-4 flex items-center border-r border-[#1a1a1a]/25">
               <motion.div animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-16 h-3 bg-[#1a1a1a]/5 rounded" />
            </div>
            <div className="flex-[1.5] px-4 flex items-center border-r border-[#1a1a1a]/25">
               <motion.div animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }} className="w-24 h-3 bg-[#1a1a1a]/5 rounded" />
            </div>
            <div className="w-10 flex items-center justify-center">
               <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-4 h-4 rounded-full bg-[#1a1a1a]/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
