import React from 'react';
import { getCountryFlag } from '../services/xtreamService';
import { XtreamCategory } from '../types';

interface CategoryListProps {
  categories: XtreamCategory[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, selectedCategoryId, onSelectCategory }) => {
  return (
    <div className="w-[280px] flex flex-col pl-4 pr-6 h-full overflow-hidden">
      <h2 className="text-white text-xl font-medium mb-6 mt-2 ml-2">Live TV's</h2>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide pb-20">
        {categories.map((category) => {
            const isSelected = category.category_id === selectedCategoryId;
            
            return (
                <button
                    key={category.category_id}
                    onClick={() => onSelectCategory(category.category_id)}
                    className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group origin-left
                        ${isSelected 
                            ? 'bg-gradient-to-r from-blue-600/20 to-transparent border-l-4 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)] scale-105 translate-x-2' 
                            : 'hover:bg-white/5 border-l-4 border-transparent hover:scale-105 hover:translate-x-2 hover:shadow-lg'
                        }
                    `}
                >
                    <div className={`w-8 h-8 flex items-center justify-center text-2xl rounded-full transition-transform duration-300 ${isSelected ? 'scale-125' : 'opacity-70 group-hover:opacity-100 group-hover:scale-110'}`}>
                        {getCountryFlag(category.category_name)}
                    </div>
                    
                    <div className="flex flex-col items-start">
                        <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}>
                            {category.category_name}
                        </span>
                        {/* Mock Channel Counts */}
                        {isSelected && (
                            <span className="text-[10px] text-blue-400 font-medium animate-pulse">147 Channels</span>
                        )}
                    </div>
                </button>
            );
        })}
      </div>
    </div>
  );
};

export default CategoryList;