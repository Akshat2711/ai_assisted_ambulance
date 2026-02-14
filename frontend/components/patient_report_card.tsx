"use client";
import React, { useState } from 'react';
import { Activity, Thermometer, User, ClipboardList } from 'lucide-react';

const PatientCareReport = () => {
  return (
    <div className="max-w-5xl mx-auto p-8 bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl font-mono text-[13px] uppercase tracking-tight">
      
      {/* Header Section */}
      <div className="flex justify-between items-center border-b-2 border-blue-900 pb-4 mb-6">
        <Activity className="text-blue-600" size={32} />
        <div className="text-center">
          <h1 className="text-2xl font-black text-blue-900 tracking-[0.2em]">Patient Care Report</h1>
          <p className="text-[10px] text-slate-400">System ID: RA2311056010161 | Node: Secure-01</p>
        </div>
        <Activity className="text-blue-600" size={32} />
      </div>

      {/* Top Info Grid */}
      <div className="grid grid-cols-12 gap-px bg-slate-200 border border-slate-200 mb-6">
        <div className="col-span-8 bg-white p-3">
          <label className="text-[10px] font-bold text-blue-600 block">Patient Name:</label>
          <input type="text" className="w-full bg-transparent outline-none border-b border-blue-50 focus:border-blue-300 transition-colors py-1" />
        </div>
        <div className="col-span-4 bg-white p-3">
          <label className="text-[10px] font-bold text-blue-600 block">Date:</label>
          <input type="date" className="w-full bg-transparent outline-none py-1" />
        </div>
        
        <div className="col-span-4 bg-white p-3 border-t border-slate-200">
          <label className="text-[10px] font-bold text-blue-600 block">Age:</label>
          <input type="number" className="w-full bg-transparent outline-none py-1" />
        </div>
        <div className="col-span-4 bg-white p-3 border-t border-l border-slate-200">
          <label className="text-[10px] font-bold text-blue-600 block">DOB:</label>
          <input type="text" placeholder="MM/DD/YYYY" className="w-full bg-transparent outline-none py-1" />
        </div>
        <div className="col-span-4 bg-white p-3 border-t border-l border-slate-200 flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="gender" className="accent-blue-600" /> MALE
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="gender" className="accent-blue-600" /> FEMALE
          </label>
        </div>
      </div>

      {/* Chief Complaint Section */}
      <div className="border border-blue-100 bg-blue-50/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList size={16} className="text-blue-600" />
          <h3 className="font-bold text-blue-900">Chief Complaint:</h3>
        </div>
        <textarea 
          className="w-full h-20 bg-transparent border-none outline-none resize-none text-sm p-2 bg-white/50 rounded"
          placeholder="ENTER PATIENT COMPLAINT..."
        ></textarea>
      </div>

      {/* Glasgow Coma Scale & Vitals Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Glasgow Coma Scale */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-blue-900 text-white p-2 font-bold text-center">Glasgow Coma Scale</div>
          <div className="p-3 space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <span>Eye (4-3-2-1)</span>
              <input type="number" max="4" min="1" className="w-12 border border-slate-200 rounded text-center py-1" />
            </div>
            <div className="flex justify-between items-center">
              <span>Verbal (5-4-3-2-1)</span>
              <input type="number" max="5" min="1" className="w-12 border border-slate-200 rounded text-center py-1" />
            </div>
            <div className="flex justify-between items-center">
              <span>Motor (6-5-4-3-2-1)</span>
              <input type="number" max="6" min="1" className="w-12 border border-slate-200 rounded text-center py-1" />
            </div>
          </div>
        </div>

        {/* Patient Signs Quick Check */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 p-2 font-bold text-center border-b border-slate-200">Patient Signs</div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {['Coherent', 'Normal Skin', 'Responsive', 'Stable BP'].map((sign) => (
              <label key={sign} className="flex items-center gap-2 text-[11px] cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
                <input type="checkbox" className="accent-blue-600" /> {sign}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Vitals Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg mb-6">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-blue-900">
              <th className="p-2 border-r border-slate-200">Time</th>
              <th className="p-2 border-r border-slate-200">Pulse</th>
              <th className="p-2 border-r border-slate-200">BP</th>
              <th className="p-2 border-r border-slate-200">RR</th>
              <th className="p-2 border-r border-slate-200">O2 Sat</th>
              <th className="p-2">Pain</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((row) => (
              <tr key={row} className="border-b border-slate-100">
                <td className="p-2 border-r border-slate-100"><input type="text" className="w-full outline-none text-center" placeholder="--:--" /></td>
                <td className="p-2 border-r border-slate-100"><input type="text" className="w-full outline-none text-center" /></td>
                <td className="p-2 border-r border-slate-100"><input type="text" className="w-full outline-none text-center" /></td>
                <td className="p-2 border-r border-slate-100"><input type="text" className="w-full outline-none text-center" /></td>
                <td className="p-2 border-r border-slate-100"><input type="text" className="w-full outline-none text-center" /></td>
                <td className="p-2"><input type="text" className="w-full outline-none text-center" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Controls */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors">Discard</button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Submit Report</button>
      </div>
    </div>
  );
};

export default PatientCareReport;