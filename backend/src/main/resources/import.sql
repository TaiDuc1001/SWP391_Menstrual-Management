INSERT INTO accounts (id, email, password, status) VALUES (1, 'doctor@doctor', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (2, 'staff@staff', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (3, 'cus@cus', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (4, 'cus2@cus2', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (5, 'admin@admin', '123', 1);

INSERT INTO customers (id, name, date_of_birth, gender, phone_number, cccd, address) VALUES (3, 'Customer test account', '1990-01-01', 1, '0123456789', '123456789012', '123 Test Street, Test City');
INSERT INTO customers (id, name, date_of_birth, gender, phone_number, cccd, address) VALUES (4, 'Customer test account 2', '1990-01-01', 1, '0123456780', '123456789011', '123 Test Street, Test City');

INSERT INTO doctors (id, specialization, name, price) VALUES (1, 'Gynecology', 'Doctor Test Account', 210.00);
INSERT INTO admins (id, name) VALUES (5, 'Admin Test Account');
INSERT INTO staffs (id, name) VALUES (2, 'Staff Test Account');

INSERT INTO schedules (date, slot, doctor_id) VALUES ('2025-06-15', '1', 1);
INSERT INTO schedules (date, slot, doctor_id) VALUES ('2025-06-16', '1', 1);
INSERT INTO schedules (date, slot, doctor_id) VALUES ('2025-06-17', '1', 1);
INSERT INTO schedules (date, slot, doctor_id) VALUES ('2025-06-18', '1', 1);

INSERT INTO appointments (id, customer_id, doctor_id, date, slot, url, customer_note, doctor_note, feedback, score, appointment_status) VALUES (0, 3, 1, '2025-06-12', 1, 'https://zoom.us/j/100', 'Experiencing irregular periods ', 'Recommend tracking ', 'The doctor was', 5, 0);


INSERT INTO panels (id, panel_name, description, price, response_time, duration, panel_type, panel_tag) VALUES (18, 'Chlamydia & Gonorrhea Pane', 'The Chlamydia & Gonorrhea Panel ', 85.00, 48, 30, 1, 1);

INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (18, 4, 2, 18, 1, '2025-07-02', 2, 3);

INSERT INTO results (id, order_id, code) VALUES (17, 18, 'RES-20250702-018');
INSERT INTO test_types (id, name, normal_range, description) VALUES (18, 'Hepatitis C Viral Load', '<15 IU/mL', 'Quantifies Hepatitis C virus RNA');

INSERT INTO panel_test_types (test_type_id, panel_id) VALUES (18, 18);
INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (17, 18, '12 IU/mL', 'Hepatitis B viral load undetectable', 0);

INSERT INTO cycles (id, customer_id, cycle_start_date, cycle_length, period_duration, ovulation_date, fertility_window_start, fertility_window_end) VALUES (4, 3, '2025-07-01', 28, 5, '2025-07-15', '2025-07-13', '2025-07-17');

INSERT INTO cycle_symptom_by_date (cycle_id, symptom, date) VALUES (4, 14, '2025-07-02 12:00:00');

INSERT INTO blogs (id, slug, admin_id, category, title, content, publish_date) VALUES (4, 'understanding-hpv', 5, 14, 'Understanding HPV and Its Risks', 'Human Papillomavirus (HPV) ', '2025-06-15 09:00:00');