
import React, { useState } from 'react';
import { PlantCareInfo } from '../types';

interface PlantCareCardProps {
  plant: PlantCareInfo;
  imageUrl?: string;
  onSave?: (nickname: string) => void;
  isSaved?: boolean;
  nickname?: string;
}

const PlantCareCard: React.FC<PlantCareCardProps> = ({ plant, imageUrl, onSave, isSaved, nickname }) => {
  const [localNickname, setLocalNickname] = useState('');

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100 transition-all duration-300 hover:shadow-2xl">
      {imageUrl && (
        <div className="h-64 overflow-hidden relative">
          <img src={imageUrl} alt={plant.commonName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
             {nickname && <h3 className="text-emerald-300 font-bold uppercase tracking-widest text-xs mb-1">"{nickname}"</h3>}
             <h2 className="text-3xl font-bold">{plant.commonName}</h2>
             <p className="italic opacity-90 text-sm font-medium">{plant.scientificName}</p>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {!imageUrl && (
           <div className="mb-6">
             {nickname && <h3 className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-1">"{nickname}"</h3>}
             <h2 className="text-3xl font-bold text-emerald-900">{plant.commonName}</h2>
             <p className="italic text-emerald-600 font-medium">{plant.scientificName}</p>
           </div>
        )}

        <p className="text-gray-600 mb-8 leading-relaxed">
          {plant.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
              <i className="fa-solid fa-droplet"></i>
            </div>
            <div>
              <h4 className="font-bold text-blue-900">Watering</h4>
              <p className="text-sm text-blue-700">{plant.watering}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
              <i className="fa-solid fa-sun"></i>
            </div>
            <div>
              <h4 className="font-bold text-amber-900">Light</h4>
              <p className="text-sm text-amber-700">{plant.light}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-2xl">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
              <i className="fa-solid fa-temperature-half"></i>
            </div>
            <div>
              <h4 className="font-bold text-orange-900">Temperature</h4>
              <p className="text-sm text-orange-700">{plant.temperature}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-2xl">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
              <i className="fa-solid fa-seedling"></i>
            </div>
            <div>
              <h4 className="font-bold text-emerald-900">Soil</h4>
              <p className="text-sm text-emerald-700">{plant.soil}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-5 rounded-2xl">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-vial-circle-check text-emerald-500"></i>
              Fertilizer
            </h4>
            <p className="text-sm text-slate-600">{plant.fertilizer}</p>
          </div>

          <div className="bg-red-50 p-5 rounded-2xl">
            <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-bug text-red-500"></i>
              Potential Pests
            </h4>
            <div className="flex flex-wrap gap-2">
              {plant.pests.map((pest, i) => (
                <span key={i} className="px-3 py-1 bg-white border border-red-100 text-red-700 rounded-full text-xs font-semibold">
                  {pest}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 p-5 rounded-2xl border-l-4 border-purple-400">
            <h4 className="font-bold text-purple-800 mb-1">Did you know?</h4>
            <p className="text-sm text-purple-700 italic">"{plant.funFact}"</p>
          </div>
        </div>

        {onSave && !isSaved && (
          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Give it a nickname (Optional)</label>
              <input 
                type="text" 
                value={localNickname}
                onChange={(e) => setLocalNickname(e.target.value)}
                placeholder="e.g. Fernie Sanders, Sir Grows-a-lot..."
                className="w-full px-5 py-3 rounded-2xl border border-emerald-100 outline-none focus:border-emerald-500 text-gray-700 bg-emerald-50/30"
              />
            </div>
            <button 
              onClick={() => onSave(localNickname)}
              className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 active:scale-95"
            >
              <i className="fa-solid fa-plus"></i>
              Add to My Garden
            </button>
          </div>
        )}

        {isSaved && (
          <div className="mt-8 w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 bg-gray-100 text-gray-400 cursor-not-allowed">
            <i className="fa-solid fa-check"></i>
            Already in Garden
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantCareCard;
