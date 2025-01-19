import React, { useState } from 'react';
import { Search, AlertCircle, User, History, PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Patient, MedicalRecord } from '../types/database';

export function SymptomChecker() {
  const [aadharNumber, setAadharNumber] = useState('');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPatient = async () => {
    if (!aadharNumber) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('aadhar_number', aadharNumber)
        .single();

      if (patientError) throw patientError;

      const { data: recordsData, error: recordsError } = await supabase
        .from('medical_records')
        .select('*')
        .eq('aadhar_number', aadharNumber)
        .order('treatment_date', { ascending: false });

      if (recordsError) throw recordsError;

      setPatient(patientData);
      setRecords(recordsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSymptom = () => {
    if (newSymptom && !symptoms.includes(newSymptom)) {
      setSymptoms([...symptoms, newSymptom]);
      setNewSymptom('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const filterRecordsBySymptoms = () => {
    if (!symptoms.length) return records;
    return records.filter(record => 
      symptoms.every(symptom => 
        record.symptoms.some(s => 
          s.toLowerCase().includes(symptom.toLowerCase())
        )
      )
    );
  };

  const filteredRecords = filterRecordsBySymptoms();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <AlertCircle className="h-10 w-10" />
          Symptom Checker
        </h1>
        
        {/* Patient Search Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <User className="h-6 w-6" />
            Patient Search
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
              placeholder="Enter Aadhar Number"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={searchPatient}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
              {error}
            </div>
          )}
        </div>

        {patient && (
          <>
            {/* Symptom Input Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <PlusCircle className="h-6 w-6" />
                Add Symptoms
              </h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
                  placeholder="Enter symptoms to filter medical history"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={addSymptom}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 transition-colors"
                >
                  Add
                </button>
              </div>

              {symptoms.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {symptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/30 border border-indigo-500/50"
                    >
                      {symptom}
                      <button
                        onClick={() => removeSymptom(symptom)}
                        className="ml-2 hover:text-indigo-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Medical History Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <History className="h-6 w-6" />
                Medical History
              </h2>
              
              {filteredRecords.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="text-lg font-semibold">
                            {new Date(record.treatment_date).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-white/70 mb-2">Symptoms</h4>
                          <div className="flex flex-wrap gap-2">
                            {record.symptoms.map((symptom, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-indigo-500/20 rounded-full text-xs font-medium"
                              >
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </div>

                        {record.diagnosis && (
                          <div>
                            <h4 className="text-sm font-medium text-white/70 mb-1">Diagnosis</h4>
                            <p className="text-sm">{record.diagnosis}</p>
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-medium text-white/70 mb-1">Prescription</h4>
                          <p className="text-sm whitespace-pre-line">{record.prescription}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-white/60">
                  {symptoms.length > 0 
                    ? "No medical records found matching these symptoms."
                    : "No medical records found for this patient."}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}