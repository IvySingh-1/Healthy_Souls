-- Insert 100 dummy patients into the patients table
    DO $$
    BEGIN
      FOR i IN 1..100 LOOP
        INSERT INTO patients (aadhar_number)
        SELECT 'patient_' || i
        WHERE NOT EXISTS (SELECT 1 FROM patients WHERE aadhar_number = 'patient_' || i);
      END LOOP;
    END;
    $$;
