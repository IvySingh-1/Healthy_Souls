-- Insert dummy patients
    INSERT INTO patients (aadhar_number)
    VALUES
      ('111122223333'),
      ('444455556666'),
      ('777788889999'),
      ('101020203030'),
      ('404050506060'),
      ('707080809090'),
      ('121234345656'),
      ('787890901212'),
      ('343456567878'),
      ('909012123434')
    ON CONFLICT DO NOTHING;

    -- Insert dummy medical records
    INSERT INTO medical_records (aadhar_number, doctor_id, treatment_date, symptoms, prescription)
    VALUES
      (
        '111122223333',
        (SELECT id FROM auth.users LIMIT 1),
        NOW() - INTERVAL '10 days',
        ARRAY['Fever', 'Cough', 'Fatigue'],
        'Rest, Paracetamol 500mg twice daily'
      ),
      (
        '111122223333',
        (SELECT id FROM auth.users LIMIT 1),
        NOW() - INTERVAL '5 days',
        ARRAY['Headache', 'Sore throat'],
        'Ibuprofen 200mg as needed'
      ),
      (
        '444455556666',
        (SELECT id FROM auth.users LIMIT 1),
        NOW() - INTERVAL '15 days',
        ARRAY['Nausea', 'Vomiting'],
        'Oral rehydration solution'
      ),
      (
        '777788889999',
        (SELECT id FROM auth.users LIMIT 1),
        NOW() - INTERVAL '20 days',
        ARRAY['Muscle pain', 'Joint pain'],
        'Rest, Warm compress'
      ),
      (
        '101020203030',
        (SELECT id FROM auth.users LIMIT 1),
        NOW() - INTERVAL '25 days',
        ARRAY['Skin rash', 'Itching'],
        'Antihistamine cream'
      ),
      (
        '404050506060',
        (SELECT id FROM auth.users LIMIT 1),
        NOW() - INTERVAL '30 days',
        ARRAY['Dizziness', 'Lightheadedness'],
        'Stay hydrated, rest'
      ),
      (
        '707080809090',
        (SELECT id FROM auth.users LIMIT 1),
        NOW() - INTERVAL '35 days',
        ARRAY['Chest pain', 'Shortness of breath'],
        'Consult a specialist'
      ),
      (
        '121234345656',
        (SELECT id FROM auth.users LIMIT 1),
        NOW() - INTERVAL '40 days',
        ARRAY['Abdominal pain', 'Bloating'],
        'Antacids, avoid spicy food'
      ),
      (
        '787890901212',
        (SELECT id FROM auth.users LIMIT 1),
        NOW() - INTERVAL '45 days',
        ARRAY['Blurred vision', 'Eye strain'],
        'Eye drops, rest eyes'
      ),
      (
        '343456567878',
        (SELECT id FROM auth.users LIMIT 1),
        NOW() - INTERVAL '50 days',
        ARRAY['Loss of appetite', 'Weight loss'],
        'Nutritional supplements'
      ),
      (
        '22',
        (SELECT id FROM auth.users LIMIT 1),
        NOW() - INTERVAL '2 days',
        ARRAY['Headache', 'Runny nose'],
        'Rest, Decongestant'
      )
    ON CONFLICT DO NOTHING;
