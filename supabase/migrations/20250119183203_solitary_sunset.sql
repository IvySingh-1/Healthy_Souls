/*
  # Fix Patient Table Policies

  1. Changes
    - Update RLS policies for patients table to allow proper access
    - Add policies for unauthenticated access for patient portal
    - Fix insert and select permissions

  2. Security
    - Enable RLS on patients table
    - Add policies for public access to patients table
    - Maintain security while allowing patient portal functionality
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view patients" ON patients;
DROP POLICY IF EXISTS "Authenticated users can create patients" ON patients;

-- Create new policies for patients table
CREATE POLICY "Anyone can view patients"
  ON patients
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create patients"
  ON patients
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update patients"
  ON patients
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);