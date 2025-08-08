import React, { useState } from 'react';
import { Phone, X, Mail, User, MessageSquare, Send } from 'lucide-react';

const FloatingContactButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form and close modal
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsOpen(false);
  };

  return (
    <>
      {/* Contact Modal */}
      <div className={`
        fixed inset-0 z-40 flex items-center justify-center p-4
        transition-all duration-300
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        {/* Enhanced Backdrop with blur */}
        <div 
          className="absolute inset-0 bg-espresso/30 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Glass Panel Modal Container */}
        <div className={`
          relative z-50 w-full max-w-lg
          transform transition-all duration-300
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}>
          {/* Outer glass container */}
          <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl p-1 shadow-2xl border border-white/30 overflow-hidden">
            {/* Glass effect overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-sage-mist/10 to-transparent rounded-3xl"></div>
            
            {/* Inner content container */}
            <div className="relative bg-white/60 backdrop-blur-sm rounded-[calc(1.5rem-4px)] p-8 shadow-inner">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                <X className="w-5 h-5 text-espresso" />
              </button>
              
              <div className="mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-espresso mb-2">Quick Quote Request</h3>
                <p className="text-espresso/70">Get your free insulation estimate today</p>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <User className="w-5 h-5 text-sage-mist" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30 text-espresso placeholder-espresso/60 focus:bg-white/70 focus:border-sage-mist/50 focus:outline-none focus:ring-2 focus:ring-sage-mist/20 transition-all duration-200"
                  />
                </div>

                {/* Email Field */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Mail className="w-5 h-5 text-sage-mist" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30 text-espresso placeholder-espresso/60 focus:bg-white/70 focus:border-sage-mist/50 focus:outline-none focus:ring-2 focus:ring-sage-mist/20 transition-all duration-200"
                  />
                </div>

                {/* Phone Field */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Phone className="w-5 h-5 text-sage-mist" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Your Phone Number"
                    className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30 text-espresso placeholder-espresso/60 focus:bg-white/70 focus:border-sage-mist/50 focus:outline-none focus:ring-2 focus:ring-sage-mist/20 transition-all duration-200"
                  />
                </div>

                {/* Message Field */}
                <div className="relative">
                  <div className="absolute left-4 top-4 z-10">
                    <MessageSquare className="w-5 h-5 text-sage-mist" />
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your insulation needs..."
                    rows={4}
                    className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30 text-espresso placeholder-espresso/60 focus:bg-white/70 focus:border-sage-mist/50 focus:outline-none focus:ring-2 focus:ring-sage-mist/20 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-sage-mist to-sage-mist/90 hover:from-sage-mist/90 hover:to-sage-mist text-white font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20"
                  >
                    <Send className="w-5 h-5" />
                    Send Quote Request
                  </button>

                  {/* Call Button */}
                  <a
                    href="tel:+19073103000"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white/40 hover:bg-white/60 text-espresso font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg backdrop-blur-sm border border-white/30"
                  >
                    <Phone className="w-5 h-5" />
                    Call (907) 310-3000
                  </a>
                </div>
              </form>

              {/* Trust Indicators */}
              <div className="mt-6 text-center">
                <p className="text-sm text-espresso/60">Licensed • Bonded • Insured</p>
              </div>
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-br-full"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-tl-full"></div>
          </div>
        </div>
      </div>

      {/* Floating Button with Glass Effect */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-30 group"
        aria-label="Contact us"
      >
        <div className="relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-full bg-terra-cotta opacity-20 blur-xl group-hover:opacity-30 transition-opacity" />
          
          {/* Button with glass effect */}
          <div className="
            relative w-14 h-14 sm:w-16 sm:h-16 rounded-full
            bg-terra-cotta/40 backdrop-blur-md
            border border-terra-cotta/20
            shadow-glass
            transform transition-all duration-300
            group-hover:scale-110 group-hover:bg-terra-cotta/50
            flex items-center justify-center
            overflow-hidden
          ">
            {/* Glass light effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-soft-white relative z-10" />
          </div>
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full border-2 border-terra-cotta/30 animate-ping" />
        </div>
      </button>
    </>
  );
};

export default FloatingContactButton;
