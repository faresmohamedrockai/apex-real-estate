'use client';

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingProps {
  isLoading?: boolean;
}

const Loading = ({ isLoading = true }: LoadingProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#b70501] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            <Image
              src="/loading/Loading_Apex.gif"
              alt="Loading..."
              width={800}
              height={800}
              priority
              className="animate-pulse"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#b70501] via-transparent to-transparent opacity-30"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loading;
