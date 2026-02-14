import React from 'react';
import InteractiveBodyDiagram from './body_diagram';

interface PatientData {
  patient_name?: string;
  date?: string;
  weight?: string;
  incident?: string;
  age?: string;
  gender?: 'male' | 'female';
  dob?: string;
  poc?: string;
  priority?: 'red' | 'yellow' | 'green';
  medical?: boolean;
  trauma?: boolean;
  cardiac?: boolean;
  firstaid?: boolean;
  chief_complaint?: string;
  noi_moi?: string;
  ss?: string;
  
  // Vitals data
  vitals?: Array<{
    time?: string;
    loc?: string;
    pulse?: string;
    bp?: string;
    rr?: string;
    o2sat?: string;
    bgl?: string;
    pain?: string;
  }>;
  
  // Consciousness
  loc_no?: boolean;
  loc_yes?: boolean;
  loc_minutes?: string;
  
  // Medications
  medications?: Array<{
    time?: string;
    medication?: string;
    route?: string;
    response?: string;
  }>;
  
  // Signatures
  patient_signature?: string;
  patient_sig_date?: string;
  witness_signature?: string;
  witness_sig_date?: string;
  receiving_signature?: string;
  receiving_date?: string;
  ems_provider_signature?: string;
  ems_provider_date?: string;
  
  // Transfer of Care
  hospital_ed?: boolean;
  als_medical?: boolean;
  als_ground?: boolean;
  bls?: boolean;
  als_air?: boolean;
  other_transfer?: boolean;
  other_specify?: string;
}

interface PatientCareReportProps {
  data?: PatientData;
  editable?: boolean;
  useHandwriting?: boolean;
}

const PatientCareReport: React.FC<PatientCareReportProps> = ({ 
  data = {}, 
  editable = true,
  useHandwriting = false 
}) => {
  // Ensure we have default arrays for vitals and medications
  const vitals = data.vitals || [{}, {}, {}, {}];
  const medications = data.medications || [{}, {}, {}];

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Kalam:wght@300;400;700&family=Patrick+Hand&family=Permanent+Marker&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .form-container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border: 3px solid #000;
          font-family: ${useHandwriting ? "'Kalam', cursive" : 'Arial, sans-serif'};
          color:black;
        }
        
        .handwriting-input {
          font-family: 'Kalam', cursive !important;
          font-weight: 400;
        }
        
        .handwriting-signature {
          font-family: 'Caveat', cursive !important;
          font-size: 16px !important;
          font-weight: 700;
        }
        
        .header {
          display: grid;
          grid-template-columns: 100px 1fr 100px;
          border-bottom: 3px solid #000;
          align-items: center;
        }
        
        .logo {
          border-right: 3px solid #000;
          padding: 20px;
          text-align: center;
          font-size: 60px;
        }
        
        .title {
          text-align: center;
          padding: 10px;
        }
        
        .title h1 {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .title p {
          font-size: 11px;
        }
        
        .logo-right {
          border-left: 3px solid #000;
          padding: 20px;
          text-align: center;
          font-size: 60px;
        }
        
        .patient-info {
          display: grid;
          grid-template-columns: 3fr 1fr 1fr;
          border-bottom: 2px solid #000;
        }
        
        .field {
          border-right: 2px solid #000;
          padding: 3px 8px;
          font-size: 11px;
          display: flex;
          align-items: center;
        }
        
        .field:last-child {
          border-right: none;
        }
        
        .field label {
          font-weight: bold;
          margin-right: 5px;
          white-space: nowrap;
        }
        
        .field input[type="text"],
        .field input[type="date"],
        .field input[type="number"] {
          border: none;
          flex: 1;
          padding: 2px;
          font-size: 11px;
          outline: none;
          background: transparent;
        }
        input{
        color:blue;}
        
        .incident-row {
          display: grid;
          grid-template-columns: 3fr 1fr 1.2fr;
          border-bottom: 2px solid #000;
        }
        
        .priority-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          border-bottom: 2px solid #000;
        }
        
        .priority-box {
          border-right: 2px solid #000;
          padding: 3px 8px;
          font-size: 11px;
          display: flex;
          align-items: center;
        }
        
        .priority-box:last-child {
          border-right: none;
        }
        
        .priority-box input[type="checkbox"] {
          margin-right: 5px;
        }
        
        .priority-box label {
          margin: 0;
        }
        
        .category-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1.5fr;
          border-bottom: 2px solid #000;
        }
        
        .category-box {
          border-right: 2px solid #000;
          padding: 3px 8px;
          font-size: 11px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .category-box:last-child {
          border-right: none;
        }
        
        .category-box label {
          display: flex;
          align-items: center;
          margin: 0;
        }
        
        .category-box input[type="checkbox"] {
          margin-right: 5px;
        }
        
        .complaint-row {
          border-bottom: 2px solid #000;
          padding: 3px 8px;
          display: flex;
          align-items: center;
        }
        
        .complaint-row label {
          font-weight: bold;
          font-size: 11px;
          margin-right: 10px;
          white-space: nowrap;
        }
        
        .complaint-row input[type="text"] {
          flex: 1;
          border: none;
          padding: 2px;
          font-size: 11px;
          outline: none;
          background: transparent;
        }
        
        .noi-row {
          border-bottom: 2px solid #000;
          padding: 3px 8px;
          display: flex;
          align-items: center;
        }
        
        .noi-row label {
          font-weight: bold;
          font-size: 11px;
          margin-right: 10px;
          white-space: nowrap;
        }
        
        .noi-row input[type="text"] {
          flex: 1;
          border: none;
          padding: 2px;
          font-size: 11px;
          outline: none;
          background: transparent;
        }
        
        .assessment-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }
        
        .assessment-table th,
        .assessment-table td {
          border: 1px solid #000;
          padding: 2px 4px;
          text-align: center;
          vertical-align: middle;
        }
        
        .assessment-table th {
          background: #f0f0f0;
          font-weight: bold;
          font-size: 10px;
        }
        
        .assessment-table .label-col {
          text-align: left;
          font-weight: normal;
          padding-left: 6px;
        }
        
        .assessment-table input[type="checkbox"] {
          margin: 0 2px;
        }
        
        .vitals-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          border-top: 2px solid #000;
        }
        
        .vitals-table th,
        .vitals-table td {
          border: 1px solid #000;
          padding: 6px 4px;
          text-align: center;
        }
        
        .vitals-table th {
          background: #f0f0f0;
          font-weight: bold;
          font-size: 10px;
        }
        
        .vitals-table input[type="text"] {
          width: 95%;
          border: none;
          text-align: center;
          font-size: 10px;
          outline: none;
          background: transparent;
        }
        
        .bottom-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-top: 2px solid #000;
        }
        
        .body-diagram {
          border-right: 2px solid #000;
          padding: 20px;
          text-align: center;
        }
        
        .body-diagram svg {
          max-width: 100%;
          height: auto;
        }
        
        .right-section {
          display: flex;
          flex-direction: column;
        }
        
        .consciousness-box {
          border-bottom: 2px solid #000;
          padding: 5px 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 10px;
        }
        
        .consciousness-box label {
          font-weight: bold;
          margin-right: 10px;
        }
        
        .medications-table {
          border-bottom: 2px solid #000;
        }
        
        .medications-table table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }
        
        .medications-table th,
        .medications-table td {
          border: 1px solid #000;
          padding: 4px;
          text-align: center;
        }
        
        .medications-table th {
          background: #f0f0f0;
          font-weight: bold;
        }
        
        .medications-table input[type="text"] {
          width: 95%;
          border: none;
          font-size: 10px;
          outline: none;
          background: transparent;
        }
        
        .waiver-section {
          border-bottom: 2px solid #000;
          padding: 8px;
        }
        
        .waiver-section h3 {
          text-align: center;
          font-size: 11px;
          margin-bottom: 6px;
          text-decoration: underline;
          font-weight: bold;
        }
        
        .waiver-section p {
          font-size: 8px;
          line-height: 1.3;
          margin-bottom: 8px;
          text-align: justify;
        }
        
        .signature-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 8px;
        }
        
        .signature-field {
          font-size: 9px;
        }
        
        .signature-field label {
          font-weight: bold;
          display: block;
          margin-bottom: 2px;
        }
        
        .signature-field input[type="text"],
        .signature-field input[type="date"] {
          width: 100%;
          border: none;
          border-bottom: 1px solid #000;
          padding: 1px;
          font-size: 9px;
          outline: none;
          background: transparent;
        }
        
        .transfer-section {
          padding: 8px;
        }
        
        .transfer-section h3 {
          text-align: center;
          font-size: 11px;
          margin-bottom: 6px;
          text-decoration: underline;
          font-weight: bold;
        }
        
        .transfer-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-bottom: 8px;
          font-size: 10px;
        }
        
        .transfer-options label {
          display: flex;
          align-items: center;
        }
        
        .transfer-options input[type="checkbox"] {
          margin-right: 5px;
        }
        
        .transfer-options input[type="text"] {
          border: none;
          border-bottom: 1px solid #999;
          font-size: 10px;
          outline: none;
          background: transparent;
        }
        
        .ems-signatures {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          margin-top: 8px;
        }
        
        .ems-signature {
          font-size: 9px;
        }
        
        .ems-signature label {
          font-weight: bold;
          display: block;
          margin-bottom: 2px;
        }
        
        .ems-signature input[type="text"],
        .ems-signature input[type="date"] {
          width: 100%;
          border: none;
          border-bottom: 1px solid #000;
          padding: 1px;
          font-size: 9px;
          outline: none;
          background: transparent;
        }
        
        @media print {
          .form-container {
            border: 2px solid #000;
          }
        }
      `}</style>

      <div className="form-container">
        {/* Header */}
        <div className="header">
          <div className="logo">✷</div>
          <div className="title">
            <h1>Patient Care Report</h1>
            <p>Refer also to IBPS (Pink Section) and Medical Incident Report (B-Line)*</p>
          </div>
          <div className="logo-right">✷</div>
        </div>
        
        {/* Patient Info Row 1 */}
        <div className="patient-info">
          <div className="field">
            <label>Patient Name:</label>
            <input 
              type="text" 
              name="patient_name"
              defaultValue={data.patient_name}
              readOnly={!editable}
              className={useHandwriting ? 'handwriting-input' : ''}
            />
          </div>
          <div className="field">
            <label>Date:</label>
            <input 
              type="date" 
              name="date"
              defaultValue={data.date}
              readOnly={!editable}
            />
          </div>
          <div className="field">
            <label>Weight:</label>
            <input 
              type="text" 
              name="weight"
              defaultValue={data.weight}
              readOnly={!editable}
              className={useHandwriting ? 'handwriting-input' : ''}
            />
          </div>
        </div>
        
        {/* Incident Row */}
        <div className="incident-row">
          <div className="field">
            <label>*Incident Name / Number:</label>
            <input 
              type="text" 
              name="incident"
              defaultValue={data.incident}
              readOnly={!editable}
              className={useHandwriting ? 'handwriting-input' : ''}
            />
          </div>
          <div className="field">
            <label>Age:</label>
            <input 
              type="text" 
              name="age"
              defaultValue={data.age}
              readOnly={!editable}
              className={useHandwriting ? 'handwriting-input' : ''}
            />
          </div>
          <div className="field" style={{ display: 'flex', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="checkbox" 
                name="gender" 
                value="male"
                defaultChecked={data.gender === 'male'}
                disabled={!editable}
                style={{ marginRight: '5px' }}
              /> Male
            </label>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="checkbox" 
                name="gender" 
                value="female"
                defaultChecked={data.gender === 'female'}
                disabled={!editable}
                style={{ marginRight: '5px' }}
              /> Female
            </label>
          </div>
        </div>
        
        {/* Priority Row */}
        <div className="priority-row">
          <div className="priority-box">
            <label>*Evac Priority:</label>
          </div>
          <div className="priority-box">
            <input 
              type="checkbox" 
              name="priority_red" 
              id="priority_red"
              defaultChecked={data.priority === 'red'}
              disabled={!editable}
            />
            <label htmlFor="priority_red">Red / Priority 1</label>
          </div>
          <div className="priority-box">
            <input 
              type="checkbox" 
              name="priority_yellow" 
              id="priority_yellow"
              defaultChecked={data.priority === 'yellow'}
              disabled={!editable}
            />
            <label htmlFor="priority_yellow">Yellow / Priority 2</label>
          </div>
          <div className="priority-box">
            <input 
              type="checkbox" 
              name="priority_green" 
              id="priority_green"
              defaultChecked={data.priority === 'green'}
              disabled={!editable}
            />
            <label htmlFor="priority_green">Green / Priority 3</label>
          </div>
        </div>
        
        {/* Category Row */}
        <div className="category-row">
          <div className="category-box">
            <label>
              <input 
                type="checkbox" 
                name="medical" 
                id="medical"
                defaultChecked={data.medical}
                disabled={!editable}
              /> Medical
            </label>
            <label>
              <input 
                type="checkbox" 
                name="trauma" 
                id="trauma"
                defaultChecked={data.trauma}
                disabled={!editable}
              /> Trauma
            </label>
          </div>
          <div className="category-box">
            <label>
              <input 
                type="checkbox" 
                name="cardiac" 
                id="cardiac"
                defaultChecked={data.cardiac}
                disabled={!editable}
              /> Cardiac
            </label>
            <label>
              <input 
                type="checkbox" 
                name="firstaid" 
                id="firstaid"
                defaultChecked={data.firstaid}
                disabled={!editable}
              /> First Aid
            </label>
          </div>
          <div className="category-box" style={{ flexDirection: 'row', alignItems: 'center' }}>
            <label style={{ fontWeight: 'bold', marginRight: '5px' }}>DOB:</label>
            <input 
              type="date" 
              name="dob"
              defaultValue={data.dob}
              readOnly={!editable}
              style={{ flex: 1, border: 'none', fontSize: '11px', outline: 'none', background: 'transparent' }}
            />
          </div>
        </div>
        
        <div style={{ borderBottom: '2px solid #000', padding: '3px 8px', display: 'flex', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', fontSize: '11px', marginRight: '5px' }}>POC:</label>
          <input 
            type="text" 
            name="poc"
            defaultValue={data.poc}
            readOnly={!editable}
            className={useHandwriting ? 'handwriting-input' : ''}
            style={{ flex: 1, border: 'none', fontSize: '11px', outline: 'none', background: 'transparent' }}
          />
        </div>
        
        {/* Chief Complaint */}
        <div className="complaint-row">
          <label>Chief complaint:</label>
          <input 
            type="text" 
            name="chief_complaint"
            defaultValue={data.chief_complaint}
            readOnly={!editable}
            className={useHandwriting ? 'handwriting-input' : ''}
          />
        </div>
        
        {/* NOI / MOI */}
        <div className="noi-row">
          <label>*NOI / MOI:</label>
          <input 
            type="text" 
            name="noi_moi"
            defaultValue={data.noi_moi}
            readOnly={!editable}
            className={useHandwriting ? 'handwriting-input' : ''}
          />
        </div>
        
        {/* S/S Row */}
        <div style={{ borderBottom: '2px solid #000', padding: '3px 8px', display: 'flex', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', fontSize: '11px', marginRight: '10px', whiteSpace: 'nowrap' }}>S / S:</label>
          <input 
            type="text" 
            name="ss"
            defaultValue={data.ss}
            readOnly={!editable}
            className={useHandwriting ? 'handwriting-input' : ''}
            style={{ flex: 1, border: 'none', padding: '2px', fontSize: '11px', outline: 'none', background: 'transparent' }}
          />
        </div>
        
        {/* Assessment Table */}
        <table className="assessment-table">
          <thead>
            <tr>
              <th rowSpan={2} style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', width: '20px', padding: '4px 2px' }}>
                A<br />B<br />C
              </th>
              <th>Patent</th>
              <th>NPA</th>
              <th>OPA</th>
              <th>Advanced Airway</th>
              <th>Glasgow</th>
              <th>Eye:</th>
              <th>Verbal:</th>
              <th>Motor:</th>
              <th>Total</th>
            </tr>
            <tr>
              <th>O2</th>
              <th>Canula</th>
              <th>NRB</th>
              <th>BVM</th>
              <th>Coma<br />Scale:</th>
              <th>4 3 2 1</th>
              <th>5 4 3 2 1</th>
              <th>6 5 4 3 2 1</th>
              <th>(E+V+M):</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan={5} style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', padding: '4px 2px', fontWeight: 'bold' }}>
                Patient Assessment Findings
              </td>
              <td className="label-col">Radial</td>
              <td className="label-col">Carotid</td>
              <td className="label-col">Skin Moisture</td>
              <td className="label-col">Color</td>
              <td className="label-col">Respiratory</td>
              <td colSpan={2} className="label-col">Pulse</td>
              <td colSpan={2} className="label-col">Pupils</td>
              <td></td>
            </tr>
            <tr>
              <td className="label-col">Speech</td>
              <td></td>
              <td className="label-col">Normal</td>
              <td className="label-col">Normal</td>
              <td className="label-col">Clear</td>
              <td colSpan={2} className="label-col">Normal</td>
              <td colSpan={2} className="label-col">Equal</td>
              <td>L / R</td>
            </tr>
            <tr>
              <td className="label-col">Coherent</td>
              <td></td>
              <td className="label-col">Dry</td>
              <td className="label-col">Pale</td>
              <td className="label-col">Wet</td>
              <td>L / R</td>
              <td className="label-col">Rapid</td>
              <td colSpan={2} className="label-col">Dilated</td>
              <td>L / R</td>
            </tr>
            <tr>
              <td className="label-col">Incoherent</td>
              <td></td>
              <td className="label-col">Moist / Clammy</td>
              <td className="label-col">Bluish</td>
              <td className="label-col">Decreased</td>
              <td>L / R</td>
              <td className="label-col">Weak/Slow</td>
              <td colSpan={2} className="label-col">Equal</td>
              <td>L / R</td>
            </tr>
            <tr>
              <td className="label-col">*Slurred*</td>
              <td className="label-col">Silent</td>
              <td className="label-col">Profuse Sweating</td>
              <td className="label-col">Flushed / Red</td>
              <td className="label-col">Absent</td>
              <td></td>
              <td className="label-col">Absent</td>
              <td colSpan={2} className="label-col">Unequal</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        
        {/* Vitals Table */}
        <table className="vitals-table">
          <thead>
            <tr>
              <th colSpan={8} style={{ textAlign: 'left', padding: '3px 8px', fontSize: '11px', background: 'white', borderBottom: '1px solid #000' }}>
                Vitals
              </th>
            </tr>
            <tr>
              <th>Time</th>
              <th>LOC / AVPU</th>
              <th>Pulse</th>
              <th>BP</th>
              <th>RR / Quality</th>
              <th>O2 Saturation</th>
              <th>BGL</th>
              <th>Pain</th>
            </tr>
          </thead>
          <tbody>
            {vitals.map((vital, index) => (
              <tr key={index}>
                <td>
                  <input 
                    type="text" 
                    name={`time${index + 1}`}
                    defaultValue={vital.time}
                    readOnly={!editable}
                    className={useHandwriting ? 'handwriting-input' : ''}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    name={`loc${index + 1}`}
                    defaultValue={vital.loc}
                    readOnly={!editable}
                    className={useHandwriting ? 'handwriting-input' : ''}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    name={`pulse${index + 1}`}
                    defaultValue={vital.pulse}
                    readOnly={!editable}
                    className={useHandwriting ? 'handwriting-input' : ''}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    name={`bp${index + 1}`}
                    defaultValue={vital.bp}
                    readOnly={!editable}
                    className={useHandwriting ? 'handwriting-input' : ''}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    name={`rr${index + 1}`}
                    defaultValue={vital.rr}
                    readOnly={!editable}
                    className={useHandwriting ? 'handwriting-input' : ''}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    name={`o2sat${index + 1}`}
                    defaultValue={vital.o2sat}
                    readOnly={!editable}
                    className={useHandwriting ? 'handwriting-input' : ''}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    name={`bgl${index + 1}`}
                    defaultValue={vital.bgl}
                    readOnly={!editable}
                    className={useHandwriting ? 'handwriting-input' : ''}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    name={`pain${index + 1}`}
                    defaultValue={vital.pain}
                    readOnly={!editable}
                    className={useHandwriting ? 'handwriting-input' : ''}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Bottom Section */}
        <div className="bottom-section">
          {/* Body Diagram */}
          <div className="body-diagram">
           <InteractiveBodyDiagram/>
          </div>
          
          {/* Right Section */}
          <div className="right-section">
            {/* Loss of Consciousness */}
            <div className="consciousness-box">
              <div>
                <label>Loss of Consciousness:</label>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <label>
                  <input 
                    type="checkbox" 
                    name="loc_no"
                    defaultChecked={data.loc_no}
                    disabled={!editable}
                  /> No
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="loc_yes"
                    defaultChecked={data.loc_yes}
                    disabled={!editable}
                  /> Yes
                </label>
                <span style={{ marginLeft: '10px' }}>
                  Minutes: <input 
                    type="text" 
                    name="loc_minutes"
                    defaultValue={data.loc_minutes}
                    readOnly={!editable}
                    className={useHandwriting ? 'handwriting-input' : ''}
                    style={{ width: '60px', border: 'none', borderBottom: '1px solid #999', outline: 'none', background: 'transparent' }}
                  />
                </span>
              </div>
            </div>
            
            {/* Medications Table */}
            <div className="medications-table">
              <table>
                <thead>
                  <tr>
                    <th colSpan={4}>Medications:</th>
                  </tr>
                  <tr>
                    <th>Time</th>
                    <th>Medication</th>
                    <th>Route</th>
                    <th>Response</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((med, index) => (
                    <tr key={index}>
                      <td>
                        <input 
                          type="text" 
                          name={`med_time${index + 1}`}
                          defaultValue={med.time}
                          readOnly={!editable}
                          className={useHandwriting ? 'handwriting-input' : ''}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          name={`medication${index + 1}`}
                          defaultValue={med.medication}
                          readOnly={!editable}
                          className={useHandwriting ? 'handwriting-input' : ''}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          name={`route${index + 1}`}
                          defaultValue={med.route}
                          readOnly={!editable}
                          className={useHandwriting ? 'handwriting-input' : ''}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          name={`response${index + 1}`}
                          defaultValue={med.response}
                          readOnly={!editable}
                          className={useHandwriting ? 'handwriting-input' : ''}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Waiver Section */}
            <div className="waiver-section">
              <h3>Waiver of Treatment / Patient Refusal</h3>
              <p>
                I acknowledge that the EMS provider has informed that my medical condition requires 
                immediate treatment and/or transport to a physician and that with refusing 
                further medical or medical treatment there is a risk of serious injury, illness, or 
                death and I hereby refuse such treatment and/or transport and release EMS 
                personnel, their home agency, and their advising physician from all 
                responsibility regarding any ill effects which may result from this decision.
              </p>
              <div className="signature-row">
                <div className="signature-field">
                  <label>Patient Signature:</label>
                  <input 
                    type="text" 
                    name="patient_signature"
                    defaultValue={data.patient_signature}
                    readOnly={!editable}
                    className={useHandwriting ? 'handwriting-signature' : ''}
                  />
                  <label style={{ marginTop: '5px' }}>Date:</label>
                  <input 
                    type="date" 
                    name="patient_sig_date"
                    defaultValue={data.patient_sig_date}
                    readOnly={!editable}
                  />
                </div>
                <div className="signature-field">
                  <label>Witness Signature:</label>
                  <input 
                    type="text" 
                    name="witness_signature"
                    defaultValue={data.witness_signature}
                    readOnly={!editable}
                    className={useHandwriting ? 'handwriting-signature' : ''}
                  />
                  <label style={{ marginTop: '5px' }}>Date:</label>
                  <input 
                    type="date" 
                    name="witness_sig_date"
                    defaultValue={data.witness_sig_date}
                    readOnly={!editable}
                  />
                </div>
              </div>
            </div>
            
            {/* Transfer of Care */}
            <div className="transfer-section">
              <h3>Transfer of Care</h3>
              <div className="transfer-options">
                <label>
                  <input 
                    type="checkbox" 
                    name="hospital_ed"
                    defaultChecked={data.hospital_ed}
                    disabled={!editable}
                  /> Hospital ED
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="als_medical"
                    defaultChecked={data.als_medical}
                    disabled={!editable}
                  /> ALS - Medical
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="als_ground"
                    defaultChecked={data.als_ground}
                    disabled={!editable}
                  /> ALS - Ground
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="bls"
                    defaultChecked={data.bls}
                    disabled={!editable}
                  /> BLS
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="als_air"
                    defaultChecked={data.als_air}
                    disabled={!editable}
                  /> ALS - Air
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="other_transfer"
                    defaultChecked={data.other_transfer}
                    disabled={!editable}
                  /> Other (Specify): 
                  <input 
                    type="text" 
                    name="other_specify"
                    defaultValue={data.other_specify}
                    readOnly={!editable}
                    className={useHandwriting ? 'handwriting-input' : ''}
                    style={{ width: '100px', border: 'none', borderBottom: '1px solid #999', marginLeft: '5px', outline: 'none', background: 'transparent' }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: '8px', fontSize: '9px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>Receiving Signature:</label>
                <input 
                  type="text" 
                  name="receiving_signature"
                  defaultValue={data.receiving_signature}
                  readOnly={!editable}
                  className={useHandwriting ? 'handwriting-signature' : ''}
                  style={{ width: '100%', border: 'none', borderBottom: '1px solid #000', padding: '1px', fontSize: '9px', outline: 'none', background: 'transparent' }}
                />
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '2px', marginTop: '4px' }}>Date:</label>
                <input 
                  type="date" 
                  name="receiving_date"
                  defaultValue={data.receiving_date}
                  readOnly={!editable}
                  style={{ width: '100%', border: 'none', borderBottom: '1px solid #000', padding: '1px', fontSize: '9px', outline: 'none', background: 'transparent' }}
                />
              </div>
              <div className="ems-signatures">
                <div className="ems-signature">
                  <label>EMS Provider Signature:</label>
                  <input 
                    type="text" 
                    name="ems_provider_signature"
                    defaultValue={data.ems_provider_signature}
                    readOnly={!editable}
                    className={useHandwriting ? 'handwriting-signature' : ''}
                  />
                  <label style={{ marginTop: '4px' }}>Date:</label>
                  <input 
                    type="date" 
                    name="ems_provider_date"
                    defaultValue={data.ems_provider_date}
                    readOnly={!editable}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientCareReport;