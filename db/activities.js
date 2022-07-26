/* eslint-disable */

const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  try {
    const { rows: [ activity ] } = await client.query(`
        INSERT INTO activities(name, description)
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        ;
    `, [name, description]);
    return activity
} 
catch (error) {
    throw error;
} 
}

async function getAllActivities() {
  const { rows } = await client.query(`
    SELECT name 
    FROM activities;
  `)
  return rows;

}

async function getActivityById(id) {}

async function getActivityByName(name) {}

async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
