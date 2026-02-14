import React from 'react';

export interface ABCAssessment {
  airway?: 
    | 'Patent'
    | 'NPA'
    | 'OPA'
    | 'Advanced Airway'
    | null;

  breathing?: 
    | 'O2'
    | 'Canula'
    | 'NRB'
    | 'BVM'
    | null;

  circulation?: 
    | 'Radial'
    | 'Carotid'
    | 'None'
    | null;

  gcsEye?: 1 | 2 | 3 | 4 | null;
  gcsVerbal?: 1 | 2 | 3 | 4 | 5 | null;
  gcsMotor?: 1 | 2 | 3 | 4 | 5 | 6 | null;
}


interface ABCTableProps {
  values: ABCAssessment;
  onChange: (newValues: ABCAssessment) => void;
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

const ABCTable: React.FC<ABCTableProps> = ({ values, onChange }) => {
  const totalGCS = (values.gcsEye || 0) + (values.gcsVerbal || 0) + (values.gcsMotor || 0);

  const handleToggle = (field: keyof ABCAssessment, value: any) => {
    const isSame = values[field] === value;
    onChange({ ...values, [field]: isSame ? null : value });
  };

  const TextCell = ({ field, value, colSpan = 1, className = "" }: { field: keyof ABCAssessment, value: string, colSpan?: number, className?: string }) => (
    <td
      colSpan={colSpan}
      onClick={() => handleToggle(field, value)}
      className={`border border-black px-1 relative cursor-pointer hover:bg-blue-50 transition-colors select-none ${className}`}
    >
      {value}
      {values[field] === value && <Checkmark />}
    </td>
  );

  // Row 2: The clickable number selectors
  const GcsNumberSelector = ({ field, numbers }: { field: keyof ABCAssessment, numbers: number[] }) => (
    <td className="border border-black px-1 text-center whitespace-nowrap select-none">
      <div className="flex justify-center gap-1.5">
        {numbers.map((num) => (
          <span
            key={num}
            onClick={() => handleToggle(field, num)}
            className="cursor-pointer px-0.5 hover:text-blue-600 font-medium transition-colors"
          >
            {num}
          </span>
        ))}
      </div>
    </td>
  );

  // Row 3: The "Written" value display
  const GcsDisplayBox = ({ val }: { val?: number | null }) => (
    <td className="border border-black px-1 text-center text-blue-600  h-7 ">
      {val || ""}
    </td>
  );

  return (
    <table className="w-full border-collapse border border-black text-[11px] leading-tight font-sans">
      <tbody>
        {/* ROW 1: Labels */}
        <tr className="h-6">
          <td className="border border-black bg-gray-100 text-center font-bold w-6">A</td>
          <TextCell field="airway" value="Patent" className="w-24" />
          <TextCell field="airway" value="NPA" className="w-20" />
          <TextCell field="airway" value="OPA" className="w-20" />
          <TextCell field="airway" value="Advanced Airway" className="w-32" />
          <td rowSpan={3} className="border border-black bg-gray-100 text-center font-bold w-14 leading-[1.1]">
            Glasgow<br />Coma<br />Scale:
          </td>
          <td className="border border-black px-1 text-center font-bold bg-gray-50">Eye:</td>
          <td className="border border-black px-1 text-center font-bold bg-gray-50">Verbal:</td>
          <td className="border border-black px-1 text-center font-bold bg-gray-50">Motor:</td>
          <td rowSpan={2} className="border border-black px-1 text-center font-bold w-20 bg-gray-50">
            Total<br />(E+V+M):
          </td>
        </tr>

        {/* ROW 2: Options and GCS Number Selectors */}
        <tr className="h-6">
          <td className="border border-black bg-gray-100 text-center font-bold">B</td>
          <TextCell field="breathing" value="O2" />
          <TextCell field="breathing" value="Canula" />
          <TextCell field="breathing" value="NRB" />
          <TextCell field="breathing" value="BVM" />
          <GcsNumberSelector field="gcsEye" numbers={[4, 3, 2, 1]} />
          <GcsNumberSelector field="gcsVerbal" numbers={[5, 4, 3, 2, 1]} />
          <GcsNumberSelector field="gcsMotor" numbers={[6, 5, 4, 3, 2, 1]} />
        </tr>

        {/* ROW 3: Options and Written GCS Values */}
        <tr className="h-7">
          <td className="border border-black bg-gray-100 text-center font-bold">C</td>
          <TextCell field="circulation" value="Radial" colSpan={2} className="text-center" />
          <TextCell field="circulation" value="Carotid" className="text-center" />
          <TextCell field="circulation" value="None" className="text-center" />
          
          {/* Values appear here when a number above is clicked */}
          <GcsDisplayBox val={values.gcsEye} />
          <GcsDisplayBox val={values.gcsVerbal} />
          <GcsDisplayBox val={values.gcsMotor} />
          
          <td className="border border-black px-1 text-center  text-xl text-blue-600 bg-white">
            {totalGCS > 0 ? totalGCS : ""}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ABCTable;