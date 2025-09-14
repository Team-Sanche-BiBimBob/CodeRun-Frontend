import React from 'react';
import StarRating from './StarRating';

const LanguageCard = ({ language, selectedLanguage, onSelect }) => {
  return (
    <div
      className={`p-5 border rounded-lg cursor-pointer transition-all hover:shadow-md bg-white w-60 h-52 flex flex-col ${
        selectedLanguage === language.id ? 'border-green-500 shadow-md' : 'border-gray-200'
      }`}
      onClick={() => onSelect(language.id)}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">{language.name}</h3>
        {language.recommended && (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
            추천
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-3 flex-grow leading-relaxed">
        {language.description}
      </p>
      <div className="flex justify-between text-sm text-gray-600 mt-auto">
        <div className="flex items-center gap-1">
          인기: <StarRating rating={language.popularity} />
        </div>
      </div>
    </div>
  );
};

export default LanguageCard;