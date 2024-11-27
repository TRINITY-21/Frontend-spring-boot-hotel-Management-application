import React from 'react';

const Spinner = ({ size = 'w-8 h-8', color = 'border-[#f70767]' }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`border-4 border-t-transparent ${color} ${size} rounded-full animate-spin`}
      />
    </div>
  );
};

export default Spinner;
