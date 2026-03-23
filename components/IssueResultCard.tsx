
import React from 'react';
import { PlantIssueInfo } from '../types';

interface IssueResultCardProps {
  issue: PlantIssueInfo;
  imageUrl: string;
}

const IssueResultCard: React.FC<IssueResultCardProps> = ({ issue, imageUrl }) => {
  const severityColors = {
    Low: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: 'fa-circle-info' },
    Moderate: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: 'fa-triangle-exclamation' },
    High: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: 'fa-circle-exclamation' },
  };

  const severity = severityColors[issue.severity];

  const categoryIcons: Record<string, string> = {
    Pest: 'fa-bug',
    Disease: 'fa-virus',
    'Nutrient Deficiency': 'fa-vial',
    Environmental: 'fa-cloud-sun',
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-rose-100 transition-all duration-300">
      <div className="h-64 sm:h-72 overflow-hidden relative">
        <img src={imageUrl} alt={issue.issueName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${severity.bg}/80 ${severity.text}`}>
              <i className={`fa-solid ${severity.icon}`}></i>
              {issue.severity} Severity
            </span>
          </div>
          <h2 className="text-3xl font-bold">{issue.issueName}</h2>
          <p className="opacity-90 text-sm font-medium flex items-center gap-2 mt-1">
            <i className={`fa-solid ${categoryIcons[issue.category] || 'fa-triangle-exclamation'}`}></i>
            {issue.category}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Diagnosis */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-magnifying-glass text-rose-400 text-sm"></i>
            Diagnosis
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm">{issue.description}</p>
        </div>

        {/* Symptoms */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
            <i className="fa-solid fa-list-check text-rose-400"></i>
            Symptoms to Look For
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {issue.symptoms.map((symptom, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 bg-rose-50/50 p-3 rounded-xl">
                <i className="fa-solid fa-circle-check text-rose-300 mt-1 text-[10px] shrink-0"></i>
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Treatments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
            <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2 text-sm">
              <i className="fa-solid fa-leaf text-emerald-500"></i>
              Organic Treatment
            </h4>
            <p className="text-sm text-emerald-800 leading-relaxed">{issue.organicTreatment}</p>
          </div>

          <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm">
              <i className="fa-solid fa-flask text-blue-500"></i>
              Chemical Treatment
            </h4>
            <p className="text-sm text-blue-800 leading-relaxed">{issue.chemicalTreatment}</p>
          </div>
        </div>

        {/* Prevention */}
        <div className="bg-slate-50 p-5 rounded-2xl">
          <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm">
            <i className="fa-solid fa-shield-halved text-slate-500"></i>
            Prevention Tips
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">{issue.prevention}</p>
        </div>
      </div>
    </div>
  );
};

export default IssueResultCard;
