const db = require('better-sqlite3')('database.db', { verbose: console.log });


// Here are all the add related functions

function addUser(firstName, lastName, idRole, isAdmin, email)
{
    if(checkMail(email)) {
        console.log("Invalid Email");
        return 1;
    }

    let sql = db.prepare(`INSERT INTO user (firstName, lastName, idRole, isAdmin, email)
         VALUES (?, ?, ?, ?, ?)`);
         
    const info = sql.run(firstName, lastName, idRole, isAdmin, email);

    sql = db.prepare(
        `SELECT user.id as userID, role.id as roleID, role.name as role 
        FROM user
        inner join role on user.idRole = role.id
        WHERE user.id = ?`);

    let rows = sql.all(info.lastInsertRowid);
    console.log("Rowslength:" + rows.length);

    return rows[0];
};

function addActivity(userID, idSubject, idRoom)
{
    let date = new Date();
    date = date.toISOString().slice(0, 19).replace('T', ' ');

    let sql = db.prepare(`INSERT INTO activity (idUser, startTime, idSubject, idRoom, idStatus, duration)
         VALUES (?, ?, ?, ?, 1, 0)`);
         
    const info = sql.run(userID, sqlDate, idSubject, idRoom);

    sql = db.prepare(`SELECT * FROM activity WHERE id = ?`);

    let rows = sql.all(info.lastInsertRowid);
    console.log("Rowslength:" + rows.length);

    return rows[0];
}


// Here are all the delete related functions

function deleteUser(email)
{
    let sql = db.prepare(`DELETE FROM user WHERE email = ?`);
    sql.run(email);
}


// Here are all the get related functions

function getUser(id)
{
    let sql = db.prepare(
        `SELECT user.id as userID, user.firstName, user.lastName, role.id as roleID, role.name as role, user.email
        FROM user
        inner join role on user.idRole = role.id
        WHERE user.id = ?`);

    let rows = sql.all(id);

    return rows[0];
}

// Here are all the verification related functions

function checkMail(email)
{
    let re = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    if (!re.test(email)) {
        console.log("Invalid Email")
        return true;
    }

    let sql = db.prepare(`SELECT email FROM user WHERE email = ?`);
    let rows = sql.all(email);

    return rows.length > 0;
}