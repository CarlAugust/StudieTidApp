const db = require('better-sqlite3')('database.db', { verbose: console.log });

function addUser(firstName, lastName, idRole, isAdmin, email)
{

    let sql = db.prepare(`INSERT INTO user (firstName, lastName, idRole, isAdmin, email)
         VALUES (?, ?, ?, ?, ?)`);
         
    const info = sql.run(firstName, lastName, idRole, isAdmin, email);

    sql = db.prepare(`SELECT user.id as userID, role.id as roleID, role.name as role 
                    FROM user
                    inner join role on user.idRole = role.id
                    WHERE user.id = ?`);

    let rows = sql.all(info.lastInsertRowid);
    console.log("Rowslength:" + rows.length);

    return rows[0];
};

addUser("John", "Doe", 3, 0, "johndoe@gmail.com");