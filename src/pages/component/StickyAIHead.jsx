import React, { useState } from 'react';
import logoSrc from '../../images/ai-head.png';
import { useNavigate } from 'react-router-dom';
const StickyAIHead = () => {
    const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <footer className="relative">
      <div 
        className="fixed bottom-8 right-12 z-30"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div 
          className="bg-red-600 rounded-full p-2 cursor-pointer"
          style={{ position: 'relative' }}
          onClick={()=>navigate('/consumer-ai/')}
        >
          <div className="relative">
            <img 
              src={logoSrc} 
              alt="Chatbot Logo" 
              className="w-12 h-12 rounded-full" 
            />
            {showTooltip && (
              <div className="absolute bottom-full right-[-8px] transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded-lg whitespace-nowrap">
                Hii, Need any help ?
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StickyAIHead;
