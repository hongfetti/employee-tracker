import inquirer from 'inquirer';
import { pool } from './db/connection.js';

class Cli {

    async pausePrompt() {
        await inquirer.prompt([
            {
                type: "input",
                name: "continue",
                message: "Press Enter to continue...",
            },
        ]);
    }

    startApp() {
    inquirer
        .prompt([{
            type: "list",
            name: "selectAction",
            message: "What would you like to do?",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Quit",
            ],
        }
    ])
        .then( async (answers)  => {
            if (answers.selectAction === 'View All Departments') {
                try {
                    const query = `SELECT id, department_name FROM department`;
                    const results = await pool.query(query);

                    console.table(results.rows);

                    await this.pausePrompt();

                } catch (err) {
                    console.error('Error connecting to database:', err);
                }
            // } else if (answers.selectAction === 'Add Department') {
            } else if (answers.selectAction === 'View All Roles') {
                try {
                    const query = `
                    SELECT 
                        role.id, 
                        role.title,
                        role.salary,
                        department.department_name
                    FROM role
                    JOIN department ON role.department_id = department.id
                    `;
                    const results = await pool.query(query);

                    console.table(results.rows);

                    await this.pausePrompt();

                } catch (err) {
                    console.error('Error connecting to database:', err);
                }
            // } else if (answers.selectAction === 'Add Role') {

        } else if (answers.selectAction === "View All Employees") {
                try {
                    const query = `
                    SELECT 
                        e1.id AS employee_id, 
                        e1.first_name AS employee_name, 
                        e1.last_name, 
                        e2.first_name AS manager_name,
                        department.department_name,
                        role.title 
                    FROM employee e1
                    LEFT JOIN employee e2 ON e1.manager_id = e2.id 
                    JOIN role ON e1.role_id = role.id
                    JOIN department ON role.department_id = department.id;
                    `                   
                    const result = await pool.query(query);
                    console.table(result.rows);
                    
                    await this.pausePrompt();

                } catch (err) {
                    console.error('Error connecting to database:', err);
                }
            
        } else if (answers.selectAction === 'Add Employee') {
            try {
                const rolesQuery = `SELECT id, title FROM role`;
                const rolesResult = await pool.query(rolesQuery);
                const roleChoices = rolesResult.rows.map(role => ({
                    name: role.title,
                    value: role.id
                }))

                const managersQuery = `SELECT id, first_name FROM employee WHERE manager_id IS NULL`;
                const managersResult = await pool.query(managersQuery);
                const managerChoices = managersResult.rows.map(manager => ({
                    name: manager.first_name,
                    value: manager.id
                }));

                managerChoices.unshift({name: 'None', value: null});

                const employeeAnswers = await inquirer.prompt ([
                {
                    type: 'input',
                    name: 'newFirstName',
                    message: 'Please enter first name.',
                },
                {
                    type: 'input',
                    name: 'newLastName',
                    message: 'Please enter last name.',
                },
                {
                    type: 'list',
                    name: 'newRole',
                    message: 'Please select the role for the employee',
                    choices: roleChoices
                },
                {
                    type: 'list',
                    name: 'reportsTo',
                    message: 'Please select the manager for this employee',
                    choices: managerChoices
                },
            ]);
            
                const query = `
                INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ($1, $2, $3, $4);
                `;
                const values = [
                    employeeAnswers.newFirstName,
                    employeeAnswers.newLastName,
                    employeeAnswers.newRole,
                    employeeAnswers.reportsTo 
  
                ];
                await pool.query(query, values);
                console.log(`${employeeAnswers.newFirstName} ${employeeAnswers.newLastName} successfully added!`);
        
            } catch (err) {
            console.error('Error:', err)
        }
        
    
        } else if (answers.selectAction === 'Update Employee Role') {
            try {
                const employeeQuery = `SELECT id, first_name FROM employee`;
                const employeeResult = await pool.query(employeeQuery);
                const employeeChoices = employeeResult.rows.map(employee => ({
                    name: employee.first_name,
                    value: employee.id
                }))

                const roleQuery = `SELECT id, title FROM role`
                const roleResult = await pool.query(roleQuery);
                const roleChoices = roleResult.rows.map(role => ({
                    name: role.title,
                    value: role.id
                }))

                const employeeAnswers = await inquirer.prompt([
                {
                    type: "list",
                    name: "updateEmployee",
                    message: "Please select the employee to update",
                    choices: employeeChoices
                },
                {
                    type: "list",
                    name: "newRole",
                    message: 'Please select the new role.',
                    choices: roleChoices
                }
                ]);
                
                const currentRoleQuery = `SELECT role_id FROM employee WHERE id = $1`;
                const currentRoleResult = await pool.query(currentRoleQuery, [employeeAnswers.updateEmployee]);
                const currentRoleId = currentRoleResult.rows[0].role_id

                if (employeeAnswers.newRole === currentRoleId) {
                    console.log('The selected role is the same as the current role. Please select a different role')
                } else {
                    const updateQuery = `UPDATE employee SET role_id = $1 WHERE id =$2`;
                    await pool.query(updateQuery, [employeeAnswers.newRole, employeeAnswers.updateEmployee]);
                    console.log(`Employee's role successfully updated!`)
                }

            } catch (err) {
                console.error('Error:', err);
            }
    }
         else if (answers.selectAction === 'Quit') {
            console.log("Exiting the application...");
            process.exit(0);
    }
        this.startApp();
    }
);
}
}


const test = new Cli
test.startApp()