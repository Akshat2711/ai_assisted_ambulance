"use client";
import React, { useState } from 'react';

interface BodyPartProps {
  id: string;
  d: string;
  label: string;
  selected: boolean;
  onToggle: (id: string) => void;
}

const BodyPart = ({ id, d, label, selected, onToggle }: BodyPartProps) => (
  <path
    d={d}
    onClick={() => onToggle(id)}
    className={`cursor-pointer transition-all duration-200 stroke-black stroke-[1.2] hover:fill-blue-50 ${
      selected ? 'fill-red-500/50' : 'fill-transparent'
    }`}
  >
    <title>{label}</title>
  </path>
);

const InteractiveBodyDiagram = () => {
  const [burnedRegions, setBurnedRegions] = useState<Set<string>>(new Set());

  const toggleRegion = (id: string) => {
    const newRegions = new Set(burnedRegions);
    if (newRegions.has(id)) {
      newRegions.delete(id);
    } else {
      newRegions.add(id);
    }
    setBurnedRegions(newRegions);
  };

  // Simplified anatomical paths for front and back view
  const bodyPaths = [
    // FRONT VIEW
    { id: 'f-head', label: 'Front Head', d: 'M45,10 q5,-12 10,0 q5,15 -10,15 q-15,0 -10,-15' },
    { id: 'f-chest', label: 'Chest', d: 'M32,30 h36 v25 h-36 z' },
    { id: 'f-abd', label: 'Abdomen', d: 'M32,55 h36 v30 h-36 z' },
    { id: 'f-pelvis', label: 'Pelvis', d: 'M32,85 h36 l-5,15 h-26 z' },
    { id: 'f-arm-l-up', label: 'L Upper Arm', d: 'M18,32 l14,4 l-3,25 l-11,-3 z' },
    { id: 'f-arm-l-low', label: 'L Lower Arm', d: 'M15,57 l4,25 l8,-2 l-3,-23 z' },
    { id: 'f-arm-r-up', label: 'R Upper Arm', d: 'M68,36 l14,-4 l3,25 l-14,3 z' },
    { id: 'f-arm-r-low', label: 'R Lower Arm', d: 'M73,60 l4,23 l8,2 l-4,-25 z' },
    { id: 'f-thigh-l', label: 'L Thigh', d: 'M32,100 l5,45 l12,0 l-2,-45 z' },
    { id: 'f-thigh-r', label: 'R Thigh', d: 'M51,100 l-2,45 l12,0 l5,-45 z' },
    { id: 'f-calf-l', label: 'L Calf', d: 'M37,145 l3,45 l8,0 l-1,-45 z' },
    { id: 'f-calf-r', label: 'R Calf', d: 'M49,145 l-1,45 l8,0 l3,-45 z' },
  ];

  const backPaths = [
    // BACK VIEW
    { id: 'b-head', label: 'Back Head', d: 'M45,10 q5,-12 10,0 q5,15 -10,15 q-15,0 -10,-15' },
    { id: 'b-upper-back', label: 'Upper Back', d: 'M32,30 h36 v30 h-36 z' },
    { id: 'b-lower-back', label: 'Lower Back', d: 'M32,60 h36 v30 h-36 z' },
    { id: 'b-glute', label: 'Glutes', d: 'M32,90 h36 l-5,15 h-26 z' },
    { id: 'b-arm-l-up', label: 'L Upper Arm', d: 'M18,32 l14,4 l-3,25 l-11,-3 z' },
    { id: 'b-arm-r-up', label: 'R Upper Arm', d: 'M68,36 l14,-4 l3,25 l-14,3 z' },
    { id: 'b-leg-l', label: 'L Leg Back', d: 'M32,105 l5,85 l12,0 l-2,-85 z' },
    { id: 'b-leg-r', label: 'R Leg Back', d: 'M51,105 l-2,85 l12,0 l5,-85 z' },
  ];

  return (
    <div className="flex flex-col items-center p-4 bg-white border-r-[3px] border-black h-full">
      <div className="flex justify-around w-full gap-8">
        {/* Front View */}
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase block mb-2 font-sans">Front View</span>
          <svg width="140" height="280" viewBox="0 0 100 200">
            {bodyPaths.map((path) => (
              <BodyPart
                key={path.id}
                {...path}
                selected={burnedRegions.has(path.id)}
                onToggle={toggleRegion}
              />
            ))}
          </svg>
        </div>

        {/* Back View */}
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase block mb-2 font-sans">Back View</span>
          <svg width="140" height="280" viewBox="0 0 100 200">
            {backPaths.map((path) => (
              <BodyPart
                key={path.id}
                {...path}
                selected={burnedRegions.has(path.id)}
                onToggle={toggleRegion}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Region Status Bar */}
      <div className="mt-4 w-full border-t border-black pt-2">
        <label className="text-[9px] font-bold uppercase text-black block mb-1">Marked Burn Regions:</label>
        <div className="min-h-[30px] text-[12px] font-bold text-blue-800 font-mono italic">
          {burnedRegions.size > 0 
            ? Array.from(burnedRegions).map(id => id.replace('-', ' ').toUpperCase()).join(', ') 
            : "No regions marked."}
        </div>
      </div>
    </div>
  );
};

export default InteractiveBodyDiagram;