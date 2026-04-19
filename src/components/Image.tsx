import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';

interface ImageProps extends HTMLMotionProps<"img"> {
  containerClassName?: string;
}

const Image = ({ src, alt, className, containerClassName, ...props }: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName || 'w-full h-full'}`}>
      <AnimatePresence mode="wait">
        {!isLoaded && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-muted/50 animate-pulse flex items-center justify-center -z-10"
          >
            <ImageIcon className="w-6 h-6 text-foreground/10" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        src={src}
        alt={alt}
        className={`${className || ''}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy"
        {...props}
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-foreground/5 flex flex-col items-center justify-center p-4 text-center">
          <ImageIcon className="w-8 h-8 text-foreground/20 mb-2" />
          <span className="text-xs text-foreground/40">Image unavailable</span>
        </div>
      )}
    </div>
  );
};

export default Image;
