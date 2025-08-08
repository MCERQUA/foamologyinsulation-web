import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  handleShuffle: () => void;
  testimonial: string;
  position: 'front' | 'middle' | 'back';
  id: number;
  author: string;
  company?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  handleShuffle, 
  testimonial, 
  position, 
  id, 
  author,
  company 
}) => {
  const dragRef = useRef(0);
  const isFront = position === "front";
  
  return (
    <motion.div
      style={{
        zIndex: position === "front" ? "2" : position === "middle" ? "1" : "0"
      }}
      animate={{
        rotate: position === "front" ? "-6deg" : position === "middle" ? "0deg" : "6deg",
        x: position === "front" ? "0%" : position === "middle" ? "33%" : "66%"
      }}
      drag={isFront}
      dragElastic={0.35}
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onDragStart={(e: any) => {
        dragRef.current = e.clientX;
      }}
      onDragEnd={(e: any) => {
        if (dragRef.current - e.clientX > 150) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.35 }}
      className={`
        absolute left-0 top-0 
        h-[400px] w-[320px] sm:h-[450px] sm:w-[350px]
        select-none rounded-3xl 
        border-2 border-white/30
        bg-khaki/20 backdrop-blur-lg
        p-6 sm:p-8 shadow-2xl
        flex flex-col items-center justify-center gap-6
        ${isFront ? "cursor-grab active:cursor-grabbing" : ""}
      `}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-3xl pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-khaki/10 to-transparent rounded-3xl pointer-events-none"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 h-full">
      {/* Avatar */}
      <div className="relative">
        <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-sand/30 p-1">
          <img
            src={`https://i.pravatar.cc/128?img=${id}`}
            alt={`Avatar of ${author}`}
            className="pointer-events-none h-full w-full rounded-full object-cover"
          />
        </div>
        {/* Decorative ring */}
        <div className="absolute inset-0 rounded-full ring-2 ring-terra-cotta/20 ring-offset-4 ring-offset-transparent"></div>
      </div>
      
      {/* Testimonial text */}
      <p className="text-center text-base sm:text-lg italic text-cream leading-relaxed">
        "{testimonial}"
      </p>
      
      {/* Author info */}
      <div className="text-center">
        <p className="text-sm sm:text-base font-semibold text-soft-white">
          {author}
        </p>
        {company && (
          <p className="text-xs sm:text-sm text-sand mt-1">
            {company}
          </p>
        )}
      </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
