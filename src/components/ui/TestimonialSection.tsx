import React, { useState } from 'react';
import TestimonialCard from './TestimonialCard';

interface Testimonial {
  id: number;
  testimonial: string;
  author: string;
  company?: string;
}

interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ testimonials }) => {
  const [cards, setCards] = useState(testimonials);

  const handleShuffle = () => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      // Move the first card to the end
      const firstCard = newCards.shift();
      if (firstCard) {
        newCards.push(firstCard);
      }
      return newCards;
    });
  };

  return (
    <div className="relative w-full h-full">
      {cards.map((testimonial, index) => {
        const position = index === 0 ? 'front' : index === 1 ? 'middle' : 'back';
        
        if (index > 2) return null; // Only show 3 cards at a time
        
        return (
          <TestimonialCard
            key={testimonial.id}
            handleShuffle={handleShuffle}
            testimonial={testimonial.testimonial}
            position={position}
            id={testimonial.id}
            author={testimonial.author}
            company={testimonial.company}
          />
        );
      })}
    </div>
  );
};

export default TestimonialSection;
