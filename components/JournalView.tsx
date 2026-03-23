
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
  const [filter, setFilter] = useState<string>('all');

  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredEntries = filter === 'all' 
    ? sortedEntries 
    : sortedEntries.filter(e => e.category === filter);

  const categoryIcons: Record<string, string> = {
    Growth: 'fa-arrow-up-right-dots',
    Watering: 'fa-droplet',
    Issue: 'fa-triangle-exclamation',
    Observation: 'fa-eye',
  };

  const categoryColors: Record<string, string> = {
    Growth: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Watering: 'bg-blue-50 text-blue-600 border-blue-100',
    Issue: 'bg-rose-50 text-rose-600 border-rose-100',
    Observation: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  const categoryDotColors: Record<string, string> = {
    Growth: 'bg-emerald-500',
    Watering: 'bg-blue-500',
    Issue: 'bg-rose-500',
    Observation: 'bg-amber-500',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Garden Journal</h2>
          <p className="text-sm text-gray-500">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-lg shadow-emerald-200 flex items-center gap-2 hover:bg-emerald-700 transition-all active:scale-[0.98] font-bold text-sm self-start"
        >
          <i className="fa-solid fa-plus"></i>
          New Entry
        </button>
      </div>

      {/* Filter tabs */}
      {entries.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {['all', 'Growth', 'Watering', 'Issue', 'Observation'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : 'bg-white text-gray-500 border border-gray-100 hover:border-emerald-200'
              }`}
            >
              {cat !== 'all' && <i className={`fa-solid ${categoryIcons[cat]}`}></i>}
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      )}

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
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-book-open text-gray-300 text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Start Your Garden Log</h3>
          <p className="text-gray-500 mb-6 max-w-xs mx-auto text-sm">Track growth, watering, issues, and daily observations for every plant.</p>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
          >
            Create First Entry
          </button>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <i className="fa-solid fa-filter text-gray-300 text-3xl mb-3"></i>
          <p className="text-gray-500 text-sm">No {filter} entries yet.</p>
          <button onClick={() => setFilter('all')} className="text-emerald-600 font-bold text-sm mt-2 hover:underline">
            Show all entries
          </button>
        </div>
      ) : (
        <div className="space-y-4 relative">
          <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-gray-100 hidden sm:block"></div>

          {filteredEntries.map((entry) => (
            <div key={entry.id} className="relative sm:pl-14 group">
              <div className={`absolute left-[18px] top-8 w-3 h-3 rounded-full border-[3px] border-white shadow-sm z-10 hidden sm:block ${categoryDotColors[entry.category] || 'bg-gray-400'}`}></div>
              
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-4">
                  {entry.imageUrl && (
                    <div className="w-full sm:w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-gray-100">
                      <img src={entry.imageUrl} alt={entry.plantName} className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${categoryColors[entry.category]}`}>
                            <i className={`fa-solid ${categoryIcons[entry.category]} text-[8px]`}></i>
                            {entry.category}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-gray-800">{entry.plantName}</h4>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <p className="text-[10px] font-semibold text-gray-400">{new Date(entry.date).toLocaleDateString()}</p>
                        <button 
                          onClick={() => onRemoveEntry(entry.id)}
                          className="text-gray-300 hover:text-rose-500 transition-colors"
                        >
                          <i className="fa-solid fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm border-l-2 border-gray-100 pl-3 py-0.5">
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
