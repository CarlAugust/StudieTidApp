// Porpuse: This file contains all the functions that interact with the database

import Database from 'better-sqlite3';
import * as fileparser from './fileparser.js';
import fs from 'fs';
const db = new Database('database/database.db');


export function initializeDatabase()
{   
    const sql = fs.readFileSync('database/initdb.sql').toString();
    db.exec(sql);

    // Add roles

    let roles = ['Administrator', 'Lærer', 'student'];

    for (const role of roles)
    {
        // Try catch to avoid duplicate entries with roles unique constraint
        // Probobly bad solution might cahnge later
        try { db.prepare(`INSERT INTO role (name) VALUES (?)`).run(role); }
        catch (e) { }
    }
}

// Here are all the add related functions
//------------------------------------------------//

export function addUser(firstName, lastName, email, password, idClass, isAdmin, idRole)
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

    sql = db.prepare(`INSERT INTO user (firstName, lastName, idRole, isAdmin, email, password, idClass) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    sql.run(firstName, lastName, idRole, isAdmin, email, password, idClass);

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

export function addSubject(name, code)
{
    let existingItem = db.prepare(`SELECT * FROM subject WHERE code = ?`).get(code);

    if (existingItem)
    {
        return existingItem.id;
    }
    else
    {
        const result = db.prepare(`INSERT INTO subject (name, code) VALUES (?, ?)`).run(name, code);
        return result.lastInsertRowid;
    }
}

function addClass(name)
{
    const existingItem = db.prepare(`SELECT * FROM class WHERE name = ?`).get(name);

    if (existingItem)
    {
        return existingItem.id;
    }
    else
    {
        const result = db.prepare(`INSERT INTO class (name) VALUES (?)`).run(name);
        return result.lastInsertRowid;
    }
}

function addSubjectClass(subjectId, classId)
{
    const existingItem = db.prepare(`SELECT * FROM subject_class WHERE idSubject = ? AND idClass = ?`).get(subjectId, classId);

    if (existingItem)
    {
        return existingItem.id;
    }
    else
    {
        const result = db.prepare(`INSERT INTO subject_class (idSubject, idClass) VALUES (?, ?)`).run(subjectId, classId);
        return result.lastInsertRowid;
    }
}

// Here are all the delete related functions
//------------------------------------------------//

export function deleteUser(email)
{   
    let row = getUser(email);

    // To anonymize the data we change the idUser to 1, which is the root user
    let sql = db.prepare(`UPDATE activity SET idUser = 1 WHERE idUser = ?`);
    sql.run(row.userID);

    sql = db.prepare(`DELETE FROM user WHERE id = ?`);
    sql.run(row.userID);
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

export function getPassword(email)
{
    let sql = db.prepare(`SELECT password FROM user WHERE email = ?`);
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
    let sql = db.prepare(`SELECT 
    activity.id AS activity_id,
    activity.startTime,
    activity.idStatus,
    activity.idSubject,
    activity.idRoom,
    user.id AS user_id,
    user.firstName,
    user.lastName,
    subject.name as subject,
    room.name as room
    FROM 
    activity
    INNER JOIN 
    user ON activity.idUser = user.id
    INNER JOIN
    subject ON activity.idSubject = subject.id
    INNER JOIN
    room ON activity.idRoom = room.id
    ORDER BY user.firstName ASC
    ;`);

    let rows = sql.all();

    return rows;
}

export function getActivity(id)
{
    let sql = db.prepare(`SELECT * FROM activity WHERE idUser = ?`);

    let rows = sql.all(id);

    return rows;
}

export function approveActivity(id)
{
    let sql = db.prepare(`UPDATE activity SET idStatus = 2 WHERE id = ?`);

    sql.run(id);
}

export function denyActivity(id)
{
    let sql = db.prepare(`UPDATE activity SET idStatus = 3 WHERE id = ?`);

    sql.run(id);
}

// file adding functions
//------------------------------------------------//

export function updateSubjectClassRelations()
{
    let data = fileparser.readGroupData('grupper');

    for (let i = 0; i < data.Subject.Name.length; i++)
    {   

        let subjectId = addSubject(data.Subject.Name[i], data.Subject.Code[i]);
        let classes = data.Subject.ClassesToCodes[i];

        for (const c of classes)
        {
            let classId = addClass(c);
            addSubjectClass(subjectId, classId);
        }
    }
}


// Function does not work, simply making the framework
export function updateUsers()
{
    // Forgot file name
    let data = fileparser.readUserData('elevdata');

    for (let i = 0; i < data.Email.length; i++)
    {
        // Uses addClass cause it assumes that the users class isnt always in the db, however this is unrealistic
        let classId = addClass(data.Class[i]);
        // Email does not come with domain in csv file
        addUser(data.FirstName[i], data.LastName[i], data.Email + "@iskule.no", "Passord01", classId, 0, 3);
    }
}