import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

/**
 * This file is used to connect to the database and execute queries
 */

/*
 * this pool is used to connect to the database and execute queries it's pool of connections
 * so we don't have to open a new connection every time we want to execute a query.
 * to have more security we can use .env file to store the database credentials
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
}).promise();

/*
* This function is used to get all the users from the database
 */
export async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
}

/*
* This function is used to get a user by user id from the database
 */
export async function getUser(id) {
    const [rows] = await pool.query(`
    SELECT * FROM users
    WHERE id = ?
    `, [id]);
    return rows[0];
}

/*
* This function is used to create a user in the database
 */
export async function createUser(firstName, lastName, email) {
    const [result] = await pool.query(`
    INSERT INTO users (first_name, last_name, email_address)
    VALUES (?, ?, ?)
    `, [firstName, lastName, email]);
    const id = result.insertId;
    return getUser(id);
}

/*
* This function is used to delete a user by user id from the database
 */
export async function deleteUser(id){
    await pool.query(`
    DELETE FROM users
    WHERE id = ?
    `, [id]);
    return id;
}

// const id = await deleteUser(5);
// const nouser = await getUser(id);
// console.log(nouser);


