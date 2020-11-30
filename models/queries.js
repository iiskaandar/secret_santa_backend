const createUserQuery = `INSERT INTO Persons (Name, Password)
VALUES ($1, $2)`;

const getUsersQuery = 'SELECT * from Persons';

const getUserQuery = 'SELECT * FROM Persons WHERE Name=$1';

const setNotToDraw = 'UPDATE PERSONS SET notToDraw=$1 WHERE ID=$2;'

const setDrawnPerson = 'UPDATE PERSONS SET drawnPerson=$1 WHERE ID=$2;'

export {
    createUserQuery,
    getUsersQuery,
    getUserQuery,
    setNotToDraw,
    setDrawnPerson
};