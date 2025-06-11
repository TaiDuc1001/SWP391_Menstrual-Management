-- Insert Accounts
INSERT INTO accounts (id, account_name, password, account_status, email) VALUES (1, 'user1', 'pass1', 1, 'user1@email.com');
INSERT INTO accounts (id, account_name, password, account_status, email) VALUES (2, 'user2', 'pass2', 1, 'user2@email.com');
INSERT INTO accounts (id, account_name, password, account_status, email) VALUES (3, 'user3', 'pass3', 1, 'user3@email.com');
INSERT INTO accounts (id, account_name, password, account_status, email) VALUES (4, 'user4', 'pass4', 1, 'user4@email.com');
INSERT INTO accounts (id, account_name, password, account_status, email) VALUES (5, 'user5', 'pass5', 1, 'user5@email.com');

-- Insert Customers
INSERT INTO customers (id, account_id, first_name, middle_name, last_name, date_of_birth, gender, email, phone_number, cccd, address) VALUES (1, 1, 'Alice', 'B.', 'Smith', '1990-01-01', 'Female', 'alice@email.com', '0123456789', '123456789', '123 Main St');
INSERT INTO customers (id, account_id, first_name, middle_name, last_name, date_of_birth, gender, email, phone_number, cccd, address) VALUES (2, 2, 'Bob', 'C.', 'Jones', '1985-02-02', 'Male', 'bob@email.com', '0123456790', '223456789', '456 Oak St');
INSERT INTO customers (id, account_id, first_name, middle_name, last_name, date_of_birth, gender, email, phone_number, cccd, address) VALUES (3, 3, 'Carol', 'D.', 'Brown', '1992-03-03', 'Female', 'carol@email.com', '0123456791', '323456789', '789 Pine St');
INSERT INTO customers (id, account_id, first_name, middle_name, last_name, date_of_birth, gender, email, phone_number, cccd, address) VALUES (4, 4, 'David', 'E.', 'White', '1988-04-04', 'Male', 'david@email.com', '0123456792', '423456789', '321 Maple St');
INSERT INTO customers (id, account_id, first_name, middle_name, last_name, date_of_birth, gender, email, phone_number, cccd, address) VALUES (5, 5, 'Eve', 'F.', 'Black', '1995-05-05', 'Female', 'eve@email.com', '0123456793', '523456789', '654 Cedar St');

-- Insert Staffs
INSERT INTO staffs (id, account_id, specialization) VALUES (1, 1, 'General');
INSERT INTO staffs (id, account_id, specialization) VALUES (2, 2, 'Lab');
INSERT INTO staffs (id, account_id, specialization) VALUES (3, 3, 'Reception');
INSERT INTO staffs (id, account_id, specialization) VALUES (4, 4, 'Support');
INSERT INTO staffs (id, account_id, specialization) VALUES (5, 5, 'Admin');

-- Insert Doctors
INSERT INTO doctors (id, account_id, experience, specialization, is_active) VALUES (1, 1, 10, 'Gynecology', 1);
INSERT INTO doctors (id, account_id, experience, specialization, is_active) VALUES (2, 2, 8, 'Endocrinology', 1);
INSERT INTO doctors (id, account_id, experience, specialization, is_active) VALUES (3, 3, 12, 'Obstetrics', 1);
INSERT INTO doctors (id, account_id, experience, specialization, is_active) VALUES (4, 4, 7, 'General', 1);
INSERT INTO doctors (id, account_id, experience, specialization, is_active) VALUES (5, 5, 15, 'Fertility', 1);

-- Insert Admins
INSERT INTO admins (id, account_id) VALUES (1, 1);
INSERT INTO admins (id, account_id) VALUES (2, 2);
INSERT INTO admins (id, account_id) VALUES (3, 3);
INSERT INTO admins (id, account_id) VALUES (4, 4);
INSERT INTO admins (id, account_id) VALUES (5, 5);

-- Insert Categories
INSERT INTO categories (id, category_name, description, is_active) VALUES (1, 'Health', 'Health related', 1);
INSERT INTO categories (id, category_name, description, is_active) VALUES (2, 'Wellness', 'Wellness related', 1);
INSERT INTO categories (id, category_name, description, is_active) VALUES (3, 'Nutrition', 'Nutrition related', 1);
INSERT INTO categories (id, category_name, description, is_active) VALUES (4, 'Fitness', 'Fitness related', 1);
INSERT INTO categories (id, category_name, description, is_active) VALUES (5, 'Lifestyle', 'Lifestyle related', 1);

-- Insert Tags
INSERT INTO tags (id, tag_name, description, is_active) VALUES (1, 'Period', 'Period tag', 1);
INSERT INTO tags (id, tag_name, description, is_active) VALUES (2, 'Ovulation', 'Ovulation tag', 1);
INSERT INTO tags (id, tag_name, description, is_active) VALUES (3, 'Fertility', 'Fertility tag', 1);
INSERT INTO tags (id, tag_name, description, is_active) VALUES (4, 'Wellness', 'Wellness tag', 1);
INSERT INTO tags (id, tag_name, description, is_active) VALUES (5, 'Advice', 'Advice tag', 1);

-- Insert Blogs
INSERT INTO blogs (id, account_id, category_id, slug, title, content, excerpt, publish_date, status, is_active) VALUES (1, 1, 1, 'blog-1', 'Blog Title 1', 'Content 1', 'Excerpt 1', '2024-01-01 10:00:00', 'published', 1);
INSERT INTO blogs (id, account_id, category_id, slug, title, content, excerpt, publish_date, status, is_active) VALUES (2, 2, 2, 'blog-2', 'Blog Title 2', 'Content 2', 'Excerpt 2', '2024-01-02 10:00:00', 'published', 1);
INSERT INTO blogs (id, account_id, category_id, slug, title, content, excerpt, publish_date, status, is_active) VALUES (3, 3, 3, 'blog-3', 'Blog Title 3', 'Content 3', 'Excerpt 3', '2024-01-03 10:00:00', 'published', 1);
INSERT INTO blogs (id, account_id, category_id, slug, title, content, excerpt, publish_date, status, is_active) VALUES (4, 4, 4, 'blog-4', 'Blog Title 4', 'Content 4', 'Excerpt 4', '2024-01-04 10:00:00', 'published', 1);
INSERT INTO blogs (id, account_id, category_id, slug, title, content, excerpt, publish_date, status, is_active) VALUES (5, 5, 5, 'blog-5', 'Blog Title 5', 'Content 5', 'Excerpt 5', '2024-01-05 10:00:00', 'published', 1);

-- Insert BlogTags
INSERT INTO blog_tags (blog_id, tag_id) VALUES (1, 1);
INSERT INTO blog_tags (blog_id, tag_id) VALUES (2, 2);
INSERT INTO blog_tags (blog_id, tag_id) VALUES (3, 3);
INSERT INTO blog_tags (blog_id, tag_id) VALUES (4, 4);
INSERT INTO blog_tags (blog_id, tag_id) VALUES (5, 5);

-- Insert PaymentMethods
INSERT INTO payment_methods (id, method_name, description, is_active) VALUES (1, 'Cash', 'Pay by cash', 1);
INSERT INTO payment_methods (id, method_name, description, is_active) VALUES (2, 'Credit Card', 'Pay by card', 1);
INSERT INTO payment_methods (id, method_name, description, is_active) VALUES (3, 'Bank Transfer', 'Pay by bank', 1);
INSERT INTO payment_methods (id, method_name, description, is_active) VALUES (4, 'E-wallet', 'Pay by e-wallet', 1);
INSERT INTO payment_methods (id, method_name, description, is_active) VALUES (5, 'Insurance', 'Pay by insurance', 1);

-- Insert Orders
INSERT INTO orders (id, customer_id, slot, total_amount, status, date, note, is_active, staff_id, payment_method_id) VALUES (1, 1, 1, 100.00, 'pending', '2024-06-01', 'Note 1', 1, 1, 1);
INSERT INTO orders (id, customer_id, slot, total_amount, status, date, note, is_active, staff_id, payment_method_id) VALUES (2, 2, 2, 200.00, 'completed', '2024-06-02', 'Note 2', 1, 2, 2);
INSERT INTO orders (id, customer_id, slot, total_amount, status, date, note, is_active, staff_id, payment_method_id) VALUES (3, 3, 3, 150.00, 'pending', '2024-06-03', 'Note 3', 1, 3, 3);
INSERT INTO orders (id, customer_id, slot, total_amount, status, date, note, is_active, staff_id, payment_method_id) VALUES (4, 4, 1, 120.00, 'completed', '2024-06-04', 'Note 4', 1, 4, 4);
INSERT INTO orders (id, customer_id, slot, total_amount, status, date, note, is_active, staff_id, payment_method_id) VALUES (5, 5, 2, 180.00, 'pending', '2024-06-05', 'Note 5', 1, 5, 5);

-- Insert Packages
INSERT INTO packages (id, order_id, package_name, description, price, duration, is_active) VALUES (1, 1, 'Basic', 'Basic package', 100.00, 30, 1);
INSERT INTO packages (id, order_id, package_name, description, price, duration, is_active) VALUES (2, 2, 'Standard', 'Standard package', 200.00, 60, 1);
INSERT INTO packages (id, order_id, package_name, description, price, duration, is_active) VALUES (3, 3, 'Premium', 'Premium package', 150.00, 45, 1);
INSERT INTO packages (id, order_id, package_name, description, price, duration, is_active) VALUES (4, 4, 'Deluxe', 'Deluxe package', 120.00, 30, 1);
INSERT INTO packages (id, order_id, package_name, description, price, duration, is_active) VALUES (5, 5, 'Ultimate', 'Ultimate package', 180.00, 90, 1);

-- Insert Results
INSERT INTO results (id, order_id) VALUES (1, 1);
INSERT INTO results (id, order_id) VALUES (2, 2);
INSERT INTO results (id, order_id) VALUES (3, 3);
INSERT INTO results (id, order_id) VALUES (4, 4);
INSERT INTO results (id, order_id) VALUES (5, 5);

-- Insert Symptoms
INSERT INTO symptoms (id, name, is_active) VALUES (1, 'Cramps', 1);
INSERT INTO symptoms (id, name, is_active) VALUES (2, 'Headache', 1);
INSERT INTO symptoms (id, name, is_active) VALUES (3, 'Bloating', 1);
INSERT INTO symptoms (id, name, is_active) VALUES (4, 'Mood Swings', 1);
INSERT INTO symptoms (id, name, is_active) VALUES (5, 'Fatigue', 1);

-- Insert Cycles
INSERT INTO cycles (id, account_id, cycle_start_date, cycle_length, period_duration, ovulation_date, fertility_window_start, fertility_window_end, contraceptive_reminder, is_active) VALUES (1, 1, '2024-05-01', 28, 5, '2024-05-14', '2024-05-10', '2024-05-15', 'Take pill', 1);
INSERT INTO cycles (id, account_id, cycle_start_date, cycle_length, period_duration, ovulation_date, fertility_window_start, fertility_window_end, contraceptive_reminder, is_active) VALUES (2, 2, '2024-05-02', 30, 6, '2024-05-16', '2024-05-12', '2024-05-17', 'Take pill', 1);
INSERT INTO cycles (id, account_id, cycle_start_date, cycle_length, period_duration, ovulation_date, fertility_window_start, fertility_window_end, contraceptive_reminder, is_active) VALUES (3, 3, '2024-05-03', 27, 4, '2024-05-13', '2024-05-09', '2024-05-14', 'Take pill', 1);
INSERT INTO cycles (id, account_id, cycle_start_date, cycle_length, period_duration, ovulation_date, fertility_window_start, fertility_window_end, contraceptive_reminder, is_active) VALUES (4, 4, '2024-05-04', 29, 5, '2024-05-15', '2024-05-11', '2024-05-16', 'Take pill', 1);
INSERT INTO cycles (id, account_id, cycle_start_date, cycle_length, period_duration, ovulation_date, fertility_window_start, fertility_window_end, contraceptive_reminder, is_active) VALUES (5, 5, '2024-05-05', 28, 5, '2024-05-14', '2024-05-10', '2024-05-15', 'Take pill', 1);

-- Insert CycleSymptomByDate
INSERT INTO cycle_symptom_by_date (cycle_id, symptom_id, date) VALUES (1, 1, '2024-05-01 08:00:00');
INSERT INTO cycle_symptom_by_date (cycle_id, symptom_id, date) VALUES (2, 2, '2024-05-02 08:00:00');
INSERT INTO cycle_symptom_by_date (cycle_id, symptom_id, date) VALUES (3, 3, '2024-05-03 08:00:00');
INSERT INTO cycle_symptom_by_date (cycle_id, symptom_id, date) VALUES (4, 4, '2024-05-04 08:00:00');
INSERT INTO cycle_symptom_by_date (cycle_id, symptom_id, date) VALUES (5, 5, '2024-05-05 08:00:00');

-- Insert Appointments
INSERT INTO appointments (id, customer_id, doctor_id, date, slot, google_meet_url, appointment_status, description, note, is_active, price) VALUES (1, 1, 1, '2024-06-01', 1, 'http://meet1', 'scheduled', 'Desc 1', 'Note 1', 1, 100.00);
INSERT INTO appointments (id, customer_id, doctor_id, date, slot, google_meet_url, appointment_status, description, note, is_active, price) VALUES (2, 2, 2, '2024-06-02', 2, 'http://meet2', 'completed', 'Desc 2', 'Note 2', 1, 200.00);
INSERT INTO appointments (id, customer_id, doctor_id, date, slot, google_meet_url, appointment_status, description, note, is_active, price) VALUES (3, 3, 3, '2024-06-03', 3, 'http://meet3', 'scheduled', 'Desc 3', 'Note 3', 1, 150.00);
INSERT INTO appointments (id, customer_id, doctor_id, date, slot, google_meet_url, appointment_status, description, note, is_active, price) VALUES (4, 4, 4, '2024-06-04', 1, 'http://meet4', 'completed', 'Desc 4', 'Note 4', 1, 120.00);
INSERT INTO appointments (id, customer_id, doctor_id, date, slot, google_meet_url, appointment_status, description, note, is_active, price) VALUES (5, 5, 5, '2024-06-05', 2, 'http://meet5', 'scheduled', 'Desc 5', 'Note 5', 1, 180.00);

-- Insert MedicalRecords
INSERT INTO medical_records (id, customer_id, record_date, record_type, description, is_confidential) VALUES (1, 1, '2024-06-01 09:00:00', 'Type1', 'Desc 1', 0);
INSERT INTO medical_records (id, customer_id, record_date, record_type, description, is_confidential) VALUES (2, 2, '2024-06-02 09:00:00', 'Type2', 'Desc 2', 0);
INSERT INTO medical_records (id, customer_id, record_date, record_type, description, is_confidential) VALUES (3, 3, '2024-06-03 09:00:00', 'Type3', 'Desc 3', 0);
INSERT INTO medical_records (id, customer_id, record_date, record_type, description, is_confidential) VALUES (4, 4, '2024-06-04 09:00:00', 'Type4', 'Desc 4', 0);
INSERT INTO medical_records (id, customer_id, record_date, record_type, description, is_confidential) VALUES (5, 5, '2024-06-05 09:00:00', 'Type5', 'Desc 5', 0);

-- Insert RatingFeedbacks
INSERT INTO rating_feedbacks (id, customer_id, doctor_id, appointment_id, rating_score, feedback, rating_date, is_active) VALUES (1, 1, 1, 1, 5, 'Great', '2024-06-01 10:00:00', 1);
INSERT INTO rating_feedbacks (id, customer_id, doctor_id, appointment_id, rating_score, feedback, rating_date, is_active) VALUES (2, 2, 2, 2, 4, 'Good', '2024-06-02 10:00:00', 1);
INSERT INTO rating_feedbacks (id, customer_id, doctor_id, appointment_id, rating_score, feedback, rating_date, is_active) VALUES (3, 3, 3, 3, 3, 'Average', '2024-06-03 10:00:00', 1);
INSERT INTO rating_feedbacks (id, customer_id, doctor_id, appointment_id, rating_score, feedback, rating_date, is_active) VALUES (4, 4, 4, 4, 5, 'Excellent', '2024-06-04 10:00:00', 1);
INSERT INTO rating_feedbacks (id, customer_id, doctor_id, appointment_id, rating_score, feedback, rating_date, is_active) VALUES (5, 5, 5, 5, 2, 'Poor', '2024-06-05 10:00:00', 1);

-- Insert Schedules
INSERT INTO schedules (id, doctor_id, slot, is_active) VALUES (1, 1, 1, 1);
INSERT INTO schedules (id, doctor_id, slot, is_active) VALUES (2, 2, 2, 1);
INSERT INTO schedules (id, doctor_id, slot, is_active) VALUES (3, 3, 3, 1);
INSERT INTO schedules (id, doctor_id, slot, is_active) VALUES (4, 4, 4, 1);
INSERT INTO schedules (id, doctor_id, slot, is_active) VALUES (5, 5, 5, 1);

-- Insert Tests
INSERT INTO tests (id, name, type, description, is_active) VALUES (1, 'Test1', 'Blood', 'Desc 1', 1);
INSERT INTO tests (id, name, type, description, is_active) VALUES (2, 'Test2', 'Urine', 'Desc 2', 1);
INSERT INTO tests (id, name, type, description, is_active) VALUES (3, 'Test3', 'Saliva', 'Desc 3', 1);
INSERT INTO tests (id, name, type, description, is_active) VALUES (4, 'Test4', 'Blood', 'Desc 4', 1);
INSERT INTO tests (id, name, type, description, is_active) VALUES (5, 'Test5', 'Urine', 'Desc 5', 1);

-- Insert PackageTests
INSERT INTO package_tests (test_id, package_id) VALUES (1, 1);
INSERT INTO package_tests (test_id, package_id) VALUES (2, 2);
INSERT INTO package_tests (test_id, package_id) VALUES (3, 3);
INSERT INTO package_tests (test_id, package_id) VALUES (4, 4);
INSERT INTO package_tests (test_id, package_id) VALUES (5, 5);

-- Insert ResultDetails
INSERT INTO result_details (id, result_id, test_id, score, notes, results) VALUES (1, 1, 1, 90, 'Note 1', 1);
INSERT INTO result_details (id, result_id, test_id, score, notes, results) VALUES (2, 2, 2, 80, 'Note 2', 1);
INSERT INTO result_details (id, result_id, test_id, score, notes, results) VALUES (3, 3, 3, 85, 'Note 3', 1);
INSERT INTO result_details (id, result_id, test_id, score, notes, results) VALUES (4, 4, 4, 95, 'Note 4', 1);
INSERT INTO result_details (id, result_id, test_id, score, notes, results) VALUES (5, 5, 5, 88, 'Note 5', 1);