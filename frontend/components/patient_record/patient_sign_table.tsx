import React from 'react';

// Define the shape of the signs object
export interface PatientSigns {
  speech?: 'Coherent' | 'Incoherent' | 'Slurred' | 'Silent' | null;

  skin?: 
    | 'Normal'
    | 'Dry'
    | 'Moist / Clammy'
    | 'Profuse Sweating'
    | null;

  color?: 
    | 'Normal'
    | 'Pale'
    | 'Bluish'
    | 'Flushed / Red'
    | null;

  respiratory?: 
    | 'Clear'
    | 'Wet'
    | 'Decreased'
    | 'Absent'
    | null;

  pulse?: 
    | 'Normal'
    | 'Rapid'
    | 'Weak/Slow'
    | 'Absent'
    | null;

  pupils?: 
    | 'Reactive'
    | 'Dilated'
    | 'Equal'
    | 'Unequal'
    | null;

  [key: string]: string | null | undefined;
}


interface PatientSignsTableProps {
  signs: PatientSigns;
  onChange: (newSigns: PatientSigns) => void;
}

// Define props for the internal Cell component
interface CellProps {
  category: string;
  value: string;
  label?: string;      // Made optional with ?
  colSpan?: number;    // Made optional with ?
  className?: string;  // Made optional with ?
}

const Checkmark = () => (
  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 pointer-events-none select-none">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  </span>
);


const PatientSignsTable: React.FC<PatientSignsTableProps> = ({ signs = {}, onChange }) => {
  
  const handleToggle = (category: string, value: string) => {
    const newValue = signs[category] === value ? null : value;
    onChange({ ...signs, [category]: newValue });
  };

  // Internal component with explicit optional props
  const Cell: React.FC<CellProps> = ({ category, value, label, colSpan = 1, className = "" }) => {
    const isSelected = signs[category] === value;
    return (
      <td
        colSpan={colSpan}
        onClick={() => handleToggle(category, value)}
        className={`border border-black px-1 relative cursor-pointer hover:bg-blue-50 transition-colors select-none ${className}`}
      >
        {label || value} {/* Fallback to value if label is undefined */}
        {isSelected && <Checkmark />}
      </td>
    );
  };

  return (
      <table className="w-full border-collapse text-[11px] leading-tight font-sans">
        <tbody>
          <tr className="bg-gray-100 font-bold text-left h-5">
            <td rowSpan={5} className="border border-black text-center align-middle w-6" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              Patient Signs
            </td>
            <td className="border border-black px-1 w-1/6">Speech</td>
            <td className="border border-black px-1 w-1/6">Skin Moisture</td>
            <td className="border border-black px-1 w-1/6">Color</td>
            <td className="border border-black px-1 w-1/6" colSpan={2}>Respiratory</td>
            <td className="border border-black px-1 w-1/6">Pulse</td>
            <td className="border border-black px-1 w-1/6" colSpan={2}>Pupils</td>
          </tr>

          <tr className="h-6">
            <Cell category="speech" value="Coherent" />
            <Cell category="skin" value="Normal" />
            <Cell category="color" value="Normal" />
            <Cell category="respiratory" value="Clear" />
            <td className="border border-black px-1 text-center text-[9px] w-8 bg-gray-50">L / R</td>
            <Cell category="pulse" value="Normal" />
            <Cell category="pupils" value="Reactive" />
            <td className="border border-black px-1 text-center text-[9px] w-8 bg-gray-50">L / R</td>
          </tr>

          <tr className="h-6">
            <Cell category="speech" value="Incoherent" />
            <Cell category="skin" value="Dry" />
            <Cell category="color" value="Pale" />
            <Cell category="respiratory" value="Wet" />
            <td className="border border-black px-1 text-center text-[9px] bg-gray-50">L / R</td>
            <Cell category="pulse" value="Rapid" />
            <Cell category="pupils" value="Dilated" />
            <td className="border border-black px-1 text-center text-[9px] bg-gray-50">L / R</td>
          </tr>

          <tr className="h-6">
            <Cell category="speech" value="Slurred" />
            <Cell category="skin" value="Moist / Clammy" />
            <Cell category="color" value="Bluish" />
            <Cell category="respiratory" value="Decreased" />
            <td className="border border-black px-1 text-center text-[9px] bg-gray-50">L / R</td>
            <Cell category="pulse" value="Weak/Slow" />
            <Cell category="pupils" value="Equal" />
            <td className="border border-black px-1 bg-gray-50"></td>
          </tr>

          <tr className="h-6">
            <Cell category="speech" value="Silent" />
            <Cell category="skin" value="Profuse Sweating" />
            <Cell category="color" value="Flushed / Red" />
            <Cell category="respiratory" value="Absent" colSpan={2} />
            <Cell category="pulse" value="Absent" />
            <Cell category="pupils" value="Unequal" />
            <td className="border border-black px-1 bg-gray-50"></td>
          </tr>
        </tbody>
      </table>
    
  );
};

export default PatientSignsTable;