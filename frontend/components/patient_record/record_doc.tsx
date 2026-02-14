import { useState } from 'react';
import InteractiveBodyDiagram from './body_diagram';
import PatientSignsTable from './patient_sign_table';
import ABCTable from './abc_table';
//interfaces
import { ABCAssessment } from './abc_table';
import { PatientSigns } from './patient_sign_table';
//service file for report create
import { createReport } from '@/services/report_create_api';




export interface PatientData {
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

  loc_no?: boolean;
  loc_yes?: boolean;
  loc_minutes?: string;

  medications?: Array<{
    time?: string;
    medication?: string;
    route?: string;
    response?: string;
  }>;

  patient_signature?: string;
  patient_sig_date?: string;
  witness_signature?: string;
  witness_sig_date?: string;
  receiving_signature?: string;
  receiving_date?: string;
  ems_provider_signature?: string;
  ems_provider_date?: string;

  hospital_ed?: boolean;
  als_medical?: boolean;
  als_ground?: boolean;
  bls?: boolean;
  als_air?: boolean;
  other_transfer?: boolean;
  other_specify?: string;

  /* NEW — clinical structured sections */
  abc_assessment?: ABCAssessment;
  patient_signs?: PatientSigns;
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


  const [assessment, setAssessment] = useState<PatientSigns>(
    data?.patient_signs ?? {
      speech: null,
      skin: null,
      color: null,
      respiratory: null,
      pulse: null,
      pupils: null
    }
  );

  const [abcData, setAbcData] = useState<ABCAssessment>(
    data?.abc_assessment ?? {
      airway: null,
      breathing: null,
      circulation: null,
      gcsEye: null,
      gcsVerbal: null,
      gcsMotor: null
    }
  );


  return (
    <>
      <style jsx>{`
      @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Kalam:wght@300;400;700&family=Patrick+Hand&family=Permanent+Marker&display=swap');
      .form-container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border: 3px solid #000;
          font-family: 'Arial, sans-serif';
          color:black;
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
      <div className="w-full max-w-4xl bg-white">
            
        {/* SECTION 1: ABC & GCS */}
        <ABCTable values={abcData} onChange={setAbcData} />

        {/* SECTION 2: PATIENT SIGNS */}
        <PatientSignsTable
          signs={assessment} 
          onChange={(newData) => setAssessment(newData)} 
        />
      </div>
        
        {/* Vitals Table */}
        <table className="vitals-table">
          <thead>
            <tr>
              <th colSpan={8} style={{ textAlign: 'left', padding: '3px 8px', fontSize: '11px', background: '#f0f0f0', borderBottom: '1px solid #000' }}>
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
                    name="als_ground"
                    defaultChecked={data.als_ground}
                    disabled={editable}
                  /> ALS - Ground
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="hospital_ed"
                    defaultChecked={data.hospital_ed}
                    disabled={editable}
                  /> Hospital ED
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="als_medical"
                    defaultChecked={data.als_medical}
                    disabled={editable}
                  /> ALS - Medical
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="bls"
                    defaultChecked={data.bls}
                    disabled={editable}
                  /> BLS
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="als_air"
                    defaultChecked={data.als_air}
                    disabled={editable}
                  /> ALS - Air
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    name="other_transfer"
                    defaultChecked={data.other_transfer}
                    disabled={editable}
                  /> Other (Specify): 
                  <input 
                    type="text" 
                    name="other_specify"
                    defaultValue={data.other_specify}
                    readOnly={editable}
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