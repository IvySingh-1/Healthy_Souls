-- Insert dummy medical records with older dates
    INSERT INTO medical_records (aadhar_number, doctor_id, treatment_date, symptoms, prescription)
    VALUES
      (
        '111122223333',
        (SELECT id FROM auth.users LIMIT 1),
        '2025-01-10',
        ARRAY['Fever', 'Cough'],
        'Rest, Paracetamol 500mg twice daily'
      ),
      (
        '444455556666',
        (SELECT id FROM auth.users LIMIT 1),
        '2025-01-05',
        ARRAY['Headache', 'Fatigue'],
        'Ibuprofen 200mg as needed'
      ),
      (
        '777788889999',
        (SELECT id FROM auth.users LIMIT 1),
        '2024-12-20',
        ARRAY['Nausea', 'Vomiting'],
        'Oral rehydration solution'
      ),
      (
        '101020203030',
        (SELECT id FROM auth.users LIMIT 1),
        '2024-12-15',
        ARRAY['Muscle pain', 'Joint pain'],
        'Rest, Warm compress'
      ),
      (
        '404050506060',
        (SELECT id FROM auth.users LIMIT 1),
        '2024-11-30',
        ARRAY['Skin rash', 'Itching'],
        'Antihistamine cream'
      ),
      (
        '707080809090',
        (SELECT id FROM auth.users LIMIT 1),
        '2024-11-15',
        ARRAY['Dizziness', 'Lightheadedness'],
        'Stay hydrated, rest'
      ),
      (
        '121234345656',
        (SELECT id FROM auth.users LIMIT 1),
        '2024-10-20',
        ARRAY['Chest pain', 'Shortness of breath'],
        'Consult a specialist'
      ),
      (
        '787890901212',
        (SELECT id FROM auth.users LIMIT 1),
        '2024-10-05',
        ARRAY['Abdominal pain', 'Bloating'],
        'Antacids, avoid spicy food'
      ),
      (
        '343456567878',
        (SELECT id FROM auth.users LIMIT 1),
        '2024-09-20',
        ARRAY['Blurred vision', 'Eye strain'],
        'Eye drops, rest eyes'
      ),
      (
        '22',
        (SELECT id FROM auth.users LIMIT 1),
        '2024-09-10',
        ARRAY['Loss of appetite', 'Weight loss'],
        'Nutritional supplements'
      )
    ON CONFLICT DO NOTHING;
