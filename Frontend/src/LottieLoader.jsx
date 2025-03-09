import React from 'react';
import Lottie from 'lottie-react';
import coolAnimation from './coolanimation.json'; // Adjust path if needed

function LottieLoader() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <Lottie 
        animationData={coolAnimation}
        loop={true}
        autoplay={true}
        style={{ width: 1000, height: 1000 }}
      />
    </div>
  );
}

export default LottieLoader;
