
import React, { useState } from 'react';
import { PlantCareInfo, SavedPlant } from '../types';

interface GardenListProps {
  plants: SavedPlant[];
  onSelect: (plant: PlantCareInfo, imageUrl: string, nickname?: string) => void;
  onRemove: (id: string) => void;
  onWater: (id: string) => void;
}

type FilterType = 'all' | 'needs-water' | 'easy' | 'moderate' | 'expert';

const GardenList: React.FC<GardenListProps> = ({ plants, onSelect, onRemove, onWater }) => {
  const [filter, setFilter] = useState<FilterType>('all');

  if (plants.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-seedling text-emerald-300 text-4xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Garden Awaits</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Start by identifying your first plant. Each one you add will appear here with a personalized care plan.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <i className="fa-solid fa-camera text-emerald-400"></i>
            <span>Identify plants with photos</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <i className="fa-solid fa-bell text-blue-400"></i>
            <span>Get watering reminders</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <i className="fa-solid fa-book text-amber-400"></i>
            <span>Track growth in journal</span>
          </div>
        </div>
      </div>
    );
  }

  const isWaterDue = (plant: SavedPlant) => {
    const last = new Date(plant.lastWatered).getTime();
    const freq = plant.info.wateringFrequencyDays || 7;
    const due = last + (freq * 24 * 60 * 60 * 1000);
    return Date.now() > due;
  };

  const dueCount = plants.filter(isWaterDue).length;
  const easyCount = plants.filter(p => (p.info.difficulty || 'Easy') === 'Easy').length;
  const toxicCount = plants.filter(p => p.info.toxicity?.toxicToPets).length;

  const filteredPlants = plants.filter(p => {
    if (filter === 'needs-water') return isWaterDue(p);
    if (filter === 'easy') return (p.info.difficulty || 'Easy') === 'Easy';
    if (filter === 'moderate') return p.info.difficulty === 'Moderate';
    if (filter === 'expert') return p.info.difficulty === 'Expert';
    return true;
  });

  const filters: { id: FilterType; label: string; icon: string; count?: number }[] = [
    { id: 'all', label: 'All Plants', icon: 'fa-layer-group', count: plants.length },
    { id: 'needs-water', label: 'Needs Water', icon: 'fa-droplet', count: dueCount },
    { id: 'easy', label: 'Easy Care', icon: 'fa-face-smile', count: easyCount },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-white rounded-2xl p-4 border border-emerald-50 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-seedling text-emerald-500 text-sm"></i>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{plants.length}</p>
          <p className="text-[10px] text-gray-400">plants in garden</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-blue-50 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <i className={`fa-solid fa-droplet text-blue-500 text-sm ${dueCount > 0 ? 'animate-pulse' : ''}`}></i>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thirsty</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{dueCount}</p>
          <p className="text-[10px] text-gray-400">need watering</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-50 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-face-smile text-emerald-500 text-sm"></i>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Easy</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{easyCount}</p>
          <p className="text-[10px] text-gray-400">beginner friendly</p>
        </div>

        <div className={`bg-white rounded-2xl p-4 border shadow-sm ${toxicCount > 0 ? 'border-rose-100' : 'border-emerald-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${toxicCount > 0 ? 'bg-rose-50' : 'bg-emerald-50'}`}>
              <i className={`fa-solid ${toxicCount > 0 ? 'fa-triangle-exclamation text-rose-500' : 'fa-shield-check text-emerald-500'} text-sm`}></i>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Toxic</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{toxicCount}</p>
          <p className="text-[10px] text-gray-400">{toxicCount > 0 ? 'toxic to pets' : 'all pet-safe'}</p>
        </div>
      </div>

      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Plants</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : 'bg-white text-gray-500 border border-gray-100 hover:border-emerald-200 hover:text-emerald-600'
              }`}
            >
              <i className={`fa-solid ${f.icon}`}></i>
              {f.label}
              {f.count !== undefined && (
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${filter === f.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredPlants.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <i className="fa-solid fa-filter text-gray-300 text-3xl mb-3"></i>
          <p className="text-gray-500 text-sm">No plants match this filter.</p>
          <button onClick={() => setFilter('all')} className="text-emerald-600 font-bold text-sm mt-2 hover:underline">
            Show all plants
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlants.map((item) => {
            const due = isWaterDue(item);
            const diff = item.info.difficulty || 'Easy';
            const diffColors = {
              Easy: 'text-emerald-600',
              Moderate: 'text-amber-600',
              Expert: 'text-red-600',
            };

            return (
              <div 
                key={item.id}
                className={`group relative bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                  due ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-100'
                }`}
              >
                {/* Image */}
                <div 
                  className="h-40 overflow-hidden cursor-pointer relative"
                  onClick={() => onSelect(item.info, item.imageUrl, item.nickname)}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.info.commonName} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {due && (
                    <div className="absolute top-3 left-3 bg-blue-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                      <i className="fa-solid fa-droplet animate-bounce text-[8px]"></i>
                      Water Due
                    </div>
                  )}
                  {item.info.toxicity?.toxicToPets && (
                    <div className="absolute top-3 right-10 w-7 h-7 bg-rose-500/90 backdrop-blur-sm text-white rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-paw text-[10px]"></i>
                    </div>
                  )}
                </div>
                
                {/* Delete button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                  className="absolute top-3 right-3 w-7 h-7 bg-black/30 backdrop-blur-md text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      {item.nickname && (
                        <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.15em] truncate">"{item.nickname}"</h4>
                      )}
                      <h3 className="text-base font-bold text-gray-800 truncate">{item.info.commonName}</h3>
                    </div>
                    <span className={`text-[10px] font-bold ${diffColors[diff]} ml-2 shrink-0`}>
                      {diff}
                    </span>
                  </div>
                  <p className="text-[10px] italic text-gray-400 mb-3 truncate">{item.info.scientificName}</p>
                  
                  <div className="flex items-center gap-3 mb-3 text-[10px] text-gray-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-calendar-check text-emerald-400"></i>
                      {new Date(item.lastWatered).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-repeat text-blue-400"></i>
                      Every {item.info.wateringFrequencyDays || '?'}d
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onWater(item.id); }}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        due 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      <i className="fa-solid fa-droplet text-[10px]"></i>
                      {due ? 'Water Now' : 'Watered'}
                    </button>
                    <button 
                      onClick={() => onSelect(item.info, item.imageUrl, item.nickname)}
                      className="w-10 h-10 bg-gray-50 text-gray-500 rounded-xl flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    >
                      <i className="fa-solid fa-eye text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GardenList;
