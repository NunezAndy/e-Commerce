const express = require('express')
const usersRouter = express.Router();
const { requireUser } = require("./utils");

const {
    createUser,
    getUser,
    getUserByEmail,
    getAllUsers,
    getUserById
} = require('../db');

const jwt = require('jsonwebtoken')

usersRouter.get('/', async( req, res, next) => {
    try {
        const users = await getAllUsers();

        res.send({
            users
        });
    } catch ({name, message}) {
        next({name, message})
    }
});

usersRouter.post('/login', async(req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) {
        next({
            name: 'MissingCredentialsError',
            message: 'Please supply both an email and password'
        });
    }
    try {
        const user = await getUser({email, password});
        if(user) {
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                
                
            }, process.env.JWT_SECRET, {
                expiresIn: '1w'
            });

            res.send({
                message: 'Login successful!',
                token,
                user
            });
        }
        else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect'
            });
        }
    } catch(err) {
        next(err);
    }
});

usersRouter.post('/register', async(req, res, next) => {
    const { name, email, password, isAdmin } = req.body;

    try {
        const _user = await getUserByEmail(email);

        if(_user) {
            next({
                name: 'UserExistsError',
                message: 'A user with that email already exists'
            });
        }

        const user = await createUser({
            name,
            email,
            password,
            isAdmin
        });

        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: '1w'
        });

        res.send({
            message: 'Sign up successful!',
            token,
            user
        });
    } catch({name, message}) {
        next({name, message})
    }
})

usersRouter.get('/:id', async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);
        res.send(user);
    } catch (error) {
        next(error);
    }
});

usersRouter.get('/me', requireUser, (req, res) => {
    // The user information is attached to the request object by the middleware
    const user = req.user;
    // Send the user information as the response
    res.json({ user });
  });


module.exports = usersRouter;