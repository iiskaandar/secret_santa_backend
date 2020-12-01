const createUserQuery = `INSERT INTO Persons (Name, Password)
VALUES ($1, $2)`;

const getUsersQuery = 'SELECT * from Persons';

const getUserQuery = 'SELECT * FROM Persons WHERE Name=$1';

const getUserByIdQuery = 'SELECT * FROM Persons WHERE ID=$1';

const setNotToDraw = 'UPDATE PERSONS SET notToDraw=$1 WHERE ID=$2;'

const setDrawnPerson = (arrayOfPairs) => {
    let query = 'UPDATE Persons SET drawnPerson = (case '
    arrayOfPairs.forEach(({firstId, secondId}) => {
        query = query + `when id = ${firstId} then ${secondId} `
    })
    query = query +  'end);'
    return(query)
}

export {
    createUserQuery,
    getUsersQuery,
    getUserQuery,
    setNotToDraw,
    setDrawnPerson,
    getUserByIdQuery
};