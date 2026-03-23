
import React from 'react';
import { SavedPlant } from '../types';

interface RemindersOverlayProps {
  reminders: SavedPlant[];
  onWater: (id: string) => void;
  onClose: () => void;
}

const RemindersOverlay: React.FC<RemindersOverlayProps> = ({ reminders, onWater, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full"></div>
          <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          <div className="relative">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <i className="fa-solid fa-droplet text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold">
              {reminders.length === 0 ? 'All Hydrated!' : 'Thirsty Plants!'}
            </h2>
            <p className="text-blue-100 opacity-90 text-sm mt-1">
              {reminders.length === 0 
                ? 'All your plants are well-watered.' 
                : `${reminders.length} ${reminders.length === 1 ? 'plant needs' : 'plants need'} water today.`}
            </p>
          </div>
        </div>
        
        {reminders.length > 0 && (
          <div className="max-h-[50vh] overflow-y-auto p-4 space-y-2">
            {reminders.map(plant => (
              <div key={plant.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all">
                <img src={plant.imageUrl} className="w-12 h-12 rounded-xl object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm truncate">{plant.info.commonName}</h4>
                  <p className="text-[10px] text-gray-500">Every {plant.info.wateringFrequencyDays} days</p>
                </div>
                <button 
                  onClick={() => onWater(plant.id)}
                  className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shrink-0 active:scale-95"
                  title="Mark as watered"
                >
                  <i className="fa-solid fa-check text-sm"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="p-4">
          <button 
            onClick={onClose}
            className="w-full py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all active:scale-[0.98]"
          >
            {reminders.length === 0 ? 'Close' : 'Dismiss for Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemindersOverlay;
