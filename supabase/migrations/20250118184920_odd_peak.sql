/*
  # Add test patient data

  1. New Data
    - Add test patient with Aadhar number "22"
    - Add medical record with symptoms
  
  2. Changes
    - Insert sample patient
    - Insert sample medical record
*/

-- Insert test patient if not exists
INSERT INTO patients (aadhar_number)
SELECT '22'
WHERE NOT EXISTS (
  SELECT 1 FROM patients WHERE aadhar_number = '22'
);

-- Insert test medical record if not exists
INSERT INTO medical_records (aadhar_number, doctor_id, treatment_date, symptoms, diagnosis, prescription)
SELECT 
  '22',
  (SELECT id FROM auth.users LIMIT 1),
  NOW(),
  ARRAY['Fever', 'Cough'],
  'Common cold',
  'Rest and hydration\nParacetamol 500mg twice daily'
WHERE NOT EXISTS (
  SELECT 1 FROM medical_records WHERE aadhar_number = '22'
);