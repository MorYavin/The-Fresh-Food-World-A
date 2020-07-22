const express = require('express');
const router2 = express.Router();
const jwt = require("jsonwebtoken");
const jwtLogic = require('../helpers/jwt');
const User = require('../models/user-model');
const authLogic = require('../business-logic/auth-logic');

// Check stage 1 of registration 
router2.post('/validate', async (request, response) => {
    try {
        const credentials = request.body;
        const checkEmail = await authLogic.doesEmailExist(credentials.emailAddress);
        if (typeof(checkEmail[0])==="undefined") {
            const checkId = await authLogic.doesUserIdExist(credentials.customerId);
            if (typeof(checkId[0])==="undefined"){
                response.json(credentials);
            } else if (checkId[0]._id){
                response.json("ID already exists");
                return;
            }
         } else if (checkEmail[0]._id){
             response.json("Email already Exists");
             return;
         }
    } catch (error) {
        response.status(500).send(error.message);
    }
})

// Register
router2.post('/register', async (request, response) => {
    try {
        const user = new User(request.body);
        user.role = "user";
        const newUser = await authLogic.addUser(user);
        newUser.password = null;
        const jwtToken = jwt.sign({ user: newUser }, 'secretkey');
        response.json({ user: newUser, jwtToken });
    } catch (error) {
        response.status(500).send(error);
    }
});

// Login
router2.post('/login', async (request, response) => {
    try {
        const credentials = request.body;
        const loggedUser = await authLogic.login(credentials);
        if (loggedUser.length === 0) {
            response.json('Wrong email or password, please check again');
            return;
        }
        const user = loggedUser[0];
        const jwtToken = jwt.sign({ user }, 'secretkey');
        request.session.isLoggedIn = true;
        request.session.user = user;
        const userRole = user.role;
        request.session.role = userRole;
        response.json({ user, jwtToken });
        return userRole;

    } catch (error) {
        response.status(500).send(error.message);
    }
});

// Get token
router2.get('/isLoggedIn', jwtLogic.verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.json(err);
        } else {
            res.json(authData);
        }
    });
});

// Logout
router2.post("/logout", (request, response) => {
    request.session.destroy();
    response.send();
});


module.exports = router2;
