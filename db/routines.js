/* eslint-disable */

const { attachActivitiesToRoutines, getActivityById } = require("./activities");
const { getUserByUsername } = require("./users");
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
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId" = users.id
`)
return attachActivitiesToRoutines(rows);


}

async function getAllPublicRoutines() {
  const { rows } = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId" = users.id
  WHERE "isPublic"
`)
return attachActivitiesToRoutines(rows);
}

async function getAllRoutinesByUser({ username }) {  
  try {
    const user = await getUserByUsername(username)
    const { rows: routine } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE "creatorId" = $1
    `, [user.id]);
    return attachActivitiesToRoutines(routine);
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const user = await getUserByUsername(username)
    const { rows: routine } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE "creatorId" = $1 AND "isPublic"
    `, [user.id]);
    return attachActivitiesToRoutines(routine);
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const name = await getActivityById(id)
    const { rows: routine } = await client.query(`
    SELECT "routineId"
    FROM routine_activities
    JOIN routines ON routine_activities."routineId" = routines.id
    WHERE "activityId" = $1
    `,[name.id]);
    console.log(id, 'line109')
    console.log(routine, 'line 110')
    return attachActivitiesToRoutines(routine);
  } catch (error) {
    throw error;
  }

}

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
