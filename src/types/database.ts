export interface Patient {
  aadhar_number: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalRecord {
  id: string;
  aadhar_number: string;
  doctor_id: string;
  treatment_date: string;
  symptoms: string[];
  diagnosis: string;
  prescription: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  email: string;
}