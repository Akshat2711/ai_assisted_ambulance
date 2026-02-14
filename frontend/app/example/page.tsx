
"use client"
import PatientCareReport from '@/components/patient_record/record_doc'
// Example usage in your Next.js page or component
export default function ExamplePage() {
  // Sample data for the patient care report
  const patientData = {
    patient_name: "John Doe",
    date: "2024-02-14",
    weight: "180 lbs",
    incident: "INC-2024-001",
    age: "45",
    gender: "male" as const,
    dob: "1978-06-15",
    poc: "Dr. Smith",
    priority: "yellow" as const,
    medical: true,
    trauma: false,
    cardiac: false,
    firstaid: false,
    chief_complaint: "Chest pain and shortness of breath",
    noi_moi: "Patient reported sudden onset chest pain while at work",
    ss: "Diaphoresis, pale skin, labored breathing",
    
    // Vitals data (multiple readings)
    vitals: [
      {
        time: "14:30",
        loc: "Alert",
        pulse: "88",
        bp: "140/90",
        rr: "22",
        o2sat: "94%",
        bgl: "110",
        pain: "7/10"
      },
      {
        time: "14:45",
        loc: "Alert",
        pulse: "82",
        bp: "135/88",
        rr: "20",
        o2sat: "96%",
        bgl: "108",
        pain: "5/10"
      },
      {
        time: "15:00",
        loc: "Alert",
        pulse: "78",
        bp: "130/85",
        rr: "18",
        o2sat: "98%",
        bgl: "105",
        pain: "3/10"
      },
      {} // Empty row for additional entries
    ],
    
    // Loss of consciousness
    loc_no: true,
    loc_yes: false,
    loc_minutes: "",
    
    // Medications administered
    medications: [
      {
        time: "14:35",
        medication: "Aspirin 325mg",
        route: "PO",
        response: "Good"
      },
      {
        time: "14:40",
        medication: "Nitroglycerin 0.4mg",
        route: "SL",
        response: "Pain decreased"
      },
      {} // Empty row
    ],
    
    // Signatures
    patient_signature: "John Doe",
    patient_sig_date: "2024-02-14",
    witness_signature: "",
    witness_sig_date: "",
    receiving_signature: "Dr. Emily Johnson",
    receiving_date: "2024-02-14",
    ems_provider_signature: "EMT Sarah Williams",
    ems_provider_date: "2024-02-14",
    
    // Transfer of care
    hospital_ed: true,
    als_medical: false,
    als_ground: false,
    bls: false,
    als_air: false,
    other_transfer: false,
    other_specify: ""
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Patient Care Report Example</h1>
      
      {/* Example 1: Editable form with handwriting font */}
      <div style={{ marginBottom: '40px' }}>
        <h2>Editable with Handwriting Font</h2>
        <PatientCareReport 
          data={patientData} 
          editable={true} 
          useHandwriting={true} 
        />
      </div>
      
      {/* Example 2: Read-only form with normal font */}
      <div style={{ marginBottom: '40px' }}>
        <h2>Read-only (for viewing/printing)</h2>
        <PatientCareReport 
          data={patientData} 
          editable={false} 
          useHandwriting={false} 
        />
      </div>
      
      {/* Example 3: Empty form for new entry */}
      <div>
        <h2>New Empty Form</h2>
        <PatientCareReport 
          editable={true} 
          useHandwriting={true} 
        />
      </div>
    </div>
  );
}

// COMPONENT PROPS EXPLANATION:
// 
// data: PatientData object (optional)
//   - Contains all the field values to pre-fill the form
//   - If not provided, form will be empty
//
// editable: boolean (default: true)
//   - true: All fields are editable
//   - false: All fields are read-only (good for viewing/printing)
//
// useHandwriting: boolean (default: false)
//   - true: Uses handwriting-style fonts (Kalam for text, Caveat for signatures)
//   - false: Uses standard Arial font
//
// HANDWRITING FONTS USED:
// - Kalam: For general text input fields (looks like casual handwriting)
// - Caveat: For signature fields (looks like cursive signature)
// - These are loaded from Google Fonts in the component

// HOW TO USE IN YOUR APP:
// 
// 1. Import the component:
//    import PatientCareReport from './PatientCareReport';
//
// 2. Create your data object with the fields you want to fill
//
// 3. Render the component:
//    <PatientCareReport data={yourData} editable={true} useHandwriting={true} />
//
// 4. For printing, you can use window.print() or a print library