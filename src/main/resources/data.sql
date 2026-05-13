-- Insert Suppliers
INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES
('MediCorp India', 'Rahul Sharma', '987-654-3210', 'rahul@medicorp.in', '123 Pharma Lane, Mumbai'),
('HealthPlus Supplies', 'Priya Gupta', '987-654-3211', 'priya@healthplus.in', '456 Medical Blvd, Delhi'),
('Global Pharma Distributors', 'Amit Patel', '987-654-3212', 'amit@globalpharma.in', '789 Industrial Pkwy, Ahmedabad'),
('Apex Medical Supply', 'Sneha Desai', '987-654-3213', 'sneha@apexmed.in', '101 Health Ave, Pune'),
('BioLife Partners', 'Vikram Singh', '987-654-3214', 'orders@biolife.in', '202 Science Rd, Bangalore');

-- Insert Customers
INSERT INTO customers (name, phone, email, address) VALUES
('Walk-in Customer', '000-000-0000', '', ''),
('Anjali Verma', '987-654-3215', 'anjali@example.in', '789 Main St, Mumbai'),
('Raj Kumar', '987-654-3216', 'raj.k@email.in', '45 Elm Street, Apt 2B, Delhi'),
('Pooja Reddy', '987-654-3217', 'pooja.r@email.in', '120 Pine Road, Hyderabad'),
('Suresh Rao', '987-654-3218', 'suresh.r@email.in', '88 Oak Avenue, Chennai'),
('Neha Sharma', '987-654-3219', 'neha.s@email.in', '34 Cedar Court, Kolkata');

-- Insert Medicines
INSERT INTO medicines (name, category, description, quantity, price, cost_price, expiry_date, supplier_id, image_url, uses, side_effects, manufacturer, is_prescription_required, generic_name, rating) VALUES
('Paracetamol 500mg', 'Painkiller', 'Fever and mild pain relief', 500, 40.0, 15.0, '2025-12-31', 1, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80', 'Fever, Body ache, Headache', 'Nausea, Rash', 'PharmaCare Inc', false, 'Acetaminophen', 4.8),
('Amoxicillin 250mg', 'Antibiotic', 'Bacterial infection treatment', 200, 120.0, 65.0, '2024-10-15', 2, 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&q=80', 'Respiratory infections, Ear infections', 'Diarrhea, Stomach pain', 'MediLife', true, 'Amoxicillin', 4.5),
('Cetirizine 10mg', 'Antihistamine', 'Allergy relief', 8, 65.0, 25.0, '2024-06-30', 1, 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&q=80', 'Allergies, Hay fever, Sneezing', 'Drowsiness, Dry mouth', 'HealthPlus', false, 'Cetirizine Hydrochloride', 4.2),
('Ibuprofen 400mg', 'Painkiller', 'Anti-inflammatory and pain relief', 150, 95.0, 40.0, '2025-05-20', 2, 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&q=80', 'Pain relief, Inflammation, Fever', 'Stomach upset, Heartburn', 'BioMed', false, 'Ibuprofen', 4.6),
('Lisinopril 10mg', 'Cardiovascular', 'Blood pressure management', 120, 175.0, 80.0, '2026-01-15', 3, 'https://images.unsplash.com/photo-1550572017-edb3df40a6e0?w=500&q=80', 'Hypertension, Heart failure', 'Dizziness, Cough', 'Apex Pharma', true, 'Lisinopril', 4.7),
('Metformin 500mg', 'Diabetic', 'Type 2 diabetes management', 300, 145.0, 55.0, '2025-08-10', 4, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&q=80', 'Type 2 Diabetes', 'Nausea, Stomach ache', 'DiabCare', true, 'Metformin Hydrochloride', 4.4),
('Omeprazole 20mg', 'Gastrointestinal', 'Acid reflux relief', 80, 200.0, 95.0, '2024-11-22', 5, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80', 'Acid reflux, Ulcers', 'Headache, Abdominal pain', 'GastroHealth', false, 'Omeprazole', 4.3),
('Atorvastatin 20mg', 'Cardiovascular', 'Cholesterol management', 150, 240.0, 110.0, '2026-03-05', 3, 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80', 'High cholesterol', 'Muscle pain, Liver issues', 'CardioMed', true, 'Atorvastatin Calcium', 4.9),
('Azithromycin 250mg', 'Antibiotic', 'Macrolide antibacterial', 50, 225.0, 120.0, '2025-02-28', 2, 'https://images.unsplash.com/photo-1550572017-4f8e815616f9?w=500&q=80', 'Bacterial infections, Bronchitis', 'Nausea, Diarrhea', 'BioLife', true, 'Azithromycin', 4.5),
('Albuterol Inhaler', 'Respiratory', 'Asthma relief', 40, 360.0, 200.0, '2025-09-15', 4, 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&q=80', 'Asthma, COPD', 'Nervousness, Tremor', 'RespiCare', true, 'Albuterol Sulfate', 4.8),
('Levothyroxine 50mcg', 'Hormonal', 'Thyroid hormone replacement', 100, 120.0, 50.0, '2026-05-10', 5, 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&q=80', 'Hypothyroidism', 'Weight loss, Sweating', 'ThyroHealth', true, 'Levothyroxine Sodium', 4.6),
('Amlodipine 5mg', 'Cardiovascular', 'Calcium channel blocker', 200, 145.0, 65.0, '2025-10-01', 3, 'https://images.unsplash.com/photo-1603808033176-9d134e6f2c74?w=500&q=80', 'High blood pressure', 'Swelling, Fatigue', 'CardioMed', true, 'Amlodipine Besylate', 4.4),
('Sertraline 50mg', 'Antidepressant', 'SSRI for depression/anxiety', 90, 280.0, 145.0, '2025-07-20', 1, 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&q=80', 'Depression, Anxiety', 'Nausea, Insomnia', 'MindCare', true, 'Sertraline Hydrochloride', 4.7),
('Fluticasone Nasal Spray', 'Allergy', 'Nasal corticosteroid', 60, 190.0, 90.0, '2026-04-15', 4, 'https://images.unsplash.com/photo-1583947581924-860bda6a45df?w=500&q=80', 'Allergic rhinitis', 'Nosebleeds, Headache', 'AllergyPlus', false, 'Fluticasone Propionate', 4.5),
('Pantoprazole 40mg', 'Gastrointestinal', 'Proton pump inhibitor', 5, 160.0, 70.0, '2024-05-30', 5, 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&q=80', 'GERD, Acid Reflux', 'Headache, Diarrhea', 'GastroHealth', true, 'Pantoprazole Sodium', 4.6);
