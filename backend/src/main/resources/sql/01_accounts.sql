
INSERT INTO accounts (id, email, password, status, role) VALUES (1, 'doctor@doctor', '123', 1, 'DOCTOR');
INSERT INTO accounts (id, email, password, status, role) VALUES (2, 'staff@staff', '123', 1, 'STAFF');
INSERT INTO accounts (id, email, password, status, role) VALUES (3, 'cus@cus', '123', 1, 'CUSTOMER');
INSERT INTO accounts (id, email, password, status, role) VALUES (4, 'admin@admin', '123', 1, 'ADMIN');
INSERT INTO accounts (id, email, password, status, role) VALUES (5, 'health-issue@customer', '123', 1, 'CUSTOMER');
INSERT INTO accounts (id, email, password, status, role) VALUES (6, 'hung.tran@example.com', '123', 1, 'DOCTOR');
INSERT INTO accounts (id, email, password, status, role) VALUES (7, 'hoa.le@example.com', '123', 1, 'DOCTOR');
INSERT INTO accounts (id, email, password, status, role) VALUES (8, 'lan.hoang@example.com', '123', 1, 'DOCTOR');
INSERT INTO accounts (id, email, password, status, role) VALUES (9, 'hoa.le2@example.com', '123', 1, 'DOCTOR');
INSERT INTO accounts (id, email, password, status, role) VALUES (10, 'tuan.pham2@example.com', '123', 1, 'DOCTOR');

INSERT INTO customers (id, name, date_of_birth, gender, phone_number, cccd, address) VALUES (3, 'Tuan Anh', '1990-01-01', 1, '0123456789', '123456789012', '123 Test Street, Test City');
INSERT INTO customers (id, name, date_of_birth, gender, phone_number, cccd, address) VALUES (5, 'Maria Problematic', '1992-05-15', 0, '0987654321', '987654321123', '456 Health Issue Street, Concern City');

INSERT INTO doctors (id, specialization, name, degree, university, price, experience) VALUES (1, 'Gynecology', 'Tran Duc Linh', 'Bachelor of Medicine', 'University of Medicine and Pharmacy Ho Chi Minh City', 210000.00, 10);
INSERT INTO doctors (id, specialization, name, degree, university, price, experience) VALUES (6, 'Gynecology', 'Nguyen Trung Tin', 'Doctor of Medicine', 'Hanoi Medical University', 200000.00, 8);
INSERT INTO doctors (id, specialization, name, degree, university, price, experience) VALUES (7, 'Urology', 'Nguyen Le Quang Hung', 'Doctor of Medicine', 'Hue University of Medicine and Pharmacy', 180000.00, 6);
INSERT INTO doctors (id, specialization, name, degree, university, price, experience) VALUES (8, 'Infectious Diseases', 'Hong Ty', 'Master of Medicine', 'Can Tho University of Medicine and Pharmacy', 220000.00, 12);
INSERT INTO doctors (id, specialization, name, degree, university, price, experience) VALUES (9, 'Sexual Health', 'Luong Minh Nhat', 'Bachelor of Medicine', 'University of Medicine and Pharmacy Ho Chi Minh City', 160000.00, 5);
INSERT INTO doctors (id, specialization, name, degree, university, price, experience) VALUES (10, 'Sexual Health', 'Thanh Cat Tu Han', 'Doctor of Medicine', 'Hanoi Medical University', 150000.00, 4);

INSERT INTO admins (id, name) VALUES (4, 'Admin');

INSERT INTO staffs (id, name) VALUES (2, 'Nguyen Phuc Khang');

