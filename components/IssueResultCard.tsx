
import React from 'react';
import { PlantIssueInfo } from '../types';

interface IssueResultCardProps {
  issue: PlantIssueInfo;
  imageUrl: string;
}

const IssueResultCard: React.FC<IssueResultCardProps> = ({ issue, imageUrl }) => {
  const severityColors = {
    Low: 'bg-blue-100 text-blue-700',
    Moderate: 'bg-orange-100 text-orange-700',
    High: 'bg-red-100 text-red-700',
  };

  const categoryIcons = {
    Pest: 'fa-bug',
    Disease: 'fa-virus',
    'Nutrient Deficiency': 'fa-vial',
    Environmental: 'fa-cloud-sun',
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-rose-100 transition-all duration-300">
      <div className="h-64 overflow-hidden relative">
        <img src={imageUrl} alt={issue.issueName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${severityColors[issue.severity]}`}>
              {issue.severity} Severity
            </span>
          </div>
          <h2 className="text-3xl font-bold">{issue.issueName}</h2>
          <p className="opacity-90 text-sm font-medium flex items-center gap-2">
            <i className={`fa-solid ${categoryIcons[issue.category as keyof typeof categoryIcons] || 'fa-triangle-exclamation'}`}></i>
            {issue.category}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Diagnosis</h3>
          <p className="text-gray-600 leading-relaxed">{issue.description}</p>
        </div>

        <div className="mb-8">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-list-check text-rose-500"></i>
            Symptoms
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {issue.symptoms.map((symptom, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <i className="fa-solid fa-circle-check text-rose-300 mt-1 text-[10px]"></i>
                {symptom}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
            <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-leaf text-emerald-500"></i>
              Organic Treatment
            </h4>
            <p className="text-sm text-emerald-800 leading-relaxed">{issue.organicTreatment}</p>
          </div>

          <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-flask text-blue-500"></i>
              Chemical Treatment
            </h4>
            <p className="text-sm text-blue-800 leading-relaxed">{issue.chemicalTreatment}</p>
          </div>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl">
          <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-slate-500"></i>
            Prevention
          </h4>
          <p className="text-sm text-slate-600 italic">{issue.prevention}</p>
        </div>
      </div>
    </div>
  );
};

export default IssueResultCard;
