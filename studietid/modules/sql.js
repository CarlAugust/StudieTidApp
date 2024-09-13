// Porpuse: This file contains all the functions that interact with the database

const db = require('better-sqlite3')('database.db', { verbose: console.log });


// Here are all the add related functions

// Adds user, returns 0 if successful, 1 if email is invalid and 2 if the email is already in the database
function addUser(req, isAdmin, idRole)
{
    const result = checkMail(req.email);
    if(result === 1)
    {
        return 1;
    }
    else if (result === 2)
    {
        return 2;
    }

    let sql = db.prepare(`INSERT INTO user (firstName, lastName, idRole, isAdmin, email) VALUES (?, ?, ?, ?, ?)`);
         
    sql.run(req.firstName, req.lastName, idRole, isAdmin, req.email);

    return 0;
};

function addActivity(userID, idSubject, idRoom)
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

function addRoom(name)
{
    let sql = db.prepare(`INSERT INTO room (name) VALUES (?)`);
    const info = sql.run(name);

    sql = db.prepare(`SELECT * FROM room WHERE id = ?`);

    let rows = sql.all(info.lastInsertRowid);
    console.log("Rowslength:" + rows.length);

    return rows[0];
}

function addSubject(name)
{
    let sql = db.prepare(`INSERT INTO subject (name) VALUES (?)`);
    const info = sql.run(name);

    sql = db.prepare(`SELECT * FROM subject WHERE id = ?`);

    let rows = sql.all(info.lastInsertRowid);
    console.log("Rowslength:" + rows.length);

    return rows[0];
}

// Here are all the delete related functions

function deleteUser(email)
{   
    let row = getUser(email);

    let sql = db.prepare(`DELETE FROM activity WHERE idUser = ?`);
    sql.run(row.userID);

    sql = db.prepare(`DELETE FROM user WHERE id = ?`);
    sql.run(row.userID);

    console.log("Termination successful");
}

function deleteSubject(name)
{
    let sql = db.prepare(`DELETE FROM subject WHERE name = ?`);
    sql.run(name);
}

function deleteRoom(name)
{
    let sql = db.prepare(`DELETE FROM room WHERE name = ?`);
    sql.run(name);
}

// Here are all the get related functions

function getUser(email)
{
    let sql = db.prepare(
        `SELECT user.id as userID, user.firstName, user.lastName, role.id as roleID, role.name as role, user.email
        FROM user
        inner join role on user.idRole = role.id
        WHERE user.email = ?`);

    let rows = sql.all(email);

    return rows[0];
}

function getUsers()
{
    let sql = db.prepare(
        `SELECT user.id as userID, user.firstName, user.lastName, role.id as roleID, role.name as role, user.email
        FROM user
        inner join role on user.idRole = role.id`);

    let rows = sql.all();

    return rows;
}

// Here are all the verification related functions

// A function that returns 1 if email is invalid and 2 if the email is already in the database
function checkMail(email)
{
    let re = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    // If the reg test is invalid, it returns 1
    if (!re.test(email))
    {
        console.log("Invalid Email")
        return 1;
    }

    let sql = db.prepare(`SELECT email FROM user WHERE email = ?`);
    let rows = sql.all(email);
    
    // Returns 2 if the email is already in the database
    if (rows.length > 0)
    {
        return 2;
    }
}

// Exports

module.exports = {
    addUser,
    addActivity,
    addRoom,
    addSubject,
    deleteUser,
    deleteSubject,
    deleteRoom,
    getUser,
    getUsers,
    checkMail
  };