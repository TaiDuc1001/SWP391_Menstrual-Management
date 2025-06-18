INSERT INTO accounts (id, email, password, status) VALUES (1, 'doctor@doctor', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (2, 'staff@staff', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (3, 'cus@cus', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (4, 'admin@admin', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (5, 'mai.nguyen@example.com', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (6, 'hung.tran@example.com', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (7, 'hoa.le@example.com', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (8, 'lan.hoang@example.com', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (9, 'hoa.le2@example.com', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (10, 'tuan.pham2@example.com', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (11, 'lan.hoang2@example.com', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (12, 'minh.vo@example.com', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (13, 'thanh.bui@example.com', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (14, 'long.nguyen@example.com', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (15, 'ngoc.tran@example.com', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (16, 'nam.nguyen@example.com', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (17, 'hong.nguyen@example.com', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (18, 'phuc.tran@example.com', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (19, 'mai.le@example.com', '123', 1);
INSERT INTO accounts (id, email, password, status) VALUES (20, 'hieu.pham@example.com', '123', 1);

INSERT INTO customers (id, name, date_of_birth, gender, phone_number, cccd, address) VALUES (3, 'Customer test account', '1990-01-01', 1, '0123456789', '123456789012', '123 Test Street, Test City');
INSERT INTO customers (id, name, date_of_birth, gender, phone_number, cccd, address) VALUES (5, 'Nguyen Thi Mai', '1985-03-15', 0, '0912345678', '123456789013', '123 Le Loi, Hanoi');
INSERT INTO customers (id, name, date_of_birth, gender, phone_number, cccd, address) VALUES (19, 'Tran Van Hung', '1990-07-22', 1, '0987654321', '987654321098', '456 Nguyen Trai, Ho Chi Minh City');
INSERT INTO customers (id, name, date_of_birth, gender, phone_number, cccd, address) VALUES (20, 'Le Thi Hoa', '1978-11-30', 0, '0932123456', '456789123456', '789 Tran Hung Dao, Da Nang');
INSERT INTO customers (id, name, date_of_birth, gender, phone_number, cccd, address) VALUES (16, 'Pham Minh Tuan', '1995-05-10', 1, '0908765432', '321654987123', '101 Vo Van Tan, Hanoi');
INSERT INTO customers (id, name, date_of_birth, gender, phone_number, cccd, address) VALUES (17, 'Hoang Thi Lan', '1988-09-05', 0, '0943216547', '654321987654', '202 Ba Trieu, Hue');

INSERT INTO doctors (id, specialization, name, price) VALUES (1, 'Gynecology', 'Doctor Test Account', 210.00);
INSERT INTO doctors (id, specialization, name, price) VALUES (6, 'Gynecology', 'Vo Thi Minh', 200.00);
INSERT INTO doctors (id, specialization, name, price) VALUES (7, 'Urology', 'Bui Van Thanh', 180.00);
INSERT INTO doctors (id, specialization, name, price) VALUES (8, 'Infectious Diseases', 'Nguyen Van Long', 220.00);
INSERT INTO doctors (id, specialization, name, price) VALUES (9, 'Sexual Health', 'Tran Thi Ngoc', 160.00);
INSERT INTO doctors (id, specialization, name, price) VALUES (10, 'Sexual Health', 'Le Thi Hoa', 150.00);

INSERT INTO admins (id, name) VALUES (4, 'Admin Test Account');

INSERT INTO staffs (id, name) VALUES (2, 'Staff Test Account');
INSERT INTO staffs (id, name) VALUES (11, 'Nguyen Thi Hong');
INSERT INTO staffs (id, name) VALUES (12, 'Tran Van Phuc');
INSERT INTO staffs (id, name) VALUES (13, 'Le Thi Mai');
INSERT INTO staffs (id, name) VALUES (14, 'Pham Van Hieu');
INSERT INTO staffs (id, name) VALUES (15, 'Hoang Thi Lan');

