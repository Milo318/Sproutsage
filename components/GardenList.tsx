
import React from 'react';
import { PlantCareInfo, SavedPlant } from '../types';

interface GardenListProps {
  plants: SavedPlant[];
  onSelect: (plant: PlantCareInfo, imageUrl: string, nickname?: string) => void;
  onRemove: (id: string) => void;
  onWater: (id: string) => void;
}

const GardenList: React.FC<GardenListProps> = ({ plants, onSelect, onRemove, onWater }) => {
  if (plants.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-seedling text-emerald-400 text-4xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Garden is Empty</h2>
        <p className="text-gray-500 mb-8">Start identifying plants to add them to your digital garden!</p>
      </div>
    );
  }

  const isWaterDue = (plant: SavedPlant) => {
    const last = new Date(plant.lastWatered).getTime();
    const freq = plant.info.wateringFrequencyDays || 7;
    const due = last + (freq * 24 * 60 * 60 * 1000);
    return Date.now() > due;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">My Plants ({plants.length})</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {plants.map((item) => {
          const due = isWaterDue(item);
          return (
            <div 
              key={item.id}
              className={`group relative bg-white rounded-3xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 ${due ? 'border-blue-200 ring-2 ring-blue-50' : 'border-emerald-50'}`}
            >
              <div 
                className="h-48 overflow-hidden cursor-pointer relative"
                onClick={() => onSelect(item.info, item.imageUrl, item.nickname)}
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.info.commonName} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {due && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                    <i className="fa-solid fa-droplet animate-bounce"></i>
                    Water Due
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => onRemove(item.id)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/30 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
              >
                <i className="fa-solid fa-trash-can text-xs"></i>
              </button>

              <div className="p-5">
                {item.nickname && (
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">"{item.nickname}"</h4>
                )}
                <h3 className="text-xl font-bold text-gray-800 mb-1">{item.info.commonName}</h3>
                <p className="text-xs italic text-emerald-600 font-medium mb-3">{item.info.scientificName}</p>
                
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                    <i className="fa-solid fa-calendar-check text-emerald-400"></i>
                    Last Watered: {new Date(item.lastWatered).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                    <i className="fa-solid fa-repeat text-blue-400"></i>
                    Frequency: Every {item.info.wateringFrequencyDays || 'N/A'} days
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => onWater(item.id)}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      due 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100' 
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    <i className="fa-solid fa-droplet"></i>
                    {due ? 'Water Now' : 'I Watered It'}
                  </button>
                  <button 
                    onClick={() => onSelect(item.info, item.imageUrl, item.nickname)}
                    className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center hover:bg-emerald-100 transition-colors"
                  >
                    <i className="fa-solid fa-eye"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GardenList;
