import React, { useState, useEffect } from 'react';
    import { Search, AlertCircle, User, History } from 'lucide-react';
    import { supabase } from '../lib/supabase';
    import type { Patient, MedicalRecord } from '../types/database';

    export function SymptomChecker() {
      const [aadharNumber, setAadharNumber] = useState('');
      const [patient, setPatient] = useState<Patient | null>(null);
      const [records, setRecords] = useState<MedicalRecord[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const [symptomSearch, setSymptomSearch] = useState('');
      const [searchResults, setSearchResults] = useState<MedicalRecord[]>([]);
      const [noResultsMessage, setNoResultsMessage] = useState<string | null>(null);

      useEffect(() => {
        const fetchInitialData = async () => {
          if (!aadharNumber) return;
          setLoading(true);
          setError(null);
          try {
            console.log("Fetching medical records for Aadhar:", aadharNumber);
            const { data, error } = await supabase
              .from('medical_records')
              .select('*')
              .eq('aadhar_number', aadharNumber)
              .order('treatment_date', { ascending: false });

            if (error) {
              console.error("Error fetching initial records:", error);
              setError(`Error fetching initial records: ${error.message}`);
              setRecords([]);
              return;
            }

            console.log("Initial records fetched:", data);
            setRecords(data || []);
          } catch (err: any) {
            console.error("Unexpected error:", err);
            setError(`An unexpected error occurred: ${err.message}`);
            setRecords([]);
          } finally {
            setLoading(false);
          }
        };

        fetchInitialData();
      }, [aadharNumber]);

      const searchPatient = async () => {
        if (!aadharNumber) return;
        
        setLoading(true);
        setError(null);
        setNoResultsMessage(null);
        
        try {
          console.log("Fetching patient data for Aadhar:", aadharNumber);
          const { data: patientData, error: patientError } = await supabase
            .from('patients')
            .select('*')
            .eq('aadhar_number', aadharNumber)
            .maybeSingle();

          if (patientError) {
            console.error("Error fetching patient data:", patientError);
            setError(`Error fetching patient data: ${patientError.message}`);
            setPatient(null);
            setRecords([]);
            return;
          }

          console.log("Patient data fetched successfully:", patientData);
          setPatient(patientData);

          console.log("Fetching medical records for Aadhar:", aadharNumber);
          const { data: recordsData, error: recordsError } = await supabase
            .from('medical_records')
            .select('*')
            .eq('aadhar_number', aadharNumber)
            .order('treatment_date', { ascending: false });

          if (recordsError) {
            console.error("Error fetching medical records:", recordsError);
            setError(`Error fetching medical records: ${recordsError.message}`);
            setRecords([]);
            return;
          }

          console.log("Medical records fetched successfully:", recordsData);
          setRecords(recordsData || []);
        } catch (err: any) {
          console.error("Unexpected error:", err);
          setError(`An unexpected error occurred: ${err.message}`);
          setPatient(null);
          setRecords([]);
        } finally {
          setLoading(false);
        }
      };

      const handleSymptomSearch = () => {
        if (!symptomSearch) {
          setSearchResults([]);
          setNoResultsMessage(null);
          return;
        }

        if (!records || records.length === 0) {
          setSearchResults([]);
          setNoResultsMessage("No medical records available to search.");
          return;
        }

        const filteredRecords = records.filter(record =>
          record.symptoms.some(symptom =>
            symptom.toLowerCase().includes(symptomSearch.toLowerCase())
          )
        );
        setSearchResults(filteredRecords);
        console.log("Filtered records:", filteredRecords);
        if (filteredRecords.length === 0) {
          setNoResultsMessage("This symptom wasn't found in the records.");
        } else {
          setNoResultsMessage(null);
        }
      };

      // Group records by date
      const groupedRecords = records.reduce((acc, record) => {
        const date = new Date(record.treatment_date).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(record);
        return acc;
      }, {} as { [date: string]: MedicalRecord[] });

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
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Search className="h-6 w-6" />
                  Symptom Search
                </h2>
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    value={symptomSearch}
                    onChange={(e) => setSymptomSearch(e.target.value)}
                    placeholder="Enter symptom to search"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleSymptomSearch}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    Search
                  </button>
                </div>

                {noResultsMessage && (
                  <div className="text-center py-6 text-white/60">
                    {noResultsMessage}
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    {searchResults.map((record) => (
                      <div
                        key={record.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="text-lg font-semibold">
                              {new Date(record.treatment_date).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-white/70 mb-1">Prescription</h4>
                            <p className="text-sm whitespace-pre-line">{record.prescription}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {patient && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <History className="h-6 w-6" />
                  Medical History
                </h2>
                
                {Object.keys(groupedRecords).length > 0 ? (
                  Object.entries(groupedRecords).map(([date, recordsForDate]) => (
                    <div key={date} className="mb-8">
                      <h3 className="text-xl font-semibold mb-4 text-white">{date}</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/20">
                          <thead className="bg-white/5">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                Symptoms
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                Prescription
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/20">
                            {recordsForDate.map((record) => (
                              <tr key={record.id}>
                                <td className="px-6 py-4 whitespace-pre-line text-sm text-white">
                                  {record.symptoms.join(', ')}
                                </td>
                                <td className="px-6 py-4 whitespace-pre-line text-sm text-white">
                                  {record.prescription}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-white/60">
                    No medical records found for this patient.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
