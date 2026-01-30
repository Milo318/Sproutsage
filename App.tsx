
import React, { useState, useEffect } from 'react';
import { AppTab, PlantCareInfo, JournalEntry, SavedPlant } from './types';
import PlantIdentifier from './components/PlantIdentifier';
import IssueIdentifier from './components/IssueIdentifier';
import ChatBot from './components/ChatBot';
import GardenList from './components/GardenList';
import PlantCareCard from './components/PlantCareCard';
import JournalView from './components/JournalView';
import RemindersOverlay from './components/RemindersOverlay';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.IDENTIFY);
  const [savedPlants, setSavedPlants] = useState<SavedPlant[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<{ info: PlantCareInfo, imageUrl: string, nickname?: string } | null>(null);
  const [showReminders, setShowReminders] = useState(false);

  // Persistence
  useEffect(() => {
    const storedGarden = localStorage.getItem('sproutsage_garden');
    if (storedGarden) {
      setSavedPlants(JSON.parse(storedGarden));
    }
    const storedJournal = localStorage.getItem('sproutsage_journal');
    if (storedJournal) {
      setJournalEntries(JSON.parse(storedJournal));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sproutsage_garden', JSON.stringify(savedPlants));
  }, [savedPlants]);

  useEffect(() => {
    localStorage.setItem('sproutsage_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  const handleSavePlant = (info: PlantCareInfo, imageUrl: string, nickname: string) => {
    const newEntry: SavedPlant = {
      info,
      imageUrl,
      id: Date.now().toString(),
      lastWatered: new Date().toISOString(),
      nickname: nickname.trim() || undefined
    };
    setSavedPlants(prev => [...prev, newEntry]);
    setActiveTab(AppTab.MY_GARDEN);
  };

  const handleRemovePlant = (id: string) => {
    setSavedPlants(prev => prev.filter(p => p.id !== id));
  };

  const handleWaterPlant = (id: string) => {
    const now = new Date().toISOString();
    setSavedPlants(prev => prev.map(p => p.id === id ? { ...p, lastWatered: now } : p));
    
    // Also log to journal automatically
    const plant = savedPlants.find(p => p.id === id);
    if (plant) {
      const displayName = plant.nickname || plant.info.commonName;
      handleAddJournalEntry({
        plantName: displayName,
        date: now,
        note: `Watered ${displayName}. Keep drinking up!`,
        category: 'Watering'
      });
    }
  };

  const handleAddJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newJournal = {
      ...entry,
      id: Date.now().toString()
    };
    setJournalEntries(prev => [...prev, newJournal]);
  };

  const handleRemoveJournalEntry = (id: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== id));
  };

  const isWaterDue = (plant: SavedPlant) => {
    const last = new Date(plant.lastWatered).getTime();
    const freq = plant.info.wateringFrequencyDays || 7;
    const due = last + (freq * 24 * 60 * 60 * 1000);
    return Date.now() > due;
  };

  const duePlants = savedPlants.filter(isWaterDue);
  const plantNames = savedPlants.map(p => p.nickname || p.info.commonName);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col pb-24 md:pb-0 md:pt-20">
      {showReminders && (
        <RemindersOverlay 
          reminders={duePlants} 
          onWater={handleWaterPlant} 
          onClose={() => setShowReminders(false)} 
        />
      )}

      {/* Desktop Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl z-50 border-b border-emerald-50 hidden md:block">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <i className="fa-solid fa-leaf text-white text-xl"></i>
            </div>
            <h1 className="text-2xl font-extrabold text-emerald-900 tracking-tight">SproutSage</h1>
          </div>
          
          <nav className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-2xl">
            {[
              { id: AppTab.IDENTIFY, label: 'Identify', icon: 'fa-camera' },
              { id: AppTab.DIAGNOSE, label: 'Diagnose', icon: 'fa-stethoscope' },
              { id: AppTab.JOURNAL, label: 'Journal', icon: 'fa-book-open' },
              { id: AppTab.MY_GARDEN, label: 'My Garden', icon: 'fa-seedling' },
              { id: AppTab.CHAT, label: 'Expert Chat', icon: 'fa-comment-dots' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedPlant(null); }}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  activeTab === tab.id 
                  ? 'bg-white text-emerald-700 shadow-sm' 
                  : 'text-gray-500 hover:text-emerald-600'
                }`}
              >
                <i className={`fa-solid ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
             <button 
               onClick={() => setShowReminders(true)}
               className="relative w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all"
             >
                <i className="fa-solid fa-bell"></i>
                {duePlants.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {duePlants.length}
                  </span>
                )}
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-white p-4 sticky top-0 z-50 border-b border-emerald-50 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-leaf text-white text-sm"></i>
            </div>
            <h1 className="text-lg font-bold text-emerald-900">SproutSage</h1>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={() => setShowReminders(true)}
               className="text-gray-400 relative"
             >
               <i className="fa-solid fa-bell"></i>
               {duePlants.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
                    {duePlants.length}
                  </span>
                )}
             </button>
          </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {selectedPlant ? (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <button 
              onClick={() => setSelectedPlant(null)}
              className="mb-6 flex items-center gap-2 text-emerald-700 font-bold hover:underline"
            >
              <i className="fa-solid fa-chevron-left"></i>
              Back to Garden
            </button>
            <PlantCareCard 
              plant={selectedPlant.info} 
              imageUrl={selectedPlant.imageUrl} 
              nickname={selectedPlant.nickname}
            />
          </div>
        ) : (
          <>
            {activeTab === AppTab.IDENTIFY && (
              <PlantIdentifier 
                onPlantSaved={handleSavePlant} 
                savedPlants={savedPlants.map(p => p.info)} 
              />
            )}
            {activeTab === AppTab.DIAGNOSE && (
              <IssueIdentifier />
            )}
            {activeTab === AppTab.JOURNAL && (
              <JournalView 
                entries={journalEntries} 
                onAddEntry={handleAddJournalEntry} 
                onRemoveEntry={handleRemoveJournalEntry}
                plantOptions={plantNames}
              />
            )}
            {activeTab === AppTab.MY_GARDEN && (
              <GardenList 
                plants={savedPlants} 
                onSelect={(info, imageUrl, nickname) => setSelectedPlant({ info, imageUrl, nickname })}
                onRemove={handleRemovePlant}
                onWater={handleWaterPlant}
              />
            )}
            {activeTab === AppTab.CHAT && <ChatBot />}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-emerald-50 px-2 py-4 flex justify-between items-center z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        {[
          { id: AppTab.IDENTIFY, icon: 'fa-camera', label: 'Scan' },
          { id: AppTab.DIAGNOSE, icon: 'fa-stethoscope', label: 'Heal' },
          { id: AppTab.JOURNAL, icon: 'fa-book-open', label: 'Notes' },
          { id: AppTab.MY_GARDEN, icon: 'fa-seedling', label: 'Garden' },
          { id: AppTab.CHAT, icon: 'fa-comment-dots', label: 'Chat' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSelectedPlant(null); }}
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${
              activeTab === tab.id ? 'text-emerald-600 scale-105' : 'text-gray-400'
            }`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              activeTab === tab.id ? (tab.id === AppTab.DIAGNOSE ? 'bg-rose-50' : 'bg-emerald-50') : ''
            }`}>
              <i className={`fa-solid ${tab.icon} text-lg ${activeTab === tab.id && tab.id === AppTab.DIAGNOSE ? 'text-rose-600' : ''}`}></i>
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-wider ${activeTab === tab.id && tab.id === AppTab.DIAGNOSE ? 'text-rose-600' : ''}`}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
