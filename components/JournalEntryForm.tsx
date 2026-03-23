
import React, { useState, useRef } from 'react';
import { JournalEntry } from '../types';

interface JournalEntryFormProps {
  onSave: (entry: Omit<JournalEntry, 'id'>) => void;
  onCancel: () => void;
  plantOptions: string[];
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ onSave, onCancel, plantOptions }) => {
  const [plantName, setPlantName] = useState(plantOptions[0] || '');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<JournalEntry['category']>('Observation');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;
    onSave({
      plantName: plantName || 'General Garden',
      note,
      category,
      imageUrl,
      date: new Date().toISOString()
    });
  };

  const categoryConfig: Record<string, { icon: string; color: string }> = {
    Growth: { icon: 'fa-arrow-up-right-dots', color: 'emerald' },
    Watering: { icon: 'fa-droplet', color: 'blue' },
    Issue: { icon: 'fa-triangle-exclamation', color: 'rose' },
    Observation: { icon: 'fa-eye', color: 'amber' },
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">New Journal Entry</h3>
        <button onClick={onCancel} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Plant</label>
          <div className="relative">
            <select 
              value={plantName} 
              onChange={(e) => setPlantName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 appearance-none text-gray-700 text-sm transition-all"
            >
              <option value="">Select a plant...</option>
              {plantOptions.map(p => <option key={p} value={p}>{p}</option>)}
              <option value="General Garden">General Garden</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <i className="fa-solid fa-chevron-down text-xs"></i>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
          <div className="grid grid-cols-2 gap-2">
            {(['Growth', 'Watering', 'Issue', 'Observation'] as const).map(cat => {
              const config = categoryConfig[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    category === cat 
                    ? `bg-${config.color}-600 text-white shadow-lg` 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
                  }`}
                  style={category === cat ? {
                    backgroundColor: config.color === 'emerald' ? '#059669' : config.color === 'blue' ? '#2563eb' : config.color === 'rose' ? '#e11d48' : '#d97706',
                    boxShadow: `0 10px 15px -3px ${config.color === 'emerald' ? 'rgba(5,150,105,0.2)' : config.color === 'blue' ? 'rgba(37,99,235,0.2)' : config.color === 'rose' ? 'rgba(225,29,72,0.2)' : 'rgba(217,119,6,0.2)'}`
                  } : {}}
                >
                  <i className={`fa-solid ${config.icon}`}></i>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="What did you observe today?"
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-gray-700 resize-none text-sm transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Photo (Optional)</label>
          {imageUrl ? (
            <div className="relative rounded-2xl overflow-hidden h-36 group">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setImageUrl(undefined)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-emerald-300 hover:text-emerald-500 hover:bg-emerald-50/30 transition-all"
            >
              <i className="fa-solid fa-camera text-lg"></i>
              <span className="text-xs font-medium">Add Progress Photo</span>
            </button>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        <button
          type="submit"
          disabled={!note}
          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:shadow-none text-sm"
        >
          Save Entry
        </button>
      </form>
    </div>
  );
};

export default JournalEntryForm;
