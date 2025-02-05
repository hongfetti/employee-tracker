-- SELECT 
--     e1.id AS employee_id, 
--     e1.first_name AS employee_name, 
--     e1.last_name, 
--     e2.first_name AS manager_name,
--     department.department_name,
--     role.title 
-- FROM employee e1
-- LEFT JOIN employee e2 ON e1.manager_id = e2.id 
-- JOIN role ON e1.role_id = role.id
-- JOIN department ON role.department_id = department.id;



-- SELECT 
-- role.id, 
-- role.title,
-- role.salary,
-- department.department_name
-- FROM role
-- JOIN department ON role.department_id = department.id