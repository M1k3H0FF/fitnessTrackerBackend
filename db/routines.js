/* eslint-disable */

const client = require("./client");


async function createRoutine({ creatorId, isPublic, name, goal }) {
  // eslint-disable-next-line no-useless-catch
  try {
    const { rows: [ routine ] } = await client.query(`
        INSERT INTO routines("creatorId", "isPublic", name, goal)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        ;
    `, [creatorId, isPublic, name, goal]);
    return routine
} 
catch (error) {
    throw error;
}   

}

async function getRoutineById(id) {
  try {
    const { rows: [ routine ] } = await client.query(`
      SELECT id
      FROM routines
      WHERE id=$1;
    `, [id]);

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  const { rows } = await client.query(`
    SELECT * 
    FROM routines;
  `)

  return rows;
}

async function getAllRoutines() {
  const { rows } = await client.query(`
  SELECT routines.*, users.username
  FROM routines
  JOIN users ON 
  routines.creatorId = userId
`)
// console.log(rows, "here's line 50")
return rows;

}

async function getAllPublicRoutines() {
  const { rows } = await client.query(`
  SELECT * 
  FROM routines
  WHERE "isPublic";
`)
return rows;
}

async function getAllRoutinesByUser({ username }) {  
  try {
    const { rows: [ routine ] } = await client.query(`
      SELECT id
      FROM routines
      WHERE "creatorId"= "userId";
    `);

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
