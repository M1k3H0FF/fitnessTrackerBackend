/* eslint-disable no-useless-catch */

const client = require("./client");
const bcrypt = require('bcrypt');

const SALT_COUNT = 10;
// database functions

// user functions
async function createUser({ username, password }){
   
   const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
    try {
        const { rows: [ user ] } = await client.query(`
            INSERT INTO users(username, password)
            VALUES ($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING username, id;
            
        `, [username, hashedPassword]);
        return user
    } 
    catch (error) {
        throw error;
    } 
} 






async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  const isValid = await bcrypt.compare(password, hashedPassword)
  
 try{
  if(isValid){
  const gettingTheUserByUsername = await getUserByUsername(username)
  if(!gettingTheUserByUsername){
    return
  }
  delete gettingTheUserByUsername.password

   return gettingTheUserByUsername;
  }} catch (error) {
      throw error;
    }}


  


async function getUserById(userId) {

  try {
    const { rows: [ user ] } = await client.query(`
      SELECT id
      FROM users
      WHERE id=$1;
    `, [userId]);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1;
    `, [username]);

    return user;
  } catch (error) {
    throw error;
  }

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}