INSERT INTO department (department_name)
VALUES ('Sales'),
('HR'),
('IT');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Manager', 100000, 1),
('Salesperson', 80000, 1),
('HR Manager', 90000, 2),
('HR Admin', 50000, 2),
('IT Manager', 100000, 3),
('Software Developer', 80000, 3);

SELECT setval('employee_id_seq', 1, false);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Matt', 'Smith', 1, 1),
('John', 'Doe', 2, null),
('Jane', 'Brown', 3, 2),
('Jill', 'McNeil', 4, null),
('Marc', 'Kim', 5, 3),
('Rebecca', 'Clark', 6, null);

SELECT *
FROM department;

SELECT *
FROM role;

SELECT *
FROM employee;
