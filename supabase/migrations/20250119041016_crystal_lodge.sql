/*
  # Add test data

  1. Changes
    - Insert test patient with Aadhar number '22'
    - Insert test medical record for the patient
    
  2. Notes
    - Only inserts if data doesn't already exist
    - Uses safe INSERT with WHERE NOT EXISTS
*/

-- Insert test patient if not exists
INSERT INTO patients (aadhar_number)
SELECT '22'
WHERE NOT EXISTS (
  SELECT 1 FROM patients WHERE aadhar_number = '22'
);

-- Insert test medical record if not exists
INSERT INTO medical_records (aadhar_number, doctor_id, treatment_date, symptoms, prescription)
SELECT 
  '22',
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  ARRAY['Fever', 'Cough'],
  'Rest and hydration\nParacetamol 500mg twice daily'
WHERE NOT EXISTS (
  SELECT 1 FROM medical_records WHERE aadhar_number = '22'
);