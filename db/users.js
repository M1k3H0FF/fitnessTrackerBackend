/* eslint-disable no-useless-catch */

const client = require("./client");
// const bcrypt = require('bcrypt');

// database functions

// user functions
async function createUser({ username, password }){
    try {
        const { rows: [ user ] } = await client.query(`
            INSERT INTO users(username, password)
            VALUES ($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING username;
            
        `, [username, password]);
        return user
    } 
    catch (error) {
        throw error;
    } 
} 



 
// const SALT_COUNT = 10;

// const hashedPassword = await bcrypt.hash(password, SALT_COUNT)


async function getUser({ username, password }) {
 try{
  const { rows: [user] } = await client.query(`
    SELECT * 
    FROM users
    WHERE username=$1
    `, [username, password]);
  
    return user;
  } catch (error) {
      throw error;
    }
}

  // const user = await getUserByUserName(username);
  // const hashedPassword = user.password;
  // const isValid = await bcrypt.compare(password, hashedPassword)


async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}