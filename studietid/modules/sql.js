// Porpuse: This file contains all the functions that interact with the database

import Database from 'better-sqlite3';
const db = new Database('database.db', { verbose: console.log });


// Here are all the add related functions
//------------------------------------------------//

export function addUser(firstName, lastName, email, password, isAdmin, idRole)
{
    let re = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    if (!re.test(email))
    {
        return "Invalid";
    }

    let sql = db.prepare(`SELECT email FROM user WHERE email = ?`);

    let rows = sql.all(email);
    
    if (rows.length > 0)
    {
        return "InUse";
    }

    sql = db.prepare(`INSERT INTO user (firstName, lastName, email, password, idRole, isAdmin) VALUES (?, ?, ?, ?, ?, ?)`);
         
    sql.run(firstName, lastName, email, password, idRole, isAdmin);

    return "Success";
};

export function addActivity(userID, idSubject, idRoom)
{
    let date = new Date();
    date = date.toISOString().slice(0, 19).replace('T', ' ');

    let sql = db.prepare(`INSERT INTO activity (idUser, startTime, idSubject, idRoom, idStatus, duration)
         VALUES (?, ?, ?, ?, 1, 0)`);
         
    const info = sql.run(userID, date, idSubject, idRoom);

    sql = db.prepare(`SELECT * FROM activity WHERE id = ?`);

    let rows = sql.all(info.lastInsertRowid);
    console.log("Rowslength:" + rows.length);

    return rows[0];
}

export function addRoom(name)
{
    let sql = db.prepare(`INSERT INTO room (name) VALUES (?)`);
    const info = sql.run(name);

    sql = db.prepare(`SELECT * FROM room WHERE id = ?`);

    let rows = sql.all(info.lastInsertRowid);
    console.log("Rowslength:" + rows.length);

    return rows[0];
}

export function addSubject(name)
{
    let sql = db.prepare(`INSERT INTO subject (name) VALUES (?)`);
    const info = sql.run(name);

    sql = db.prepare(`SELECT * FROM subject WHERE id = ?`);

    let rows = sql.all(info.lastInsertRowid);
    console.log("Rowslength:" + rows.length);

    return rows[0];
}

// Here are all the delete related functions
//------------------------------------------------//

export function deleteUser(email)
{   
    let row = getUser(email);

    let sql = db.prepare(`DELETE FROM activity WHERE idUser = ?`);
    sql.run(row.userID);

    sql = db.prepare(`DELETE FROM user WHERE id = ?`);
    sql.run(row.userID);

    console.log("Termination successful");
}

export function deleteSubject(name)
{
    let sql = db.prepare(`DELETE FROM subject WHERE name = ?`);
    sql.run(name);
}

export function deleteRoom(name)
{
    let sql = db.prepare(`DELETE FROM room WHERE name = ?`);
    sql.run(name);
}

// Here are all the get related functions
//------------------------------------------------//

export function getUser(email)
{
    let sql = db.prepare(
        `SELECT user.id as userID, user.firstName, user.lastName, role.id as roleID, role.name as role, user.email, user.password as password, user.isAdmin as isAdmin
        FROM user
        inner join role on user.idRole = role.id
        WHERE user.email = ?`);

    let rows = sql.all(email);

    return rows[0];
}

export function getUsers()
{
    let sql = db.prepare(
        `SELECT user.id as userID, user.firstName, user.lastName, role.id as roleID, role.name as role, user.email, user.password as password, user.isAdmin as isAdmin
        FROM user
        inner join role on user.idRole = role.id`);

    let rows = sql.all();

    return rows;
}

export function getSubjects()
{
    let sql = db.prepare(`SELECT * FROM subject`);

    let rows = sql.all();

    return rows;
}

export function getRooms()
{
    let sql = db.prepare(`SELECT * FROM room`);

    let rows = sql.all();

    return rows;
}

export function getActivities()
{
    let sql = db.prepare(`SELECT * FROM activity`);

    let rows = sql.all();

    return rows;
}

export function getActivity(id)
{
    let sql = db.prepare(`SELECT * FROM activity WHERE idUser = ?`);

    let rows = sql.all(id);

    return rows;
}