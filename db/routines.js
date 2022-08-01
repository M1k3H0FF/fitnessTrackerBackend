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
      SELECT *
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
    const { rows: routine } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    JOIN routine_activities ON routine_activities."routineId" = routines.id
    WHERE routines."isPublic" = true AND routine_activities."activityId" = $1;
  `, [ id ])
  return attachActivitiesToRoutines(routine);
  } catch (error) {
    throw error;
  }

}

async function updateRoutine({ id, ...fields }) {
  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');
      console.log(setString, 'Here is the setString')
  // // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [routine]} = await client.query(`
      UPDATE routines
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return routine;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try{
    await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId" = $1;
    `, [id])

    const { rows: [routine]} = await client.query(`
    DELETE FROM routines
    WHERE id = $1
    RETURNING *;
    `, [id]);
    console.log(routine, "hello", id)
    return routine;
  } catch (error) {
    throw error;
  }

}

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
