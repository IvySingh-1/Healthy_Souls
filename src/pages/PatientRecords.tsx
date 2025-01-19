import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, User, History } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Patient, MedicalRecord } from '../types/database';

export function PatientRecords() {
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [searchAadhar, setSearchAadhar] = useState('');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [aadharNumber, setAadharNumber] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [prescription, setPrescription] = useState('');
  const [treatmentDate, setTreatmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [diagnosis, setDiagnosis] = useState('');

  const searchPatient = async () => {
    if (!searchAadhar) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('aadhar_number', searchAadhar)
        .single();

      if (patientError) throw patientError;

      const { data: recordsData, error: recordsError } = await supabase
        .from('medical_records')
        .select('*')
        .eq('aadhar_number', searchAadhar)
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

  const addPatientRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data: existingPatient, error: patientError } = await supabase
        .from('patients')
        .select('aadhar_number')
        .eq('aadhar_number', aadharNumber)
        .single();

      if (!existingPatient) {
        const { error: createError } = await supabase
          .from('patients')
          .insert([{ aadhar_number: aadharNumber }]);

        if (createError) throw createError;
      }

      const { error: recordError } = await supabase
        .from('medical_records')
        .insert([{
          aadhar_number: aadharNumber,
          doctor_id: user.id,
          treatment_date: new Date(treatmentDate).toISOString(),
          symptoms,
          diagnosis,
          prescription
        }]);

      if (recordError) throw recordError;

      // Reset form
      setShowForm(false);
      setAadharNumber('');
      setSymptoms([]);
      setSymptomInput('');
      setPrescription('');
      setDiagnosis('');
      setTreatmentDate(new Date().toISOString().split('T')[0]);
      
      // If this was the searched patient, refresh the records
      if (searchAadhar === aadharNumber) {
        searchPatient();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSymptom = () => {
    if (symptomInput && !symptoms.includes(symptomInput)) {
      setSymptoms([...symptoms, symptomInput]);
      setSymptomInput('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <FileText className="h-10 w-10 text-blue-400" />
            Patient Records
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Record
          </button>
        </div>

        {/* Search Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <User className="h-6 w-6" />
            Search Patient
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={searchAadhar}
              onChange={(e) => setSearchAadhar(e.target.value)}
              placeholder="Enter Aadhar Card Number"
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
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <History className="h-6 w-6" />
              Medical History
            </h2>
            
            {records.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {records.map((record) => (
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
                No medical records found for this patient.
              </div>
            )}
          </div>
        )}

        {/* Add Record Form */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-semibold mb-6">Add New Record</h2>
            <form onSubmit={addPatientRecord} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Aadhar Card Number
                </label>
                <input
                  type="text"
                  required
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Treatment Date
                </label>
                <input
                  type="date"
                  required
                  value={treatmentDate}
                  onChange={(e) => setTreatmentDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Symptoms</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter a symptom"
                  />
                  <button
                    type="button"
                    onClick={addSymptom}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                {symptoms.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {symptoms.map((symptom, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/30 border border-indigo-500/50"
                      >
                        {symptom}
                        <button
                          type="button"
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

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Diagnosis
                </label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Prescription
                </label>
                <textarea
                  required
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}