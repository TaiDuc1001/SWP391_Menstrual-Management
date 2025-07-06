-- Migration script for reschedule feature

-- Create reschedule_requests table
CREATE TABLE IF NOT EXISTS reschedule_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    customer_note VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    
    INDEX idx_appointment_id (appointment_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_status (status)
);

-- Create reschedule_options table
CREATE TABLE IF NOT EXISTS reschedule_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reschedule_request_id BIGINT NOT NULL,
    date DATE NOT NULL,
    slot VARCHAR(20) NOT NULL,
    is_selected BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (reschedule_request_id) REFERENCES reschedule_requests(id) ON DELETE CASCADE,
    
    INDEX idx_reschedule_request_id (reschedule_request_id),
    INDEX idx_date_slot (date, slot)
);
