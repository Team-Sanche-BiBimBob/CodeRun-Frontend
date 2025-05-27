import React from 'react';

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-xl ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
