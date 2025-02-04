import inquirer from 'inquirer';
import { pool } from './db/connection.js';

class Cli {
    exit: boolean = false;

    startApp() {
    inquirer
        .prompt([{
            type: "list",
            name: "selectActions",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit",
            ],
        }
    ])
        .then( async (answers)  => {
            if (answers.action === "View All Emloyees") {
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
                    console.table(result.rows)
                } catch (err) {
                    console.error('Error connecting to database:', err);
                    this.startApp()
                }
            }
        // } else if (answers.action === 'Add Employee') {

        // } else if (answers.action === 'Update Employee Role') {

        // } else if (answers.action === 'View All Roles') {

        // } else if (answers.action === 'Add Role') {

        // } else if (answers.action === 'View All Departments') {

        // } else if (answers.action === 'Add Department') {

        // }
         else {
        this.exit = true;
    }
    if (!this.exit) {
        this.startApp();
    }
    });
}
}


const test = new Cli
test.startApp()