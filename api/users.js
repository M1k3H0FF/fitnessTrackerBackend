/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const {getUserByUsername, createUser, getAllRoutinesByUser, getAllPublicRoutines, getPublicRoutinesByUser} = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
// POST /api/users/register

router.post('/register', async (req, res, next) => {
    
    const {username, password} =req.body;
    console.log(username, 'line9')
    try {
        const _user = await getUserByUsername(username)
    
        if (_user) {
            next({
              name: 'UserExistsError',
              message: `User ${ username } is already taken.`
            });
          }
        if (password.length < 8){ 
            res.send({
            error: 'too short',
            message: "Password Too Short!",
            name: 'you a shorty'
        });
    }
        

          const user = await createUser({
            username,
            password
          });

          const token = jwt.sign({ 
            id: user.id, 
            username
          }, JWT_SECRET, {
            expiresIn: '1w'
          });
      
          res.send({ 
            message: "thank you for signing up",
            token,
            user
          });
        } catch ({ name, message }) {
          next({ name, message })
        } 
})
// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    // request must have both
    if (!username || !password){
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }
    try {
        const user = await getUserByUsername(username);
     
    
        if (user) {
          const jwtToken = jwt.sign({ 
            id: user.id, 
            username
          },JWT_SECRET, {
            expiresIn: '1w'
          });
            console.log(jwtToken)
          res.send(
            {
               message: "you're logged in!",
              token: jwtToken,
              user
            }
          );
        } else {
          next({ 
            error: 'Incorrect username or password', 
            message: 'Username or password is incorrect',
            name: 'IncorrectCredentialsError'
          });
        }
      } catch(error) {
        console.log(error);
        next(error);
      }
    });

// GET /api/users/me
router.get('/me', async (req, res, next)=>{
    try{
    if(req.user){
        res.send(req.user)
    }else {
        res
        .status(401)
        .send({
            error: "401 - Unautherized",
            message: 'You must be logged in to perform this action',
            name: 'Unautherized'
        })
    }
    } catch(error) {
        next(error)
    }
});
// GET /api/users/:username/routines
router.get('/:username/routines', async (req, res, next)=> {
    try {
        if (req.user.username === req.params.username) {
            const routines = await getAllRoutinesByUser({username: req.params.username})
            res.send(routines)
        } else { 
            const publicRoutines = await getPublicRoutinesByUser({username: req.params.username})
            res.send(publicRoutines)            
        }
    } catch (error) {
        next(error)
    }
})
module.exports = router;
