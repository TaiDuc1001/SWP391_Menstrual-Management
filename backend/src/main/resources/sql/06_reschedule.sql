
INSERT INTO reschedule_requests (id, appointment_id, customer_id, doctor_id, customer_note, status, created_at, updated_at) 
VALUES (1, 1, 3, 1, 'Need to reschedule due to work conflict', 'PENDING', '2025-06-01 10:00:00', '2025-06-01 10:00:00');

INSERT INTO reschedule_requests (id, appointment_id, customer_id, doctor_id, customer_note, status, created_at, updated_at) 
VALUES (2, 2, 3, 1, 'Family emergency, please reschedule', 'APPROVED', '2025-06-02 09:30:00', '2025-06-02 14:15:00');

INSERT INTO reschedule_options (id, reschedule_request_id, date, slot, is_selected) 
VALUES (1, 1, '2025-06-05', 3, true);

INSERT INTO reschedule_options (id, reschedule_request_id, date, slot, is_selected) 
VALUES (2, 2, '2025-06-04', 5, true);
