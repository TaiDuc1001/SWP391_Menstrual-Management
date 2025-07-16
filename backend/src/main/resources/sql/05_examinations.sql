INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (1, 3, 2, 9, 1, '2025-06-23', 1, 4);
INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (2, 3, 2, 1, 2, '2025-06-24', 1, 2);
INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (3, 3, 2, 2, 3, '2025-06-25', 1, 1);

INSERT INTO results (id, order_id, code) VALUES (1, 1, 'RES-20250618-003');
INSERT INTO results (id, order_id, code) VALUES (2, 2, 'RES-20250624-002');
INSERT INTO results (id, order_id, code) VALUES (3, 3, 'RES-20250625-003');



INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (1, 7, 'Negative', 'No Hepatitis B surface antigen detected', 0);
INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (1, 8, 'Negative', 'No Hepatitis C antibodies detected', 0);
INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (2, 13, 'Negative', 'HIV RNA not detected', 0);
INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (2, 14, '700', 'CD4+ T cell count within normal range', 0);
