
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
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-blue-600 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <i className="fa-solid fa-droplet text-3xl"></i>
          </div>
          <h2 className="text-3xl font-bold">Thirsty Plants!</h2>
          <p className="text-blue-100 opacity-90">{reminders.length} {reminders.length === 1 ? 'plant needs' : 'plants need'} attention today.</p>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
          {reminders.map(plant => (
            <div key={plant.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all">
              <img src={plant.imageUrl} className="w-14 h-14 rounded-xl object-cover" alt="" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">{plant.info.commonName}</h4>
                <p className="text-xs text-gray-500 italic">Every {plant.info.wateringFrequencyDays} days</p>
              </div>
              <button 
                onClick={() => onWater(plant.id)}
                className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                title="Mark as watered"
              >
                <i className="fa-solid fa-check"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="p-6 pt-0">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
          >
            Dismiss for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemindersOverlay;
