const createUserQuery = `INSERT INTO Persons (Name, Password)
VALUES ($1, $2)`;

const getUsersQuery = 'SELECT * from Persons';

const getUserQuery = 'SELECT * FROM Persons WHERE Name=$1';

const setNotToDraw = 'UPDATE PERSONS SET notToDraw=$1 WHERE ID=$2;'

const setDrawnPerson = (arrayOfPairs) => {
    'UPDATE Persons SET drawnPerson = (case when id = 3 then 2 when id = 11 then 3  when id = 15 then 12 end);'
    let query = 'UPDATE Persons SET drawnPerson = (case '
    arrayOfPairs.forEach(({firstId, secondId}) => {
        query = query + `when id = ${firstId} then ${secondId}`
    })
    query = query +  'end);'
    return(query)
}

export {
    createUserQuery,
    getUsersQuery,
    getUserQuery,
    setNotToDraw,
    setDrawnPerson
};