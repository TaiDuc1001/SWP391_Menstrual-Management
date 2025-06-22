INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (1, 3, 2, 9, 1, '2025-06-23', 1, 4);
-- INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (3, 5, 13, 3, 5, '2025-06-17', 1, 4);
-- INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (4, 16, 14, 4, 2, '2025-06-18', 5, 1);
-- INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (5, 17, 15, 5, 4, '2025-06-19', 1, 2);
-- INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (6, 19, 2, 6, 5, '2025-06-20', 2, 1);
-- INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (7, 19, 11, 7, 6, '2025-06-21', 3, 0);
-- INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (8, 20, 12, 8, 7, '2025-06-22', 4, 3);
-- INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (11, 5, 15, 11, 2, '2025-06-25', 2, 1);
-- INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (12, 16, 2, 12, 3, '2025-06-26', 3, 0);
-- INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (13, 17, 11, 13, 4, '2025-06-27', 4, 3);
-- INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (14, 19, 12, 14, 5, '2025-06-28', 1, 4);
-- INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (15, 19, 13, 15, 6, '2025-06-29', 5, 2);
-- INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (16, 20, 14, 16, 7, '2025-06-30', 2, 1);
-- INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (19, 5, 11, 18, 2, '2025-07-03', 1, 4);
-- INSERT INTO examinations (id, customer_id, staff_id, panel_id, slot, date, payment_method, examination_status) VALUES (20, 16, 12, 18, 3, '2025-07-04', 2, 2);

INSERT INTO results (id, order_id, code) VALUES (1, 1, 'RES-20250618-003');
-- INSERT INTO results (id, order_id, code) VALUES (7, 8, 'RES-20250622-008');
-- INSERT INTO results (id, order_id, code) VALUES (8, 9, 'RES-20250623-009');
-- INSERT INTO results (id, order_id, code) VALUES (9, 10, 'RES-20250624-010');
-- INSERT INTO results (id, order_id, code) VALUES (10, 11, 'RES-20250625-011');
-- INSERT INTO results (id, order_id, code) VALUES (11, 12, 'RES-20250626-012');
-- INSERT INTO results (id, order_id, code) VALUES (12, 13, 'RES-20250627-013');
-- INSERT INTO results (id, order_id, code) VALUES (13, 14, 'RES-20250628-014');
-- INSERT INTO results (id, order_id, code) VALUES (14, 15, 'RES-20250629-015');
-- INSERT INTO results (id, order_id, code) VALUES (15, 16, 'RES-20250630-016');
-- INSERT INTO results (id, order_id, code) VALUES (16, 17, 'RES-20250701-017');
-- INSERT INTO results (id, order_id, code) VALUES (17, 18, 'RES-20250702-018');
-- INSERT INTO results (id, order_id, code) VALUES (18, 19, 'RES-20250703-019');
-- INSERT INTO results (id, order_id, code) VALUES (19, 20, 'RES-20250704-020');



INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (1, 3, 'Negative', 'No Neisseria gonorrhoeae DNA detected', 0);
-- INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (7, 7, 'Negative', 'No Hepatitis B surface antigen detected', 0);
-- INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (8, 8, 'Negative', 'No Hepatitis C antibodies detected', 0);
-- INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (9, 9, 'Negative', 'No Ureaplasma urealyticum DNA detected', 0);
-- INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (10, 10, 'Negative', 'No Mycoplasma genitalium DNA detected', 0);
-- INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (11, 11, '2', 'Bacterial vaginosis score normal', 0);
-- INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (12, 12, 'Negative', 'No Candida species cultured', 0);
-- INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (13, 13, 'Negative', 'HIV RNA not detected', 0);
-- INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (14, 14, '700', 'CD4+ T cell count within normal range', 0);
-- INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (15, 15, 'Negative', 'No syphilis TPHA detected', 0);
-- INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (16, 16, 'Negative', 'No Hepatitis B core antibody detected', 0);
-- INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (17, 17, 'Negative', 'Hepatitis B viral load undetectable', 0);
-- INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (18, 18, 'Negative', 'Hepatitis C viral load undetectable', 0);
-- INSERT INTO result_details (result_id, test_type_id, test_index, notes, diagnosis) VALUES (19, 19, 'Negative', 'No HPV 16/18 DNA detected', 0);
