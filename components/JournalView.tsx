
import React, { useState } from 'react';
import { JournalEntry } from '../types';
import JournalEntryForm from './JournalEntryForm';

interface JournalViewProps {
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  onRemoveEntry: (id: string) => void;
  plantOptions: string[];
}

const JournalView: React.FC<JournalViewProps> = ({ entries, onAddEntry, onRemoveEntry, plantOptions }) => {
  const [isAdding, setIsAdding] = useState(false);

  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const categoryIcons = {
    Growth: 'fa-arrow-up-right-dots text-emerald-500',
    Watering: 'fa-droplet text-blue-500',
    Issue: 'fa-triangle-exclamation text-rose-500',
    Observation: 'fa-eye text-amber-500',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Garden Journal</h2>
          <p className="text-sm text-gray-500">Track your progress and observations</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-emerald-600 text-white w-12 h-12 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center hover:bg-emerald-700 transition-all active:scale-90"
        >
          <i className="fa-solid fa-plus text-xl"></i>
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <JournalEntryForm 
              plantOptions={plantOptions}
              onCancel={() => setIsAdding(false)}
              onSave={(entry) => {
                onAddEntry(entry);
                setIsAdding(false);
              }}
            />
          </div>
        </div>
      )}

      {sortedEntries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-book-open text-gray-300 text-4xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No entries yet</h3>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Start logging your garden's growth and daily care activities.</p>
          <button 
            onClick={() => setIsAdding(true)}
            className="text-emerald-700 font-bold hover:underline"
          >
            Create your first log
          </button>
        </div>
      ) : (
        <div className="space-y-6 relative">
          {/* Vertical line for timeline */}
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-100 hidden sm:block"></div>

          {sortedEntries.map((entry) => (
            <div key={entry.id} className="relative pl-0 sm:pl-16 group">
              {/* Timeline marker */}
              <div className="absolute left-4 top-8 w-4 h-4 rounded-full border-4 border-white bg-emerald-500 shadow-sm z-10 hidden sm:block"></div>
              
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-50 hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                <div className="flex flex-col md:flex-row gap-6">
                  {entry.imageUrl && (
                    <div className="w-full md:w-32 h-32 shrink-0 rounded-2xl overflow-hidden border border-gray-100">
                      <img src={entry.imageUrl} alt={entry.plantName} className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <i className={`fa-solid ${categoryIcons[entry.category]}`}></i>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{entry.category}</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-800">{entry.plantName}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400">{new Date(entry.date).toLocaleDateString()}</p>
                        <button 
                          onClick={() => onRemoveEntry(entry.id)}
                          className="text-gray-300 hover:text-rose-500 transition-colors mt-2"
                        >
                          <i className="fa-solid fa-trash-can text-sm"></i>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm italic border-l-2 border-emerald-100 pl-4 py-1">
                      "{entry.note}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalView;
