import express from 'express';

import { createUser, signinUser, getUsers, setNotToDrawPerson, drawRandomSanta } from '../controllers/usercontroller';

const router = express.Router();

// users Routes

router.post('/auth/signup', createUser);
router.post('/auth/signin', signinUser);
router.get('/users', getUsers);
router.put('/user/notToDraw', setNotToDrawPerson);
router.get('/draw', drawRandomSanta);

export default router;
