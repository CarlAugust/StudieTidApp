PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS activity (
    id        INTEGER  PRIMARY KEY AUTOINCREMENT,
    idUser    INTEGER,
    startTime DATETIME NOT NULL,
    idSubject INTEGER,
    idRoom    INTEGER,
    idStatus  TINYINT,
    duration  TINYINT,
    idTeacher INT      REFERENCES user (id),
    FOREIGN KEY (
        idUser
    )
    REFERENCES user (id),
    FOREIGN KEY (
        idSubject
    )
    REFERENCES subject (id),
    FOREIGN KEY (
        idRoom
    )
    REFERENCES room (id),
    FOREIGN KEY (
        idStatus
    )
    REFERENCES status (id) 
);

CREATE TABLE IF NOT EXISTS class (
    id   INTEGER      PRIMARY KEY AUTOINCREMENT
                      UNIQUE
                      NOT NULL,
    name VARCHAR (45) NOT NULL
);

CREATE TABLE IF NOT EXISTS role (
    id   INTEGER      PRIMARY KEY AUTOINCREMENT,
    name VARCHAR (20) NOT NULL
);

CREATE TABLE IF NOT EXISTS room (
    id   INTEGER      PRIMARY KEY AUTOINCREMENT,
    name VARCHAR (45) NOT NULL
);

CREATE TABLE IF NOT EXISTS status (
    id   INTEGER      PRIMARY KEY AUTOINCREMENT,
    name VARCHAR (45) NOT NULL
);

CREATE TABLE IF NOT EXISTS subject (
    id   INTEGER      PRIMARY KEY AUTOINCREMENT,
    name VARCHAR (45) NOT NULL,
    code VARCHAR (45) NOT NULL
);

CREATE TABLE IF NOT EXISTS subject_class (
    idSubject INTEGER REFERENCES subject (id),
    idClass   INTEGER REFERENCES class (id),
    PRIMARY KEY (idSubject, idClass)
);

CREATE TABLE IF NOT EXISTS user (
    id        INTEGER       PRIMARY KEY AUTOINCREMENT,
    firstName VARCHAR (45)  NOT NULL,
    lastName  VARCHAR (45)  NOT NULL,
    idRole    INTEGER,
    isAdmin   TINYINT,
    email     VARCHAR (100) UNIQUE,
    password  TEXT (255),
    class     INTEGER       REFERENCES class (id),
    FOREIGN KEY (
        idRole
    )
    REFERENCES role (id) 
);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
