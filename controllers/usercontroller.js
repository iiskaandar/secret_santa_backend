import db from '../models/connection';

import {
    isEmpty,
} from '../helpers/validations';

import {
    createUserQuery,
    getUsersQuery,
    getUserQuery,
    setNotToDraw,
    setDrawnPerson
} from '../models/queries.js';

import {
    errorMessage, successMessage, status,
} from '../helpers/status';
import {
    randomSanta
} from '../helpers/randomSanta';

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
        return res.status(status.bad).send(errorMessage);
    }
    const response = await db.query(getUserQuery, [name]);
    if (response.rows.length > 0) {
        errorMessage.error = 'User with that name already exists';
        return res.status(status.conflict).send(errorMessage);
    } 
    const values = [
        name,
        password
    ];
    try {
        await db.query(createUserQuery, values);
        const response = await db.query(getUserQuery, [name]);
        const dbResponse = response.rows[0];
        delete dbResponse.password;
        successMessage.data = dbResponse
        return res.status(status.created).send(successMessage);
    } catch (e) {
        console.log(e);

        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
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
        return res.status(status.bad).send(errorMessage);
    }
    try {
        const { rows } = await db.query(getUserQuery, [name]);
        const dbResponse = rows[0];
        if (!dbResponse) {
            errorMessage.error = 'User with this name does not exist';
            return res.status(status.notfound).send(errorMessage);
        }
        if (dbResponse.password !== password) {
            errorMessage.error = 'The password you provided is incorrect';
            return res.status(status.bad).send(errorMessage);
        }
        delete dbResponse.password;
        successMessage.data = dbResponse
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        console.log(error);
        return res.status(status.error).send(errorMessage);
    }

};

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
            return res.status(status.error).send(errorMessage);
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
        return res.status(status.error).send(errorMessage);
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
        return res.status(status.error).send(errorMessage);
    }
    try {
        const dbResponse = await db.query(setNotToDraw, [id, userId]);
        if (!dbResponse) {
            errorMessage.error = 'Could not set this person to not draw';
            return res.status(status.error).send(errorMessage);
        }
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        console.log(error);
        return res.status(status.error).send(errorMessage);
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
        const dbResponse = await db.query(getUsersQuery);
        if (!dbResponse || !dbResponse.rows) {
            errorMessage.error = 'Something went wrong when getting all users from database';
            return res.status(status.error).send(errorMessage);
        }
        if(dbResponse.rows.length < 3) {
            errorMessage.error = 'List of users is too small. You need more then 2 users.';
            return res.status(status.conflict).send(errorMessage);
        }
        const arrayID = dbResponse.rows.map((row) => {
            return row.id
        })
        await randomSanta(arrayID)
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Operation was not successful';
        console.log(error);
        return res.status(status.error).send(errorMessage);
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
