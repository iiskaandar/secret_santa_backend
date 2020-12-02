import db from '../models/connection';

import {
    isEmpty,
} from '../helpers/validations';

import {
    createUserQuery,
    getUsersQuery,
    getUserQuery,
    setNotToDraw,
    setDrawnPerson,
    getUserByIdQuery
} from '../models/queries.js';

import {
    errorMessage, successMessage, status,
} from '../helpers/status';
import {
    randomSanta
} from '../helpers/randomSanta';

import { io } from '../app'

/**
   * Create A User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
const createUser = async (req, res) => {
    const {
        name, password
    } = req.body;

    if (isEmpty(name) || isEmpty(password)) {
        errorMessage.error = 'Password, name field cannot be empty';
        return res.status(status.success).send(errorMessage);
    }
    const response = await db.query(getUserQuery, [name]);
    if (response.rows.length > 0) {
        errorMessage.error = 'User with that name already exists';
        return res.status(status.success).send(errorMessage);
    } 
    const values = [
        name,
        password
    ];
    try {
        await db.query(createUserQuery, values);
        const listOfUsers = await getUsersStatic()
        io.sockets.emit('NewUser', listOfUsers);
        console.log(io.sockets)
        const response = await db.query(getUserQuery, [name]);
        const dbResponse = response.rows[0];
        delete dbResponse.password;
        successMessage.data = dbResponse
        return res.status(status.success).send(successMessage);
    } catch (e) {
        console.log(e);

        errorMessage.error = 'Operation was not successful';
        return res.status(status.success).send(errorMessage);
    }
};

/**
   * Signin
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
const signinUser = async (req, res) => {
    const { name, password } = req.body;
    if (isEmpty(name) || isEmpty(password)) {
        errorMessage.error = 'Email or Password detail is missing';
        return res.status(status.success).send(errorMessage);
    }
    try {
        const { rows } = await db.query(getUserQuery, [name]);
        const dbResponse = rows[0];
        if (!dbResponse) {
            errorMessage.error = 'User with this name does not exist';
            return res.status(status.success).send(errorMessage);
        }
        if (dbResponse.password !== password) {
            errorMessage.error = 'The password you provided is incorrect';
            return res.status(status.success).send(errorMessage);
        }
        delete dbResponse.password;
        successMessage.data = dbResponse
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        console.log(error);
        return res.status(status.success).send(errorMessage);
    }

};

const getUsersStatic = async () => {
    const dbResponse = await db.query(getUsersQuery);
    if (!dbResponse || !dbResponse.rows) {
        errorMessage.error = 'Something went wrong when getting all users from database';
        return res.status(status.success).send(errorMessage);
    }
    dbResponse.rows.map((row) => {
        delete row.password
        delete row.isadmin;
        delete row.nottodraw;
        delete row.drawnperson;
        return row;
    })
    return dbResponse.rows
}

/**
   * GetUsers
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  const getUsers = async (req, res) => {
    try {
        const dbResponse = await db.query(getUsersQuery);
        if (!dbResponse || !dbResponse.rows) {
            errorMessage.error = 'Something went wrong when getting all users from database';
            return res.status(status.success).send(errorMessage);
        }
        dbResponse.rows.map((row) => {
            delete row.password
            return row;
        })
        successMessage.data = dbResponse.rows
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        console.log(error);
        return res.status(status.success).send(errorMessage);
    }
};

/**
   * SetNotToDrawPerson
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  const setNotToDrawPerson = async (req, res) => {
    const { id, userId } = req.body;
    if(id === userId) {
        errorMessage.error = 'You cannot set yourself to not to draw';
        return res.status(status.success).send(errorMessage);
    }
    try {
        let dbResponse = await db.query(setNotToDraw, [id, userId]);
        if (!dbResponse) {
            errorMessage.error = 'Could not set this person to not draw';
            return res.status(status.success).send(errorMessage);
        }
        const { rows } = await db.query(getUserByIdQuery, [userId]);
        dbResponse = rows[0];
        delete dbResponse.password;
        successMessage.data = dbResponse
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        console.log(error);
        return res.status(status.success).send(errorMessage);
    }
};

/**
   * DrawRandomSanta
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  const drawRandomSanta = async (req, res) => {
    try {
        let dbResponse = await db.query(getUsersQuery);
        if (!dbResponse || !dbResponse.rows) {
            errorMessage.error = 'Something went wrong when getting all users from database';
            return res.status(status.success).send(errorMessage);
        }
        if(dbResponse.rows.length < 3) {
            errorMessage.error = 'List of users is too small. You need more then 2 users.';
            return res.status(status.success).send(errorMessage);
        }
        const arrayID = dbResponse.rows.map((row) => {
            return row.id
        })
        let pairDictNotToDraw = {}
        dbResponse.rows.forEach(({id, nottodraw}) => {
            pairDictNotToDraw = {...pairDictNotToDraw, [id]: nottodraw}
        })
        await randomSanta(arrayID, pairDictNotToDraw)
        dbResponse = await db.query(getUsersQuery);
        io.sockets.sockets.forEach(async (socket) => {
            console.log(socket.handshake.query.id)
            const { rows } = await db.query(getUserByIdQuery, [socket.handshake.query.id]);
            dbResponse.rows.forEach(({id, name}) => {
                if(rows[0].drawnperson === id){
                    console.log(name)
                    io.to(socket.id).emit('NewDrawnPerson', name);
                }
            })
        });
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        console.log(error);
        return res.status(status.success).send(errorMessage);
    }
};

const setDrawnPersonById = async (arrayOfPairs) => {
    try {
        const query = setDrawnPerson(arrayOfPairs)
        console.log(query)
        await db.query(query);
    } catch (error) {
        console.log(error);
    }
};



export {
    createUser,
    signinUser,
    getUsers,
    setNotToDrawPerson,
    setDrawnPersonById,
    drawRandomSanta
};
