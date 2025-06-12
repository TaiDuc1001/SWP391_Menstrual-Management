-- Database Schema for SWP391 Backend Application

-- Accounts Table
CREATE TABLE accounts (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    status TINYINT(1)
);

-- Customers Table
CREATE TABLE customers (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    date_of_birth DATE,
    gender TINYINT(1),
    phone_number VARCHAR(255) UNIQUE,
    cccd VARCHAR(255) UNIQUE,
    address VARCHAR(255),
    FOREIGN KEY (id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Doctors Table
CREATE TABLE doctors (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    specialization VARCHAR(255),
    price DECIMAL(19,2),
    FOREIGN KEY (id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Admin Table
CREATE TABLE admins (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    FOREIGN KEY (id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Staff Table
CREATE TABLE staffs (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    FOREIGN KEY (id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Slot Enum Table (if implemented as a table)
CREATE TABLE slots (
    id INT PRIMARY KEY,
    start_time TIME,
    end_time TIME,
    name VARCHAR(50)
);

-- Schedule Table
CREATE TABLE schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    doctor_id BIGINT,
    date DATE,
    slot VARCHAR(255),
    is_booked TINYINT(1),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Appointment Status Enum
CREATE TABLE appointment_statuses (
    id INT PRIMARY KEY,
    status_name VARCHAR(50)
);

-- Appointments Table
CREATE TABLE appointments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT,
    doctor_id BIGINT,
    date DATE,
    slot VARCHAR(255),
    url VARCHAR(255),
    appointment_status VARCHAR(50),
    description TEXT,
    doctor_note TEXT,
    customer_note TEXT,
    feedback TEXT,
    score INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Blog Category Enum
CREATE TABLE blog_categories (
    id INT PRIMARY KEY,
    category_name VARCHAR(50)
);

-- Blog Tag Enum
CREATE TABLE blog_tags (
    id INT PRIMARY KEY,
    tag_name VARCHAR(50)
);

-- Blogs Table
CREATE TABLE blogs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    admin_id BIGINT,
    slug VARCHAR(255) UNIQUE,
    title VARCHAR(255),
    content TEXT,
    publish_date DATETIME,
    blog_tag VARCHAR(50),
    blog_category VARCHAR(50),
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- Examination Status Enum
CREATE TABLE examination_statuses (
    id INT PRIMARY KEY,
    status_name VARCHAR(50)
);

-- Payment Method Enum
CREATE TABLE payment_methods (
    id INT PRIMARY KEY,
    method_name VARCHAR(50)
);

-- Examinations Table
CREATE TABLE examinations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT,
    examination_status VARCHAR(50),
    payment_method VARCHAR(50),
    paid TINYINT(1),
    date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Test Types Table
CREATE TABLE test_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description TEXT
);

-- Panel Types Table
CREATE TABLE panel_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255)
);

-- Panel Tags Table
CREATE TABLE panel_tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255)
);

-- Panels Table
CREATE TABLE panels (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    price DECIMAL(19,2),
    description TEXT,
    panel_type VARCHAR(255),
    panel_tag VARCHAR(255)
);

-- Panel Test Type Junction Table
CREATE TABLE panel_test_types (
    panel_id BIGINT,
    test_type_id BIGINT,
    PRIMARY KEY (panel_id, test_type_id),
    FOREIGN KEY (panel_id) REFERENCES panels(id),
    FOREIGN KEY (test_type_id) REFERENCES test_types(id)
);

-- Results Table
CREATE TABLE results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    examination_id BIGINT,
    date DATE,
    FOREIGN KEY (examination_id) REFERENCES examinations(id)
);

-- Result Details Table
CREATE TABLE result_details (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    result_id BIGINT,
    test_type_id BIGINT,
    value VARCHAR(255),
    unit VARCHAR(50),
    reference_range VARCHAR(255),
    FOREIGN KEY (result_id) REFERENCES results(id),
    FOREIGN KEY (test_type_id) REFERENCES test_types(id)
);

-- Symptoms Table
CREATE TABLE symptoms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description TEXT
);

-- Cycle Symptom By Date Table
CREATE TABLE cycle_symptom_by_dates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT,
    symptom_id BIGINT,
    date DATE,
    intensity INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (symptom_id) REFERENCES symptoms(id)
);
