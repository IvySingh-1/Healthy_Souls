/*
  # Patient Records Management System

  1. New Tables
    - `patients`
      - `aadhar_number` (text, primary key) - Unique identifier for patients
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `medical_records`
      - `id` (uuid, primary key)
      - `aadhar_number` (text, references patients)
      - `doctor_id` (uuid, references auth.users)
      - `treatment_date` (timestamp)
      - `symptoms` (text[])
      - `prescription` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage records
*/

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  aadhar_number text PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create medical_records table
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aadhar_number text REFERENCES patients(aadhar_number),
  doctor_id uuid REFERENCES auth.users(id),
  treatment_date timestamptz DEFAULT now(),
  symptoms text[],
  prescription text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Policies for patients table
CREATE POLICY "Authenticated users can view patients"
  ON patients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create patients"
  ON patients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for medical_records table
CREATE POLICY "Authenticated users can view medical records"
  ON medical_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Doctors can create medical records"
  ON medical_records
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update their own records"
  ON medical_records
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = doctor_id)
  WITH CHECK (auth.uid() = doctor_id);